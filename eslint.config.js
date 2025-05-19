import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintReactPlugin from 'eslint-plugin-react'
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

import pluginJs from '@eslint/js'
import eslintPluginNext from '@next/eslint-plugin-next'

import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['node_modules', 'dist', '.vscode', 'build', 'coverage', '.next', '*.config.*js'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: true,
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      react: eslintReactPlugin,
      'react-hooks': eslintReactHooksPlugin,
      '@next/next': eslintPluginNext,
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    rules: {
      ...eslintReactPlugin.configs.recommended.rules,
      ...eslintReactHooksPlugin.configs.recommended.rules,
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs['core-web-vitals'].rules,
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off',
      'typescript-eslint/no-unsafe-assigment': 'off',
      'typescript-eslint/no-unsafe-call': 'off',
    },
  },
)
