import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MailIcon, PhoneIcon, MapPinIcon, AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PrivacySettingsProps {
  settings: {
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
  }
  onChange: (settings: {
    showEmail: boolean
    showPhone: boolean
    showLocation: boolean
  }) => void
}

export function PrivacySettings({ settings, onChange }: PrivacySettingsProps) {
  const handleToggle = (key: keyof typeof settings) => {
    onChange({
      ...settings,
      [key]: !settings[key]
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>プライバシー設定</CardTitle>
          <CardDescription>
            プロフィールに表示する情報を管理します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>
              以下の設定は、他のユーザーがあなたのプロフィールを閲覧する際に適用されます。
              予約が確定した相手には、連絡に必要な情報が共有される場合があります。
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MailIcon className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="show-email" className="text-base">
                  メールアドレスを表示
                </Label>
                <p className="text-sm text-gray-500">
                  プロフィールにメールアドレスを公開する
                </p>
              </div>
            </div>
            <Switch
              id="show-email"
              checked={settings.showEmail}
              onCheckedChange={() => handleToggle('showEmail')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="show-phone" className="text-base">
                  電話番号を表示
                </Label>
                <p className="text-sm text-gray-500">
                  プロフィールに電話番号を公開する
                </p>
              </div>
            </div>
            <Switch
              id="show-phone"
              checked={settings.showPhone}
              onCheckedChange={() => handleToggle('showPhone')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="show-location" className="text-base">
                  タイムゾーンを表示
                </Label>
                <p className="text-sm text-gray-500">
                  あなたの所在地のタイムゾーンを表示する
                </p>
              </div>
            </div>
            <Switch
              id="show-location"
              checked={settings.showLocation}
              onCheckedChange={() => handleToggle('showLocation')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>データ管理</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">データのエクスポート</h4>
            <p className="text-sm text-gray-500">
              あなたのプロフィール、予約履歴、メッセージなどのデータをダウンロードできます。
            </p>
            <button className="text-blue-600 hover:underline text-sm">
              データをエクスポート
            </button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">アカウントの削除</h4>
            <p className="text-sm text-gray-500">
              アカウントを完全に削除します。この操作は取り消せません。
            </p>
            <button className="text-red-600 hover:underline text-sm">
              アカウントを削除
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}