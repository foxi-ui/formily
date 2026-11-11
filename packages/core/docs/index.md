---
title: Formily-Alibaba unified front-end form solution
order: 10
hero:
  title: Core Library
  desc: Alibaba Unified Form Solution
  actions:
    - text: Home Site
      link: https://formilyjs-v2.bugduo.com
    - text: Document
      link: /guide
features:
  - icon: /assets/icons/feature-efficient.svg
    title: High Performance
    desc: Efficient update, Demand rendering
  - icon: /assets/icons/feature-reusable.svg
    title: Excellent Reusability
    desc: Independent side effects, Pluggable
  - icon: /assets/icons/feature-linkage.svg
    title: Elegant Linkage Writing
    desc: Flexible, Complete, Elegant
  - icon: /assets/icons/feature-domain.svg
    title: Complete domain model
    desc: Pure Core, No UI, No Framework
  - icon: /assets/icons/feature-debug.svg
    title: Friendly debugging
    desc: Natural docking with Formily DevTools
  - icon: /assets/icons/feature-smart-tips.svg
    title: Smart Tips
    desc: Embrace Typescript
footer: Open-source MIT Licensed | Copyright © 2019-present<br />Powered by self<br /><span class="site-visit-stats" data-vercount-stats>Total site views <span data-vercount-pv>--</span> · ~<span data-vercount-uv>--</span> visitors</span>
---

## Installation

```bash
$ npm install --save @formily/core

```

## Quick start

> The following case is to teach you step by step to implement a form from scratch
>
> @formily/core brings you the following capabilities:
>
> 1. Responsive computing capabilities
> 2. Verification capability, verification internationalization capability
> 3. Value Management Ability
> 4. Linkage management capabilities
> 5. Development tool debugging capabilities, [download Formily Devtools](https://chrome.google.com/webstore/detail/formily-devtools/kkocalmbfnplecdmbadaapgapdioecfm?hl=zh-CN)

```tsx
/**
 * defaultShowCode: true
 */
import React, { createContext, useMemo, useContext, useEffect } from 'react'
import { createForm, setValidateLanguage } from '@formily/core'
import { observer } from '@formily/reactive-react'

//Create a context to facilitate Field consumption
const FormContext = createContext()
//Create a context to facilitate the consumption of FormItem
const FieldContext = createContext()

//State bridge component
const Field = observer((props) => {
  const form = useContext(FormContext)
  //Create a field
  const field = form.createField(props)
  useEffect(() => {
    //Mount field
    field.onMount()
    return () => {
      //Unload field
      field.onUnmount()
    }
  })
  if (!field.visible || field.hidden) return null
  //Render the field, associate the field state with the UI component
  const component = React.createElement(field.component[0], {
    ...field.component[1],
    value: field.value,
    onChange: field.onInput,
  })

  //Render field wrapper
  const decorator = React.createElement(
    field.decorator[0],
    field.decorator[1],
    component
  )

  return (
    <FieldContext.Provider value={field}>{decorator}</FieldContext.Provider>
  )
})

// FormItem UI component
const FormItem = observer(({ children }) => {
  const field = useContext(FieldContext)
  return (
    <div>
      <div style={{ height: 20 }}>{field.title}:</div>
      {children}
      <div style={{ height: 20, fontSize: 12, color: 'red' }}>
        {field.selfErrors.join(',')}
      </div>
    </div>
  )
})

// Input UI component
const Input = (props) => {
  return (
    <input
      {...props}
      value={props.value || ''}
      style={{
        ...props.style,
        border: '2px solid rgb(186 203 255)',
        borderRadius: 6,
        width: '100%',
        height: 28,
        padding: '0 5px',
      }}
    />
  )
}

//Form management entrance
const FormProvider = (props) => {
  useEffect(() => {
    //Mount form
    props.form?.onMount()
    return () => {
      //Uninstall the form
      props.form?.onUnmount()
    }
  })
  return (
    <FormContext.Provider value={props.form}>
      {props.children}
    </FormContext.Provider>
  )
}

//Form response monitor
const FormConsumer = observer((props) => {
  const form = useContext(FormContext)
  return <div>{props.children(form)}</div>
})

/*
 * The above logic has been implemented in @formily/react or @formily/vue, and there is no need to rewrite it in actual use
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
    </FormProvider>
  )
}
```
