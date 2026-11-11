# 文档站外部资源本地化评估

- 评估日期：2026-11-11
- 评估对象：`docs-deploy` 单域名文档站（主站 + 7 个子站，共 1351 个 HTML 页面）
- 目标：CDN 不可用时，文档站仍能正常显示样式、图片和品牌信息；同时记录无法完全本地化的运行时依赖。

## 0. 结论

1. **页面加载阶段的外部静态资源集中在 3 个域名**：
   - `img.alicdn.com`：图片、logo、favicon、首页背景（详见第 2 节）
   - `esm.sh`：antd / next / element 的 3 个 CSS，影响 **1118 / 1351** 个页面；element 的图标字体也由 esm.sh 提供
   - `at.alicdn.com`：next CSS 内部引用的图标字体（6 个文件）
   - 没有外部 `<script>`、Google Fonts 或其他 CDN 样式。Carbon Ads 和旧 Netlify Functions 已不在产物中。
2. **`esm.sh` 的影响面比图片更大**：它决定页面是否“变形”，建议优先级高于内容图片。
3. **`at.alicdn.com` 是之前 `img.alicdn.com` 排查遗漏的 alicdn 子域**，随 next CSS 一起加载，必须一起本地化。
4. 演示数据还有 4 个外部依赖：`unpkg`（china-location）、`zos.alipayobjects.com`（图片）、`mocky.io`、`beeceptor`。其中 **mocky/beeceptor 当前已经不可用**，属于既有问题，不是“未来 CDN 挂掉”才出现的。
5. 动态 API 和 iframe 无法通过“拉取到本地”彻底解决，只能做静态兜底或降级：GitHub Contributors、npm registry、淘宝搜索、CodeSandbox。

**工作量总览（人天，单人）：**

| 目标                                                          |    估算 |
| ------------------------------------------------------------- | ------: |
| 页面不再变形、品牌不丢（esm.sh CSS + 字体 + alicdn 品牌资源） |     1–2 |
| 内容图片完整（再加上 31 个 alicdn 文档资源）                  |   2–3.5 |
| 产物零 alicdn（再加上 Upload 占位图）                         | 2.5–4.5 |
| 演示数据完整（再加上 unpkg / zos）                            |  3–5.25 |
| 修复失效 mock 上传接口（mocky / beeceptor）                   |  +0.5–1 |
| 动态 API / iframe 降级（GitHub、registry、CodeSandbox）       |    +1–2 |

> P0（品牌资源）和 P1（esm.sh CSS 与字体）均已实施并通过完整构建验证，见第 8、9 节。

## 1. 审计方法

- **源码扫描**：遍历实际参与部署的 `docs/` 与 `packages/{reactive,core,react,antd,next,vue,element}/docs/`、各站点配置和 `.vuepress/`。
- **产物扫描**：以 `doc-site/` 为准，解析 HTML 中 `<link>`、`<script>`、`<img>`、`<iframe>`、内联 `<style>` 的 `url()`，只统计浏览器页面加载阶段会发起的请求。产物扫描比源码扫描更准确，可以排除普通超链接和代码示例里的 URL。
- **可达性探测**：对 48 个 alicdn 资源、3 个 esm.sh CSS、6 个 alicdn 字体、unpkg / zos / mocky / beeceptor 做了 HTTP 探测。
- 产物结构：`doc-site` 约 37 MB，1351 个 HTML 文件。

## 2. 页面加载类外部资源

### 2.1 汇总

| 资源                                                  |     唯一 URL | 实际加载位置                                                          | 当前状态 | 必须本地化        |
| ----------------------------------------------------- | -----------: | --------------------------------------------------------------------- | -------- | ----------------- |
| `img.alicdn.com` 图片/品牌资源                        | 46（产物中） | 几乎每页的 favicon（1351 页）；1164 处 hero；约 61–69 处 logo；内容图 | 200      | 是                |
| `https://esm.sh/antd@4.x/dist/antd.css`               |            1 | 主站 213 + react 129 + antd 317 = **659 页**                          | 200      | 是                |
| `https://esm.sh/@alifd/next/dist/next-noreset.css`    |            1 | next 子站 **325 页**                                                  | 200      | 是                |
| `https://esm.sh/element-ui/lib/theme-chalk/index.css` |            1 | element 子站 **134 页**                                               | 200      | 是                |
| `//at.alicdn.com/t/font_515771_xjdbujl2iu.*`          |            6 | next CSS 的 `@font-face`                                              | 200      | 是（随 next CSS） |
| `element-icons.ttf` / `.woff`                         |            2 | element CSS 内部相对路径                                              | 本地已有 | 随 CSS 拷贝       |
| 外部 `<script>` / Google Fonts / 其他 CSS             |            0 | —                                                                     | —        | —                 |

