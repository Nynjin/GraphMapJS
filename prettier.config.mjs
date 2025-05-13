/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  endOfLine: 'auto',
  singleQuote: true,
  insertPragma: false,
  bracketSpacing: true,
  trailingComma: 'all',
  proseWrap: 'preserve',
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  embeddedLanguageFormatting: 'auto',
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],
  importOrder: ['^[react]', '^@\\w', '^\\w', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config
