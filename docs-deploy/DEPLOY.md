# Formily v2 单域名文档站部署说明

- 统一域名：`https://formilyjs-v2.bugduo.com`
- 部署方式：GitHub Pages + GitHub Actions
- 构建产物：仓库根目录 `doc-site/`（已加入 `.gitignore`）

## 1. 整体架构

```text
Formily 仓库
  ├─ 根目录 docs/                 -> Dumi    -> doc-site/
  ├─ packages/reactive/docs/      -> Dumi    -> doc-site/reactive/
  ├─ packages/core/docs/          -> Dumi    -> doc-site/core/
  ├─ packages/react/docs/         -> Dumi    -> doc-site/react/
  ├─ packages/antd/docs/          -> Dumi    -> doc-site/antd/
  ├─ packages/next/docs/          -> Dumi    -> doc-site/next/
  ├─ packages/element/docs/       -> VuePress-> doc-site/element/
  └─ packages/vue/docs/           -> VuePress-> doc-site/vue/
```

所有站点在同一个 `doc-site/` 目录中合并，由一次 GitHub Pages 部署发布。

## 2. 文档映射表

| 模块     | URL          | 源目录                    | 工具     | workspace           |
| -------- | ------------ | ------------------------- | -------- | ------------------- |
| 主站     | `/`          | `docs/`                   | Dumi     | 根目录              |
| Reactive | `/reactive/` | `packages/reactive/docs/` | Dumi     | `@formily/reactive` |
| Core     | `/core/`     | `packages/core/docs/`     | Dumi     | `@formily/core`     |
| React    | `/react/`    | `packages/react/docs/`    | Dumi     | `@formily/react`    |
| Antd     | `/antd/`     | `packages/antd/docs/`     | Dumi     | `@formily/antd`     |
| Next     | `/next/`     | `packages/next/docs/`     | Dumi     | `@formily/next`     |
| Element  | `/element/`  | `packages/element/docs/`  | VuePress | `@formily/element`  |
| Vue      | `/vue/`      | `packages/vue/docs/`      | VuePress | `@formily/vue`      |

以下 package 没有独立文档目录，因此没有独立子站：

- `@formily/json-schema`
- `@formily/path`
- `@formily/reactive-react`（内容位于 reactive 文档的 `/api/react/observer`）
- `@formily/reactive-vue`（内容位于 reactive 文档的 `/api/vue/observer`）
- `@formily/benchmark`
- `@formily/reactive-test-cases-for-react18`
- `@formily/grid`、`@formily/shared`、`@formily/validator`

## 3. 环境要求

- Node.js **16.x**（与现有 CI 一致，也是当前已验证的版本）
- Yarn **1.22.x**
- 不需要额外服务器、对象存储或子域名

Node 17+ 会出现以下问题，因此第一阶段固定使用 Node 16：

- 旧版 webpack 4 在部分场景需要 `--openssl-legacy-provider`
- Node 22 自带的新版 npm 会拒绝根 `package.json` 的旧 `devEngines.node` 写法，导致 `yarn build` 在 `npm run build:cjs` 阶段失败

`scripts/build-docs.sh` 会检查 Node 主版本，不是 16 时直接报错。确实需要尝试其他版本时可设置：

```bash
FORMILY_DOCS_ALLOW_UNSUPPORTED_NODE=1 bash scripts/build-docs.sh
```

Node 升级属于后续独立任务，不在本次“恢复原文档”的范围内。

## 4. 本地开发

```bash
nvm use 16
yarn install --frozen-lockfile --ignore-engines

# 主站
yarn start

# 单个 package 文档
yarn workspace @formily/reactive start
yarn workspace @formily/core start
yarn workspace @formily/react start
yarn workspace @formily/antd start
yarn workspace @formily/next start
yarn workspace @formily/element start
yarn workspace @formily/vue start
```

开发模式默认仍使用 `/` 作为 base，不受部署配置影响。

## 5. 本地完整构建

```bash
nvm use 16
yarn install --frozen-lockfile --ignore-engines
bash scripts/build-docs.sh
```