> 说明：`esm.sh` 的三个 CSS 合计影响 1118 个 HTML 页面，是当前最大的单点外部依赖。

### 2.2 esm.sh CSS 明细

| esm.sh URL                                            | 本地替代                                                      | 本地文件大小 | 备注                                         |
| ----------------------------------------------------- | ------------------------------------------------------------- | -----------: | -------------------------------------------- |
| `https://esm.sh/antd@4.x/dist/antd.css`               | `node_modules/antd/dist/antd.css`（antd 4.20.2）              |    689,812 B | 仅一个 data URI，无外部引用                  |
| `https://esm.sh/@alifd/next/dist/next-noreset.css`    | `node_modules/@alifd/next/dist/next-noreset.css`（1.25.34）   |    726,652 B | 内含 6 个 `//at.alicdn.com` 字体 URL，需改写 |
| `https://esm.sh/element-ui/lib/theme-chalk/index.css` | `node_modules/element-ui/lib/theme-chalk/index.css`（2.15.8） |    238,984 B | 引用同级 `fonts/element-icons.*`             |

- esm.sh 返回的 CSS 与本地 node_modules 版本大小略有差异，但同属一个大版本；自托管时应使用**本地安装版本**，保证与 Demo 使用的组件版本一致。
- 三个 CSS 均不需要再从 esm.sh 下载，直接从 `node_modules` 拷贝即可。
- 自托管后总体积约 1.65 MB CSS + 0.18 MB 字体。若在构建时从 `node_modules` 拷贝，不增加仓库体积；若提交进仓库，则增加约 1.83 MB。

### 2.3 at.alicdn.com 图标字体

`next-noreset.css` 的 `@font-face` 引用：

| 文件                           |         大小 |
| ------------------------------ | -----------: |
| `font_515771_xjdbujl2iu.eot`   |     13,120 B |
| `font_515771_xjdbujl2iu.ttf`   |     12,952 B |
| `font_515771_xjdbujl2iu.woff`  |      7,308 B |
| `font_515771_xjdbujl2iu.woff2` |      6,112 B |
| `font_515771_xjdbujl2iu.svg`   |     54,052 B |
| **合计**                       | **93,544 B** |

- 这是 `//at.alicdn.com`，不在之前 `//img.alicdn.com` 的扫描范围内。
- 本地化 next CSS 时必须同时把 6 个 URL 改成本地相对路径，否则 next 图标仍会依赖 alicdn。
- 现代浏览器实际只会请求 woff2（必要时 woff）；为了完整性和兼容旧浏览器，建议 5 个文件一起放本地。

### 2.4 element-ui 字体

- `element-icons.ttf`：55,956 B
- `element-icons.woff`：28,200 B

CSS 中为相对路径 `fonts/element-icons.*`。实施时曾尝试在 `enhanceApp.js` 中直接 `import 'element-ui/lib/theme-chalk/index.css'`，但旧版 VuePress 的 css-loader 会把 `@font-face` 输出成 `url([object Module])`：字体文件虽然被 emit，CSS 引用却是坏的。最终改为由 `scripts/prepare-doc-assets.js` 把 CSS 和字体拷贝到 `.vuepress/public/assets/css/`，再用 `<link>` 引用。

## 3. img.alicdn.com 明细（上一轮评估结论）

### 3.1 数量

| 类别            |              唯一资源 | 引用位置       | 说明                                                                                   |
| --------------- | --------------------: | -------------- | -------------------------------------------------------------------------------------- |
| 文档内容图片    | 28（17 SVG + 11 PNG） | 37 个 md       | 41 处 Markdown 图片、48 处 frontmatter 特性图标、4 处内联 TSX `<img>`、2 处 `<QrCode>` |
| 站点品牌资源    |                     3 | 8 个配置       | logo、favicon、首页 hero 背景                                                          |
| Upload 占位图   |                    15 | 2 个库源码文件 | `packages/{antd,next}/src/upload/placeholder.ts`，被打进主站/antd/next 的 JS bundle    |
| **产物合计**    |                **46** |                |                                                                                        |
| README 专用图片 |                     2 | `README*.md`   | 不进文档产物                                                                           |
| **源码合计**    |                **48** |                |                                                                                        |

