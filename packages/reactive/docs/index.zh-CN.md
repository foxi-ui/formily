---
title: Formily - 阿里巴巴统一前端表单解决方案
order: 10
hero:
  title: Reactive Library
  desc: 面向DDD的响应式状态管理方案
  actions:
    - text: 主站文档
      link: https://formilyjs-v2.bugduo.com
    - text: 开发指南
      link: /zh-CN/guide
features:
  - icon: /assets/icons/feature-efficient.svg
    title: 超高性能
    desc: 依赖追踪，高效更新，按需渲染
  - icon: /assets/icons/feature-domain.svg
    title: 跨终端，跨框架
    desc: UI无关，框架无关
  - icon: /assets/icons/feature-smart-tips.svg
    title: 智能提示
    desc: 拥抱Typescript
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self
---

## 安装

```bash
$ npm install --save @formily/reactive

```

## 快速开始

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
