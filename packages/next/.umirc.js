import { resolve } from 'path'
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  mode: 'site',
  base,
  publicPath: base,
  exportStatic: {},
  logo: `${base}assets/chrome/logo.svg`,
  title: 'Fusion',
  favicon: `${base}assets/chrome/favicon.svg`,
  hash: true,
  outputPath,
  navs: {
    'en-US': [
      {
        title: 'Alibaba Fusion',
        path: '/components',
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
        title: 'Alibaba Fusion',
        path: '/zh-CN/components',
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
      from: '../../docs-assets/generated/next-noreset.css',
      to: 'assets/css/next-noreset.css',
    },
    {
      from: '../../docs-assets/fonts/next',
      to: 'assets/css/fonts',
    },
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
  links: [
    {
      rel: 'stylesheet',
      href: `${base}assets/css/next-noreset.css`,
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
}