- 48 个 URL 实测全部 HTTP 200，总大小 **1,942,733 B**。
- 文档站需要本地化的是 31 个：28 个内容图 + 3 个品牌资源，约 **1.64 MB**。
- 最大的单文件是首页 hero 背景 PNG（396,275 B，6001×4001），可考虑转 WebP/压缩。

### 3.2 引用形式与处理难点

| 引用形式                                |               次数 | 处理方式                                              |
| --------------------------------------- | -----------------: | ----------------------------------------------------- |
| `![](...)` Markdown 图片                |                 41 | 改相对路径；Dumi 会转成 `require()`，webpack 自动输出 |
| frontmatter `features[].icon`           | 48（9 个唯一 SVG） | 不经过 webpack；需静态路径或 data URI                 |
| 内联 TSX `<img src>`                    |                  4 | 改成 `import` + `src={img}`                           |
| `<QrCode link>`                         |                  2 | 改成 import 或静态路径                                |
| 配置 `logo` / `favicon` / `styles` 背景 |                 22 | 本地静态路径 + 构建时拷贝                             |

### 3.3 关键源码位置

- `@umijs/preset-dumi/lib/transformer/remark/img.js`：确认 Markdown 相对图片会被转成 `require('...')`。
- `@umijs/bundler-webpack/lib/getConfig/getConfig.js`：确认 Umi 3.5 的 `copy` 配置可用，`from` 相对 cwd、`to` 相对输出目录，dev 和 build 都会执行。
- VuePress 1.9：相对图片由 webpack 处理；VuePress 的 `.vuepress/public/` 会拷贝到输出根目录。

## 4. 运行时数据 / API 依赖

这些不是页面加载的静态资源，CDN 挂掉时页面主体仍能打开，但对应的 Demo 或区块会失效。

| 依赖                                                        | 引用次数 | 当前状态                                   | 影响                                                     | 建议                                                                 |          估算 |
| ----------------------------------------------------------- | -------: | ------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------- | ------------: |
| `//unpkg.com/china-location/dist/location.json`             |       33 | 200，145,468 B                             | antd/next/element Cascader Demo、场景文档的省市区数据    | 快照为本地 JSON，替换 fetch/axios 地址                               | 0.25–0.5 人天 |
| `https://zos.alipayobjects.com/rmsportal/...png`            |       24 | 200，1,435,417 B                           | Upload / edit-detail 场景的示例图片                      | 下载并压缩后本地引用                                                 |     0.25 人天 |
| `https://www.mocky.io/v2/5cc8019d300000980a055e76`          |       56 | **已失效**：HTTPS 自签名证书失败，HTTP 404 | Upload Demo 的上传 action、form-builder                  | 需要客户端 mock（`customRequest`）或降级；GitHub Pages 不能接收 POST |    0.5–1 人天 |
| `https://formily-vue.free.beeceptor.com/file`               |       12 | **已失效**：404，未配置                    | element Upload Demo                                      | 同上                                                                 |      含在上项 |
| `https://api.github.com/repos/alibaba/formily/contributors` |        1 | 可用，未认证限流 60 次/小时                | 主站贡献者列表；头像来自 `avatars.githubusercontent.com` | 可选：快照 contributors JSON + 头像，或失败时隐藏                    |    0.5–1 人天 |
| `https://registry.npmmirror.com/@formily/core`              |        2 | 可用                                       | issue-helper 版本下拉                                    | 可选：构建期快照版本列表                                             | 0.25–0.5 人天 |
| `https://registry.npmjs.org/-/v1/search?text=@formily`      |        2 | 可用                                       | issue-helper 包名下拉                                    | 同上                                                                 |      含在上项 |
| `https://suggest.taobao.com/sug?q=...`                      |        2 | 动态接口，可能 CORS 受限                   | Select 远程搜索 Demo                                     | 一般不处理；可改为静态候选                                           |          可选 |
| `https://codesandbox.io/embed/...`                          |        2 | 可用                                       | 主站首页 iframe                                          | 无法本地化；可加截图/链接兜底                                        |     0.25 人天 |

