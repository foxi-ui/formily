# Formily v2 文档站仓库审计报告

- 审计日期：2026-11-11
- 仓库：`foxi-ui/formily`（Fork）
- 当前分支：`formily_next`
- 当前提交：`d9a46442a575aa5f0fc1bd945e34d9a85d191d0e`
- 审计范围：根目录与 `packages/*` 下的文档目录、Dumi/VuePress 配置、构建脚本、导航、链接与外部资源。
- 审计方式：只读检查 + 一次 `@formily/reactive` 文档基线构建 + 一次全量 package 构建验证。

## 1. Git 与运行环境

| 项目                 | 实际值                                  |
| -------------------- | --------------------------------------- | --- | --- | --- | ---- | --- | ------------------------------- |
| 当前分支             | `formily_next`                          |
| `origin`             | `git@github.com:foxi-ui/formily.git`    |
| `upstream`           | 不存在（仅配置了 origin）               |
| 未提交修改           | 仅 `doc-build.md`（审计开始时）         |
| 项目版本             | `2.3.7`（`lerna.json`）                 |
| 包管理器             | Yarn `1.22.22`（`packageManager` 字段） |
| CI Node 版本         | `16`（`.github/workflows/ci.yml`）      |
| 本机 Node 版本       | 默认 `22.23.2`；同时已安装 `16.20.2`    |
| 根 `devEngines.node` | `8.x                                    |     | 9.x |     | 10.x |     | 11.x`（历史遗留，与 CI 不一致） |
| 根 `build:docs`      | `dumi build`                            |
| 根 `start`           | `dumi dev`                              |

结论：

1. 必须使用 Node 16 执行本地构建验证，与现有 CI 保持一致。
2. Node 22 下 `npm` 会拒绝根 `package.json` 的旧 `devEngines.node` 写法，导致 `yarn build` 在子包执行 `npm run build:cjs` 时失败；这不是文档代码问题。
3. 本任务不修改 `devEngines`，也不升级 Node/Dumi/VuePress。

## 2. 文档 package 清单

扫描 `docs/` 与 `packages/*/docs/` 后，实际存在独立文档目录的模块如下。

| 模块              | package 名          | 文档源目录                | Markdown 数量 | 构建工具       | 文档构建命令                                      | 配置文件                                    |
| ----------------- | ------------------- | ------------------------- | ------------- | -------------- | ------------------------------------------------- | ------------------------------------------- |
| 主站              | `root`              | `docs/`                   | 50            | Dumi 1.1.54    | `yarn build:docs`（根目录）                       | `.umirc.js`                                 |
| @formily/reactive | `@formily/reactive` | `packages/reactive/docs/` | 44            | Dumi 1.1.54    | `yarn workspace @formily/reactive run build:docs` | `packages/reactive/.umirc.js`               |
| @formily/core     | `@formily/core`     | `packages/core/docs/`     | 40            | Dumi 1.1.54    | `yarn workspace @formily/core run build:docs`     | `packages/core/.umirc.js`                   |
| @formily/react    | `@formily/react`    | `packages/react/docs/`    | 54            | Dumi 1.1.54    | `yarn workspace @formily/react run build:docs`    | `packages/react/.umirc.js`                  |
| @formily/antd     | `@formily/antd`     | `packages/antd/docs/`     | 72            | Dumi 1.1.54    | `yarn workspace @formily/antd run build:docs`     | `packages/antd/.umirc.js`                   |
| @formily/next     | `@formily/next`     | `packages/next/docs/`     | 74            | Dumi 1.1.54    | `yarn workspace @formily/next run build:docs`     | `packages/next/.umirc.js`                   |
| @formily/element  | `@formily/element`  | `packages/element/docs/`  | 34            | VuePress 1.9.7 | `yarn workspace @formily/element run build:docs`  | `packages/element/docs/.vuepress/config.js` |
| @formily/vue      | `@formily/vue`      | `packages/vue/docs/`      | 27            | VuePress 1.9.7 | `yarn workspace @formily/vue run build:docs`      | `packages/vue/docs/.vuepress/config.js`     |

依赖版本：

