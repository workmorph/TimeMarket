'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { SkillsEditor } from '@/components/profile/SkillsEditor'
import { Avatar } from '@/components/ui/avatar'
import { ArrowLeftIcon, CameraIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProfileEditPage() {
  const { user, profile, loading, updateProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    expertise_areas: [] as string[],
    years_of_experience: 0,
    hourly_rate_min: 0,
    hourly_rate_max: 0,
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    avatar_url: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        expertise_areas: profile.expertise_areas || [],
        years_of_experience: profile.years_of_experience || 0,
        hourly_rate_min: profile.hourly_rate_min || 0,
        hourly_rate_max: profile.hourly_rate_max || 0,
        portfolio_url: profile.portfolio_url || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
        avatar_url: profile.avatar_url || ''
      })
    }
  }, [profile])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingAvatar(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setErrors({ avatar: 'アバターのアップロードに失敗しました' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.display_name.trim()) {
      newErrors.display_name = '表示名は必須です'
    }

    if (formData.hourly_rate_min < 0) {
      newErrors.hourly_rate_min = '時給は0以上である必要があります'
    }

    if (formData.hourly_rate_max && formData.hourly_rate_max < formData.hourly_rate_min) {
      newErrors.hourly_rate_max = '最大時給は最小時給以上である必要があります'
    }

    if (formData.years_of_experience < 0) {
      newErrors.years_of_experience = '経験年数は0以上である必要があります'
    }

    // Validate URLs
    const urlFields = ['portfolio_url', 'github_url', 'linkedin_url', 'twitter_url'] as const
    urlFields.forEach(field => {
      if (formData[field] && !isValidUrl(formData[field])) {
        newErrors[field] = '有効なURLを入力してください'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    try {
      await updateProfile(formData)
      router.push('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ submit: 'プロフィールの更新に失敗しました' })
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
        <Link href="/profile" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          プロフィールに戻る
        </Link>
        <h1 className="text-3xl font-bold">プロフィールを編集</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール画像</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt={formData.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                    {formData.display_name.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </Avatar>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                  disabled={uploadingAvatar}
                />
                <label htmlFor="avatar-upload">
                  <Button type="button" variant="outline" disabled={uploadingAvatar} asChild>
                    <span>
                      <CameraIcon className="h-4 w-4 mr-2" />
                      {uploadingAvatar ? 'アップロード中...' : '画像を変更'}
                    </span>
                  </Button>
                </label>
                {errors.avatar && (
                  <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="display_name">表示名 *</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                placeholder="田中 太郎"
              />
              {errors.display_name && (
                <p className="text-red-500 text-sm mt-1">{errors.display_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="あなたの経験やスキルについて教えてください"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="years_of_experience">経験年数</Label>
              <Input
                id="years_of_experience"
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))}
              />
              {errors.years_of_experience && (
                <p className="text-red-500 text-sm mt-1">{errors.years_of_experience}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expertise Areas */}
        <Card>
          <CardHeader>
            <CardTitle>専門分野</CardTitle>
            <CardDescription>あなたの専門スキルや分野を追加してください</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillsEditor
              skills={formData.expertise_areas}
              onChange={(skills) => setFormData(prev => ({ ...prev, expertise_areas: skills }))}
            />
          </CardContent>
        </Card>

        {/* Hourly Rate */}
        <Card>
          <CardHeader>
            <CardTitle>時給設定</CardTitle>
            <CardDescription>希望する時給の範囲を設定してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate_min">最小時給（円）</Label>
                <Input
                  id="hourly_rate_min"
                  type="number"
                  min="0"
                  value={formData.hourly_rate_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate_min: parseInt(e.target.value) || 0 }))}
                  placeholder="3000"
                />
                {errors.hourly_rate_min && (
                  <p className="text-red-500 text-sm mt-1">{errors.hourly_rate_min}</p>
                )}
              </div>
              <div>
                <Label htmlFor="hourly_rate_max">最大時給（円）</Label>
                <Input
                  id="hourly_rate_max"
                  type="number"
                  min="0"
                  value={formData.hourly_rate_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate_max: parseInt(e.target.value) || 0 }))}
                  placeholder="8000"
                />
                {errors.hourly_rate_max && (
                  <p className="text-red-500 text-sm mt-1">{errors.hourly_rate_max}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>ソーシャルリンク</CardTitle>
            <CardDescription>ポートフォリオやSNSのリンクを追加してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="portfolio_url">ポートフォリオ</Label>
              <Input
                id="portfolio_url"
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                placeholder="https://example.com"
              />
              {errors.portfolio_url && (
                <p className="text-red-500 text-sm mt-1">{errors.portfolio_url}</p>
              )}
            </div>

            <div>
              <Label htmlFor="github_url">GitHub</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                placeholder="https://github.com/username"
              />
              {errors.github_url && (
                <p className="text-red-500 text-sm mt-1">{errors.github_url}</p>
              )}
            </div>

            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedin_url && (
                <p className="text-red-500 text-sm mt-1">{errors.linkedin_url}</p>
              )}
            </div>

            <div>
              <Label htmlFor="twitter_url">Twitter</Label>
              <Input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                placeholder="https://twitter.com/username"
              />
              {errors.twitter_url && (
                <p className="text-red-500 text-sm mt-1">{errors.twitter_url}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/profile">
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? '保存中...' : '変更を保存'}
          </Button>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-center">{errors.submit}</p>
        )}
      </form>
    </div>
  )
}