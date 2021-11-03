module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-typescript-prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['prettier', 'jsx-a11y', 'react', 'react-hooks', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': 'off',

    // Turn this off because consistent types are nice to have.
    'no-inferrable-types': 'off',

    'prettier/prettier': 'error',
    indent: 'off',
    'no-multiple-empty-lines': 'error',
    curly: ['error', 'all'],
    'brace-style': 'error',
    'no-nested-ternary': 'error',
    'function-call-argument-newline': ['error', 'consistent'],
    'object-curly-spacing': 'error',
    'prefer-rest-params': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'no-unused-expressions': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'one-var': ['error', 'never'],
    'no-extra-boolean-cast': 'error',
    'no-mixed-operators': 'error',
    'jsx-quotes': 'error',
    'no-trailing-spaces': 'error',
    'no-return-assign': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    semi: 'error',
    'eol-last': 'error',
    'no-floating-decimal': 'error',
    'dot-notation': 'error',
    'comma-dangle': ['error', 'never'],
    'object-curly-newline': ['error', { consistent: true }],
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'no-tabs': 'error',
    'spaced-comment': 'error',
    'no-else-return': 'error',
    'space-infix-ops': 'error',

    // I turned these off because I don't have a strong preference
    // for any particular variation of these rules
    'nonblock-statement-body-position': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',

    // TODO turn these standard eslint rules back on
    'no-restricted-syntax': 'off',
    'object-shorthand': 'off',
    'no-console': 'off',
    'no-empty': 'off',
    'func-names': 'off',
    'wrap-iife': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-restricted-properties': 'off',
    'no-useless-escape': 'off',
    'prefer-arrow-callback': 'off',
    'consistent-return': 'off',
    'no-useless-catch': 'off',
    'no-unused-vars': 'off',
    'no-confusing-arrow': 'off',

    // TODO turn this back on with exceptions for API
    camelcase: 'off',

    // TODO turn this back on
    // 'max-len': ['error', 120],
    'max-len': 'off',

    'import/no-duplicates': 'error',
    'import/order': 'error',
    'import/extensions': [
      'error',
      'never',
      { svg: 'always', gif: 'always', png: 'always', mp4: 'always', json: 'always', pdf: 'always' }
    ],
    'import/newline-after-import': 'error',

    // TODO turn the 'import' rules back on
    'import/first': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    // 'import/imports-first': ['error', 'absolute-first'],
    'import/no-cycle': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-named-as-default': 'off',

    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx']
      }
    ],
    'react/destructuring-assignment': ['error', 'always'],
    'react/jsx-indent': ['error', 2],
    'react/static-property-placement': ['error', 'static public field'],
    'react/no-unused-state': 'error',

    // Keep this rule off: we will depend on TypeScript for types instead
    'react/require-default-props': 'off',

    // These 2 react rules conflict with prettier and are not correctness related,
    // so we will configure them to match prettier or turn them off
    'react/jsx-closing-tag-location': 'off',
    'jsx-closing-bracket-location': 'off',

    // TODO turn the 'react' rules back on
    'react/no-unescaped-entities': 'error',
    'react/no-did-update-set-state': 'error',
    'react/jsx-curly-newline': 'off',
    'react/jsx-closing-tag-location': 'error',
    'react/button-has-type': 'error',
    'react/no-array-index-key': 'off',
    'react/default-props-match-prop-types': 'error',
    'react/forbid-prop-types': 'error',
    'react/no-deprecated': 'off',
    'react/sort-comp': 'error',
    'react/jsx-wrap-multilines': 'off',
    'react/display-name': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-fragments': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/state-in-constructor': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-unused-prop-types': 'off',
    'react/no-unused-state': 'off',

    // TODO turn this on once we can use typescript to generate the prop types
    'react/prop-types': 'off',

    // TODO turn these 'react-hooks' rules back on
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'error',

    // TODO turn these 'jsx-a11y' rules back on
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off'
  },
  globals: {
    cy: true,
    Cypress: true,
    window: true,
    document: true,
    localStorage: true,
    FormData: true,
    FileReader: true,
    Blob: true,
    navigator: true,
    btoa: true,
    atob: true,
    sessionStorage: true,
    fetch: true,
    MutationObserver: true,
    Node: true,
    Image: true
  },
  env: {
    browser: true,
    es6: true,
    jest: true
  }
};