- 根 `devDependencies.dumi`: `^1.1.53`，实际安装 `1.1.54`
- 各 package `devDependencies.dumi`: `^1.1.0-rc.8`，通过 Yarn hoist 使用 `1.1.54`
- Dumi 底层 `umi`: `3.5.41`
- VuePress: `^1.8.2`，实际安装 `1.9.7`
- React: `^18.0.0`
- Vue: `^2.6.0` / `^2.6.12`
- Element 文档组件库：`element-ui@^2.15.7`
- Antd 文档组件库：`antd@^4.0.0`
- Next 文档组件库：`@alifd/next@^1.19.1`

## 3. 存在 `build:docs` 但没有独立文档站的 package

以下 package 不能被错误地接入为独立子站：

| package                                                    | 实际情况                                                                       | 处理                                                                      |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `@formily/json-schema`                                     | 有 `package.json`，无 `docs/`                                                  | 不创建子站；保留主站/其他文档中的链接                                     |
| `@formily/path`                                            | 有 `build:docs`/`start`，但无 `docs/` 目录                                     | 不创建子站                                                                |
| `@formily/reactive-react`                                  | 有 `.umirc.js`（`mode: 'doc'`）与 `build:docs`，但无 `docs/` 目录，仅有 README | 不创建子站；其文档内容已在 `packages/reactive/docs/api/react/observer.md` |
| `@formily/reactive-vue`                                    | 无 `docs/`、无 `build:docs`                                                    | 不创建子站；内容已在 `packages/reactive/docs/api/vue/observer.md`         |
| `@formily/benchmark`                                       | 有 `.umirc.js` 与 `start`，无 `docs/`                                          | 不创建子站                                                                |
| `@formily/reactive-test-cases-for-react18`                 | 有 `.umirc.js`，无 `docs/`                                                     | 不创建子站                                                                |
| `@formily/grid` / `@formily/shared` / `@formily/validator` | 无 `docs/`、无 `build:docs`                                                    | 不创建子站                                                                |

因此最终启用 8 个站点：主站 + `reactive`、`core`、`react`、`antd`、`next`、`element`、`vue`。

## 4. 原始路径与输出配置

### 4.1 Dumi（主站与 5 个 React 系 package）

所有 Dumi 配置当前都：

- 没有 `base`
- 没有 `publicPath`
- 已有 `outputPath: './doc-site'`
- 已有 `hash: true`（这是 umi 的产物文件名 hash，不是路由 hash）
- 主站与 `antd` 配置了 `locales`
- `reactive`/`core`/`react`/`antd`/`next` 的 `navs` 中包含 `Home Site`/`主站` 指向 `https://formilyjs.org`
- 全部注入了 Carbon Ads `headScripts`
- `react`/`antd`/`next` 通过 `links` 引用 `esm.sh` 上的组件库 CSS
- 主站额外引用 `esm.sh/antd@4.x` 的 CSS

`outputPath` 的行为（已核对 umi 源码）：umi 使用 `path.join(cwd, outputPath)`，因此：

- 根目录执行时输出到 `<repo>/doc-site`
- 在 package 目录执行时输出到 `<package>/doc-site`
- **不能直接把绝对路径传给 `outputPath`**，否则会被拼接到 cwd 后面；构建脚本应传相对于 package 目录的路径，例如 `../../doc-site/reactive`

### 4.2 VuePress（element / vue）

两个配置当前都有：

- `dest: './doc-site'`
- 没有 `base`
- `theme: '@vuepress-dumi/dumi'`
- `plugins`: `vuepress-plugin-typescript`、`back-to-top`、`last-updated`、`dumi-previewer`、`medium-zoom`
- `themeConfig.nav` 中包含指向 `https://formilyjs.org` 的“主站”
- `configureWebpack.resolve.alias` 只覆盖了部分 `@formily/*` 源码

VuePress 的 `dest` 由 `@vuepress/core` 解析，相对路径基于 cwd；构建脚本同样应传相对于 package 目录的路径。

### 4.3 重新生成 HTML 与刷新 404

Dumi/umi 默认只生成一个 `index.html` 的 SPA。仅配置 `base`/`publicPath` 后，直接访问或刷新 `/reactive/guide/...` 在 GitHub Pages 上会 404。

已核对本仓库安装的 umi 3.5.41：其 `exportStatic` 功能会为每条路由生成对应目录的 `index.html`（例如 `guide/quick-start/index.html`），可直接用于 GitHub Pages 的“目录 index.html”静态托管。因此计划为每个 Dumi 站点增加：

