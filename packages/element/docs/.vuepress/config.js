const path = require('path')
const utils = require('./util')

const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

const componentFiles = utils
  .getFiles(path.resolve(__dirname, '../guide'))
  .map((item) => item.replace(/(\.md)/g, ''))
  .filter((item) => !['el-form', 'el-form-item', 'index'].includes(item))

module.exports = {
  title: 'Element',
  description: 'Alibaba unified front-end form solution',
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
    [
      'link',
      {
        rel: 'stylesheet',
        href: '/assets/css/element-ui.css',
      },
    ],
  ],
  themeConfig: {
    logo: '/assets/chrome/logo.svg',
    nav: [
      {
        text: 'Element',
        link: '/guide/',
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
      '/guide/': ['', ...componentFiles],
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
          '@formily/element': path.resolve(__dirname, '../../src'),
          vue$: 'vue/dist/vue.esm.js',
        },
      },
    }
  },
  chainWebpack: (config, isServer) => {
    config.module
      .rule('js') // Find the rule.
      .use('babel-loader') // Find the loader
      .tap((options) =>
        Object.assign(options, {
          // Modifying options
          presets: [
            [
              '@vue/babel-preset-jsx',
              {
                vModel: false,
                compositionAPI: true,
              },
            ],
          ],
        })
      )
  },
}
