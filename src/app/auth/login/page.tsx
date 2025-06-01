'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
    Mail, Lock, Eye, EyeOff, Github,
    Loader2, AlertCircle, Gavel
} from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // TODO: Supabase認証処理
            await new Promise(resolve => setTimeout(resolve, 1500)) // シミュレート

            // Mock error for demo
            if (email === 'error@test.com') {
                throw new Error('メールアドレスまたはパスワードが正しくありません')
            }

            console.log('ログイン:', { email, password })

            // TODO: リダイレクト処理
            alert('ログイン成功！ダッシュボードへリダイレクトします。')

        } catch (error: any) {
            setError(error.message || 'ログインに失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            // TODO: Google OAuth処理
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Google login clicked')
            alert('Google認証処理を実装してください')
        } catch (error) {
            setError('Google認証に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGithubLogin = async () => {
        setIsLoading(true)
        try {
            // TODO: GitHub OAuth処理  
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('GitHub login clicked')
            alert('GitHub認証処理を実装してください')
        } catch (error) {
            setError('GitHub認証に失敗しました')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* ロゴ・ヘッダー */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2 hover:opacity-80">
                        <Gavel className="h-10 w-10 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">TimeBid</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        アカウントにログイン
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        専門家の時間をオークションで取引
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-center">ログイン</CardTitle>
                        <CardDescription className="text-center">
                            メールアドレスとパスワードを入力してください
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* エラー表示 */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* ソーシャルログイン */}
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                            >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Googleでログイン
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleGithubLogin}
                                disabled={isLoading}
                            >
                                <Github className="w-4 h-4 mr-2" />
                                GitHubでログイン
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-muted-foreground">または</span>
                            </div>
                        </div>

                        {/* メール・パスワードログイン */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">パスワード</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        パスワードを忘れた方
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="パスワードを入力"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-gray-700"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ログイン中...
                                    </>
                                ) : (
                                    'ログイン'
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                アカウントをお持ちでない方は{' '}
                                <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                                    こちらから新規登録
                                </Link>
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* テスト用情報 */}
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">
                            デモ用テストアカウント
                        </h4>
                        <div className="text-xs text-yellow-700 space-y-1">
                            <p>メール: demo@timebid.com</p>
                            <p>パスワード: demo123</p>
                            <p className="text-red-600">※ error@test.com でエラーテスト可能</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}