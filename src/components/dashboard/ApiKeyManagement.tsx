"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Copy,
  Trash2,
  Key,
  Clock,
  Globe,
  Shield,
  Check,
  AlertTriangle,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import { ApiKey } from "@/models/ApiKey";

interface ApiKeyManagementProps {
  apiKeys: ApiKey[];
  onCreateKey: () => void;
  onDeleteKey: (keyId: string) => void;
  onUpdateKey?: (keyId: string, updates: Partial<ApiKey>) => void;
  isLoading?: boolean;
}

export function ApiKeyManagement({
  apiKeys,
  onCreateKey,
  onDeleteKey,
  onUpdateKey,
  isLoading = false,
}: ApiKeyManagementProps) {
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "未設定";
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maskApiKey = (key: string, show: boolean = false) => {
    if (show) return key;
    const prefix = key.substring(0, 10);
    const suffix = key.substring(key.length - 4);
    return `${prefix}...${suffix}`;
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(keyId);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleDeleteClick = (key: ApiKey) => {
    setSelectedKey(key);
    setShowDeleteDialog(true);
  };

  const handleEditClick = (key: ApiKey) => {
    setSelectedKey(key);
    setShowEditDialog(true);
  };

  const confirmDelete = () => {
    if (selectedKey) {
      onDeleteKey(selectedKey.id);
      setShowDeleteDialog(false);
      setSelectedKey(null);
    }
  };

  const getPermissionsDisplay = (
    permissions: { read?: boolean; write?: boolean; delete?: boolean } | null | undefined
  ): string => {
    if (!permissions || Object.keys(permissions).length === 0) {
      return "標準権限";
    }
    const perms = [];
    if (permissions.read) perms.push("読み取り");
    if (permissions.write) perms.push("書き込み");
    if (permissions.delete) perms.push("削除");
    return perms.length > 0 ? perms.join(", ") : "標準権限";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">APIキー一覧</h3>
          <Button onClick={onCreateKey} className="gap-2">
            <Key className="h-4 w-4" />
            新しいAPIキーを作成
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-muted">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">APIキーがありません</h3>
            <p className="text-muted-foreground mb-4">
              APIキーを作成して、外部サイトにウィジェットを埋め込みましょう
            </p>
            <Button onClick={onCreateKey} className="gap-2">
              <Key className="h-4 w-4" />
              最初のAPIキーを作成
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名前</TableHead>
                  <TableHead>APIキー</TableHead>
                  <TableHead>権限</TableHead>
                  <TableHead>許可オリジン</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead>最終使用日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {maskApiKey(key.key, showKeys.has(key.id))}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="h-7 w-7 p-0"
                        >
                          {showKeys.has(key.id) ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className="h-7 w-7 p-0"
                        >
                          {copied === key.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{getPermissionsDisplay(key.permissions)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                          {key.allowed_origins && key.allowed_origins.length > 0
                            ? key.allowed_origins.join(", ")
                            : "すべて許可"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "有効" : "無効"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{formatDate(key.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {key.last_used_at ? formatDate(key.last_used_at) : "未使用"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">メニューを開く</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => copyToClipboard(key.key, key.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            APIキーをコピー
                          </DropdownMenuItem>
                          {onUpdateKey && (
                            <DropdownMenuItem onClick={() => handleEditClick(key)}>
                              <Edit className="mr-2 h-4 w-4" />
                              編集
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(key)}
                            className="text-red-600"
                            disabled={!key.is_active}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            無効化
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
      </div>

      {/* 削除確認ダイアログ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              APIキーの無効化
            </DialogTitle>
            <DialogDescription>
              <strong>{selectedKey?.name}</strong> を無効化しますか？
              この操作は取り消せません。無効化されたAPIキーは使用できなくなります。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              無効化する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編集ダイアログ（将来の拡張用） */}
      {onUpdateKey && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>APIキーの編集</DialogTitle>
              <DialogDescription>APIキーの設定を変更します</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">名前</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedKey?.name}
                  placeholder="APIキーの名前"
                />
              </div>
              <div>
                <Label htmlFor="edit-origins">許可するオリジン</Label>
                <Input
                  id="edit-origins"
                  defaultValue={selectedKey?.allowed_origins?.join(", ")}
                  placeholder="https://example.com, https://app.example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                キャンセル
              </Button>
              <Button
                onClick={() => {
                  // TODO: 実装
                  setShowEditDialog(false);
                }}
              >
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
