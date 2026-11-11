# Formily v2 单域名文档站部署改造实施任务书

> 执行对象：Claude Code  
> 项目：`alibaba/formily` Fork 仓库  
> 目标分支：`formily_next`（执行前确认实际分支）  
> 部署方式：GitHub Pages + GitHub Actions  
> 自定义域名：`formilyjs-v2.bugduo.com`  
> 最终访问地址：<https://formilyjs-v2.bugduo.com>

---

# 一、项目目标

当前 Formily 官方文档站及多个 package 文档站无法正常访问。

需要基于 Formily 官方 GitHub 仓库 Fork 版本，重新构建一套完整的 Formily v2 文档站。

要求将原来分散在不同子域名的文档统一部署到一个域名下。

## 1.1 最终访问地址规划

统一域名：

`https://formilyjs-v2.bugduo.com`

文档路由规划：

| 文档模块          | URL 路径     | 文档源目录                | 文档构建技术 |
| ----------------- | ------------ | ------------------------- | ------------ |
| Formily 主站      | `/`          | `docs/`                   | Dumi         |
| @formily/reactive | `/reactive/` | `packages/reactive/docs/` | Dumi         |
| @formily/core     | `/core/`     | `packages/core/docs/`     | Dumi         |
| @formily/react    | `/react/`    | `packages/react/docs/`    | Dumi         |
| @formily/antd     | `/antd/`     | `packages/antd/docs/`     | Dumi         |
| @formily/next     | `/next/`     | `packages/next/docs/`     | Dumi         |
| @formily/element  | `/element/`  | `packages/element/docs/`  | VuePress     |
| @formily/vue      | `/vue/`      | `packages/vue/docs/`      | VuePress     |

注意：

1. 上述文档模块是初始规划，必须以实际仓库分支中的文档目录为准。
2. `@formily/json-schema` 如果没有独立 docs 目录，不需要强行创建独立子站，应保留其现有文档入口。
3. `@formily/reactive-react`、`@formily/reactive-vue` 等相关内容需要检查是否已经包含在其他文档中，避免重复部署。
4. 不得因为 package 存在，就假设其一定拥有独立文档站。
5. 如果发现其他存在独立文档的 package，应列入检查报告，由项目实际情况决定是否接入。

## 1.2 核心架构

采用：

**多个独立文档项目构建 + 一个统一静态目录 + 一次 GitHub Pages 部署。**

架构：

```text
Formily GitHub Repository
          |
          v
     GitHub Actions
          |
          v
   安装项目依赖
          |
          v
   构建主站 Dumi
          |
          v
   构建各 Package Dumi
          |
          v
   构建各 Package VuePress
          |
          v
   合并静态构建产物
          |
          v
       doc-site/
          |
          v
   GitHub Pages Deploy
          |
          v
formilyjs-v2.bugduo.com
```

最终只有：

- 一个 GitHub 仓库。
- 一个 GitHub Pages 站点。
- 一个自定义域名。
- 一套 GitHub Actions 部署流程。
- 一个完整的静态文件产物目录。

不使用多个 GitHub Pages 项目，不使用多个子域名，不需要额外云服务器。

---

# 二、执行原则

Claude Code 必须遵循以下原则。

## 2.1 先检查，再修改

不能直接按照任务书中的示例覆盖原配置。

必须先检查：

- 当前 Git 分支。
- 根目录 `package.json`。
- 根目录 `.umirc.js`。
- `yarn.lock`。
- 各 package 的 `package.json`。
- 各 package 的 `.umirc.js`。
- 各 package 的 VuePress 配置。
- 各 package 的 docs 目录。
- 原有构建脚本。
- 原有文档路由及导航配置。
- 原有图片、CSS、JS、CDN 和在线代码示例依赖。

如果实际仓库与任务书中的目录或技术配置不一致，以仓库实际情况为准，并在执行报告中说明。

## 2.2 保留原始文档

不得大规模迁移或重写原始 Markdown 文档。

不得为了统一站点而将所有 package 文档迁移到根目录。

保留原有目录结构：

```text
docs/
packages/*/docs/
```

优先采用配置改造和构建产物合并的方式。

## 2.3 不随意升级依赖

当前 Formily 项目使用较老的 Dumi、VuePress 及相关依赖。

第一阶段目标是恢复原有文档，不是升级整个项目技术栈。

要求：

