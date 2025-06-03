module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:security/recommended"
  ],
  rules: {
    // セキュリティ
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'security/detect-object-injection': 'error',
    
    // パフォーマンス
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    
    // TimeBid専用ルール
    'no-hardcoded-credentials': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error'
  }
};
