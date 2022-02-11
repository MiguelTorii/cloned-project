import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { ViteSentryPluginOptions } from 'vite-plugin-sentry';
import viteSentry from 'vite-plugin-sentry';

import checker from 'vite-plugin-checker';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';

const ENV_PREFIX = 'REACT_APP_';

/*
	Configure sentry plugin
  Proposal: Can this replace build.sh?
*/
/** https://www.npmjs.com/package/vite-plugin-sentry
 * const sentryConfig: ViteSentryPluginOptions = {
 *   url: '',
 *   authToken: '<SECRET_TOKEN_HERE>',
 *   org: 'circlein',
 *   project: 'web',
 *   Release automatically set from git commit unless specified as
 *   ** release: 1.0
 *   deploy: {
 *     env: 'production'
 *   },
 *   setCommits: {
 *     auto: true
 *   },
 *   sourceMaps: {
 *     include: ['./dist/assets'],
 *     ignore: ['node_modules'],
 *     urlPrefix: '~/assets'
 *   }
 * };
 */

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Loads from .env file
  const env = loadEnv(mode, 'env', [ENV_PREFIX, 'SERVER']);
  const isProd = env.REACT_APP_ENV === 'production';

  const envProcess = loadEnv(mode, process.cwd());

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(envProcess).reduce((prev, [key, val]) => {
    return {
      ...prev,
      ['process.env.' + key]: `"${val}"`
    };
  }, {});

  return {
    server: {
      port: 2000
    },
    define: envWithProcessPrefix,
    build: {
      // mode: 'development', // Only for React minimization crashes on build
      target: 'es2018',
      // https://vitejs.dev/config/#build-sourcemap
      sourcemap: isProd ? 'hidden' : true,
      // sourcemap: true // Only for React minimization crashes on build
      outDir: 'build',
      commonjsOptions: {
        // exclude: [/./], // Only for React minimization crashes on build
        transformMixedEsModules: true
      }
      /** Only for React minimization crashes on build
       *  rollupOptions: {
       * plugins: [commonjs()]
       * },
       */
      // minify: false // Only for React minimization crashes on build
    },
    resolve: {
      alias: {
        // https://github.com/danbovey/react-infinite-scroller/issues/253
        'react-infinite-scroller': 'react-infinite-scroller/index.js'
      }
    },
    // TODO might need for twilio or node-dependent libraries, do not remove
    rollupInputOptions: {
      plugins: [nodePolyfills()]
    },
    plugins: [
      react({
        // jsxRuntime: 'classic', // Only for React minimization crashes on build
        babel: {
          plugins: [
            [
              'babel-plugin-styled-components',
              {
                displayName: true,
                fileName: false
              }
            ]
          ]
        }
      }),
      // Keeps all REACT_APP_ environment variables
      EnvironmentPlugin('all', { prefix: 'REACT_APP_' }),
      tsconfigPaths(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
          svgo: true
          // ...svgr options (https://react-svgr.com/docs/options/)
        }
      })
      /**
       * Speeds up TypeScript checker by running in worker thread in serve mode
       * Prompt errors in Vite HMR overlay and terminal console
       * Do not set enableBuild to true while TS errors are not removed from the app as it will stop the build
       * Currently disabled by default due to high CPU spike, enable at your choice for local development
       * https://github.com/fi3ework/vite-plugin-checker/issues/72
       */
      /**
       * checker({
       *  overlay: false,
       * typescript: true,
       * enableBuild: false
       * })
       */
    ]
  };
});
