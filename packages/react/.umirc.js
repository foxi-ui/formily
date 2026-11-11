import { resolve } from 'path'
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  mode: 'site',
  base,
  publicPath: base,
  exportStatic: {},
  logo: `${base}assets/chrome/logo.svg`,
  title: 'React',
  hash: true,
  favicon: `${base}assets/chrome/favicon.svg`,
  outputPath,
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
  copy: [
    {
      from: '../../node_modules/antd/dist/antd.css',
      to: 'assets/css/antd.css',
    },
    {
      from: '../../docs-assets/chrome',
      to: 'assets/chrome',
    },
  ],
  links: [
    {
      rel: 'stylesheet',
      href: `${base}assets/css/antd.css`,
    },
  ],
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
      { title: 'Architecture', path: '/guide/architecture' },
      { title: 'Concept', path: '/guide/concept' },
    ],
    '/zh-CN/guide': [
      {
        title: '介绍',
        path: '/guide',
      },
      { title: '核心架构', path: '/zh-CN/guide/architecture' },
      { title: '核心概念', path: '/zh-CN/guide/concept' },
    ],
  },
}
