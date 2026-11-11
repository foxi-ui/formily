# Formily v2 文档站构建与验收报告

- 上游跟踪分支：`formily_next`
- 部署改造分支：`docs-deploy`
- 基线提交：`d9a46442a575aa5f0fc1bd945e34d9a85d191d0e`
- 构建日期：2026-11-11
- 本地构建环境：Node.js `16.20.2`、Yarn `1.22.22`、macOS
- CI 目标环境：Ubuntu + Node.js `16`（`.github/workflows/deploy-docs.yml`）
- 构建命令：`bash scripts/build-docs.sh`
- 最终结果：**8 个站点全部构建成功，`verify-docs.sh` 通过，退出码 0**

## 1. 修改文件清单

共修改 110 个文件。

### 1.1 构建/部署配置（8 个）

| 文件                                        | 修改内容                                                                                            |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `.umirc.js`                                 | 增加 `base`/`publicPath`/`exportStatic`/环境变量输出目录；移除 Carbon Ads；主站导航指向统一域名路径 |
| `packages/reactive/.umirc.js`               | 同上；`Home Site`/`主站` 改为统一域名主站                                                           |
| `packages/core/.umirc.js`                   | 同上                                                                                                |
| `packages/react/.umirc.js`                  | 同上                                                                                                |
| `packages/antd/.umirc.js`                   | 同上                                                                                                |
| `packages/next/.umirc.js`                   | 同上                                                                                                |
| `packages/element/docs/.vuepress/config.js` | 增加 `base`/环境变量 `dest`；关闭文档构建期重复 TS 类型检查；图片改绝对 HTTPS；主站链接更新         |
| `packages/vue/docs/.vuepress/config.js`     | 同上                                                                                                |

### 1.2 文档内容修改

| 范围                      | 文件数 | 说明                                                                |
| ------------------------- | ------ | ------------------------------------------------------------------- |
| `docs/`                   | 31     | 30 个 Markdown 的旧域名链接 + `docs/site/Contributors.tsx` API 替换 |
| `packages/antd/docs/`     | 8      | 旧域名链接                                                          |
| `packages/core/docs/`     | 2      | 旧域名链接                                                          |
| `packages/element/docs/`  | 4      | 旧域名链接                                                          |
| `packages/next/docs/`     | 8      | 旧域名链接                                                          |
| `packages/react/docs/`    | 32     | 旧域名链接                                                          |
| `packages/reactive/docs/` | 2      | 旧域名链接                                                          |
| `packages/vue/docs/`      | 15     | 旧域名链接                                                          |

链接替换共涉及 **99 个 Markdown 文件、262 个 URL**。替换只修改文档域名，不迁移、不重写正文结构。

额外修改：

- `docs/guide/issue-helper.md`、`docs/guide/issue-helper.zh-CN.md`：旧 Netlify npm-search API 改为 `https://registry.npmjs.org/-/v1/search`，并适配 `objects[].package.name`。
- `docs/site/Contributors.tsx`：旧 Netlify contributors API 改为 GitHub Contributors API，并处理非数组响应。

### 1.3 新增文件清单

| 文件                                | 用途                                    |
| ----------------------------------- | --------------------------------------- |
| `.github/workflows/deploy-docs.yml` | GitHub Actions 构建与 GitHub Pages 部署 |
| `scripts/build-docs.sh`             | 全量文档构建脚本                        |
| `scripts/verify-docs.sh`            | 构建产物完整性校验                      |
| `docs-deploy/AUDIT.md`              | 仓库审计报告                            |
| `docs-deploy/DEPLOY.md`             | 部署、维护与排障说明                    |
| `docs-deploy/BUILD-REPORT.md`       | 本报告                                  |

说明：`doc-build.md` 是任务开始前已存在的未跟踪任务书，不属于本次新增文件。

`.gitignore` 已包含 `doc-site`（第 26 行），无需重复添加。

## 2. 每个 package 构建结果

最终一次完整构建（清理后从零开始）：

