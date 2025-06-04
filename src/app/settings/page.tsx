'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { NotificationSettings } from '@/components/settings/NotificationSettings'
import { PrivacySettings } from '@/components/settings/PrivacySettings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ArrowLeftIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const timezones = [
  { value: 'Asia/Tokyo', label: '東京 (GMT+9)' },
  { value: 'Asia/Seoul', label: 'ソウル (GMT+9)' },
  { value: 'Asia/Shanghai', label: '上海 (GMT+8)' },
  { value: 'Asia/Singapore', label: 'シンガポール (GMT+8)' },
  { value: 'Europe/London', label: 'ロンドン (GMT+0)' },
  { value: 'Europe/Paris', label: 'パリ (GMT+1)' },
  { value: 'America/New_York', label: 'ニューヨーク (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'ロサンゼルス (GMT-8)' },
]

const languages = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ko', label: '한국어' },
]

export default function SettingsPage() {
  const { user, profile, loading, updateProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  
  const [settings, setSettings] = useState({
    timezone: 'Asia/Tokyo',
    language: 'ja',
    notification_email: true,
    notification_push: false,
    notification_sms: false,
    privacy_show_email: false,
    privacy_show_phone: false,
    privacy_show_location: true,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setSettings({
        timezone: profile.timezone || 'Asia/Tokyo',
        language: profile.language || 'ja',
        notification_email: profile.notification_email ?? true,
        notification_push: profile.notification_push ?? false,
        notification_sms: profile.notification_sms ?? false,
        privacy_show_email: profile.privacy_show_email ?? false,
        privacy_show_phone: profile.privacy_show_phone ?? false,
        privacy_show_location: profile.privacy_show_location ?? true,
      })
    }
  }, [profile])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await updateProfile(settings)
      // Show success message or toast
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          ダッシュボードに戻る
        </Link>
        <h1 className="text-3xl font-bold">設定</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">一般</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="privacy">プライバシー</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>一般設定</CardTitle>
              <CardDescription>言語とタイムゾーンの設定</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">言語</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">タイムゾーン</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings
            settings={{
              email: settings.notification_email,
              push: settings.notification_push,
              sms: settings.notification_sms,
            }}
            onChange={(notifications) => 
              setSettings(prev => ({
                ...prev,
                notification_email: notifications.email,
                notification_push: notifications.push,
                notification_sms: notifications.sms,
              }))
            }
          />
        </TabsContent>

        <TabsContent value="privacy" className="mt-6">
          <PrivacySettings
            settings={{
              showEmail: settings.privacy_show_email,
              showPhone: settings.privacy_show_phone,
              showLocation: settings.privacy_show_location,
            }}
            onChange={(privacy) => 
              setSettings(prev => ({
                ...prev,
                privacy_show_email: privacy.showEmail,
                privacy_show_phone: privacy.showPhone,
                privacy_show_location: privacy.showLocation,
              }))
            }
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving ? '保存中...' : '設定を保存'}
        </Button>
      </div>
    </div>
  )
}