### 4.1 已失效接口说明

`mocky.io` 和 `beeceptor` 是 Demo 的上传目标（`action` prop），不是 CDN 资源。当前探测结果：

- `https://www.mocky.io/...`：TLS 证书错误；`http://` 返回 404。
- `https://formily-vue.free.beeceptor.com/file`：404，返回 “nothing is configured here”。

因此这些 Upload Demo 在现网大概率已经是失败状态，建议作为独立问题处理，而不是混在 CDN 本地化里。

### 4.2 不是实际资源请求的 URL

以下 URL 出现在产物中，但不会在页面加载时发起请求，不需要处理：

- `www.w3.org`：SVG `xmlns`。
- `img.shields.io`：代码块/文本中的徽章字符串，产物解析未发现实际 `<img>` 标签。
- `assets-cdn.github.com`：showdown 的 emoji 映射表，只有渲染对应 emoji 时才可能用到。
- `ant.design`、`element.eleme.io`、`fusion.design`、`github.com`、`formilyjs-v2.bugduo.com`、各 Formily 子域：普通超链接或导航链接。
- `www.mocky.io` / `beeceptor` 之外的 `codesandbox.io/static/...`：issue-helper 生成的 Markdown 文本，不加载。

## 5. 推荐技术方案

### 5.1 统一资源目录

建议新增仓库级目录（可提交，也可由构建脚本生成）：

```text
docs-assets/
  chrome/     logo.svg, favicon.svg, hero.png
  content/    28 个文档内容图
  icons/      9 个 frontmatter 特性图标 SVG
  css/        antd.css, next-noreset.css（改写字体 URL）, element 由 enhanceApp 引入
  fonts/      next 的 5 个字体 + element 的 2 个字体
  data/       china-location.json
  images/     zos 示例图（压缩后）
```

- 图片/数据需要提交进仓库（约 3 MB，含可压缩的 zos 1.4 MB）。
- CSS/字体建议构建时从 `node_modules` 拷贝，避免仓库里维护一份会过期的第三方 CSS。
- 如果 next 字体 URL 改写放在构建脚本中，需要确保 `dumi dev` 前也执行；可以给 next 的 `start` / `build:docs` 加 `prestart` / `prebuild:docs`。

### 5.2 Dumi 站点

- 使用 Umi 3.5 的 `copy` 配置把 `docs-assets` 拷到输出目录：

```js
copy: [
  { from: resolve(__dirname, '../docs-assets/chrome'), to: 'assets/chrome' },
  { from: resolve(__dirname, '../docs-assets/icons'), to: 'assets/icons' },
  // ...
]
```

- 配置中的 `links` 使用 `${base}assets/css/...`，`logo` / `favicon` 同理，保证子路径部署时也能正确解析。
- Markdown 图片用相对路径；frontmatter 特性图标用 `/assets/icons/...`（当前单域名根部署成立）；内联 TSX 用 `import`。
- `copy` 在 dev 和 build 都会执行，因此 `dumi dev` 下也能访问 `/assets/...`。

### 5.3 VuePress 站点

- element：
  - `scripts/prepare-doc-assets.js` 把 `node_modules/element-ui/lib/theme-chalk/index.css` 和 `fonts/element-icons.*` 拷贝到 `packages/element/docs/.vuepress/public/assets/css/`。
  - `config.js` 的 `head` 增加 `<link rel="stylesheet" href="/assets/css/element-ui.css">`，VuePress 会自动加 `base` 前缀（最终为 `/element/assets/css/element-ui.css`）。
  - 不要通过 `enhanceApp.js` `import` 这份 CSS：旧版 VuePress 的 css-loader 会输出 `url([object Module])`。
- vue：没有 esm.sh CSS 依赖，只需处理品牌资源和内容图片。
- 静态数据/图片放 `.vuepress/public/`，开发和生产都能访问；生成的目录已加入 `.gitignore`。

### 5.4 路径约束

