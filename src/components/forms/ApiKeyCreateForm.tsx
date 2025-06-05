"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Key, AlertTriangle, Shield, Globe, Clock, Gauge, Info, Plus, X } from "lucide-react";

interface ApiKeyCreateFormProps {
  onSubmit: (data: ApiKeyFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ApiKeyFormData {
  name: string;
  description?: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  allowed_origins: string[];
  rate_limit: number;
  expires_at?: string;
}

export function ApiKeyCreateForm({ onSubmit, onCancel, isLoading = false }: ApiKeyCreateFormProps) {
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: "",
    description: "",
    permissions: {
      read: true,
      write: false,
      delete: false,
    },
    allowed_origins: [],
    rate_limit: 1000,
    expires_at: "",
  });

  const [originInput, setOriginInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "APIキー名は必須です";
    }

    if (formData.allowed_origins.length === 0) {
      newErrors.origins = "セキュリティのため、少なくとも1つのオリジンを指定してください";
    }

    if (formData.rate_limit < 10) {
      newErrors.rate_limit = "レート制限は最低10回/時以上に設定してください";
    }

    if (formData.expires_at) {
      const expiryDate = new Date(formData.expires_at);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);

      if (expiryDate < new Date()) {
        newErrors.expires_at = "有効期限は将来の日付を指定してください";
      } else if (expiryDate > maxDate) {
        newErrors.expires_at = "有効期限は最大2年後までです";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const addOrigin = () => {
    const origin = originInput.trim();
    if (origin && !formData.allowed_origins.includes(origin)) {
      if (isValidOrigin(origin)) {
        setFormData((prev) => ({
          ...prev,
          allowed_origins: [...prev.allowed_origins, origin],
        }));
        setOriginInput("");
        setErrors((prev) => ({ ...prev, origins: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          originInput: "有効なURLを入力してください（例: https://example.com）",
        }));
      }
    }
  };

  const removeOrigin = (origin: string) => {
    setFormData((prev) => ({
      ...prev,
      allowed_origins: prev.allowed_origins.filter((o) => o !== origin),
    }));
  };

  const isValidOrigin = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const togglePermission = (permission: keyof typeof formData.permissions) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  // デフォルトで1年後の日付を計算
  // const getDefaultExpiry = () => {
  //   const date = new Date()
  //   date.setFullYear(date.getFullYear() + 1)
  //   return date.toISOString().split('T')[0]
  // }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            新しいAPIキーの作成
          </CardTitle>
          <CardDescription>
            外部サイトでTimeBidウィジェットを使用するためのAPIキーを作成します
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              基本情報
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name">
                APIキー名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="例: 本番環境用、開発環境用"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明（オプション）</Label>
              <Textarea
                id="description"
                placeholder="このAPIキーの用途や注意事項を記載"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* 権限設定 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              権限設定
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="read"
                    checked={formData.permissions.read}
                    onChange={() => togglePermission("read")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="read" className="cursor-pointer">
                    <div className="font-medium">読み取り権限</div>
                    <div className="text-sm text-muted-foreground">
                      オークション情報の取得、入札履歴の閲覧
                    </div>
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="write"
                    checked={formData.permissions.write}
                    onChange={() => togglePermission("write")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="write" className="cursor-pointer">
                    <div className="font-medium">書き込み権限</div>
                    <div className="text-sm text-muted-foreground">
                      入札の作成、オークションへの参加
                    </div>
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="delete"
                    checked={formData.permissions.delete}
                    onChange={() => togglePermission("delete")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="delete" className="cursor-pointer">
                    <div className="font-medium">削除権限</div>
                    <div className="text-sm text-muted-foreground">
                      入札のキャンセル（制限付き）
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* オリジン制限 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              許可するオリジン <span className="text-red-500">*</span>
            </h3>

            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={originInput}
                onChange={(e) => setOriginInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addOrigin())}
                className={errors.originInput ? "border-red-500" : ""}
              />
              <Button type="button" onClick={addOrigin} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {errors.originInput && <p className="text-sm text-red-500">{errors.originInput}</p>}

            {errors.origins && <p className="text-sm text-red-500">{errors.origins}</p>}

            {formData.allowed_origins.length > 0 && (
              <div className="space-y-2">
                {formData.allowed_origins.map((origin) => (
                  <div key={origin} className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {origin}
                      <button
                        type="button"
                        onClick={() => removeOrigin(origin)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">セキュリティに関する注意</p>
                  <p>APIキーを使用できるドメインを制限します。本番環境では必ず設定してください。</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* レート制限 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              レート制限
            </h3>

            <div className="space-y-2">
              <Label htmlFor="rate_limit">1時間あたりのリクエスト数</Label>
              <Select
                value={formData.rate_limit.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rate_limit: parseInt(value) }))
                }
              >
                <SelectTrigger id="rate_limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100回/時（開発用）</SelectItem>
                  <SelectItem value="1000">1,000回/時（標準）</SelectItem>
                  <SelectItem value="5000">5,000回/時（高頻度）</SelectItem>
                  <SelectItem value="10000">10,000回/時（エンタープライズ）</SelectItem>
                </SelectContent>
              </Select>
              {errors.rate_limit && <p className="text-sm text-red-500">{errors.rate_limit}</p>}
            </div>
          </div>

          <Separator />

          {/* 有効期限 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              有効期限
            </h3>

            <div className="space-y-2">
              <Label htmlFor="expires_at">有効期限日（オプション）</Label>
              <Input
                id="expires_at"
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData((prev) => ({ ...prev, expires_at: e.target.value }))}
                min={new Date().toISOString().split("T")[0]}
                max={(() => {
                  const date = new Date();
                  date.setFullYear(date.getFullYear() + 2);
                  return date.toISOString().split("T")[0];
                })()}
                className={errors.expires_at ? "border-red-500" : ""}
              />
              {errors.expires_at && <p className="text-sm text-red-500">{errors.expires_at}</p>}
              <p className="text-sm text-muted-foreground">
                未設定の場合、デフォルトで1年後に設定されます
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isLoading || !formData.name.trim()} className="gap-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                作成中...
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                APIキーを作成
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
