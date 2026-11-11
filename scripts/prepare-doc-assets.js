#!/usr/bin/env node
/**
 * Prepare third-party documentation assets that need small rewrites before
 * they can be served from the docs origin.
 *
 * Currently this only handles @alifd/next's next-noreset.css, whose icon-font
 * URLs point at //at.alicdn.com. The fonts themselves are committed under
 * docs-assets/fonts/next and copied next to the generated CSS by the site's
 * Umi `copy` config.
 */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const cssSource = path.join(
  root,
  'node_modules/@alifd/next/dist/next-noreset.css'
)
const fontsDir = path.join(root, 'docs-assets/fonts/next')
const outDir = path.join(root, 'docs-assets/generated')
const outFile = path.join(outDir, 'next-noreset.css')

const elementThemeDir = path.join(
  root,
  'node_modules/element-ui/lib/theme-chalk'
)
const elementPublicDir = path.join(
  root,
  'packages/element/docs/.vuepress/public/assets/css'
)

const fontFiles = [
  'font_515771_xjdbujl2iu.eot',
  'font_515771_xjdbujl2iu.ttf',
  'font_515771_xjdbujl2iu.woff',
  'font_515771_xjdbujl2iu.woff2',
  'font_515771_xjdbujl2iu.svg',
]

if (!fs.existsSync(cssSource)) {
  console.error(
    `[prepare-doc-assets] Missing ${cssSource}. Run yarn install first.`
  )
  process.exit(1)
}

const missingFonts = fontFiles.filter(
  (name) => !fs.existsSync(path.join(fontsDir, name))
)
if (missingFonts.length) {
  console.error(
    `[prepare-doc-assets] Missing local icon fonts: ${missingFonts.join(', ')}`
  )
  process.exit(1)
}

const source = fs.readFileSync(cssSource, 'utf8')
const output = source.replace(/(?:https?:)?\/\/at\.alicdn\.com\/t\//g, 'fonts/')

const remaining = output.match(/(?:https?:)?\/\/[^)"']*alicdn\.com/g)
if (remaining) {
  console.error(
    `[prepare-doc-assets] Refusing to write CSS with remaining alicdn URLs: ${remaining.join(
      ', '
    )}`
  )
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, output)
console.log(
  `[prepare-doc-assets] Wrote ${path.relative(root, outFile)} (${
    output.length
  } bytes)`
)

// element-ui's CSS references its icon fonts with relative URLs. Serve both
// from VuePress's public dir instead of importing the CSS through webpack:
// the older VuePress css-loader turns the font URLs into `[object Module]`.
const elementCss = path.join(elementThemeDir, 'index.css')
const elementFonts = ['element-icons.ttf', 'element-icons.woff']
if (!fs.existsSync(elementCss)) {
  console.error(
    `[prepare-doc-assets] Missing ${elementCss}. Run yarn install first.`
  )
  process.exit(1)
}
for (const name of elementFonts) {
  if (!fs.existsSync(path.join(elementThemeDir, 'fonts', name))) {
    console.error(`[prepare-doc-assets] Missing element-ui font: fonts/${name}`)
    process.exit(1)
  }
}
fs.mkdirSync(path.join(elementPublicDir, 'fonts'), { recursive: true })
fs.copyFileSync(elementCss, path.join(elementPublicDir, 'element-ui.css'))
for (const name of elementFonts) {
  fs.copyFileSync(
    path.join(elementThemeDir, 'fonts', name),
    path.join(elementPublicDir, 'fonts', name)
  )
}
console.log(
  `[prepare-doc-assets] Copied element-ui theme and fonts to ${path.relative(
    root,
    elementPublicDir
  )}`
)

// Brand assets are shared by every site. Dumi sites copy them through their
// Umi `copy` config; VuePress sites get them in their public directories here.
const chromeDir = path.join(root, 'docs-assets/chrome')
if (!fs.existsSync(chromeDir)) {
  console.error(
    `[prepare-doc-assets] Missing ${chromeDir}. Brand assets are required.`
  )
  process.exit(1)
}
const chromeTargets = [
  path.join(root, 'packages/vue/docs/.vuepress/public/assets/chrome'),
  path.join(root, 'packages/element/docs/.vuepress/public/assets/chrome'),
]
for (const target of chromeTargets) {
  fs.mkdirSync(target, { recursive: true })
  for (const name of fs.readdirSync(chromeDir)) {
    fs.copyFileSync(path.join(chromeDir, name), path.join(target, name))
  }
}
console.log(
  `[prepare-doc-assets] Copied chrome assets to ${chromeTargets
    .map((target) => path.relative(root, target))
    .join(', ')}`
)
