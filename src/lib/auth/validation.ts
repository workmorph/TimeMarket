// メールアドレスのバリデーション
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// パスワード強度のチェック
export function validatePassword(password: string): {
  score: number
  message: string
} {
  let score = 0
  const messages: string[] = []

  // 長さチェック
  if (password.length >= 8) {
    score++
  } else {
    messages.push('8文字以上')
  }

  // 大文字を含むか
  if (/[A-Z]/.test(password)) {
    score++
  } else {
    messages.push('大文字')
  }

  // 小文字を含むか
  if (/[a-z]/.test(password)) {
    score++
  } else {
    messages.push('小文字')
  }

  // 数字を含むか
  if (/\d/.test(password)) {
    score++
  } else {
    messages.push('数字')
  }

  // 特殊文字を含むか
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score++
  } else {
    messages.push('特殊文字')
  }

  // メッセージの生成
  let message = ''
  if (score === 5) {
    message = '非常に強力なパスワード'
  } else if (score === 4) {
    message = '強力なパスワード'
  } else if (score === 3) {
    message = '標準的なパスワード'
  } else if (score === 2) {
    message = '弱いパスワード'
  } else {
    message = `非常に弱いパスワード - 以下を含めてください: ${messages.join('、')}`
  }

  return { score, message }
}

// ユーザー名のバリデーション
export function validateUsername(username: string): {
  isValid: boolean
  message?: string
} {
  // 長さチェック
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'ユーザー名は3文字以上で入力してください'
    }
  }

  if (username.length > 20) {
    return {
      isValid: false,
      message: 'ユーザー名は20文字以下で入力してください'
    }
  }

  // 使用可能文字チェック（英数字、アンダースコア、ハイフン）
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      message: 'ユーザー名は英数字、アンダースコア、ハイフンのみ使用できます'
    }
  }

  // 先頭・末尾のチェック
  if (/^[-_]|[-_]$/.test(username)) {
    return {
      isValid: false,
      message: 'ユーザー名の先頭と末尾にハイフンやアンダースコアは使用できません'
    }
  }

  return { isValid: true }
}

// パスワードとメールアドレスの類似性チェック
export function checkPasswordSimilarity(password: string, email: string): boolean {
  const emailPrefix = email.split('@')[0].toLowerCase()
  const passwordLower = password.toLowerCase()
  
  // メールアドレスの前半部分がパスワードに含まれているか
  if (passwordLower.includes(emailPrefix) || emailPrefix.includes(passwordLower)) {
    return true
  }
  
  return false
}

// 一般的な弱いパスワードのチェック
const COMMON_WEAK_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty', 'abc123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'password1',
  'admin123', 'root', 'toor', 'pass', 'test', 'guest', 'master',
  'dragon', 'football', 'baseball', 'soccer', 'michael', 'shadow'
]

export function isCommonPassword(password: string): boolean {
  return COMMON_WEAK_PASSWORDS.includes(password.toLowerCase())
}

// 総合的なパスワードバリデーション
export function validatePasswordComprehensive(
  password: string,
  email?: string
): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // 基本的な強度チェック
  const strength = validatePassword(password)
  if (strength.score < 3) {
    errors.push('パスワードが弱すぎます。より複雑なパスワードを設定してください。')
  }
  
  // 一般的なパスワードチェック
  if (isCommonPassword(password)) {
    errors.push('よく使われるパスワードは使用できません。')
  }
  
  // メールアドレスとの類似性チェック
  if (email && checkPasswordSimilarity(password, email)) {
    errors.push('メールアドレスと類似したパスワードは使用できません。')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}