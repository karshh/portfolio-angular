const { defineConfig } = require('eslint/config');
const angular = require('angular-eslint');

module.exports = defineConfig(
  {
    files: ['**/*.ts'],
    extends: [angular.configs.tsRecommended],
    languageOptions: {
      parserOptions: { project: './tsconfig.json' }
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-selector': ['error', {
        type: 'element', prefix: 'app', style: 'kebab-case'
      }],
      '@angular-eslint/directive-selector': ['error', {
        type: 'attribute', prefix: 'app', style: 'camelCase'
      }],
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off'
    }
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended]
  }
);