- 当前部署是单域名根路径（`https://formilyjs-v2.bugduo.com/`），因此 frontmatter 里的 `/assets/...` 根绝对路径成立。
- 如果以后需要 `DOCS_BASE=/xxx/` 子路径部署，frontmatter 无法插值，需要改成每站拷贝 + 相对路径，或增加一个 remark 插件统一加 base 前缀。工作量约增加 0.5 人天。

## 6. 分阶段工作量

| 阶段                  | 内容                                                                         |                         估算 |
| --------------------- | ---------------------------------------------------------------------------- | ---------------------------: |
| **P0 品牌资源**       | alicdn logo/favicon/hero + 8 个配置 + 拷贝机制                               | ✅ 已完成（原估 0.5–1 人天） |
| **P1 CSS 与图标字体** | esm.sh 三份 CSS、element 字体、next 的 at.alicdn 字体改写、VuePress 静态拷贝 | ✅ 已完成（原估 0.5–1 人天） |
| **P2 内容图片**       | 28 个 alicdn 内容图、37 个 md、frontmatter/TSX 特殊处理                      |                   1–1.5 人天 |
| **P3 零 alicdn**      | Upload 占位图（2 个库源码文件，data URI 或随包打包）                         |                   0.5–1 人天 |
| **P4 演示数据**       | unpkg china-location + zos 图片                                              |                0.5–0.75 人天 |
| **P5 失效 mock**      | mocky / beeceptor 上传 action 的客户端 mock 或降级                           |                   0.5–1 人天 |
| **P6 动态依赖**       | GitHub Contributors、npm registry、CodeSandbox 兜底                          |                     1–2 人天 |
| **P7 验证与防回归**   | 完整构建、8 站视觉检查、`verify-docs.sh` 增加外链断言                        |                0.25–0.5 人天 |

**推荐执行顺序：** P1 → P0 → P2 → P4 → P7；P3、P5、P6 视是否需要“完全离线”再排期。

**P7 建议增加的断言：**

```bash
# 产物中不允许残留的外部静态资源
grep -r "img.alicdn.com\|at.alicdn.com\|esm.sh" doc-site && exit 1
```

同时检查本地 `/assets/...` 引用是否都存在（可扩展现有 `scripts/verify-docs.sh`）。

## 7. 风险与验证

| 风险                                                           | 影响               | 应对                                                             |
| -------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| VuePress 直接 `import` element CSS 的 webpack 行为与 Dumi 不同 | 中                 | 先做一个 element 子站构建验证字体是否正确输出                    |
| next CSS 补丁在升级 `@alifd/next` 后失效                       | 中                 | 用脚本从 node_modules 生成并改写，不手工维护；升级时重新生成     |
| frontmatter 图标不经过 webpack                                 | 中                 | 统一使用静态 `/assets/icons/...` 或 data URI                     |
| 根绝对 `/assets` 与 `DOCS_BASE` 子路径冲突                     | 低（当前单域名根） | 子路径部署时改为每站拷贝 + 相对路径                              |
| 提交 1.4 MB zos 图片导致仓库变大                               | 低                 | 压缩为 WebP/JPEG 后再提交                                        |
| Upload 占位图改动影响 npm 发布包                               | 中                 | 作为独立 PR，跑 package 测试                                     |
| mocky / beeceptor 无法用静态文件模拟 POST                      | 中                 | 用 Upload 的 `customRequest` 做客户端 mock，或明确标注 Demo 限制 |
| 动态 API 无法完全离线                                          | 低                 | 失败时隐藏区块或展示静态兜底，不影响页面主体                     |

**验收方式：**

1. `nvm use 16 && bash scripts/build-docs.sh` 完整构建通过。
2. 产物扫描无 `img.alicdn.com`、`at.alicdn.com`、`esm.sh` 引用（若 P3/P5/P6 未做，允许白名单）。
3. 8 个站点逐站检查：favicon、logo、首页 hero、特性图标、内容图片、next 图标字体、element 图标字体。
4. `bash scripts/verify-docs.sh doc-site` 通过。
5. 断网/替换 hosts 模拟 CDN 不可用，页面样式和品牌仍完整。

## 8. P1 实施记录（2026-11-11）

### 8.1 变更文件