- 保留原有 Yarn 版本及 lockfile。
- 不随意升级 Dumi。
- 不随意升级 VuePress。
- 不随意升级 React、Vue、Webpack。
- 不修改业务 package 的依赖版本。
- 如果 Node 版本不兼容，先分析原因，再提出最小化处理方案。

原仓库 CI 曾使用 Node 16，先验证旧依赖的兼容性。Node 16 已停止维护，不能将其视为长期安全运行方案；完成首次构建后，应单独评估升级 Node 的可行性。

## 2.4 避免影响业务构建

文档部署改造不得破坏：

- Formily package 正常构建。
- package 发布流程。
- 单元测试。
- 原有 TypeScript 配置。
- 原有开发模式。

所有修改尽量限定在：

- 文档配置。
- 文档构建脚本。
- GitHub Actions。
- 文档导航和链接。
- 文档资源路径。

---

# 三、第一阶段：仓库结构审计

在修改任何文件之前，先生成仓库审计报告。

## 3.1 检查 Git 状态

执行：

```bash
git status
git branch --show-current
git remote -v
```

确认：

- 当前是否为 Fork 仓库。
- 当前分支是否为目标分支。
- 是否存在用户未提交的修改。
- upstream 是否指向 `alibaba/formily`。

不得覆盖用户已有的未提交修改。

## 3.2 检查 package 文档清单

扫描：

```text
packages/*/docs/
```

识别每个 package：

| 字段              | 说明                   |
| ----------------- | ---------------------- |
| packageName       | package.json 中的 name |
| packagePath       | package 所在目录       |
| docsPath          | 文档源目录             |
| buildTool         | Dumi / VuePress / 其他 |
| buildCommand      | 实际文档构建命令       |
| configPath        | 文档配置文件           |
| baseSupport       | 是否支持 base 路径     |
| outputPathSupport | 是否支持自定义输出目录 |
| hasDocs           | 是否存在独立文档       |

不能仅根据 package.json 是否有 `build:docs` 判断文档是否存在。

## 3.3 检查构建命令

检查根目录及所有 package 的：

```bash
cat package.json
```

重点检查：

```json
{
  "scripts": {
    "start": "...",
    "build:docs": "..."
  }
}
```

对每个 package 记录实际命令。

必须区分：

- 开发预览命令。
- 文档构建命令。
- package 编译命令。

不能将 `build` 误认为 `build:docs`。

## 3.4 审计报告

先生成：

```text
docs-deploy/AUDIT.md
```

报告必须包含：

1. 当前分支和项目版本。
2. 所有 package 文档目录。
3. 文档构建技术。
4. 每个文档的构建命令。
5. 原始 base、publicPath、outputPath 配置。
6. 原始导航链接。
7. 旧域名引用。
8. 图片和 CDN 外部依赖。
9. 在线代码预览器依赖。
10. 当前不能直接部署的阻塞问题。

**完成审计后再开始实施。**

---

# 四、第二阶段：统一站点目录设计

最终构建产物：

```text
doc-site/
├── index.html
├── CNAME
│
├── assets/
│
├── guide/
│
├── reactive/
│   ├── index.html
│   ├── guide/
│   ├── api/
│   └── ...
│
├── core/
│   ├── index.html
│   ├── guide/
│   ├── api/
│   └── ...
│
├── react/
│   ├── index.html
│   └── ...
│
├── antd/
│   ├── index.html
│   └── ...
│
├── next/
│   ├── index.html
│   └── ...
│
├── element/
│   ├── index.html
│   └── ...
│
└── vue/
    ├── index.html
    └── ...
```

说明：

1. 主站产物直接放在 `doc-site/` 根目录。
2. 每个 package 的产物放到对应子目录。
3. 所有站点的 HTML、CSS、JS、图片必须正确引用对应路径。
4. 不允许不同站点的静态资源相互覆盖。
5. 构建目录每次都应从干净状态开始。
6. 不得把 package 源码、node_modules 或临时构建文件放入最终发布目录。

---

# 五、第三阶段：统一路径配置

这是整个改造最重要的部分。

每个子站必须支持独立的部署路径。

## 5.1 Dumi 配置

检查：

```text
.umirc.js
packages/reactive/.umirc.js
packages/core/.umirc.js
packages/react/.umirc.js
packages/antd/.umirc.js
packages/next/.umirc.js
```

对存在的 Dumi 配置进行增量修改。

统一支持：

```js
const base = process.env.DOCS_BASE || '/'
```

配置：

```js
export default {
  // 保留原有配置

  base,
  publicPath: base,

  outputPath: process.env.DOCS_OUT_DIR || './doc-site',
}
```

