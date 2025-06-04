import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { 
  validateWidgetConfig, 
  generateTenantConfig, 
  sanitizeWidgetConfig,
  validateOrigin,
  generateCSPHeader,
  DEFAULT_SECURITY_CONFIG
} from '@/widget/multi-tenant-config'
import { WidgetConfig } from '@/config/widget-config'

// ウィジェット設定の取得
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // APIキーまたはセッションで認証
    const apiKey = request.headers.get('x-api-key')
    const origin = request.headers.get('origin') || ''
    
    let userId: string | null = null
    let tenantId: string | null = null
    
    if (apiKey) {
      // APIキーで認証
      const { data: keyData, error: keyError } = await supabase
        .from('api_keys')
        .select('user_id, permissions')
        .eq('key', apiKey)
        .single()
      
      if (keyError || !keyData) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      }
      
      // APIキーの権限確認
      if (!keyData.permissions.includes('widget:read')) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      
      userId = keyData.user_id
    } else {
      // セッションで認証
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      userId = session.user.id
    }
    
    // ユーザーのテナント情報を取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id')
      .eq('id', userId)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    tenantId = userData.tenant_id
    
    // テナント設定を取得
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()
    
    if (tenantError || !tenantData) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }
    
    // ウィジェット設定を取得
    const { data: configData, error: configError } = await supabase
      .from('widget_configs')
      .select('*')
      .eq('tenant_id', tenantId)
      .single()
    
    if (configError || !configData) {
      // デフォルト設定を返す
      const defaultConfig = generateTenantConfig(tenantData)
      
      return NextResponse.json({
        config: defaultConfig,
        tenant: {
          id: tenantData.id,
          name: tenantData.name,
          plan: tenantData.plan
        }
      }, {
        headers: {
          'Access-Control-Allow-Origin': validateOrigin(origin, tenantData.allowed_origins || ['*']) ? origin : '',
          'Content-Security-Policy': generateCSPHeader(DEFAULT_SECURITY_CONFIG)
        }
      })
    }
    
    // セキュリティチェック
    if (!validateOrigin(origin, configData.allowed_origins || ['*'])) {
      return NextResponse.json(
        { error: 'Origin not allowed' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({
      config: sanitizeWidgetConfig(configData.config),
      tenant: {
        id: tenantData.id,
        name: tenantData.name,
        plan: tenantData.plan
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Content-Security-Policy': generateCSPHeader(configData.security || DEFAULT_SECURITY_CONFIG),
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff'
      }
    })
    
  } catch (error) {
    console.error('Widget config GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ウィジェット設定の更新
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // セッション認証のみ（管理画面からの更新）
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const config = body.config as WidgetConfig
    
    // 設定の検証
    const validation = validateWidgetConfig(config)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid configuration', errors: validation.errors },
        { status: 400 }
      )
    }
    
    // ユーザーのテナント情報を取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tenant_id, role')
      .eq('id', session.user.id)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // 管理者権限の確認
    if (userData.role !== 'admin' && userData.role !== 'owner') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    // テナント設定を取得
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', userData.tenant_id)
      .single()
    
    if (tenantError || !tenantData) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      )
    }
    
    // プランに基づく制限チェック
    const tenantConfig = generateTenantConfig(tenantData)
    
    // カスタムテーマの制限
    if (!tenantConfig.customization?.allowCustomCSS && body.customCSS) {
      return NextResponse.json(
        { error: 'Custom CSS not allowed in current plan' },
        { status: 403 }
      )
    }
    
    // カスタムJSの制限
    if (!tenantConfig.customization?.allowCustomJS && body.customJS) {
      return NextResponse.json(
        { error: 'Custom JavaScript not allowed in current plan' },
        { status: 403 }
      )
    }
    
    // セキュリティ設定の準備
    const securityConfig = {
      ...DEFAULT_SECURITY_CONFIG,
      allowedOrigins: body.allowedOrigins || ['*']
    }
    
    // ウィジェット設定を更新または作成
    const { data: updatedConfig, error: updateError } = await supabase
      .from('widget_configs')
      .upsert({
        tenant_id: userData.tenant_id,
        config: sanitizeWidgetConfig(config),
        custom_css: body.customCSS || null,
        custom_js: body.customJS || null,
        allowed_origins: body.allowedOrigins || ['*'],
        security: securityConfig,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id
      }, {
        onConflict: 'tenant_id'
      })
      .select()
      .single()
    
    if (updateError) {
      console.error('Widget config update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update configuration' },
        { status: 500 }
      )
    }
    
    // 更新履歴を記録
    await supabase
      .from('widget_config_history')
      .insert({
        tenant_id: userData.tenant_id,
        config: sanitizeWidgetConfig(config),
        changed_by: session.user.id,
        change_type: 'update',
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent')
      })
    
    return NextResponse.json({
      message: 'Configuration updated successfully',
      config: updatedConfig
    })
    
  } catch (error) {
    console.error('Widget config PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// プリフライトリクエストの処理
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
      'Access-Control-Max-Age': '86400',
    }
  })
}