| 文件                                              | 变更                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `scripts/prepare-doc-assets.js`                   | 新增；从 `node_modules` 生成 next CSS（改写 at.alicdn 字体 URL），并把 element CSS/字体拷贝到 VuePress public 目录 |
| `docs-assets/fonts/next/font_515771_xjdbujl2iu.*` | 新增 5 个字体文件，共 93,544 B                                                                                     |
| `.umirc.js`                                       | 主站：`copy` antd.css 到 `assets/css/antd.css`，`links` 改为 `${base}assets/css/antd.css`                          |
| `packages/react/.umirc.js`                        | 同上（react 子站）                                                                                                 |
| `packages/antd/.umirc.js`                         | 同上（antd 子站）                                                                                                  |
| `packages/next/.umirc.js`                         | `copy` 生成的 next CSS 和字体；`links` 改为 `${base}assets/css/next-noreset.css`                                   |
| `packages/next/package.json`                      | 增加 `prestart` / `prebuild:docs`，自动执行 `prepare-doc-assets.js`                                                |
| `packages/element/package.json`                   | 增加 `prestart` / `prebuild:docs`，自动执行 `prepare-doc-assets.js`                                                |
| `packages/element/docs/.vuepress/config.js`       | 删除 esm.sh link，改为 `/assets/css/element-ui.css`（VuePress 自动加 base）                                        |
| `scripts/verify-docs.sh`                          | 增加本地 CSS/字体存在性检查，以及产物中 `esm.sh` / `at.alicdn.com` 外链断言                                        |
| `.gitignore`                                      | 忽略 `docs-assets/generated` 和 `packages/element/docs/.vuepress/public/assets`                                    |

生成文件（不提交）：

- `docs-assets/generated/next-noreset.css`
- `packages/element/docs/.vuepress/public/assets/css/element-ui.css`
- `packages/element/docs/.vuepress/public/assets/css/fonts/element-icons.*`

### 8.2 实施中发现的问题

- element 最初通过 `enhanceApp.js` `import 'element-ui/lib/theme-chalk/index.css'` 引入，构建后 CSS 的 `@font-face` 变成 `url([object Module])`。字体文件虽然被 emit，但引用无法解析。改为静态拷贝 + `<link>` 后修复。
- VuePress 会给 `head` 中的根相对 URL 自动加 `base`。因此配置里写 `/assets/css/element-ui.css`，最终产物是 `/element/assets/css/element-ui.css`；不能写成 `${base}assets/...`，否则会出现 `/element/element/...`。
- Umi 的 `copy` 会同时作用于 dev 和 build；next/element 的生成文件通过 `prestart` / `prebuild:docs` 保证存在。若直接调用 `dumi dev` 或 `vuepress dev`（绕过 yarn script），需要先手动执行 `node scripts/prepare-doc-assets.js`。

### 8.3 验证结果

```text
$ nvm use 16 && bash scripts/build-docs.sh
Documentation verification passed
All documentation built successfully: doc-site

$ grep -rl 'esm.sh' doc-site | wc -l
0
$ grep -rl 'at.alicdn.com' doc-site | wc -l
0

$ bash scripts/verify-docs.sh doc-site
Documentation verification passed
```

- antd 本地 CSS：`doc-site/assets/css/antd.css`、`react/assets/css/antd.css`、`antd/assets/css/antd.css`，分别被 213 / 129 / 317 个页面引用（合计 659）。
- next 本地 CSS：`doc-site/next/assets/css/next-noreset.css`，被 325 个页面引用；CSS 中 6 个字体 URL 全部改为 `fonts/...`，5 个字体文件已拷贝。
- element 本地 CSS：`doc-site/element/assets/css/element-ui.css` 和 `fonts/element-icons.*`，`@font-face` 为 `url(fonts/element-icons.woff)` / `.ttf`，无 `[object Module]`。
- 本地静态服务器验证：`/assets/css/antd.css`、`/react/assets/css/antd.css`、`/antd/assets/css/antd.css`、`/next/assets/css/next-noreset.css`、`/next/assets/css/fonts/font_515771_xjdbujl2iu.woff2`、`/element/`、`/element/assets/css/element-ui.css`、`/element/assets/css/fonts/element-icons.woff` 全部 HTTP 200。

## 9. P0 实施记录（2026-11-11）

### 9.1 变更内容