| 站点     | workspace           | 工具           |   用时 | HTML 数 |   产物大小 | 结果 |
| -------- | ------------------- | -------------- | -----: | ------: | ---------: | ---- |
| 主站     | 根目录              | Dumi 1.1.54    | 16.59s |     213 | 计入总大小 | 成功 |
| Reactive | `@formily/reactive` | Dumi 1.1.54    |  6.03s |      59 |       1.1M | 成功 |
| Core     | `@formily/core`     | Dumi 1.1.54    |  8.19s |     121 |       2.3M | 成功 |
| React    | `@formily/react`    | Dumi 1.1.54    | 12.73s |     129 |       3.8M | 成功 |
| Antd     | `@formily/antd`     | Dumi 1.1.54    | 24.56s |     317 |       5.7M | 成功 |
| Next     | `@formily/next`     | Dumi 1.1.54    | 23.87s |     325 |       5.7M | 成功 |
| Element  | `@formily/element`  | VuePress 1.9.7 | 14.96s |     134 |       5.5M | 成功 |
| Vue      | `@formily/vue`      | VuePress 1.9.7 | 14.52s |      53 |       7.2M | 成功 |

构建前置步骤：

- `yarn build`：48.32s，成功构建所有 workspace package 的 `lib`/`esm`。
- 该步骤是 package 文档 Demo 能解析 `@formily/*` 依赖的前提。

总计：

- HTML 文件：**1351 个**
- `doc-site/` 总大小：**37 MB**
- 完整构建加校验耗时约 3–4 分钟

## 3. 构建产物路径

```text
doc-site/
├── index.html                 # 主站
├── 404.html
├── umi.<hash>.js
├── umi.<hash>.css
├── guide/
├── zh-CN/
├── reactive/
├── core/
├── react/
├── antd/
├── next/
├── element/
└── vue/
```

各 Dumi 站点通过 `exportStatic: {}` 生成了深层路由的目录式 `index.html`，例如：

```text
doc-site/reactive/guide/concept/index.html
doc-site/core/zh-CN/api/models/form/index.html
doc-site/antd/components/form/index.html
doc-site/next/components/form/index.html
```

VuePress 站点本身为静态生成：

```text
doc-site/element/guide/form.html
doc-site/vue/guide/concept.html
```

构建脚本使用相对于 package 目录的输出路径（`../../doc-site/<name>`），因为 umi 使用 `path.join(cwd, outputPath)`，绝对路径会被错误拼接。

## 4. 路由检查结果

### 4.1 HTTP 状态检查

本地静态服务器（`python3 -m http.server 8090`）检查，全部返回 `200`：

```text
/                                 200
/reactive/                        200
/core/                            200
/react/                           200
/antd/                            200
/next/                            200
/element/                         200
/vue/                             200
/guide/quick-start                200
/reactive/guide/concept           200
/core/guide/form                  200
/core/zh-CN/api/models/form       200
/react/api/components/field       200
/antd/components/form             200
/next/components/form             200
/element/guide/form.html          200
/vue/guide/concept.html           200
/reactive/zh-CN/api/observable    200
```

深层 URL 实际映射到构建产物中的 `index.html`，因此刷新不会 404。

### 4.2 路径前缀检查

静态检查结果：

- 7 个子站 `index.html` 中所有本地 `href`/`src` 均以对应 `/<name>/` 开头。
- 未发现任何逃逸 base 的子站本地资源引用。
- 主站导航包含全部 7 个子站路径：`/reactive/`、`/core/`、`/react/`、`/antd/`、`/next/`、`/element/`、`/vue/`。
- 子站 `Home Site`/`主站` 均指向 `https://formilyjs-v2.bugduo.com/`。
- 中文路由 `/zh-CN/...` 保留并正常工作。

### 4.3 浏览器渲染检查

使用本机 Google Chrome 157 无头模式（`--dump-dom`）验证 15 个页面：