要求：

- 保留原有 navs。
- 保留原有 menus。
- 保留原有 locales。
- 保留原有 alias。
- 保留原有 plugins。
- 保留原有主题配置。
- 保留原有 resolve 配置。
- 只调整部署所需配置。

注意：

如果原有配置已经存在 `base`、`publicPath` 或 `outputPath`，应修改原配置，不得产生重复字段。

如果不同 Dumi 版本对某些配置存在差异，应以当前项目版本的实际行为为准。

## 5.2 VuePress 配置

检查：

```text
packages/vue/docs/.vuepress/config.js
packages/element/docs/.vuepress/config.js
```

VuePress 使用：

```js
module.exports = {
  // 保留原有配置

  base: process.env.DOCS_BASE || '/',

  dest: process.env.DOCS_OUT_DIR || './doc-site',
}
```

要求：

1. 确认 VuePress 实际版本。
2. 确认 `base` 能正确影响资源路径。
3. 确认 `dest` 对绝对路径的处理方式。
4. 保留原有插件、主题和 Webpack alias。
5. 不要覆盖原有 sidebar、nav、plugins 等配置。

如果 VuePress 的 `dest` 是相对于执行目录还是配置文件目录，需要通过实际构建验证，不能仅凭配置推测。

## 5.3 路径对应表

统一采用：

| 站点     | DOCS_BASE    | 输出目录             |
| -------- | ------------ | -------------------- |
| 主站     | `/`          | `doc-site/`          |
| Reactive | `/reactive/` | `doc-site/reactive/` |
| Core     | `/core/`     | `doc-site/core/`     |
| React    | `/react/`    | `doc-site/react/`    |
| Antd     | `/antd/`     | `doc-site/antd/`     |
| Next     | `/next/`     | `doc-site/next/`     |
| Element  | `/element/`  | `doc-site/element/`  |
| Vue      | `/vue/`      | `doc-site/vue/`      |

---

# 六、第四阶段：导航和内部链接改造

## 6.1 主站导航

修改根目录 `.umirc.js` 中的中英文导航。

推荐结构：

```text
Formily
├── 指南
├── 核心库
│   ├── @formily/reactive
│   ├── @formily/core
│   └── @formily/react
└── 组件生态
    ├── @formily/antd
    ├── @formily/next
    ├── @formily/element
    └── @formily/vue
```

导航路径：

```text
/reactive/
/core/
/react/
/antd/
/next/
/element/
/vue/
```

示例：

```js
{
  title: 'Core Libraries',
  children: [
    {
      title: '@formily/reactive',
      path: '/reactive/',
    },
    {
      title: '@formily/core',
      path: '/core/',
    },
    {
      title: '@formily/react',
      path: '/react/',
    },
  ],
}
```

中文导航也应保持相同结构。

注意：具体导航配置结构必须符合当前 Dumi 版本的配置格式，不能直接假设所有版本均支持相同的嵌套结构。

## 6.2 替换旧域名

搜索整个文档目录中的旧域名：

```bash
grep -RInE \
'formilyjs\.org|reactive\.formilyjs|core\.formilyjs|react\.formilyjs|vue\.formilyjs|antd\.formilyjs|element\.formilyjs' \
docs packages
```

需要识别：

- 主站导航。
- 子站导航。
- Markdown 内部链接。
- 首页按钮。
- 代码示例跳转。
- 图片链接。
- 其他文档之间的跳转。

对于文档站内部链接，优先替换为统一域名下的对应路径。

例如：

```text
https://reactive.formilyjs.org/guide
```

改为：

```text
https://formilyjs-v2.bugduo.com/reactive/guide
```

跨站返回主站：

```text
https://formilyjs-v2.bugduo.com/
```

不要简单全局替换所有 `formilyjs.org`，必须识别链接用途，避免误改 GitHub、NPM 或第三方链接。

## 6.3 国际化

必须检查：

- 主站英文页面。
- 主站中文页面。
- Reactive 中英文页面。
- Core 中英文页面。
- React 中英文页面。
- 其他存在国际化内容的子站。

原有 `/zh-CN/` 等路由结构应尽量保留。

不能因为新增子路径而破坏原来的语言切换。

---

# 七、第五阶段：构建脚本

新增：

```text
scripts/build-docs.sh
```

目标：

