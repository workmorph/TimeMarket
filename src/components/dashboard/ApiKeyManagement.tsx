'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Eye, EyeOff, MoreHorizontal, Plus, Trash2, Key, Clock, Globe } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { toast } from 'sonner'

interface ApiKey {
  id: string
  key_name: string
  key_value: string
  permissions: {
    read?: boolean
    write?: boolean
  }
  allowed_origins?: string[]
  rate_limit?: number
  expires_at?: string
  last_used_at?: string
  created_at: string
}

interface ApiKeyManagementProps {
  apiKeys: ApiKey[]
  onRefresh: () => void
}

export function ApiKeyManagement({ apiKeys, onRefresh }: ApiKeyManagementProps) {
  const router = useRouter()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label}をコピーしました`)
    } catch (error) {
      toast.error('コピーに失敗しました')
    }
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return '****'
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`
  }

  const handleDelete = async () => {
    if (!keyToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/api-keys?id=${keyToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('APIキーの削除に失敗しました')
      }

      toast.success('APIキーを削除しました')
      setDeleteDialogOpen(false)
      onRefresh()
    } catch (error) {
      toast.error('APIキーの削除に失敗しました')
    } finally {
      setIsDeleting(false)
      setKeyToDelete(null)
    }
  }

  const getPermissionBadges = (permissions: ApiKey['permissions']) => {
    const badges = []
    if (permissions.read) badges.push(<Badge key="read" variant="secondary">読み取り</Badge>)
    if (permissions.write) badges.push(<Badge key="write" variant="default">書き込み</Badge>)
    return badges
  }

  const getStatusBadge = (key: ApiKey) => {
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return <Badge variant="destructive">期限切れ</Badge>
    }
    if (!key.last_used_at) {
      return <Badge variant="outline">未使用</Badge>
    }
    return <Badge variant="success">アクティブ</Badge>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>APIキー</CardTitle>
              <CardDescription>
                外部サービスからTimeBidウィジェットを利用するためのAPIキーを管理します
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/dashboard/api-keys/create')}>
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>APIキーがまだ作成されていません</p>
              <p className="text-sm mt-2">新規作成ボタンから最初のAPIキーを作成してください</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>キー</TableHead>
                    <TableHead>権限</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>最終使用</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.key_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showKeys[key.id] ? key.key_value : maskApiKey(key.key_value)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleKeyVisibility(key.id)}
                            className="h-6 w-6"
                          >
                            {showKeys[key.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(key.key_value, 'APIキー')}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {getPermissionBadges(key.permissions)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(key)}</TableCell>
                      <TableCell>
                        {key.last_used_at ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(key.last_used_at), {
                              addSuffix: true,
                              locale: ja,
                            })}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(key.created_at), {
                            addSuffix: true,
                            locale: ja,
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/api-keys/${key.id}/edit`)}
                            >
                              編集
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setKeyToDelete(key)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-destructive"
                            >
                              削除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>APIキーの削除</DialogTitle>
            <DialogDescription>
              本当に「{keyToDelete?.key_name}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}