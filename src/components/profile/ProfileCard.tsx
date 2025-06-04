import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarIcon, MapPinIcon, CheckCircleIcon } from 'lucide-react'
import type { Profile } from '@/lib/supabase'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="p-6">
      <div className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
              {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>

        <h2 className="text-2xl font-bold mb-2">
          {profile.display_name || profile.username || 'ユーザー'}
        </h2>

        {profile.verification_status === 'verified' && (
          <div className="flex items-center justify-center text-green-600 mb-2">
            <CheckCircleIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">認証済み</span>
          </div>
        )}

        {/* Rating */}
        {profile.average_rating > 0 && (
          <div className="flex items-center justify-center mb-4">
            <span className="text-lg font-semibold mr-1">{profile.average_rating}</span>
            <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-gray-500 ml-2">({profile.total_sessions}件のレビュー)</span>
          </div>
        )}

        {/* Location/Timezone */}
        {profile.timezone && (
          <div className="flex items-center justify-center text-gray-600 mb-4">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{profile.timezone}</span>
          </div>
        )}

        {/* Hourly Rate */}
        {profile.hourly_rate_min && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="text-sm text-gray-600">時給</div>
            <div className="text-xl font-bold">
              ¥{profile.hourly_rate_min.toLocaleString()}
              {profile.hourly_rate_max && ` - ¥${profile.hourly_rate_max.toLocaleString()}`}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{profile.total_sessions || 0}</div>
            <div className="text-xs text-gray-600">完了セッション</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">{profile.response_rate || 0}%</div>
            <div className="text-xs text-gray-600">返信率</div>
          </div>
        </div>
      </div>
    </Card>
  )
}