脚本执行顺序：

1. 检查 Node 版本。
2. 清空 `doc-site/`。
3. 执行 `yarn build`，构建所有 workspace package 的 `lib`/`esm`。
4. 构建主站。
5. 依次构建 5 个 Dumi 子站。
6. 依次构建 2 个 VuePress 子站。
7. 执行 `scripts/verify-docs.sh`。

为什么需要先构建 package：

- 文档 Demo 直接 `import '@formily/core'`、`@formily/reactive-react` 等 workspace package。
- 这些 package 的 `main`/`module` 指向 `lib`/`esm`。
- 如果未构建，Dumi 在 package 目录下只会 alias 当前 package，其他同仓库 package 会解析失败。

单独校验产物：

```bash
bash scripts/verify-docs.sh doc-site
```

本地静态预览：

```bash
npx http-server doc-site -p 8080
```

访问：

- <http://localhost:8080/>
- <http://localhost:8080/reactive/>
- <http://localhost:8080/core/>
- <http://localhost:8080/react/>
- <http://localhost:8080/antd/>
- <http://localhost:8080/next/>
- <http://localhost:8080/element/>
- <http://localhost:8080/vue/>

注意：`http-server` 会以目录 index.html 响应深层路径；GitHub Pages 行为一致。

## 6. 路径配置约定

所有站点统一读取两个环境变量：

| 变量           | 作用                                               |
| -------------- | -------------------------------------------------- |
| `DOCS_BASE`    | 路由 base 与静态资源 publicPath，例如 `/reactive/` |
| `DOCS_OUT_DIR` | 构建输出目录                                       |

Dumi 配置示例（`packages/*/.umirc.js`）：

```js
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

export default {
  base,
  publicPath: base,
  outputPath,
  exportStatic: {},
}
```

VuePress 配置示例：

```js
const base = process.env.DOCS_BASE || '/'
const outputPath = process.env.DOCS_OUT_DIR || './doc-site'

module.exports = {
  base,
  dest: outputPath,
}
```

重要：`DOCS_OUT_DIR` 必须是相对于当前工作目录的路径，不能是绝对路径。umi 使用 `path.join(cwd, outputPath)`，绝对路径会被拼接到 cwd 后面。

构建脚本中各子站使用：

```text
../../doc-site/<name>
```

这是从 `packages/<name>` 回到仓库根目录 `doc-site/<name>` 的相对路径。

### 深链接与 `exportStatic`

Dumi 默认只生成一个 `index.html` 的 SPA。GitHub Pages 没有 SPA fallback，刷新 `/reactive/guide/...` 会 404。

因此每个 Dumi 站点都启用：

```js
exportStatic: {
}
```

构建后每个路由都会生成目录形式的 `index.html`，例如：

```text
doc-site/reactive/guide/concept/index.html
```

这样 URL 仍然是 `/reactive/guide/concept`，刷新和直接访问都正常。

VuePress 本身是静态生成，无需该配置。

### VuePress 的 TypeScript 类型检查

`vuepress-plugin-typescript` 默认在构建时做完整类型检查。文档会 alias 多个 workspace package 的源码，旧 `@types/node` 与 DOM 类型冲突会导致构建失败。文档构建不需要重复做类型检查（package 的 `yarn build` 已执行 `tsc`），因此配置为：

```js
;['vuepress-plugin-typescript', { tsLoaderOptions: { transpileOnly: true } }]
```

## 7. 新增子站的方法

1. 在 package 下创建 `docs/`，确认确实有独立文档，不要仅因为 package 存在就创建。
2. 选择 Dumi 或 VuePress，并创建对应配置文件。
3. 在配置中加入 `DOCS_BASE` / `DOCS_OUT_DIR` 支持。
4. Dumi 站点加入 `exportStatic: {}`。
5. 在 `scripts/build-docs.sh` 的站点清单中加入构建调用。
6. 在 `scripts/verify-docs.sh` 的 `SITES` 和 `DEEP_ROUTES` 中加入校验。
7. 在主站 `.umirc.js` 的导航中加入对应完整 URL。
8. 在子站导航中加入返回主站的完整 URL。
9. 执行完整构建与本地预览。

