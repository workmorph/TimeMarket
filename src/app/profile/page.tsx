'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PencilIcon, CalendarIcon, StarIcon, ClockIcon } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">マイプロフィール</h1>
        <Link href="/profile/edit">
          <Button>
            <PencilIcon className="h-4 w-4 mr-2" />
            プロフィールを編集
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="expertise">専門分野</TabsTrigger>
              <TabsTrigger value="stats">統計</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">自己紹介</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {profile.bio || 'まだ自己紹介が設定されていません。'}
                </p>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">基本情報</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      経験年数: {profile.years_of_experience || 0}年
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      時給: {profile.hourly_rate_min ? `¥${profile.hourly_rate_min.toLocaleString()}` : '未設定'} 
                      {profile.hourly_rate_max && ` - ¥${profile.hourly_rate_max.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Portfolio Links */}
              {(profile.portfolio_url || profile.github_url || profile.linkedin_url || profile.twitter_url) && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">リンク</h2>
                  <div className="space-y-2">
                    {profile.portfolio_url && (
                      <a
                        href={profile.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        ポートフォリオ
                      </a>
                    )}
                    {profile.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        GitHub
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {profile.twitter_url && (
                      <a
                        href={profile.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="expertise" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">専門分野</h2>
                {profile.expertise_areas && profile.expertise_areas.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise_areas.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">専門分野が設定されていません。</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">パフォーマンス統計</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.total_sessions || 0}
                    </div>
                    <div className="text-sm text-gray-600">完了セッション</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.average_rating || 0}
                      <StarIcon className="inline h-5 w-5 text-yellow-500 ml-1" />
                    </div>
                    <div className="text-sm text-gray-600">平均評価</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {profile.response_rate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">返信率</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      <Badge variant={profile.verification_status === 'verified' ? 'default' : 'secondary'}>
                        {profile.verification_status === 'verified' ? '認証済み' : '未認証'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">認証ステータス</div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}