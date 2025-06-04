import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { BellIcon, MailIcon, MessageSquareIcon } from 'lucide-react'

interface NotificationSettingsProps {
  settings: {
    email: boolean
    push: boolean
    sms: boolean
  }
  onChange: (settings: {
    email: boolean
    push: boolean
    sms: boolean
  }) => void
}

export function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  const handleToggle = (key: keyof typeof settings) => {
    onChange({
      ...settings,
      [key]: !settings[key]
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
        <CardDescription>
          重要な更新やメッセージの受け取り方法を設定します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MailIcon className="h-5 w-5 text-gray-500" />
            <div>
              <Label htmlFor="email-notifications" className="text-base">
                メール通知
              </Label>
              <p className="text-sm text-gray-500">
                予約、メッセージ、重要な更新をメールで受け取る
              </p>
            </div>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.email}
            onCheckedChange={() => handleToggle('email')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-5 w-5 text-gray-500" />
            <div>
              <Label htmlFor="push-notifications" className="text-base">
                プッシュ通知
              </Label>
              <p className="text-sm text-gray-500">
                ブラウザでリアルタイムの通知を受け取る
              </p>
            </div>
          </div>
          <Switch
            id="push-notifications"
            checked={settings.push}
            onCheckedChange={() => handleToggle('push')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquareIcon className="h-5 w-5 text-gray-500" />
            <div>
              <Label htmlFor="sms-notifications" className="text-base">
                SMS通知
              </Label>
              <p className="text-sm text-gray-500">
                緊急の連絡をSMSで受け取る
              </p>
            </div>
          </div>
          <Switch
            id="sms-notifications"
            checked={settings.sms}
            onCheckedChange={() => handleToggle('sms')}
          />
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">通知を受け取るタイミング</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 新しい予約リクエストがあったとき</p>
            <p>• メッセージを受信したとき</p>
            <p>• 予約の時間が近づいたとき（1時間前）</p>
            <p>• 支払いが完了したとき</p>
            <p>• レビューが投稿されたとき</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}