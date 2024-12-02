import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

import eslint from '@eslint/js'

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
})
