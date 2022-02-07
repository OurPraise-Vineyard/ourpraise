module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'react-app',
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': [
      'error',
      'never',
    ],
  },
}
