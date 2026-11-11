---
title: Formily - Alibaba unified front-end form solution
order: 10
hero:
  title: Alibaba Formily
  desc: Alibaba Unified Front-end Form Solution
  actions:
    - text: Introduction
      link: /guide
    - text: Quick start
      link: /guide/quick-start
features:
  - icon: /assets/icons/feature-easier.svg
    title: Easier to Use
    desc: Out of the box, rich cases
  - icon: /assets/icons/feature-efficient.svg
    title: More Efficient
    desc: Fool writing, ultra-high performance
  - icon: /assets/icons/feature-professional.svg
    title: More Professional
    desc: Complete, flexible and elegant
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
    title="Fool Writing, Ultra-high Performance"
    style={{ marginTop: 40 }}
    titleStyle={{ paddingBottom: 100, fontWeight: 'bold' }}
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
    title="Form Builder,Efficient Development"
    style={{ marginTop: 140, fontWeight: 'bold' }}
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
    title="Pure Core, More Extensibility"
    style={{ marginTop: 140 }}
    titleStyle={{ paddingBottom: 100, fontWeight: 'bold' }}
  >
    <a
      href="https://formilyjs-v2.bugduo.com/core"
      target="_blank"
      rel="noreferrer"
    >
      <img src="/assets/content/guide-core-2.svg" />
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
    title="Active Community & Genius People"
    style={{ marginTop: 100 }}
    titleStyle={{ paddingBottom: 140, fontWeight: 'bold' }}
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
    title="High-Quality Community Group"
    style={{ marginTop: 140 }}
    titleStyle={{ paddingBottom: 20, fontWeight: 'bold' }}
  >
    <QrCodeGroup>
      <QrCode link="/assets/content/community-qrcode.png" />
    </QrCodeGroup>
  </Section>
)
```
