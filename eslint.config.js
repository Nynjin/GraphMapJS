import pluginJs from '@eslint/js'
import eslintPluginNext from '@next/eslint-plugin-next'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintReactPlugin from 'eslint-plugin-react'
import eslintReactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['node_modules/*', 'dist/*', '.vscode/*', 'build/*', 'coverage/*'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      react: eslintReactPlugin,
      'react-hooks': eslintReactHooksPlugin,
      '@next/next': eslintPluginNext,
    },
    rules: {
      ...eslintReactPlugin.configs.recommended.rules,
      ...eslintReactHooksPlugin.configs.recommended.rules,
      ...eslintPluginNext.configs.recommended.rules,
      ...eslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
)
