---
title: Formily-Alibaba unified front-end form solution
order: 10
hero:
  title: React Library
  desc: Alibaba Unified Form Solution
  actions:
    - text: Home Site
      link: https://formilyjs-v2.bugduo.com
    - text: Development Guide
      link: /guide
features:
  - icon: /assets/icons/feature-efficient.svg
    title: Ultra High Performance
    desc: Dependency tracking, efficient update, on-demand rendering
  - icon: /assets/icons/feature-easier.svg
    title: Out Of The Box
    desc: The component status is automatically bound, and the access cost is extremely low
  - icon: /assets/icons/feature-react-extra.svg
    title: JSON Schema Driver
    desc: Standard JSON-Schema
  - icon: /assets/icons/feature-reusable.svg
    title: Scene Reuse
    desc: Based on protocol-driven, abstract scene components
  - icon: /assets/icons/feature-debug.svg
    title: Debugging Friendly
    desc: Natural docking with Formily DevTools
  - icon: /assets/icons/feature-smart-tips.svg
    title: Smart Tips
    desc: Embrace Typescript
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self
---

## Installation

```bash
$ npm install --save @formily/core @formily/react

```

## Quick start

```tsx
/**
 * defaultShowCode: true
 */
import React, { useMemo } from 'react'
import { createForm, setValidateLanguage } from '@formily/core'
import {
  FormProvider,
  FormConsumer,
  Field,
  useField,
  observer,
} from '@formily/react'
import { Input, Form } from 'antd'

// FormItem UI component
const FormItem = observer(({ children }) => {
  const field = useField()
  return (
    <Form.Item
      label={field.title}
      help={field.selfErrors?.length ? field.selfErrors : undefined}
      extra={field.description}
      validateStatus={field.validateStatus}
    >
      {children}
    </Form.Item>
  )
})

/*
 * The above logic has been implemented in @formily/antd, and there is no need to rewrite it in actual use
 */

//Switch the built-in check internationalization copy to English
setValidateLanguage('en')

export default () => {
  const form = useMemo(() => createForm({ validateFirst: true }))

  const createPasswordEqualValidate = (equalName) => (field) => {
    if (
      form.values.confirm_password &&
      field.value &&
      form.values[equalName] !== field.value
    ) {
      field.selfErrors = ['Password does not match Confirm Password.']
    } else {
      field.selfErrors = []
    }
  }

  return (
    <FormProvider form={form}>
      <Form layout="vertical">
        <Field
          name="name"
          title="Name"
          required
          decorator={[FormItem]}
          component={[Input, { placeholder: 'Please Input' }]}
        />
        <Field
          name="password"
          title="Password"
          required
          decorator={[FormItem]}
          component={[Input, { type: 'password', placeholder: 'Please Input' }]}
          reactions={createPasswordEqualValidate('confirm_password')}
        />
        <Field
          name="confirm_password"
          title="Confirm Password"
          required
          decorator={[FormItem]}
          component={[Input, { type: 'password', placeholder: 'Please Input' }]}
          reactions={createPasswordEqualValidate('password')}
        />
        <code>
          <pre>
            <FormConsumer>
              {(form) => JSON.stringify(form.values, null, 2)}
            </FormConsumer>
          </pre>
        </code>
      </Form>
    </FormProvider>
  )
}
```
