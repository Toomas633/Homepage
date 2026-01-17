import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [
	js.configs.recommended,
	{
		files: ['src/**/*.ts', 'tests/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node,
				NodeJS: 'readonly',
			},
			parser: parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier,
		},
		rules: {
			// TypeScript-specific rules
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_' },
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',

			// Node.js best practices
			'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
			'no-debugger': 'warn',
			'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars
			'prefer-const': 'error',
			'no-var': 'error',

			// Prettier integration
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					semi: false,
					tabWidth: 2,
					useTabs: true,
					trailingComma: 'es5',
				},
			],
		},
	},
	{
		// Ignore only compiled files and generated reports
		ignores: [
			'dist/**/*.js',
			'**/*.mjs',
			'.reports/**',
			'coverage/**',
		],
	},
]
