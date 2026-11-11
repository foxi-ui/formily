const path = require('path')

const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

module.exports = {
  title: 'Formily Vue',
  base,
  dest: outputPath,
  theme: '@vuepress-dumi/dumi',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/assets/chrome/favicon.svg',
      },
    ],
  ],
  themeConfig: {
    logo: '/assets/chrome/logo.svg',
    nav: [
      {
        text: '指南',
        link: '/guide/',
      },
      {
        text: 'API',
        link: '/api/components/field',
      },
      {
        text: 'Q&A',
        link: '/questions/',
      },
      {
        text: '主站',
        link: 'https://formilyjs-v2.bugduo.com/',
      },
      {
        text: 'GITHUB',
        link: 'https://github.com/alibaba/formily',
      },
    ],
    sidebar: {
      '/guide/': ['', 'architecture', 'concept'],
      '/api/': [
        {
          title: 'Components',
          children: [
            '/api/components/field',
            '/api/components/array-field',
            '/api/components/object-field',
            '/api/components/void-field',
            '/api/components/schema-field',
            '/api/components/schema-field-with-schema',
            '/api/components/recursion-field',
            '/api/components/recursion-field-with-component',
            '/api/components/form-provider',
            '/api/components/form-consumer',
            '/api/components/expression-scope',
          ],
        },
        {
          title: 'Hooks',
          children: [
            '/api/hooks/use-field',
            '/api/hooks/use-field-schema',
            '/api/hooks/use-form',
            '/api/hooks/use-form-effects',
            '/api/hooks/use-parent-form',
          ],
        },
        {
          title: 'Shared',
          children: [
            '/api/shared/connect',
            '/api/shared/injections',
            '/api/shared/map-props',
            '/api/shared/map-read-pretty',
            '/api/shared/observer',
            '/api/shared/schema',
          ],
        },
      ],
    },
    lastUpdated: 'Last Updated',
    smoothScroll: true,
  },
  plugins: [
    [
      'vuepress-plugin-typescript',
      { tsLoaderOptions: { transpileOnly: true } },
    ],
    '@vuepress/back-to-top',
    '@vuepress/last-updated',
    '@vuepress-dumi/dumi-previewer',
    [
      '@vuepress/medium-zoom',
      {
        selector: '.content__default :not(a) > img',
      },
    ],
  ],
  configureWebpack: (config, isServer) => {
    return {
      resolve: {
        alias: {
          '@formily/vue': path.resolve(__dirname, '../../src'),
          '@formily/json-schema': path.resolve(
            __dirname,
            '../../../json-schema/src'
          ),
          '@formily/path': path.resolve(__dirname, '../../../path/src'),
          '@formily/reactive-vue': path.resolve(
            __dirname,
            '../../../reactive-vue/src'
          ),
          '@formily/element': path.resolve(__dirname, '../../../element/src'),
          vue: path.resolve(
            __dirname,
            '../../../../node_modules/vue/dist/vue.runtime.esm.js'
          ),
        },
      },
    }
  },
}
