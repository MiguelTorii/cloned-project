module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb',
    'prettier',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['prettier', 'jsx-a11y', 'flowtype', 'react', 'react-hooks'],
  rules: {
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
        extensions: ['.js', '.jsx']
      }
    ],
    'react/destructuring-assignment': ['error', 'always'],
    'react/jsx-indent': ['error', 2],
    'react/static-property-placement': ['error', 'static public field'],

    // TODO turn the 'react' rules back on
    'react/no-unescaped-entities': 'error',
    'react/no-unused-state': 'off',
    'react/no-did-update-set-state': 'off',
    'react/jsx-curly-newline': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/jsx-closing-tag-location': 'error',
    'react/button-has-type': 'error',
    'react/no-array-index-key': 'off',
    'react/default-props-match-prop-types': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/forbid-prop-types': 'error',
    'react/no-deprecated': 'off',
    'react/sort-comp': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/display-name': 'off',
    'react/jsx-key': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-fragments': 'off',
    'react/jsx-boolean-value': 'off',
    'react/self-closing-comp': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'react/jsx-tag-spacing': 'off',
    'react/state-in-constructor': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/no-unused-prop-types': 'off',

    // TODO turn this on once we can use typescript to generate the prop types
    'react/prop-types': 'off',

    // TODO turn these 'react-hooks' rules back on
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'error',

    // TODO turn these 'jsx-a11y' rules back on
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',

    // TODO remove all 'flowtype' rules (with a switch to TS)
    'flowtype/boolean-style': ['error', 'boolean'],
    'flowtype/define-flow-type': 'error',
    'flowtype/delimiter-dangle': ['error', 'never'],
    'flowtype/generic-spacing': ['error', 'never'],
    'flowtype/no-mixed': 'error',
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
