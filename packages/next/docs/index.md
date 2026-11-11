---
title: Formily-Alibaba unified front-end form solution
order: 10
hero:
  title: Formily Fusion
  desc: Formily Component System Based on Alibaba Fusion Encapsulation
  actions:
    - text: Home Site
      link: https://formilyjs-v2.bugduo.com
    - text: Document
      link: /components
features:
  - icon: /assets/icons/feature-easier.svg
    title: Easier To Use
    desc: Out of the box, rich cases
  - icon: /assets/icons/feature-efficient.svg
    title: More Efficient
    desc: Stupid writing, super high performance
  - icon: /assets/icons/feature-professional.svg
    title: More Professional
    desc: complete, flexible, elegant
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self<br /><span class="site-visit-stats" data-vercount-stats>Total site views <span data-vercount-pv>--</span> · ~<span data-vercount-uv>--</span> visitors</span>
---

## Installation

```bash
$ npm install --save @alifd/next moment
$ npm install --save @formily/core @formily/react @formily/next

```

## Quick start

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react'
import { NumberPicker, FormItem, Space } from '@formily/next'
import { createForm } from '@formily/core'
import { FormProvider, FormConsumer, Field } from '@formily/react'

const form = createForm()

export default () => (
  <FormProvider form={form}>
    <Space>
      <Field
        name="price"
        title="price"
        initialValue={5.2}
        decorator={[FormItem]}
        component={[
          NumberPicker,
          {
            placeholder: 'Please enter',
            style: {
              width: 100,
            },
          },
        ]}
      />
      <FormItem>×</FormItem>
      <Field
        name="count"
        title="quantity"
        initialValue={100}
        decorator={[FormItem]}
        component={[
          NumberPicker,
          {
            placeholder: 'Please enter',
            style: {
              width: 100,
            },
          },
        ]}
      />
      <FormConsumer>
        {(form) => (
          <FormItem>={` ${form.values.price * form.values.count}元`}</FormItem>
        )}
      </FormConsumer>
    </Space>
  </FormProvider>
)
```