## 8. GitHub Actions 部署流程

工作流：`.github/workflows/deploy-docs.yml`

触发条件：

- push 到 `docs-deploy`
- 手动 `workflow_dispatch`

步骤：

1. Checkout
2. Setup Node 16（Yarn cache）
3. `actions/configure-pages@v5`
4. `yarn install --frozen-lockfile --ignore-engines`
5. `bash scripts/build-docs.sh`
6. `bash scripts/verify-docs.sh doc-site`
7. 写入 `doc-site/CNAME`，并创建 `doc-site/.nojekyll`
8. `actions/upload-pages-artifact@v3`
9. `actions/deploy-pages@v4`

构建失败不会进入 deploy job。

## 9. GitHub Pages 配置

在 GitHub 仓库：

```text
Settings -> Pages -> Build and deployment
```

- Source: `GitHub Actions`
- Custom domain: `formilyjs-v2.bugduo.com`
- 等待 DNS 检查与证书签发后，开启 `Enforce HTTPS`

## 10. DNS 配置

在 `bugduo.com` 的 DNS 控制台添加：

| 类型  | 主机记录       | 记录值              |
| ----- | -------------- | ------------------- |
| CNAME | `formilyjs-v2` | `foxi-ui.github.io` |

当前仓库 `origin` 为 `git@github.com:foxi-ui/formily.git`，因此记录值取 `foxi-ui.github.io`。如果实际部署到其他账号或组织，替换为对应的 `<账号>.github.io`。

不要填写带仓库路径的值（例如 `foxi-ui.github.io/formily`）。

## 11. 常见问题

### 构建时报 Node 版本错误

```bash
nvm use 16
node -v
```

### `Can't resolve '@formily/xxx'`

说明 package 的 `lib`/`esm` 还没构建。先执行：

```bash
yarn build
```

或直接重新执行 `bash scripts/build-docs.sh`。

### 子站页面样式/JS 404

检查该站点构建时是否设置了正确的 `DOCS_BASE`，并确认 `index.html` 中引用的是 `/<name>/...`。

可用以下命令检查：

```bash
grep -o '/<name>/[^"]*' doc-site/<name>/index.html | head
```

### 刷新深层页面 404

确认 Dumi 配置包含 `exportStatic: {}`，并确认构建产物中存在对应目录的 `index.html`：

```bash
find doc-site/reactive/guide -name index.html
```

### 主站贡献者列表为空

主站通过 `https://api.github.com/repos/alibaba/formily/contributors` 获取贡献者。未认证请求有频率限制，超限时会静默显示为空，不影响页面渲染。

### issue-helper 包列表为空

使用 `https://registry.npmjs.org/-/v1/search?text=@formily&size=250`。如网络不可达，仅影响该示例的数据源。

### VuePress 构建类型报错

确认两个 VuePress 配置中的 `vuepress-plugin-typescript` 已使用：

```js
{
  tsLoaderOptions: {
    transpileOnly: true
  }
}
```

### 旧域名链接

文档中的旧 Formily 文档域名已统一替换为 `https://formilyjs-v2.bugduo.com` 下的对应路径。`designable-antd.formilyjs.org`、`v1.formilyjs.org` 等第三方/历史站点保持原样。

## 12. 依赖升级注意事项

- 第一阶段不升级 Dumi、VuePress、React、Vue、Webpack。
- 不修改业务 package 的依赖版本。
- 不删除 `yarn.lock`，CI 使用 `--frozen-lockfile`。
- 如未来升级 Node，需要同时验证：
  - `yarn build` 是否仍能在新 npm 下工作（旧 `devEngines.node` 字段需要调整）
  - webpack 4 与 OpenSSL 3 的兼容性
  - Dumi 1.x / VuePress 1.x 的 Node 支持范围
- 如未来升级 Dumi，需要重新验证 `base`、`publicPath`、`exportStatic`、`resolve` 与 Demo 编译行为。