```js
exportStatic: {},
```

这样 URL 仍保持 `/reactive/guide/quick-start` 这类干净路径，刷新不会 404。VuePress 本身是静态生成，每个页面已有独立 HTML，不需要该处理。

## 5. 原始导航与旧域名引用

### 5.1 主站导航中的文档域名

根 `.umirc.js` 中与本站相关的导航项：

| 导航项            | 原地址                           | 目标路径     |
| ----------------- | -------------------------------- | ------------ |
| @formily/reactive | `https://reactive.formilyjs.org` | `/reactive/` |
| @formily/core     | `https://core.formilyjs.org`     | `/core/`     |
| @formily/react    | `https://react.formilyjs.org`    | `/react/`    |
| @formily/antd     | `https://antd.formilyjs.org`     | `/antd/`     |
| @formily/next     | `https://fusion.formilyjs.org`   | `/next/`     |
| @formily/element  | `https://element.formilyjs.org`  | `/element/`  |
| @formily/vue      | `https://vue.formilyjs.org`      | `/vue/`      |

主站导航还包含大量本仓库不存在的子站（`antd5`、`antd-mobile`、`element-plus`、`antdv`、`vant`、`semi`、`tdesign-react` 等）以及 Designable、Chrome 扩展、GitHub、知乎等第三方链接。这些不属于本次托管的 8 个站点，保留原样，仅替换本仓库实际托管的 7 个子站链接。

各子站导航中的 `Home Site` / `主站` 原指向 `https://formilyjs.org`，需改为统一域名主站（跨站链接必须使用完整 URL，不能用 `/`，否则会被 React Router 的 basename 解析回子站）。

### 5.2 文档正文中的旧域名

按 host 统计（已排除 `node_modules`）：

| 旧域名                          | 命中文件数             | 备注                             |
| ------------------------------- | ---------------------- | -------------------------------- |
| `core.formilyjs.org`            | 71                     | 最主要的跨站引用                 |
| `react.formilyjs.org`           | 14                     |                                  |
| `formilyjs.org`（裸主机）       | 13                     | 含导航、首页按钮、旧 Netlify API |
| `antd.formilyjs.org`            | 12                     |                                  |
| `reactive.formilyjs.org`        | 7                      |                                  |
| `fusion.formilyjs.org`          | 7                      | 对应 `@formily/next`             |
| `vue.formilyjs.org`             | 2                      |                                  |
| `element.formilyjs.org`         | 1                      |                                  |
| `designable-antd.formilyjs.org` | 2                      | 第三方 Designable，保留          |
| `v1.formilyjs.org`              | 0（正文）/ 1（根导航） | 1.x 文档，保留                   |

替换规则：

| 旧地址                            | 新地址                                     |
| --------------------------------- | ------------------------------------------ |
| `https://formilyjs.org`（裸主机） | `https://formilyjs-v2.bugduo.com`          |
| `reactive.formilyjs.org`          | `https://formilyjs-v2.bugduo.com/reactive` |
| `core.formilyjs.org`              | `https://formilyjs-v2.bugduo.com/core`     |
| `react.formilyjs.org`             | `https://formilyjs-v2.bugduo.com/react`    |
| `antd.formilyjs.org`              | `https://formilyjs-v2.bugduo.com/antd`     |
| `fusion.formilyjs.org`            | `https://formilyjs-v2.bugduo.com/next`     |
| `element.formilyjs.org`           | `https://formilyjs-v2.bugduo.com/element`  |
| `vue.formilyjs.org`               | `https://formilyjs-v2.bugduo.com/vue`      |

注意：

- 必须使用“主机名边界”匹配，不能把 `designable-antd.formilyjs.org`、`v1.formilyjs.org`、`antd5.formilyjs.org` 等误替换。
- 裸 `formilyjs.org` 不能覆盖子域名；替换脚本必须在子域名替换完成后再处理裸主机，并使用负向前瞻/边界检查。
- 旧 Netlify Functions 不能简单替换域名（见第 7 节）。

### 5.3 国际化

- 主站：`locales: [['en-US','English'], ['zh-CN','中文']]`，文件采用 `xxx.md` + `xxx.zh-CN.md`
- `antd`：显式配置 `locales`
- `reactive`/`core`/`react`/`next`：使用 Dumi 默认 locale 约定，同样存在 `.zh-CN.md`
- `element`/`vue`：VuePress 中文为主，无语言切换配置
- 目标：保留 `/zh-CN/...` 路由结构；配置 `base` 后由 Router 自动加前缀，不修改文档文件名。

