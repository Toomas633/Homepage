import vue from 'eslint-plugin-vue'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vuetify from 'eslint-plugin-vuetify'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import js from '@eslint/js'
import vueEslintParser from 'vue-eslint-parser'

export default [
	js.configs.recommended,
	...vue.configs['flat/recommended'],
	{
		files: ['**/*.{ts,vue}', 'tests/**/*.{ts,vue}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				__VUE_VERSION__: 'readonly',
				__VUETIFY_VERSION__: 'readonly',
				__APP_VERSION__: 'readonly',
				ImportMetaEnv: 'readonly',
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: vueEslintParser,
			parserOptions: {
				parser: typescriptParser,
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			vue,
			'@typescript-eslint': typescriptEslint,
			vuetify,
			prettier,
		},

		rules: {
			// Base ESLint rules
			'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
			'no-debugger': 'warn',
			'no-unused-vars': 'off', // Let TypeScript handle this

			// TypeScript rules
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'@typescript-eslint/no-inferrable-types': 'off',

			// Vue rules
			'vue/multi-word-component-names': 'off',
			'vue/no-v-html': 'warn',
			'vue/require-default-prop': 'off',
			'vue/require-explicit-emits': 'error',
			'vue/singleline-html-element-content-newline': 'off',
			'vue/first-attribute-linebreak': 'off',
			'vue/html-closing-bracket-spacing': 'off',
			'vue/html-self-closing': 'off',
			'vue/html-indent': 'off', // Disabled - conflicts with prettier
			'vue/max-attributes-per-line': 'off', // Disabled - conflicts with prettier
			'vue/html-closing-bracket-newline': 'off', // Disabled due to conflicts with prettier

			// Vuetify rules
			'vuetify/no-deprecated-classes': 'warn',
			'vuetify/no-deprecated-props': 'warn',
			'vuetify/no-deprecated-colors': 'off',

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
		files: ['tests/**/*.{ts,spec.ts}'],
		rules: {
			'vue/one-component-per-file': 'off', // Allow inline test components
		},
	},
]
