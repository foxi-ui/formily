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
        href: 'https://img.alicdn.com/imgextra/i3/O1CN01XtT3Tv1Wd1b5hNVKy_!!6000000002810-55-tps-360-360.svg',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://esm.sh/element-ui/lib/theme-chalk/index.css',
      },
    ],
  ],
  themeConfig: {
    logo: 'https://img.alicdn.com/imgextra/i2/O1CN01Kq3OHU1fph6LGqjIz_!!6000000004056-55-tps-1141-150.svg',
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
