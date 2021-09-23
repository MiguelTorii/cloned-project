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
    // TODO turn this back on
    // 'prettier/prettier': 'error',

    'object-curly-spacing': 'error',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx']
      }
    ],

    // TODO turn this on once we can use typescript to generate the prop types
    'react/prop-types': 'off',

    // TODO turn this back on
    'no-underscore-dangle': 'off',

    // TODO turn this back on
    // 'import/imports-first': ['error', 'absolute-first'],

    // TODO turn this back on
    'react/no-unescaped-entities': 'off',

    // TODO turn this back on
    indent: ['error', 2],
    // indent: 'off',

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
    curly: 'off',

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

    // TODO turn this back on
    'react/jsx-key': 'off',

    // TODO turn this back on
    'nonblock-statement-body-position': 'off',

    // TODO turn this back on
    'react/jsx-props-no-spreading': 'off',

    'arrow-body-style': ['error', 'as-needed'],

    // TODO turn this back on
    // 'max-len': ['error', 120],
    'max-len': 'off',

    'comma-dangle': ['error', 'never'],

    // TODO turn this back on
    'implicit-arrow-linebreak': 'off',

    // TODO turn this back on
    'consistent-return': 'off',

    'object-curly-newline': ['error', { consistent: true }],

    // TODO turn this back on
    'import/no-named-as-default': 'off',

    // TODO turn this back on
    'no-useless-catch': 'off',

    // TODO turn this back on
    'operator-linebreak': 'off',

    // TODO turn this back on
    'no-unused-vars': 'off',

    // TODO turn this back on with exceptions for API
    camelcase: 'off',

    // TODO turn this back on
    'no-else-return': 'off',

    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

    'no-tabs': 'error',
    'spaced-comment': 'error',

    // TODO turn this back on
    'react/jsx-fragments': 'off',

    // TODO turn this back on
    'space-infix-ops': 'off',

    'no-extra-boolean-cast': 'error',

    // TODO turn this back on
    'object-shorthand': 'off',

    'prefer-const': 'error',
    'one-var': ['error', 'never'],

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

    semi: 'error',
    'eol-last': 'error',
    'no-floating-decimal': 'error',
    'dot-notation': 'error',

    // TODO turn this back on
    'react/jsx-tag-spacing': 'off',

    'no-return-assign': 'error',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],

    // TODO turn this back on
    'no-param-reassign': 'off',

    // TODO turn this back on
    'no-restricted-properties': 'off',

    'no-confusing-arrow': 'error',

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

    'import/extensions': ['error', 'never', { svg: 'always', gif: 'always', png: 'always', mp4: 'always', json: 'always', pdf: 'always' }],
    'import/newline-after-import': 'error',

    // TODO turn this back on
    'import/no-unresolved': 'off',

    // TODO turn this back on
    'import/prefer-default-export': 'off',

    'no-trailing-spaces': 'error',

    // TODO turn this back on
    'react-hooks/exhaustive-deps': 'off',

    'react-hooks/rules-of-hooks': 'error',

    // TODO turn this back on
    'no-shadow': 'off',

    'flowtype/boolean-style': ['error', 'boolean'],
    'flowtype/define-flow-type': 'error',
    'flowtype/delimiter-dangle': ['error', 'never'],
    'flowtype/generic-spacing': ['error', 'never'],
    'flowtype/no-mixed': 'error',

    // TODO turn this back on (or switch to TS)
    // 'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-primitive-constructor-types': 'off',

    'flowtype/no-types-missing-file-annotation': 'error',
    'flowtype/no-weak-types': 'off',
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-parameter-type': 'off',
    'flowtype/require-readonly-react-props': 'off',
    'flowtype/require-return-type': [
      'off',
      'always',
      {
        annotateUndefined: 'never'
      }
    ],
    'flowtype/require-valid-file-annotation': 'error',
    'flowtype/semi': ['error', 'always'],

    // TODO turn this back on (or switch to TS)
    // 'flowtype/space-after-type-colon': ['error', 'always'],
    'flowtype/space-after-type-colon': 'off',

    'flowtype/space-before-generic-bracket': ['error', 'never'],
    'flowtype/space-before-type-colon': ['error', 'never'],
    'flowtype/type-id-match': ['off', '^([A-Z][a-z0-9]+)+Type$'],
    'flowtype/union-intersection-spacing': ['error', 'always'],
    'flowtype/use-flow-type': 'error',
    'flowtype/valid-syntax': 'error'
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
  parser: '@babel/eslint-parser'
};
