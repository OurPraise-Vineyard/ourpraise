module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app'
  ],
  'rules': {
    'semi': [
      'error',
      'never'
    ],
    'jsx-quotes': [
      'error',
      'prefer-double'
    ],
    'quotes': [
      'error',
      'single'
    ]
  }
}
