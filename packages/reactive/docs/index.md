---
title: Formily-Alibaba unified front-end form solution
order: 10
hero:
  title: Reactive Library
  desc: DDD-oriented Responsive State Management Solution
  actions:
    - text: Home Site
      link: https://formilyjs-v2.bugduo.com
    - text: Document
      link: /guide
features:
  - icon: /assets/icons/feature-efficient.svg
    title: High Performance
    desc: Efficient update, Demand rendering
  - icon: /assets/icons/feature-domain.svg
    title: Zero Dependencies
    desc: Cross Device,Cross Framework
  - icon: /assets/icons/feature-smart-tips.svg
    title: Smart Tips
    desc: Embrace Typescript
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self<br /><span class="site-visit-stats" data-vercount-stats>Total site views <span data-vercount-pv>--</span> · ~<span data-vercount-uv>--</span> visitors</span>
---

## Installation

```bash
$ npm install --save @formily/reactive

```

## Quick start

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'

const obs = observable({
  value: 'Hello world',
})

export default observer(() => {
  return (
    <div>
      <div>
        <input
          style={{
            height: 28,
            padding: '0 8px',
            border: '2px solid #888',
            borderRadius: 3,
          }}
          value={obs.value}
          onChange={(e) => {
            obs.value = e.target.value
          }}
        />
      </div>
      <div>{obs.value}</div>
    </div>
  )
})
```