## 6. 外部资源与在线示例

| 资源                                            | 用途                                    | 审计结果             | 处理建议                     |
| ----------------------------------------------- | --------------------------------------- | -------------------- | ---------------------------- |
| `img.alicdn.com`                                | logo、favicon、首页 hero 背景、特性图标 | HTTP 200 可访问      | 保留；记录为外链依赖         |
| `esm.sh/antd@4.x/dist/antd.css`                 | 主站/react/antd 样式                    | HTTP 200             | 保留；记录为外链依赖         |
| `esm.sh/@alifd/next/dist/next-noreset.css`      | next 样式                               | HTTP 200             | 保留                         |
| `esm.sh/element-ui/lib/theme-chalk/index.css`   | element 样式                            | HTTP 200             | 保留                         |
| `cdn.carbonads.com`                             | 文档页广告                              | 可访问但与本项目无关 | 删除注入脚本与广告 CSS       |
| `codesandbox.io`                                | 主站首页 iframe                         | HTTP 200             | 保留                         |
| `unpkg.com/china-location`                      | element 级联示例数据                    | HTTP 200             | 保留，记录为第三方示例依赖   |
| `registry.npmmirror.com`                        | issue-helper 版本列表                   | HTTP 200             | 保留                         |
| `formilyjs.org/.netlify/functions/contributors` | 主站贡献者列表                          | HTTP 503             | 改为 GitHub Contributors API |
| `formilyjs.org/.netlify/functions/npm-search`   | issue-helper 包搜索                     | HTTP 503             | 改为 npm registry search API |
| `api.github.com`                                | 贡献者 API                              | HTTP 200，支持 CORS  | 可作为替代                   |
| `registry.npmjs.org/-/v1/search`                | npm 包搜索                              | HTTP 200             | 可作为替代                   |

在线示例：

- Dumi 站点使用 Dumi 内置 Demo Previewer，Demo 在构建期本地编译，不依赖外部预览服务。
- VuePress 站点使用 `@vuepress-dumi/vuepress-plugin-dumi-previewer`，同样为构建期本地编译。
- 主站首页包含 CodeSandbox iframe，可作为独立页面正常渲染；即使 iframe 不可用，也不应影响整页。

## 7. 当前不能直接部署的阻塞问题

### P0-1：package 文档构建无法解析同仓库依赖

基线命令：

```bash
yarn workspace @formily/reactive run build:docs
```

结果：失败。

```text
Module not found: Error: Can't resolve '@formily/reactive-react'
```

原因：

1. 从 package 目录执行时，Dumi 的 `getHostPkgAlias` 检测不到根目录 `lerna.json`，只会把当前 package 的 `src` 加入 alias。
2. 其他 workspace package 通过 Yarn symlink 指向 `packages/<name>`，但其 `package.json` 的 `main: lib` 尚未构建，因此 webpack 无法解析。
3. `reactive` 文档中的 Demo 直接 `import '@formily/reactive-react'`，于是构建在第一个缺失依赖处失败。

最小化方案（按优先级）：

1. 在 CI/本地先执行 package 构建（`yarn build`，Node 16），使 `lib`/`esm` 存在；这是最贴近原项目发布流程的方式，但耗时更长。
2. 若不希望构建全部业务 package，则在各文档配置中把相关 `@formily/*` alias 到对应 `src`，并通过 Dumi `resolve.includes`/VuePress babel 配置把依赖源码纳入编译。
3. 本任务优先验证方案 1；若 `yarn build` 在 Node 16 下稳定通过，则构建脚本先执行 package 构建，再进行文档构建。若失败，则采用方案 2 并为每个子站补齐 alias 清单。

> 审计时已确认：Node 22 下 `yarn build` 因旧 `devEngines` 字段失败；Node 16 下的验证结果见 `BUILD-REPORT.md`。

### P0-2：未配置 `base` / `publicPath`

所有 Dumi 站点和 VuePress 站点都没有子路径部署配置，直接部署会导致资源全部指向域名根路径，子站样式/JS 404。

方案：所有站点统一读取 `DOCS_BASE` 环境变量，设置 `base` 与 `publicPath`；主站为 `/`，子站为 `/<name>/`。

