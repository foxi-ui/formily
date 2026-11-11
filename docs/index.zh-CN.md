---
title: Formily - 阿里巴巴统一前端表单解决方案
order: 10
hero:
  title: Alibaba Formily
  desc: 阿里巴巴统一前端表单解决方案
  actions:
    - text: 查看文档
      link: /zh-CN/guide
    - text: 快速开始
      link: /zh-CN/guide/quick-start
features:
  - icon: /assets/icons/feature-easier.svg
    title: 更易用
    desc: 开箱即用，案例丰富
  - icon: /assets/icons/feature-efficient.svg
    title: 更高效
    desc: 傻瓜写法，超高性能
  - icon: /assets/icons/feature-professional.svg
    title: 更专业
    desc: 完备，灵活，优雅
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self
---

```tsx
/**
 * inline: true
 */
import React from 'react'
import { Section } from './site/Section'
import './site/styles.less'

export default () => (
  <Section
    title="傻瓜写法，超高性能"
    style={{ marginTop: 40 }}
    titleStyle={{ paddingBottom: 100 }}
  >
    <iframe
      className="codesandbox"
      src="https://codesandbox.io/embed/formilyyaliceshi-vbu4w?fontsize=12&module=%2FApp.tsx&theme=dark"
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  </Section>
)
```

```tsx
/**
 * inline: true
 */
import React from 'react'
import { Section } from './site/Section'
import './site/styles.less'

export default () => (
  <Section
    title="拖拽搭建，高效开发"
    style={{ marginTop: 140 }}
    titleStyle={{ paddingBottom: 140 }}
    scale={1.2}
  >
    <a href="//designable-antd.formilyjs.org" target="_blank" rel="noreferrer">
      <img src="/assets/content/form-builder.png" />
    </a>
  </Section>
)
```

```tsx
/**
 * inline: true
 */
import React from 'react'
import { Section } from './site/Section'
import './site/styles.less'

export default () => (
  <Section
    title="纯净内核，更易扩展"
    style={{ marginTop: 140 }}
    titleStyle={{ paddingBottom: 100 }}
  >
    <a
      href="https://formilyjs-v2.bugduo.com/core"
      target="_blank"
      rel="noreferrer"
    >
      <img src="/assets/content/guide-core.svg" />
    </a>
  </Section>
)
```

```tsx
/**
 * inline: true
 */
import React from 'react'
import { Section } from './site/Section'
import { Contributors } from './site/Contributors'
import './site/styles.less'

export default () => (
  <Section
    title="社区活跃，能者众多"
    style={{ marginTop: 100 }}
    titleStyle={{ paddingBottom: 140 }}
  >
    <Contributors />
  </Section>
)
```

```tsx
/**
 * inline: true
 */
import React from 'react'
import { Section } from './site/Section'
import { QrCode, QrCodeGroup } from './site/QrCode'
import './site/styles.less'

export default () => (
  <Section
    title="全球互助共建答疑大群"
    style={{ marginTop: 140 }}
    titleStyle={{ paddingBottom: 20, fontWeight: 'bold' }}
  >
    <QrCodeGroup>
      <QrCode link="/assets/content/community-qrcode.png" />
    </QrCodeGroup>
  </Section>
)
```