| 页面                                                       | 结果                   |
| ---------------------------------------------------------- | ---------------------- |
| 主站首页                                                   | 渲染成功，标题正确     |
| Reactive / Core / React / Antd / Next / Element / Vue 首页 | 全部渲染成功，标题正确 |
| `/reactive/guide/concept`                                  | 渲染成功               |
| `/core/guide/form`                                         | 渲染成功               |
| `/antd/components/form`                                    | 渲染成功               |
| `/next/components/form`                                    | 渲染成功               |
| `/element/guide/form.html`                                 | 渲染成功               |
| `/vue/guide/concept.html`                                  | 渲染成功（中文页面）   |
| `/guide/issue-helper`                                      | 渲染成功               |
| `/zh-CN/guide/quick-start`                                 | 渲染成功，中文标题正确 |
| `/reactive/zh-CN/`                                         | 渲染成功，中文内容正常 |
| `/core/zh-CN/guide/form`                                   | 渲染成功，中文标题正确 |

本地 JS/CSS 资源无加载错误。Dumi Demo（如 `@formily/reactive` + `@formily/reactive-react` 的 Hello World）在页面中正常编译和渲染。

主站贡献者列表在足够等待时间下可正常渲染 GitHub 头像和用户名。

### 4.4 跨子站导航修复

首次线上部署后发现：主站导航使用 `/reactive/` 等站内路径，Dumi 将其作为主站 SPA 的内部路由，点击后只做前端 `pushState`，不会加载子站，表现为页面空白，必须强制刷新才显示。

修复：根 `.umirc.js` 中 7 个子站导航改为完整 URL：

```text
https://formilyjs-v2.bugduo.com/reactive/
https://formilyjs-v2.bugduo.com/core/
https://formilyjs-v2.bugduo.com/react/
https://formilyjs-v2.bugduo.com/antd/
https://formilyjs-v2.bugduo.com/next/
https://formilyjs-v2.bugduo.com/element/
https://formilyjs-v2.bugduo.com/vue/
```

重新构建后验证：

- 7 个子站导航的 `href` 均为绝对 URL。
- Dumi 自动渲染为 `<a target="_blank" rel="noopener noreferrer">`，即在新标签页打开。
- 主站内部 `/guide` 等导航仍保持站内路由。

## 5. 资源检查结果

### 5.1 构建产物内资源

- 所有 HTML 引用的本地 JS/CSS 文件均存在。
- 构建产物中不存在 `carbonads`。
- 构建产物中不存在旧的实际托管域名
  （`reactive/core/react/antd/fusion/element.formilyjs.org`）。
- 旧域名替换后保留的第三方/历史站点：
  - `designable-antd.formilyjs.org`
  - `v1.formilyjs.org`
  - `antd5` / `antd-mobile` / `element-plus` / `antdv` / `vant` / `semi` / `tdesign-react` 等
- 这些均为本仓库不托管的第三方或历史文档，按任务要求保留。

### 5.2 外部依赖

| 资源                                            | 用途                          | 检查结果       |
| ----------------------------------------------- | ----------------------------- | -------------- |
| `img.alicdn.com`                                | logo、favicon、首页背景、图标 | 200            |
| `esm.sh`（antd / @alifd/next / element-ui CSS） | 文档样式                      | 200            |
| `unpkg.com/china-location`                      | Element 级联 Demo 数据        | 200            |
| `codesandbox.io`                                | 主站首页 iframe               | 200            |
| `registry.npmjs.org`                            | issue-helper 包搜索           | 200，支持 CORS |
| `api.github.com`                                | 主站贡献者                    | 200，支持 CORS |
| `formilyjs.org/.netlify/functions/*`            | 旧服务                        | 503，已替换    |

## 6. 自动化测试结果

| 检查             | 命令/方式                        | 结果                   |
| ---------------- | -------------------------------- | ---------------------- |
| 构建脚本语法     | `bash -n scripts/*.sh`           | 通过                   |
| 全量构建         | `bash scripts/build-docs.sh`     | 退出码 0               |
| 产物校验         | `scripts/verify-docs.sh`         | 通过                   |
| 产物校验负向测试 | 删除任一子站 JS 资源后执行校验   | 按预期失败（退出码 1） |
| 本地静态资源引用 | 自写 Node 检查脚本               | 全部存在               |
| 深层路由存在性   | `find doc-site -name index.html` | 通过                   |
| HTTP 状态        | `curl` 18 个 URL                 | 全部 200               |
| 浏览器渲染       | Chrome headless 15 个页面        | 全部渲染成功           |
| 工作流 YAML      | Ruby YAML 解析                   | 通过                   |