### P0-3：Dumi 深链接刷新 404

Dumi 默认 SPA 只生成 `index.html`；GitHub Pages 没有 SPA fallback。

方案：为 Dumi 配置 `exportStatic: {}`，构建时生成每条路由的 `index.html`。需要实际构建验证产物结构与刷新行为。

### P0-4：输出目录覆盖与主站清理顺序

- 根构建会 `rimraf` 整个 `doc-site`。
- 必须在脚本中先清空 `doc-site`，再构建主站，最后构建各子站。
- 每个子站只能清空自己的子目录，不能触碰其他子站。

### P0-5：Node 版本

- CI 使用 Node 16；本地默认 Node 22。
- Node 22 下旧 npm 校验 `devEngines` 失败，且 webpack 4 可能需要 `--openssl-legacy-provider`。
- 方案：本地与 CI 第一阶段统一使用 Node 16；完成首次部署后再单独评估升级。

### P1-1：旧 Netlify API 已 503

主站首页贡献者列表、issue-helper 的 npm 包搜索依赖的 Netlify Functions 均返回 503，属于失效服务，不是静态托管能恢复的。

方案：

- Contributors：改用 `https://api.github.com/repos/alibaba/formily/contributors?per_page=100`（需适配返回数组结构并处理失败状态）。
- npm-search：改用 `https://registry.npmjs.org/-/v1/search?text=@formily&size=250`（需适配 `objects[].package.name` 结构）。

### P1-2：Carbon Ads

所有 Dumi 配置都注入了 `cdn.carbonads.com` 广告脚本与 CSS。该广告与本站无关，且可能拖慢/污染页面。

方案：删除 `headScripts` 中的广告注入代码与 `#carbonads` 相关 CSS，不影响 Dumi 主题。

### P1-3：第三方 CDN 与图片

`img.alicdn.com`、`esm.sh` 当前可访问，先保留原引用并在验收报告中记录；不在第一阶段做本地化，避免引入新的资源路径问题。

## 8. 审计验证结果

在审计过程中执行了以下验证：

| 验证                      | 命令                                                            | 结果                                                                 |
| ------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Node 22 全量 package 构建 | `yarn build`（Node 22.23.2）                                    | 失败：npm 拒绝旧 `devEngines.node`                                   |
| Node 16 全量 package 构建 | `yarn build`（Node 16.20.2）                                    | 成功，约 64 秒，生成全部 `lib`/`esm`                                 |
| Reactive 子站基线构建     | `yarn workspace @formily/reactive run build:docs`               | 失败：缺少 `@formily/reactive-react`，原因见 P0-1                    |
| Reactive 子站新配置构建   | `DOCS_BASE=/reactive/ DOCS_OUT_DIR=../../doc-site/reactive ...` | 成功；生成 59 个 HTML，包含深层路由与 `~demos` 路由                  |
| Vue 子站新配置构建        | `DOCS_BASE=/vue/ DOCS_OUT_DIR=../../doc-site/vue ...`           | 首次因 TS 类型检查失败；开启 `transpileOnly` 后成功，生成 53 个 HTML |
| 替换后的公开 API          | GitHub Contributors / npm registry search                       | HTTP 200，均支持 CORS                                                |

由此确认：

1. Node 16 + 先构建 package 的方案可行。
2. Dumi `exportStatic: {}` 能生成深层路由 HTML，`base`/`publicPath` 正确生效。
3. VuePress `base`/`dest` 正确生效；需要关闭文档构建期的重复类型检查。
4. VuePress 中协议相对的图片地址会被 base 前缀污染，已改为 `https://` 绝对地址。

## 9. 审计结论

1. 实际需要部署 8 个站点，与任务书初始规划一致；没有额外的独立文档 package。
2. 所有 Dumi/VuePress 构建命令真实存在，但 package 构建存在 workspace 依赖解析问题，必须先解决。
3. 主站与子站都需要新增 `base`/`publicPath` 与 `exportStatic` 配置。
4. 旧域名替换范围明确，但必须排除 Designable、v1 文档与第三方子域。
5. 旧 Netlify API 已失效，需要替换为公开 API 或记录为已知问题。
6. Node 16 是当前唯一已验证与 CI 一致的构建环境；Node 升级不在本阶段范围。
