import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['client/dist/**', 'server/dist/**'],
  files: ['client/src/**/*.{ts,tsx}', 'server/**/*.ts'],
  extends: [tseslint.configs.recommended],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prefer-const': 'off',
  },
});