```bash
#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$ROOT/doc-site"

cd "$ROOT"

echo "Build Formily documentation"

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT"

# 主站
DOCS_BASE="/" \
DOCS_OUT_DIR="$OUTPUT" \
yarn build:docs

# Dumi 子站
build_dumi() {
  local workspace="$1"
  local base="$2"
  local name="$3"

  echo "Building $workspace"

  DOCS_BASE="$base" \
  DOCS_OUT_DIR="$OUTPUT/$name" \
  yarn workspace "$workspace" run build:docs
}

# VuePress 子站
build_vuepress() {
  local workspace="$1"
  local base="$2"
  local name="$3"

  echo "Building $workspace"

  DOCS_BASE="$base" \
  DOCS_OUT_DIR="$OUTPUT/$name" \
  yarn workspace "$workspace" run build:docs
}

# 以下命令必须在审计确认 package 存在、脚本可用后启用

build_dumi "@formily/reactive" "/reactive/" "reactive"
build_dumi "@formily/core" "/core/" "core"
build_dumi "@formily/react" "/react/" "react"
build_dumi "@formily/antd" "/antd/" "antd"
build_dumi "@formily/next" "/next/" "next"

build_vuepress "@formily/element" "/element/" "element"
build_vuepress "@formily/vue" "/vue/" "vue"

# 检查主站
test -f "$OUTPUT/index.html"

# 检查每个子站
for name in reactive core react antd next element vue; do
  if [ ! -f "$OUTPUT/$name/index.html" ]; then
    echo "ERROR: Missing $name/index.html"
    exit 1
  fi
done

echo "All documentation built successfully"
```

重要要求：

以上脚本是目标实现模板，Claude Code 必须根据第一阶段的审计结果修正后才能执行。

尤其注意：

1. Yarn workspace 名称必须与 package.json 中的 name 一致。
2. 各 package 必须实际存在 `build:docs`。
3. Dumi 和 VuePress 构建输出路径必须经过验证。
4. 主站构建不能在子站构建后再次清空输出目录。
5. 如果 VuePress 配置不支持目标绝对输出路径，应采用安全的构建后复制方式。
6. 某个站点构建失败必须终止整个构建。
7. 不允许失败后继续发布不完整站点。
8. 对于不存在独立文档的 package，不创建虚假构建任务。

## 7.1 产物完整性检查

建议额外编写：

```text
scripts/verify-docs.sh
```

至少检查：

- 主站 `index.html`。
- 所有启用子站的 `index.html`。
- 所有子站静态资源目录。
- CNAME 文件（由部署步骤添加）。
- 不能存在空的子站目录。
- 不允许构建产物落在错误的嵌套目录。
- 不允许不同站点构建互相覆盖。

---

# 八、第六阶段：GitHub Actions

新增：

```text
.github/workflows/deploy-docs.yml
```

配置：

