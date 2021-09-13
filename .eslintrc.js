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
    'prettier/prettier': 'warn',
    'object-curly-spacing': 2,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/prop-types': 0,
    'no-underscore-dangle': 0,
    'import/imports-first': ['error', 'absolute-first'],
    'react/no-unescaped-entities': 0,
    indent: [
      'error',
      2,
      {
        ignoredNodes: ['TemplateLiteral', 'ConditionalExpression'],
        SwitchCase: 1,
        outerIIFEBody: 0,
        MemberExpression: 1,
        FunctionDeclaration: { body: 1, parameters: 2 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        offsetTernaryExpressions: false,
        ignoreComments: true
      }
    ],
    'import/newline-after-import': 'error',
    'import/no-unresolved': 0,
    'no-trailing-spaces': 2,
    'react-hooks/exhaustive-deps': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'no-shadow': 0,

    'flowtype/boolean-style': [2, 'boolean'],
    'flowtype/define-flow-type': 1,
    'flowtype/delimiter-dangle': [2, 'never'],
    'flowtype/generic-spacing': [2, 'never'],
    'flowtype/no-mixed': 2,
    'flowtype/no-primitive-constructor-types': 2,
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
    'flowtype/space-after-type-colon': [2, 'always'],
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
    navigator: true
  },
  parser: 'babel-eslint'
};