未自动化覆盖：

- 每个组件 Demo 的交互行为（仅验证代表性 Demo 的编译与渲染）。
- CodeSandbox iframe 的实际内容。
- GitHub Actions 在线运行（尚未 push，无法在本地验证 GitHub 托管环境）。

## 7. 未解决问题与已知限制

### 7.1 需要用户手动完成

1. **提交并推送代码**：本次未执行 `git commit`/`git push`（用户未要求）。
2. **GitHub Pages 设置**：`Settings -> Pages -> Source: GitHub Actions`。
3. **Custom domain**：`formilyjs-v2.bugduo.com`。
4. **DNS**：`formilyjs-v2` CNAME 到 `foxi-ui.github.io`（按当前 origin；如 fork 到其他账号需替换）。
5. **HTTPS**：等待 GitHub 签发证书后开启 `Enforce HTTPS`。

在上述步骤完成前，不能声称线上部署已完成。

### 7.2 依赖与兼容性

- **Node 16 已停止维护**：当前构建和 CI 固定 Node 16，这是旧 Dumi/VuePress/webpack 4 工具链唯一已验证版本。升级 Node 需要单独任务。
- **Node 22 下 `yarn build` 失败**：新版 npm 拒绝旧 `devEngines.node` 字段；不是文档配置问题。
- **外部 CDN 依赖**：`esm.sh` 的 CSS/字体、`img.alicdn.com` 的 logo/favicon/hero，以及 28 个文档内容图片已本地化（见 `docs-deploy/ASSET-LOCALIZATION.md`）；剩余 15 个 Upload 占位图、`unpkg` 演示数据、CodeSandbox 未本地化；网络不可达时对应 Demo 可能降级，但不影响页面主体渲染。
- **GitHub API 频率限制**：未认证请求 60 次/小时，超限时贡献者列表为空。
- **VuePress TS 检查**：文档构建使用 `transpileOnly`，类型检查由 `yarn build` 的 `tsc` 负责。

### 7.3 非阻塞警告

- 主站 Dumi 构建有 2 条预存在的 re-export 警告（`Pattern`、`ReactFC`），不影响产物。
- React 子站有 1 条同类 `ReactFC` re-export 警告，不影响产物。
- Element VuePress 构建有 element-ui Sass `/` 除法弃用警告，不影响产物。
- exportStatic 会为 `_demos/:uuid` 等动态 Demo 路由生成目录式 HTML（无害，仅增加少量文件）。

## 8. GitHub Pages 后续操作步骤

1. 提交并推送 `docs-deploy` 分支。
2. 确认 GitHub Actions 中 `Deploy Formily Documentation` 工作流构建与校验通过。
3. 仓库 `Settings -> Pages`：
   - Source 选择 `GitHub Actions`
   - Custom domain 填写 `formilyjs-v2.bugduo.com`
4. 在 `bugduo.com` DNS 控制台添加：
   - 类型：`CNAME`
   - 主机记录：`formilyjs-v2`
   - 记录值：`foxi-ui.github.io`
5. 等待 GitHub Pages 域名检查与 HTTPS 证书签发。
6. 开启 `Enforce HTTPS`。
7. 验收：
   - <https://formilyjs-v2.bugduo.com/>
   - <https://formilyjs-v2.bugduo.com/reactive/>
   - <https://formilyjs-v2.bugduo.com/core/>
   - <https://formilyjs-v2.bugduo.com/react/>
   - <https://formilyjs-v2.bugduo.com/antd/>
   - <https://formilyjs-v2.bugduo.com/next/>
   - <https://formilyjs-v2.bugduo.com/element/>
   - <https://formilyjs-v2.bugduo.com/vue/>
   - 以及任一深层页面直接刷新。
