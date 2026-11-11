const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  mode: 'site',
  base,
  publicPath: base,
  exportStatic: {},
  logo: `${base}assets/chrome/logo.svg`,
  title: 'Formily',
  hash: true,
  favicon: `${base}assets/chrome/favicon.svg`,
  outputPath,
  copy: [
    {
      from: 'node_modules/antd/dist/antd.css',
      to: 'assets/css/antd.css',
    },
    {
      from: 'docs-assets/chrome',
      to: 'assets/chrome',
    },
    {
      from: 'docs-assets/icons',
      to: 'assets/icons',
    },
    {
      from: 'docs-assets/content',
      to: 'assets/content',
    },
    {
      from: 'docs-assets/scripts',
      to: 'assets/scripts',
    },
    {
      from: 'docs-assets/well-known',
      to: '.well-known',
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
  locales: [
    ['en-US', 'English'],
    ['zh-CN', '中文'],
  ],
  navs: {
    'en-US': [
      {
        title: 'Guide',
        path: '/guide',
      },
      {
        title: 'Basic Core Library',
        children: [
          {
            title: '@formily/reactive',
            path: 'https://formilyjs-v2.bugduo.com/reactive/',
          },
          {
            title: '@formily/core',
            path: 'https://formilyjs-v2.bugduo.com/core/',
          },
          {
            title: '@formily/react',
            path: 'https://formilyjs-v2.bugduo.com/react/',
          },
          {
            title: '@formily/vue',
            path: 'https://formilyjs-v2.bugduo.com/vue/',
          },
        ],
      },
      {
        title: 'Component Ecology',
        children: [
          {
            title: '@formily/antd',
            path: 'https://formilyjs-v2.bugduo.com/antd/',
          },
          {
            title: '@formily/antd-v5',
            path: 'https://antd5.formilyjs.org',
          },
          {
            title: '@formily/antd-mobile',
            path: 'https://antd-mobile.formilyjs.org',
          },
          {
            title: '@formily/next',
            path: 'https://formilyjs-v2.bugduo.com/next/',
          },
          {
            title: '@formily/element',
            path: 'https://formilyjs-v2.bugduo.com/element/',
          },
          {
            title: '@formily/element-plus',
            path: 'https://element-plus.formilyjs.org',
          },
          {
            title: '@formily/antdv',
            path: 'https://antdv.formilyjs.org',
          },
          {
            title: '@formily/antdv-x3',
            path: 'https://antdv-x3.formilyjs.org',
          },
          {
            title: '@formily/vant',
            path: 'https://vant.formilyjs.org',
          },
          {
            title: '@formily/semi',
            path: 'https://semi.formilyjs.org',
          },
          {
            title: '@formily/tdesign-react',
            path: 'https://tdesign-react.formilyjs.org/',
          },
          {
            title: 'aliyun teamix',
            path: 'https://formily.dg.aliyun-inc.com/',
          },
          {
            title: 'antd-formily-boost',
            path: 'https://github.com/fishedee/antd-formily-boost',
          },
        ],
      },
      {
        title: 'Tools',
        children: [
          {
            title: 'Formily Designer',
            path: 'https://designable-antd.bugduo.com/',
          },
          {
            title: 'Designable Manual',
            path: 'https://designable-antd.bugduo.com/docs/',
          },
          {
            title: 'Designable',
            path: 'https://github.com/alibaba/designable',
          },
          {
            title: 'Chrome Extension',
            path: 'https://chrome.google.com/webstore/detail/formily-devtools/kkocalmbfnplecdmbadaapgapdioecfm?hl=zh-CN',
          },
        ],
      },
      {
        title: 'Community',
        children: [
          {
            title: 'Forum',
            path: 'https://github.com/alibaba/formily/discussions',
          },
          { title: 'Zhihu', path: 'https://www.zhihu.com/column/uform' },
        ],
      },
      {
        title: 'Document@1.x',
        path: 'https://v1.formilyjs.org',
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
        title: '基础核心库',
        children: [
          {
            title: '@formily/reactive',
            path: 'https://formilyjs-v2.bugduo.com/reactive/zh-CN',
          },
          {
            title: '@formily/core',
            path: 'https://formilyjs-v2.bugduo.com/core/zh-CN',
          },
          {
            title: '@formily/react',
            path: 'https://formilyjs-v2.bugduo.com/react/zh-CN',
          },
          {
            title: '@formily/vue',
            path: 'https://formilyjs-v2.bugduo.com/vue/',
          },
        ],
      },
      {
        title: '组件生态',
        children: [
          {
            title: '@formily/antd',
            path: 'https://formilyjs-v2.bugduo.com/antd/zh-CN',
          },
          {
            title: '@formily/antd-v5',
            path: 'https://antd5.formilyjs.org/zh-CN',
          },
          {
            title: '@formily/antd-mobile',
            path: 'https://antd-mobile.formilyjs.org/zh-CN',
          },
          {
            title: '@formily/next',
            path: 'https://formilyjs-v2.bugduo.com/next/zh-CN',
          },
          {
            title: '@formily/element',
            path: 'https://formilyjs-v2.bugduo.com/element/',
          },
          {
            title: '@formily/element-plus',
            path: 'https://element-plus.formilyjs.org',
          },
          {
            title: '@formily/antdv',
            path: 'https://antdv.formilyjs.org',
          },
          {
            title: '@formily/vant',
            path: 'https://vant.formilyjs.org',
          },
          {
            title: '@formily/semi',
            path: 'https://semi.formilyjs.org',
          },
          {
            title: '@formily/tdesign-react',
            path: 'https://tdesign-react.formilyjs.org',
          },
          {
            title: 'aliyun teamix',
            path: 'https://formily.dg.aliyun-inc.com',
          },
          {
            title: 'antd-formily-boost',
            path: 'https://github.com/fishedee/antd-formily-boost',
          },
        ],
      },
      {
        title: '工具',
        children: [
          {
            title: 'Formily 设计器',
            path: 'https://designable-antd.bugduo.com/',
          },
          {
            title: 'Designable 手册',
            path: 'https://designable-antd.bugduo.com/docs/',
          },
          {
            title: '通用搭建引擎',
            path: 'https://github.com/alibaba/designable',
          },
          {
            title: 'Chrome扩展',
            path: 'https://chrome.google.com/webstore/detail/formily-devtools/kkocalmbfnplecdmbadaapgapdioecfm?hl=zh-CN',
          },
        ],
      },
      {
        title: '社区',
        children: [
          {
            title: '论坛',
            path: 'https://github.com/alibaba/formily/discussions',
          },
          { title: '知乎专栏', path: 'https://www.zhihu.com/column/uform' },
        ],
      },
      {
        title: '1.x文档',
        path: 'https://v1.formilyjs.org',
      },
      {
        title: 'GITHUB',
        path: 'https://github.com/alibaba/formily',
      },
    ],
  },
  links: [
    {
      rel: 'stylesheet',
      href: `${base}assets/css/antd.css`,
    },
  ],
  styles: [
    `.__dumi-default-navbar-logo{
      height: 60px !important;
      width: 150px !important;
      padding-left:0 !important;
      color: transparent !important;
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
        path: '/guide',
      },
      {
        title: 'How to learn Formily',
        path: '/guide/learn-formily',
      },
      {
        title: 'Quick start',
        path: '/guide/quick-start',
      },
      {
        title: 'V2 Upgrade Guide',
        path: '/guide/upgrade',
      },
      {
        title: 'Contribution Guide',
        path: '/guide/contribution',
      },
      {
        title: 'Form Builder Guide',
        path: '/guide/form-builder',
      },
      {
        title: 'Issue Helper',
        path: '/guide/issue-helper',
      },
      {
        title: 'Scenes',
        children: [
          {
            title: 'Login&Signup',
            path: '/guide/scenes/login-register',
          },
          {
            title: 'Query List',
            path: '/guide/scenes/query-list',
          },
          {
            title: 'Edit&Details',
            path: '/guide/scenes/edit-detail',
          },
          {
            title: 'Dialog&Drawer',
            path: '/guide/scenes/dialog-drawer',
          },
          {
            title: 'Step Form',
            path: '/guide/scenes/step-form',
          },
          {
            title: 'Tab Form',
            path: '/guide/scenes/tab-form',
          },
          {
            title: 'More Scenes',
            path: '/guide/scenes/more',
          },
        ],
      },
      {
        title: 'Advanced Guide',
        children: [
          {
            title: 'Form Validation',
            path: '/guide/advanced/validate',
          },
          {
            title: 'Form Layout',
            path: '/guide/advanced/layout',
          },
          {
            title: 'Asynchronous Data Sources',
            path: '/guide/advanced/async',
          },
          {
            title: 'Form Controlled',
            path: '/guide/advanced/controlled',
          },
          {
            title: 'Linkage Logic',
            path: '/guide/advanced/linkages',
          },
          {
            title: 'Calculator',
            path: '/guide/advanced/calculator',
          },
          {
            title: 'Custom Components',
            path: '/guide/advanced/custom',
          },
          {
            title: 'Front-end and back-end data compatibility solution',
            path: '/guide/advanced/destructor',
          },
          {
            title: 'Manage Business Logic',
            path: '/guide/advanced/business-logic',
          },
          {
            title: 'Pack on demand',
            path: '/guide/advanced/build',
          },
        ],
      },
    ],

    '/zh-CN/guide': [
      {
        title: '介绍',
        path: '/zh-CN/guide',
      },
      {
        title: '如何学习Formily',
        path: '/zh-CN/guide/learn-formily',
      },
      {
        title: '快速开始',
        path: '/zh-CN/guide/quick-start',
      },
      {
        title: 'V2升级指南',
        path: '/zh-CN/guide/upgrade',
      },
      {
        title: '贡献指南',
        path: '/zh-CN/guide/contribution',
      },
      {
        title: '表单设计器开发指南',
        path: '/zh-CN/guide/form-builder',
      },
      {
        title: '问题反馈',
        path: '/zh-CN/guide/issue-helper',
      },
      {
        title: '场景案例',
        children: [
          {
            title: '登录注册',
            path: '/zh-CN/guide/scenes/login-register',
          },
          {
            title: '查询列表',
            path: '/zh-CN/guide/scenes/query-list',
          },
          {
            title: '编辑详情',
            path: '/zh-CN/guide/scenes/edit-detail',
          },
          {
            title: '弹窗与抽屉',
            path: '/zh-CN/guide/scenes/dialog-drawer',
          },
          {
            title: '分步表单',
            path: '/zh-CN/guide/scenes/step-form',
          },
          {
            title: '选项卡/手风琴表单',
            path: '/zh-CN/guide/scenes/tab-form',
          },
          {
            title: '更多场景',
            path: '/zh-CN/guide/scenes/more',
          },
        ],
      },
      {
        title: '进阶指南',
        children: [
          {
            title: '实现表单校验',
            path: '/zh-CN/guide/advanced/validate',
          },
          {
            title: '实现表单布局',
            path: '/zh-CN/guide/advanced/layout',
          },
          {
            title: '实现异步数据源',
            path: '/zh-CN/guide/advanced/async',
          },
          {
            title: '实现表单受控',
            path: '/zh-CN/guide/advanced/controlled',
          },
          {
            title: '实现联动逻辑',
            path: '/zh-CN/guide/advanced/linkages',
          },
          {
            title: '实现联动计算器',
            path: '/zh-CN/guide/advanced/calculator',
          },
          {
            title: '实现自定义组件',
            path: '/zh-CN/guide/advanced/custom',
          },
          {
            title: '前后端数据差异兼容方案',
            path: '/zh-CN/guide/advanced/destructor',
          },
          {
            title: '管理业务逻辑',
            path: '/zh-CN/guide/advanced/business-logic',
          },
          {
            title: '按需打包',
            path: '/zh-CN/guide/advanced/build',
          },
        ],
      },
    ],
  },
}