```yaml
name: Deploy Formily Documentation

on:
  push:
    branches:
      - formily_next
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 16
          cache: yarn

      - name: Enable Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: yarn install --frozen-lockfile --ignore-engines

      - name: Build documentation
        run: bash scripts/build-docs.sh

      - name: Verify documentation
        run: bash scripts/verify-docs.sh

      - name: Add CNAME
        run: echo "formilyjs-v2.bugduo.com" > doc-site/CNAME

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./doc-site

  deploy:
    runs-on: ubuntu-latest
    needs: build

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

要求：

- Workflow 中的分支必须与实际部署分支一致。
- 如果仓库实际使用其他分支，需要调整。
- 保留锁文件，不使用 `yarn install` 无锁更新依赖。
- 构建失败不得进入 deploy job。
- 一个 Workflow 只上传一个完整 Pages artifact。
- 一个 Workflow 只执行一次 Pages 部署。

Node 版本应在完成兼容性验证后再决定是否升级，不要为了消除警告而直接升级整个依赖树。

---

# 九、第七阶段：外部资源和示例检查

原 Formily 文档存在第三方资源依赖，需要重点检查。

## 9.1 Carbon Ads

原 `.umirc.js` 中可能存在：

```text
cdn.carbonads.com
```

动态注入广告脚本。

要求：

- 删除或禁用 Carbon Ads 注入逻辑。
- 清理不再需要的广告 CSS。
- 不影响 Dumi 正常渲染。

## 9.2 图片资源

检查：

```text
img.alicdn.com
```

以及其他 CDN。

要求：

- 检查图片 URL 是否可访问。
- 识别失效图片。
- 能够稳定获取的关键 Logo、首页背景等资源，可以考虑下载到项目静态资源目录。
- 不要无差别下载所有图片。
- 不修改图片内容。
- 保留图片版权和原有引用说明。

## 9.3 第三方 CSS

检查：

```text
esm.sh
```

以及其他 CDN 样式依赖。

重点关注：

- Ant Design 样式。
- Element UI 样式。
- 组件预览器依赖。

如果 CDN 失效，应优先寻找与当前版本匹配的本地依赖资源。

## 9.4 在线示例

检查：

- CodeSandbox。
- 代码预览器。
- 在线 Demo。
- 第三方 API。
- iframe。

要求：

- 文档页面正常显示。
- 在线预览不可用时，不能影响整页渲染。
- 尽可能保留代码展示。
- 将依赖第三方服务的功能记录到验收报告。

---

# 十、第八阶段：本地构建和验收

必须先本地构建通过，再配置 GitHub Pages。

## 10.1 本地完整构建

执行：

```bash
bash scripts/build-docs.sh
```

检查：

```bash
find doc-site -name index.html
```

预期至少有：

```text
doc-site/index.html
doc-site/reactive/index.html
doc-site/core/index.html
doc-site/react/index.html
doc-site/antd/index.html
doc-site/next/index.html
doc-site/element/index.html
doc-site/vue/index.html
```

具体清单根据实际审计结果调整。

## 10.2 本地静态预览

使用静态服务器预览构建产物。

例如：

```bash
npx http-server doc-site -p 8080
```

检查：

```text
http://localhost:8080/
http://localhost:8080/reactive/
http://localhost:8080/core/
http://localhost:8080/react/
http://localhost:8080/antd/
http://localhost:8080/next/
http://localhost:8080/element/
http://localhost:8080/vue/
```

不能只检查首页。

必须检查：

- 首页是否正常。
- 每个子站是否正常。
- 刷新子站内部页面是否正常。
- JS 是否加载。
- CSS 是否加载。
- 图片是否加载。
- 中文和英文页面是否正常。
- 导航是否正确。
- 子站之间是否能正常跳转。
- 浏览器控制台是否有明显错误。

## 10.3 自动化检查

如果项目现有环境允许，建议增加 Playwright 验收脚本。

最少覆盖：

1. 主站首页。
2. Reactive 首页和一个内部页面。
3. Core 首页和一个内部页面。
4. React 首页。
5. Antd 首页。
6. Next 首页。
7. Vue 首页。
8. Element 首页。

检查：

- HTTP 状态码。
- 页面标题。
- 关键导航。
- JS/CSS 加载错误。
- 图片加载错误。
- 控制台异常。

如果无法自动验证某个第三方 Demo，应将其标记为人工验收项，不能假装测试通过。

---

# 十一、第九阶段：GitHub Pages 配置

代码和构建验证完成后，再配置 GitHub Pages。

## 11.1 GitHub Pages

进入仓库：

```text
Settings
  → Pages
  → Build and deployment
```

Source：

```text
GitHub Actions
```

Custom domain：

```text
formilyjs-v2.bugduo.com
```

## 11.2 DNS

在 `bugduo.com` DNS 控制台增加：

| 字段     | 内容                       |
| -------- | -------------------------- |
| 类型     | CNAME                      |
| 主机记录 | formilyjs-v2               |
| 记录值   | `<GitHub用户名>.github.io` |
| TTL      | 默认                       |

例如：

```text
formilyjs-v2.bugduo.com
    CNAME
<GitHub用户名>.github.io
```

不要填写：

```text
<GitHub用户名>.github.io/formily
```

## 11.3 HTTPS

DNS 生效后：

```text
GitHub Repository
  → Settings
  → Pages