| 内容                             | 说明                                                                                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs-assets/chrome/logo.svg`    | 3,704 B，本地 logo                                                                                                                                                                       |
| `docs-assets/chrome/favicon.svg` | 652 B，本地 favicon                                                                                                                                                                      |
| `docs-assets/chrome/hero.png`    | 396,275 B，本地首页 hero 背景                                                                                                                                                            |
| 6 个 Dumi 配置                   | 根 `.umirc.js`、`packages/{reactive,core,react,antd,next}/.umirc.js`：`logo`/`favicon` 改为 `${base}assets/chrome/...`，hero 改为 `url(${base}assets/chrome/hero.png)`；增加 `copy` 条目 |
| 2 个 VuePress 配置               | `packages/{vue,element}/docs/.vuepress/config.js`：favicon 改为 `/assets/chrome/favicon.svg`，`themeConfig.logo` 改为 `/assets/chrome/logo.svg`（由 `$withBase` 加 base）                |
| `scripts/prepare-doc-assets.js`  | 把 `docs-assets/chrome` 拷贝到 vue/element 的 `.vuepress/public/assets/chrome`                                                                                                           |
| `packages/vue/package.json`      | 增加 `prestart` / `prebuild:docs`，自动执行资源准备                                                                                                                                      |
| `scripts/verify-docs.sh`         | 增加 8 个站点的品牌资源存在性检查，以及 3 个品牌 alicdn URL 的残留断言                                                                                                                   |
| `.gitignore`                     | 忽略 `packages/vue/docs/.vuepress/public/assets`                                                                                                                                         |

### 9.2 验证结果

```text
$ nvm use 16 && bash scripts/build-docs.sh
Documentation verification passed
All documentation built successfully: doc-site

# 3 个品牌 alicdn URL 在产物中已归零
$ grep -rl 'O1CN01Kq3OHU1fph6LGqjIz|O1CN01XtT3Tv1Wd1b5hNVKy|O1CN01ZcvS4e26XMsdsCkf9' doc-site | wc -l
0
```

- 8 个站点（主站 + reactive/core/react/antd/next/element/vue）的 `assets/chrome/{logo,favicon,hero}` 均存在。
- Dumi 页面的 favicon、hero 内联 CSS 均为本地路径：`/assets/chrome/...`、`/reactive/assets/chrome/...` 等。
- Dumi 的 logo 在客户端 JS bundle 中使用本地路径（Dumi 1 的 navbar 由客户端渲染）；VuePress 的 logo 直接出现在 HTML 中：`/element/assets/chrome/logo.svg`、`/vue/assets/chrome/logo.svg`。
- 本地静态服务器验证品牌资源全部 HTTP 200。
- 说明：文档内容图片（P2）和 Upload 占位图（P3）仍引用 `img.alicdn.com`，因此本阶段不要求产物完全无 alicdn。

## 附录 A：审计命令

```bash
# 源码中所有 alicdn 子域
grep -rhoE '(https?:)?//[a-zA-Z0-9.-]*alicdn\.com' docs packages/*/docs .umirc.js \
  packages/{reactive,core,react,antd,next}/.umirc.js | sort | uniq -c

# 产物中实际页面加载的静态资源（解析 link/script/img/iframe + 内联 style）
# 见评估过程中的 Python 解析脚本；核心结论：只有 img.alicdn.com、esm.sh、at.alicdn.com

# 逐个资源探测
while read -r u; do
  curl -s -o /dev/null -w '%{http_code} %{size_download} %{content_type} %{url_effective}\n' "$u"
done < urls.txt
```

## 附录 B：页面加载外部资源完整清单

| 类型 | URL                                                                 |
| ---- | ------------------------------------------------------------------- |
| CSS  | `https://esm.sh/antd@4.x/dist/antd.css`                             |
| CSS  | `https://esm.sh/@alifd/next/dist/next-noreset.css`                  |
| CSS  | `https://esm.sh/element-ui/lib/theme-chalk/index.css`               |
| 字体 | `//at.alicdn.com/t/font_515771_xjdbujl2iu.{eot,ttf,woff,woff2,svg}` |
| 字体 | element-ui `fonts/element-icons.{ttf,woff}`（随本地 CSS）           |
| 图片 | `//img.alicdn.com/...`（46 个唯一 URL，见第 3 节）                  |

除以上内容外，页面加载阶段没有其他外部静态资源请求。
