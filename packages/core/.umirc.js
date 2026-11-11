import { resolve } from 'path'
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  mode: 'site',
  base,
  publicPath: base,
  exportStatic: {},
  logo: `${base}assets/chrome/logo.svg`,
  title: 'Core',
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
    {
      from: '../../docs-assets/scripts',
      to: 'assets/scripts',
    },
  ],
  headScripts: [
    {
      src: `${base}assets/scripts/vercount.js`,
      defer: true,
    },
    {
      src: 'https://events.vercount.one/js',
      defer: true,
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
    .site-visit-stats{
      display:inline-block;
      margin-top:10px;
      font-size:14px;
      line-height:1.6;
      color:#b0b1ba;
    }
    [data-prefers-color=dark] .site-visit-stats{
      color:rgba(255,255,255,0.45);
    }
    .__dumi-default-layout-footer-meta [data-vercount-page-stats]{
      display:inline-block;
      margin-left:auto;
    }
    `,
  ],
  menus: {
    '/guide': [
      {
        title: 'Introduction',
        children: [
          {
            title: 'Introduction',
            path: '/guide',
          },
          { title: 'Architecture', path: '/guide/architecture' },
        ],
      },
      {
        title: 'Concept',
        children: [
          {
            title: 'MVVM',
            path: '/guide/mvvm',
          },
          {
            title: 'Form Model',
            path: '/guide/form',
          },
          {
            title: 'Field Model',
            path: '/guide/field',
          },
        ],
      },
    ],

    '/zh-CN/guide': [
      {
        title: '概览',
        children: [
          {
            title: '介绍',
            path: '/zh-CN/guide',
          },
          { title: '核心架构', path: '/zh-CN/guide/architecture' },
        ],
      },
      {
        title: '概念',
        children: [
          {
            title: 'MVVM',
            path: '/zh-CN/guide/mvvm',
          },
          {
            title: '表单模型',
            path: '/zh-CN/guide/form',
          },
          {
            title: '字段模型',
            path: '/zh-CN/guide/field',
          },
        ],
      },
    ],
  },
}