```

等待 GitHub 完成域名检查和证书签发。

然后开启：

```text
Enforce HTTPS
```

这部分需要用户在 GitHub 和 DNS 控制台进行授权及配置，Claude Code 不应假设自己已经完成。

---

# 十二、第十阶段：Git 忽略和文档说明

## 12.1 .gitignore

确保构建产物不被提交：

```gitignore
# Documentation build
doc-site/
```

如果原来已有 `doc-site` 相关规则，应合并，不要重复添加。

## 12.2 部署说明

新增：

```text
docs-deploy/DEPLOY.md
```

内容至少包含：

1. 文档站整体架构。
2. package 文档映射表。
3. 本地开发方法。
4. 本地构建方法。
5. 新增子站的方法。
6. GitHub Actions 部署流程。
7. GitHub Pages 配置。
8. DNS 配置。
9. 常见问题排查。
10. 依赖升级注意事项。

## 12.3 新增 package 文档的规范

后续新增一个 package 文档时，应遵循：

```text
1. 创建 package/docs
2. 配置对应文档构建工具
3. 配置 DOCS_BASE
4. 配置 DOCS_OUT_DIR
5. 将 package 添加到构建清单
6. 将 package 添加到主站导航
7. 执行完整构建
8. 执行路由及资源检查
```

尽量将 package 构建配置集中维护，避免每次新增 package 都需要大量修改脚本。

---

# 十三、执行阶段和验收标准

Claude Code 必须按阶段实施，不得直接跳过审计。

| 阶段 | 工作     | 交付物             | 验收条件              |
| ---- | -------- | ------------------ | --------------------- |
| 1    | 仓库审计 | AUDIT.md           | 文档清单准确          |
| 2    | 配置改造 | Dumi/VuePress 配置 | base 和输出路径正确   |
| 3    | 导航改造 | 主站及子站导航     | 内部链接正确          |
| 4    | 构建脚本 | build-docs.sh      | 全部文档可构建        |
| 5    | 产物检查 | verify-docs.sh     | 构建目录完整          |
| 6    | 自动部署 | deploy-docs.yml    | Workflow 成功         |
| 7    | 本地预览 | 测试报告           | 所有站点可访问        |
| 8    | 文档说明 | DEPLOY.md          | 后续可维护            |
| 9    | 发布准备 | 部署配置清单       | DNS 和 Pages 配置明确 |

---

# 十四、阻塞问题处理原则

发现问题时，按下面优先级处理。

## P0：必须解决

- package 文档构建失败。
- Dumi/VuePress 路由不支持子路径。
- 静态资源路径错误。
- 构建产物覆盖。
- 首页无法访问。
- 内部页面刷新 404。
- 主站导航跳转错误。
- GitHub Actions 无法部署。

## P1：尽量解决

- 旧域名跳转。
- 图片失效。
- 第三方 CDN 失效。
- 中英文路由问题。
- 代码示例预览器不可用。
- 第三方 Demo 失效。

## P2：后续优化

- 文档主题样式统一。
- 搜索体验优化。
- 站点间统一导航组件。
- 离线资源。
- 文档版本管理。
- 上游文档同步自动化。

P0 问题未解决时，不允许标记部署完成。

P1 问题如果不影响页面主体访问，可以记录为已知问题，但必须在报告中明确说明。

---

# 十五、最终交付要求

Claude Code 完成后，输出执行报告：

```text
docs-deploy/
├── AUDIT.md
├── DEPLOY.md
└── BUILD-REPORT.md
```

其中：

## AUDIT.md

记录原始仓库文档结构和构建方式。

## DEPLOY.md

记录最终部署架构、配置、部署和维护方法。

## BUILD-REPORT.md

记录：

- 修改文件清单。
- 新增文件清单。
- 每个 package 构建结果。
- 构建产物路径。
- 路由检查结果。
- 资源检查结果。
- 自动化测试结果。
- 未解决问题。
- GitHub Pages 后续操作步骤。

同时向用户汇报：

1. 哪些文件被修改。
2. 哪些文件被新增。
3. 哪些 package 文档已经成功构建。
4. 哪些文档存在兼容性问题。
5. 本地预览地址。
6. GitHub Actions 是否已经具备部署条件。
7. 用户还需要手动完成哪些 DNS 和 GitHub 设置。

**不要在没有实际执行成功的情况下声称构建通过或部署成功。**

---

# 十六、给 Claude Code 的最终执行指令

请基于当前打开的 Formily 仓库，完成上述文档站单域名部署改造。

执行要求：

1. 先审计仓库，不要立即修改代码。
2. 先输出文档 package 清单和构建方式。
3. 对照现有代码，确定 Dumi 和 VuePress 的具体配置。
4. 制定最小修改方案。
5. 方案合理后直接执行，不需要每修改一个文件都询问确认。
6. 不得修改与文档部署无关的业务代码。
7. 不得随意升级依赖。
8. 每完成一个阶段立即执行对应验证。
9. 发现问题优先自行分析和修复。
10. 无法解决的问题必须记录，不得绕过检查。
11. 最终执行完整构建和本地静态站点验收。
12. 输出完整执行报告。

本任务最终目标：

**将 Formily v2 主站以及所有存在独立文档的 package，统一部署到 `https://formilyjs-v2.bugduo.com`，通过一个 GitHub Pages 站点提供完整、可维护、可持续更新的文档服务。**

先保证原有文档完整恢复，再考虑主题统一和其他体验优化。
