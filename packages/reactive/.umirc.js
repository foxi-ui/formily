import { resolve } from 'path'
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  mode: 'site',
  base,
  publicPath: base,
  exportStatic: {},
  logo: `${base}assets/chrome/logo.svg`,
  title: 'Reactive',
  hash: true,
  favicon: `${base}assets/chrome/favicon.svg`,
  outputPath,
  copy: [
    {
      from: '../../docs-assets/chrome',
      to: 'assets/chrome',
    },
    {
      from: '../../docs-assets/icons',
      to: 'assets/icons',
    },
  ],
  navs: {
    'en-US': [
      {
        title: 'Guide',
        path: '/guide',
      },
      {
        title: 'API',
        path: '/api',
      },
      {
        title: 'Home Site',
        path: 'https://formilyjs-v2.bugduo.com/',
      },
      {
        title: 'GITHUB',
        path: 'https://github.com/alibaba/formily',
      },
    ],
    'zh-CN': [
      {
        title: '指南',
        path: '/zh-CN/guide',
      },
      {
        title: 'API',
        path: '/zh-CN/api',
      },
      {
        title: '主站',
        path: 'https://formilyjs-v2.bugduo.com/',
      },
      {
        title: 'GITHUB',
        path: 'https://github.com/alibaba/formily',
      },
    ],
  },
  styles: [
    `.__dumi-default-navbar-logo{
      background-size: 140px!important;
      background-position: center left!important;
      background-repeat: no-repeat!important;
      padding-left: 150px!important;/*可根据title的宽度调整*/
      font-size: 22px!important;
      color: #000!important;
      font-weight: lighter!important;
    }
    .__dumi-default-navbar{
      padding: 0 28px !important;
    }
    .__dumi-default-layout-hero{
      background-image: url(${base}assets/chrome/hero.png);
      background-size: cover;
      background-repeat: no-repeat;
      padding: 120px 0 !important;
    }
    .__dumi-default-layout-hero h1{
      color:#45124e !important;
      font-size:80px !important;
      padding-bottom: 30px !important;
    }
    .__dumi-default-dark-switch {
      display:none
    }
    nav a{
      text-decoration: none !important;
    }
    `,
  ],
  menus: {
    '/guide': [
      {
        title: 'Introduction',
        path: '/guide',
      },
      { title: 'Concept', path: '/guide/concept' },
      {
        title: 'Best Practice',
        path: '/guide/best-practice',
      },
    ],
    '/api': [
      {
        title: '@formily/reactive',
        children: [
          {
            title: 'observable',
            path: '/api/observable',
          },
          {
            title: 'autorun',
            path: '/api/autorun',
          },
          {
            title: 'reaction',
            path: '/api/reaction',
          },

          {
            title: 'batch',
            path: '/api/batch',
          },
          {
            title: 'action',
            path: '/api/action',
          },
          {
            title: 'define',
            path: '/api/define',
          },
          {
            title: 'model',
            path: '/api/model',
          },
          {
            title: 'observe',
            path: '/api/observe',
          },
          {
            title: 'markRaw',
            path: '/api/mark-raw',
          },
          {
            title: 'markObservable',
            path: '/api/mark-observable',
          },
          {
            title: 'raw',
            path: '/api/raw',
          },
          {
            title: 'toJS',
            path: '/api/to-js',
          },
          {
            title: 'untracked',
            path: '/api/untracked',
          },
          {
            title: 'hasCollected',
            path: '/api/has-collected',
          },
          {
            title: 'Tracker',
            path: '/api/tracker',
          },
          {
            title: 'Type Chekcer',
            path: '/api/type-checker',
          },
        ],
      },
      {
        title: '@formily/reactive-react',
        children: [
          {
            title: 'observer',
            path: '/api/react/observer',
          },
        ],
      },
      {
        title: '@formily/reactive-vue',
        children: [
          {
            title: 'observer',
            path: '/api/vue/observer',
          },
        ],
      },
    ],
    '/zh-CN/guide': [
      {
        title: '介绍',
        path: '/zh-CN/guide',
      },
      { title: '核心概念', path: '/zh-CN/guide/concept' },
      {
        title: '最佳实践',
        path: '/zh-CN/guide/best-practice',
      },
    ],
    '/zh-CN/api': [
      {
        title: '@formily/reactive',
        children: [
          {
            title: 'observable',
            path: '/zh-CN/api/observable',
          },
          {
            title: 'autorun',
            path: '/zh-CN/api/autorun',
          },
          {
            title: 'reaction',
            path: '/zh-CN/api/reaction',
          },

          {
            title: 'batch',
            path: '/zh-CN/api/batch',
          },
          {
            title: 'action',
            path: '/zh-CN/api/action',
          },
          {
            title: 'define',
            path: '/zh-CN/api/define',
          },
          {
            title: 'model',
            path: '/zh-CN/api/model',
          },
          {
            title: 'observe',
            path: '/zh-CN/api/observe',
          },
          {
            title: 'markRaw',
            path: '/zh-CN/api/mark-raw',
          },
          {
            title: 'markObservable',
            path: '/zh-CN/api/mark-observable',
          },
          {
            title: 'raw',
            path: '/zh-CN/api/raw',
          },
          {
            title: 'toJS',
            path: '/zh-CN/api/to-js',
          },
          {
            title: 'untracked',
            path: '/zh-CN/api/untracked',
          },
          {
            title: 'hasCollected',
            path: '/zh-CN/api/has-collected',
          },
          {
            title: 'Tracker',
            path: '/zh-CN/api/tracker',
          },
          {
            title: 'Type Chekcer',
            path: '/zh-CN/api/type-checker',
          },
        ],
      },
      {
        title: '@formily/reactive-react',
        children: [
          {
            title: 'observer',
            path: '/zh-CN/api/react/observer',
          },
        ],
      },
      {
        title: '@formily/reactive-vue',
        children: [
          {
            title: 'observer',
            path: '/zh-CN/api/vue/observer',
          },
        ],
      },
    ],
  },
}
