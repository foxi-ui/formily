---
order: 2
---

# ObjectField

## 描述

作为@formily/core 的 [createObjectField](https://formilyjs-v2.bugduo.com/core/api/models/form#createobjectfield) Vue 实现，它是专门用于将 ViewModel 与输入控件做绑定的桥接组件，ObjectField 组件属性参考[IFieldFactoryProps](https://formilyjs-v2.bugduo.com/core/api/models/form#ifieldfactoryprops)

::: warning
我们在使用 ObjectField 组件的时候，一定要记得传 name 属性。同时要使用 scoped slot 形式来组织子组件
:::

## 签名

```ts
type ObjectField = Vue.Component<any, any, any, IFieldFactoryProps>
```

## 用例

<dumi-previewer demoPath="api/components/object-field" />
