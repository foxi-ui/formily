#!/usr/bin/env node
/**
 * One-time migration: pull the document content images off img.alicdn.com.
 *
 * - frontmatter `features[].icon` -> /assets/icons/<name> (copied per site)
 * - inline TSX <img>/<QrCode>      -> /assets/content/<name> (copied to root site)
 * - Markdown images                -> relative path under docs-assets/content
 *
 * Run `node scripts/localize-content-images.js` after `yarn install`.
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const ROOT = path.resolve(__dirname, '..')
const MD_ROOTS = [
  'docs',
  'packages/reactive/docs',
  'packages/core/docs',
  'packages/react/docs',
  'packages/antd/docs',
  'packages/next/docs',
  'packages/vue/docs',
  'packages/element/docs',
]

const ASSETS = [
  // Home page feature icons (frontmatter)
  {
    id: 'O1CN016i72sH1c5wh1kyy9U',
    category: 'icons',
    name: 'feature-easier.svg',
    url: 'https://img.alicdn.com/imgextra/i2/O1CN016i72sH1c5wh1kyy9U_!!6000000003550-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01bHdrZJ1rEOESvXEi5',
    category: 'icons',
    name: 'feature-efficient.svg',
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01bHdrZJ1rEOESvXEi5_!!6000000005599-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01xlETZk1G0WSQT6Xii',
    category: 'icons',
    name: 'feature-professional.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01xlETZk1G0WSQT6Xii_!!6000000000560-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01YqmcpN1tDalwgyHBH',
    category: 'icons',
    name: 'feature-domain.svg',
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01YqmcpN1tDalwgyHBH_!!6000000005868-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01u6jHgs1ZMwXpjAYnh',
    category: 'icons',
    name: 'feature-smart-tips.svg',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01u6jHgs1ZMwXpjAYnh_!!6000000003181-55-tps-800-800.svg',
  },
  {
    id: 'O1CN0194OqFF1ui6mMT4g7O',
    category: 'icons',
    name: 'feature-reusable.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN0194OqFF1ui6mMT4g7O_!!6000000006070-55-tps-800-800.svg',
  },
  {
    id: 'O1CN018vDmpl2186xdLu6KI',
    category: 'icons',
    name: 'feature-debug.svg',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN018vDmpl2186xdLu6KI_!!6000000006939-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01QnfYS71E44I1ZpxU9',
    category: 'icons',
    name: 'feature-linkage.svg',
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01QnfYS71E44I1ZpxU9_!!6000000000297-55-tps-800-800.svg',
  },
  {
    id: 'O1CN01JHzg8U1FZV5Mvt012',
    category: 'icons',
    name: 'feature-react-extra.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01JHzg8U1FZV5Mvt012_!!6000000000501-55-tps-800-800.svg',
  },
  // Content images
  {
    id: 'O1CN01cdzULJ1et4PBak8si',
    category: 'content',
    name: 'core-field-overview.png',
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01cdzULJ1et4PBak8si_!!6000000003928-2-tps-3506-2042.png',
  },
  {
    id: 'O1CN01LWjBSt251w5BtGHW2',
    category: 'content',
    name: 'guide-intro.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01LWjBSt251w5BtGHW2_!!6000000007467-55-tps-1100-432.svg',
  },
  {
    id: 'O1CN01jiB7h723ZFf0lBCTo',
    category: 'content',
    name: 'core-mvvm.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01jiB7h723ZFf0lBCTo_!!6000000007269-55-tps-1244-432.svg',
  },
  {
    id: 'O1CN01mpGugu1QFlnfQ4qfo',
    category: 'content',
    name: 'core-field-lifecycle.png',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01mpGugu1QFlnfQ4qfo_!!6000000001947-2-tps-3506-1794.png',
  },
  {
    id: 'O1CN01DSci5h1rAGfRafpXw',
    category: 'content',
    name: 'guide-core-intro.png',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01DSci5h1rAGfRafpXw_!!6000000005590-2-tps-2882-1642.png',
  },
  {
    id: 'O1CN01eI9FLz22tZek2jv7E',
    category: 'content',
    name: 'form-builder.png',
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01eI9FLz22tZek2jv7E_!!6000000007178-2-tps-3683-2272.png',
  },
  {
    id: 'O1CN013jbRfk1l5n6N7jYH8',
    category: 'content',
    name: 'react-architecture.svg',
    url: 'https://img.alicdn.com/imgextra/i1/O1CN013jbRfk1l5n6N7jYH8_!!6000000004768-55-tps-2200-1637.svg',
  },
  {
    id: 'O1CN01A03C191KwT1raxnDg',
    category: 'content',
    name: 'react-concept.svg',
    url: 'https://img.alicdn.com/imgextra/i1/O1CN01A03C191KwT1raxnDg_!!6000000001228-55-tps-2200-869.svg',
  },
  {
    id: 'O1CN01yiREHk1X95KJPPz1c',
    category: 'content',
    name: 'guide-index.png',
    url: 'https://img.alicdn.com/imgextra/i2/O1CN01yiREHk1X95KJPPz1c_!!6000000002880-2-tps-2014-868.png',
  },
  {
    id: 'O1CN01iEwHrP1NUw84xTded',
    category: 'content',
    name: 'guide-core.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01iEwHrP1NUw84xTded_!!6000000001574-55-tps-1939-1199.svg',
  },
  {
    id: 'O1CN01jLCRxH1aa3V0x6nw4',
    category: 'content',
    name: 'react-concept-2.svg',
    url: 'https://img.alicdn.com/imgextra/i3/O1CN01jLCRxH1aa3V0x6nw4_!!6000000003345-55-tps-2200-1147.svg',
  },
  {
    id: 'O1CN019qbf1b1ChnTfT9x3X',
    category: 'content',
    name: 'guide-core-2.svg',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN019qbf1b1ChnTfT9x3X_!!6000000000113-55-tps-1939-1199.svg',
  },
  {
    id: 'O1CN01DQMGUL22mFICDsKfY',
    category: 'content',
    name: 'reactive-concept.png',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01DQMGUL22mFICDsKfY_!!6000000007162-2-tps-1234-614.png',
  },
  {
    id: 'O1CN01HlrsLS1hQAJnihhh1',
    category: 'content',
    name: 'core-architecture.svg',
    url: 'https://img.alicdn.com/imgextra/i4/O1CN01HlrsLS1hQAJnihhh1_!!6000000004271-55-tps-2431-2037.svg',
  },
  {
    id: 'TB1HSvqxkT2gK0jSZFkXXcIQFXa',
    category: 'content',
    name: 'contribution-fork.png',
    url: 'https://img.alicdn.com/tfs/TB1HSvqxkT2gK0jSZFkXXcIQFXa-2050-898.png',
  },
  {
    id: 'TB1HUnjxXY7gK0jSZKzXXaikpXa',
    category: 'content',
    name: 'contribution-pr-closed.png',
    url: 'https://img.alicdn.com/tfs/TB1HUnjxXY7gK0jSZKzXXaikpXa-964-104.png',
  },
  {
    id: 'TB1NLrjxXY7gK0jSZKzXXaikpXa',
    category: 'content',
    name: 'contribution-fork-target.png',
    url: 'https://img.alicdn.com/tfs/TB1NLrjxXY7gK0jSZKzXXaikpXa-2206-490.png',
  },
  {
    id: 'TB1O.6mxbr1gK0jSZR0XXbP8XXa',
    category: 'content',
    name: 'contribution-pr-list.png',
    url: 'https://img.alicdn.com/tfs/TB1O.6mxbr1gK0jSZR0XXbP8XXa-1696-254.png',
  },
  {
    id: 'O1CN011zlc5b1uu1BDUpNg1',
    category: 'content',
    name: 'community-qrcode.png',
    url: 'https://img.alicdn.com/imgextra/i1/O1CN011zlc5b1uu1BDUpNg1_!!6000000006096-2-tps-978-1380.png',
  },
]

const URL_RE = /(?:https?:)?\/\/img\.alicdn\.com\/[^)"'\s>]+/g

function findAsset(url) {
  return ASSETS.find((asset) => url.includes(asset.id))
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        res.resume()
        const next = new URL(res.headers.location, url).href
        download(next, dest).then(resolve, reject)
        return
      }
      if (res.statusCode !== 200) {
        res.resume()
        reject(new Error(`${res.statusCode} ${url}`))
        return
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      const tmp = `${dest}.tmp`
      const out = fs.createWriteStream(tmp)
      res.pipe(out)
      out.on('finish', () =>
        out.close(() => {
          fs.renameSync(tmp, dest)
          resolve()
        })
      )
      out.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(60000, () => req.destroy(new Error(`timeout ${url}`)))
  })
}

function walkMarkdown(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkMarkdown(full, out)
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

function relativeContentPath(file, asset) {
  const target = path.join(ROOT, 'docs-assets', asset.category, asset.name)
  const rel = path
    .relative(path.dirname(file), target)
    .split(path.sep)
    .join('/')
  return rel.startsWith('.') ? rel : `./${rel}`
}

function rewrite() {
  const files = MD_ROOTS.flatMap((dir) => walkMarkdown(path.join(ROOT, dir)))
  let replacements = 0
  let changed = 0
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    if (!source.includes('img.alicdn.com')) continue
    const next = source
      .split('\n')
      .map((line) => {
        return line.replace(URL_RE, (url) => {
          const asset = findAsset(url)
          if (!asset) throw new Error(`No mapping for ${url} in ${file}`)
          if (asset.category === 'icons' && /icon\s*:/.test(line)) {
            return `/assets/icons/${asset.name}`
          }
          if (/<img|<QrCode/.test(line)) {
            return `/assets/content/${asset.name}`
          }
          return relativeContentPath(file, asset)
        })
      })
      .join('\n')
    if (next !== source) {
      replacements += (source.match(URL_RE) || []).length
      fs.writeFileSync(file, next)
      changed++
    }
  }
  const remaining = files.filter((file) =>
    fs.readFileSync(file, 'utf8').includes('img.alicdn.com')
  )
  if (remaining.length) {
    throw new Error(`alicdn references remain in:\n${remaining.join('\n')}`)
  }
  console.log(
    `[localize-content] Rewrote ${changed} files (${replacements} references)`
  )
}

async function main() {
  const downloadOnly = process.argv.includes('--download-only')
  for (const asset of ASSETS) {
    const dest = path.join(ROOT, 'docs-assets', asset.category, asset.name)
    if (fs.existsSync(dest) && !process.argv.includes('--force')) continue
    process.stdout.write(`[localize-content] Downloading ${asset.name} ... `)
    await download(asset.url, dest)
    console.log(`${fs.statSync(dest).size} bytes`)
  }
  if (!downloadOnly) rewrite()
}

main().catch((error) => {
  console.error(`[localize-content] ${error.stack || error}`)
  process.exit(1)
})
