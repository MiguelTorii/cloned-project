module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    // 'prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['prettier', 'jsx-a11y', 'flowtype', 'react', 'react-hooks'],
  rules: {
    // 'prettier/prettier': 'warn',
    'object-curly-spacing': 2,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/prop-types': 0,
    'no-underscore-dangle': 0,

    // TODO turn this back on
    // 'import/imports-first': ['error', 'absolute-first'],

    'react/no-unescaped-entities': 0,

    // TODO turn this back on
    // got null in chat/RightMenu.js
    // need to resolve
    // indent: ['error', 2],
    'indent': 'off',

    // TODO turn this back on
    'react/no-unused-state': 'off',

    // TODO turn this back on
    'react/no-did-update-set-state': 'off',

    // TODO turn this back on
    'react/jsx-curly-newline': 'off',

    // TODO turn this back on
    'react/destructuring-assignment': 'off',

    // TODO turn this back on
    'react/jsx-indent': 'off',

    // TODO turn this back on
    'react/static-property-placement': 'off',

    // TODO turn this back on
    'react/no-access-state-in-setstate': 'off',

    // TODO turn this back on
    'react/require-default-props': 'off',

    // TODO turn this back on
    'react/jsx-closing-tag-location': 'off',

    // TODO turn this back on
    'jsx-a11y/no-noninteractive-element-interactions': 'off',

    'no-unused-expressions': 'error',
    'no-undef': 'error',
    'brace-style': 'error',
    'no-nested-ternary': 'error',

    // TODO turn this back on
    'no-restricted-syntax': 'off',

    // TODO turn this back on
    'import/no-cycle': 'off',

    'no-mixed-operators': 'error',
    'jsx-quotes': 'error',

    // TODO turn this back on
    'import/no-mutable-exports': 'off',

    'no-multiple-empty-lines': 'error',

    // TODO turn this back on
    'react/button-has-type': 'off',

    // TODO turn this back on
    'react/no-array-index-key': 'off',

    // TODO turn this back on
    'react/default-props-match-prop-types': 'off',

    'import/order': 'error',

    // TODO turn this back on
    'react/jsx-closing-bracket-location': 'off',

    'import/no-duplicates': 'error',

    // TODO turn this back on
    'no-console': 'off',

    // TODO turn this back on
    'curly': 'off',

    // TODO turn this back on
    'react/forbid-prop-types': 'off',

    // TODO turn this back on
    'jsx-a11y/no-static-element-interactions': 'off',

    // TODO turn this back on
    'jsx-a11y/click-events-have-key-events': 'off',

    // TODO turn this back on
    'react/no-deprecated': 'off',

    // TODO turn this back on
    'react/sort-comp': 'off',

    // TODO turn this back on
    'no-empty': 'off',

    // TODO turn this back on
    'jsx-a11y/anchor-is-valid': 'off',

    // TODO turn this back on
    'function-paren-newline': 'off',

    // TODO turn this back on
    'react/jsx-wrap-multilines': 'off',

    // TODO turn this back on
    'react/display-name': 'off',

    // TODO turn this back on
    'func-names': 'off',

    // TODO turn this back on
    'wrap-iife': 'off',

    // **** TODO turn this back on
    'react/jsx-key': 'off',

    // TODO turn this back on
    'nonblock-statement-body-position': 'off',

    // TODO turn this back on
    'react/jsx-props-no-spreading': 'off',

    // TODO turn this back on
    // 'arrow-body-style': ['error', 'as-needed'],
    'arrow-body-style': 'off',

    // TODO turn this back on
    // 'max-len': ['error', 120],
    'max-len': 'off',

    // TODO turn this back on
    // 'comma-dangle': ['error', 'never'],
    'comma-dangle': 'off',

    // TODO turn this back on
    'implicit-arrow-linebreak': 'off',

    // TODO turn this back on
    'consistent-return': 'off',

    'object-curly-newline': ["error", { "consistent": true }],

    // TODO turn this back on
    'import/no-named-as-default': 'off',

    // TODO turn this back on
    'no-useless-catch': 'off',

    // TODO turn this back on
    'operator-linebreak': 'off',

    // TODO turn this back on
    'no-unused-vars': 'off',

    // TODO turn this back on with exceptions for API
    'camelcase': 'off',

    // TODO turn this back on
    'no-else-return': 'off',

    // TODO do we care about this one?
    'quote-props': 'off',

    // TODO turn this back on
    'quotes': 'off',

    // TODO turn this back on
    'no-tabs': 'off',

    // TODO turn this back on
    'spaced-comment': 'off',

    // TODO turn this back on
    'react/jsx-fragments': 'off',

    // TODO turn this back on
    'space-infix-ops': 'off',

    // TODO turn this back on
    'no-extra-boolean-cast': 'off',

    // TODO turn this back on
    'object-shorthand': 'off',

    // TODO turn this back on
    'prefer-const': 'off',

    // TODO turn this back on
    'one-var': 'off',

    // TODO turn this back on
    'react/jsx-boolean-value': 'off',

    // TODO turn this back on
    'react/self-closing-comp': 'off',

    // TODO turn this back on
    'no-useless-escape': 'off',

    // TODO turn this back on
    'import/first': 'off',

    // TODO turn this back on
    'prefer-arrow-callback': 'off',

    // TODO turn this back on
    'react/jsx-curly-brace-presence': 'off',

    // TODO turn this back on
    'semi': 'off',

    // TODO turn this back on
    'eol-last': 'off',

    // TODO turn this back on
    'no-floating-decimal': 'off',

    // TODO turn this back on
    'dot-notation': 'off',

    // TODO turn this back on
    'react/jsx-tag-spacing': 'off',

    // TODO turn this back on
    'no-return-assign': 'off',

    // TODO turn this back on
    'no-plusplus': 'off',

    // TODO turn this back on
    'no-param-reassign': 'off',

    // TODO turn this back on
    'no-restricted-properties': 'off',

    // TODO turn this back on
    'no-confusing-arrow': 'off',

    // TODO turn this back on
    'react/state-in-constructor': 'off',

    // TODO turn this back on
    'react/jsx-one-expression-per-line': 'off',

    // TODO turn this back on
    'react/no-unused-prop-types': 'off',

    // TODO turn this back on
    // got null in chat/RightMenu.js
    // need to resolve
    // 'template-curly-spacing': ['error', 'always'],
    'template-curly-spacing': 'off',

    // Turn this rule off because it will conflict with typescript
    // (i.e. .ts extensions are not allowed in imports)
    'import/extensions': 'off',

    // TODO turn this back on
    // 'import/newline-after-import': 'error',
    'import/newline-after-import': 'off',

    'import/no-unresolved': 0,
    'import/prefer-default-export': 'off',
    'no-trailing-spaces': 2,
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'no-shadow': 0,

    'flowtype/boolean-style': [2, 'boolean'],
    'flowtype/define-flow-type': 1,
    'flowtype/delimiter-dangle': [2, 'never'],
    'flowtype/generic-spacing': [2, 'never'],
    'flowtype/no-mixed': 2,

    // TODO turn this back on (or switch to TS)
    // 'flowtype/no-primitive-constructor-types': 2,
    'flowtype/no-primitive-constructor-types': 'off',

    'flowtype/no-types-missing-file-annotation': 2,
    'flowtype/no-weak-types': 0,
    'flowtype/object-type-delimiter': [2, 'comma'],
    'flowtype/require-parameter-type': 0,
    'flowtype/require-readonly-react-props': 0,
    'flowtype/require-return-type': [
      0,
      'always',
      {
        annotateUndefined: 'never'
      }
    ],
    'flowtype/require-valid-file-annotation': 2,
    'flowtype/semi': [2, 'always'],

    // TODO turn this back on
    // 'flowtype/space-after-type-colon': [2, 'always'],
    'flowtype/space-after-type-colon': 'off',

    'flowtype/space-before-generic-bracket': [2, 'never'],
    'flowtype/space-before-type-colon': [2, 'never'],
    'flowtype/type-id-match': [0, '^([A-Z][a-z0-9]+)+Type$'],
    'flowtype/union-intersection-spacing': [2, 'always'],
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false
    }
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
  parser: 'babel-eslint'
};
