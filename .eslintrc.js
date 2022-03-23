/* eslint-env node */
module.exports = {
  parserOptions: { ecmaVersion: 11, sourceType: 'module', project: ['./tsconfig.json'] },
  ignorePatterns: ['node_modules/*'],
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: {
        react: { version: 'detect' },
        'import/resolver': {
          typescript: {}
        }
      },
      env: {
        browser: true,
        node: true,
        es6: true
      },
      extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
        'plugin:jest-dom/recommended'
      ],
      rules: {
        // 'no-restricted-imports': [
        //   'error',
        //   {
        //     patterns: ['features/*/*']
        //   }
        // ],
        '@typescript-eslint/no-explicit-any': ['warn'],
        'linebreak-style': ['error', 'unix'],
        // TODO turn this on once we can use typescript to generate the prop types
        'react/prop-types': 'off',
        // TODO Find a way to dynamically have mui component imports come after externals
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              // Used to organize constants and utils
              'unknown',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type'
            ],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
            pathGroups: [
              {
                pattern: 'react',
                group: 'external',
                position: 'before'
              },
              {
                pattern: '@material-ui/**',
                group: 'external',
                position: 'after'
              },
              {
                pattern: 'constants/**',
                group: 'unknown'
              },
              {
                pattern: 'utils/**',
                group: 'unknown'
              },
              {
                pattern: '**/_styles/**',
                group: 'sibling',
                position: 'after'
              }
            ],
            pathGroupsExcludedImportTypes: ['@material-ui/**', 'react']
          }
        ],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              { group: ['../../*'], message: 'Usage of relative parent imports is not allowed.' },
              {
                group: [
                  '../actions*',
                  '../api*',
                  '../assets*',
                  '../components*',
                  '../constants**',
                  '../containers*',
                  '../contexts*',
                  '../deps*',
                  '../features*',
                  '../hooks*',
                  '../hud*',
                  '../hudAreas*',
                  '../lib*',
                  '../pages*',
                  '../reducers*',
                  '../redux*',
                  '../styles*',
                  '../types*',
                  '../utils*'
                ],
                message: 'Usage of relative imports for folders in src is not allowed.'
              }
            ]
          }
        ],
        'import/extensions': [
          'error',
          'never',
          {
            svg: 'always',
            gif: 'always',
            png: 'always',
            mp4: 'always',
            json: 'always',
            pdf: 'always'
          }
        ],
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',
        'import/no-duplicates': 'error',
        'import/newline-after-import': 'error',
        // TODO Turn on
        // 'max-depth': [2, 3],
        curly: [2, 'multi-line'],

        // TODO turn the 'import' rules back on
        'import/first': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        // 'import/imports-first': ['error', 'absolute-first'],
        'import/no-cycle': 'off',
        'import/no-mutable-exports': 'off',

        'react/react-in-jsx-scope': 'off',

        // TODO Turn on
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
        '@typescript-eslint/no-empty-function': ['off'],

        'prettier/prettier': ['error', {}, { usePrettierrc: true }],

        // ====== Legacy settings ========
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-use-before-define': 'off',

        // Turn this off because consistent types are nice to have.
        'no-inferrable-types': 'off',

        indent: 'off',
        'no-multiple-empty-lines': 'error',
        'brace-style': 'error',
        'no-nested-ternary': 'error',
        'function-call-argument-newline': ['error', 'consistent'],
        'prefer-rest-params': 'error',
        'arrow-body-style': ['error', 'as-needed'],
        'no-unused-expressions': 'error',
        'no-undef': 'error',
        'prefer-const': 'error',
        'one-var': ['error', 'never'],
        'no-extra-boolean-cast': 'error',
        'no-mixed-operators': ['off'], // Prettier removes the parantheses: https://github.com/prettier/prettier/issues/187
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
        'spaced-comment': [2, 'always', { exceptions: ['/-'], markers: ['/'] }],
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
        // TODO Due to mounted prop before componentDidMount
        // 'react/sort-comp': [
        //   1,
        //   {
        //     order: ['constructor', 'lifecycle', 'everything-else', 'render']
        //   }
        // ],

        // TODO turn the 'react' rules back on
        'react/no-unescaped-entities': 'error',
        'react/no-did-update-set-state': 'error',
        'react/jsx-curly-newline': 'off',
        'react/button-has-type': 'error',
        'react/no-array-index-key': 'off',
        'react/default-props-match-prop-types': 'error',
        'react/forbid-prop-types': 'error',
        'react/no-deprecated': 'off',
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

        // TODO turn these 'jsx-a11y' rules back on
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-autofocus': 'warn'
      }
    }
  ],
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
