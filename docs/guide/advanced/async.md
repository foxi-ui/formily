# Asynchronous Data Sources

Asynchronous data source management, the core is reflected in the dataSource property of the [Field](https://formilyjs-v2.bugduo.com/core/api/models/field) model. We can modify the dataSource of the Field in effects, or modify the dataSource property in reactions.

If the field component (such as Select) has a consumer dataSource property, when the dataSource changes, the corresponding component will automatically re-render.

<Alert>
Note: If it is a business custom component, please manually map the dataSource to the custom component, you can use  <a href="https://formilyjs-v2.bugduo.com/react/api/shared/connect">connect</a> or <a href="https://formilyjs-v2.bugduo.com/react/api/shared/observer">observer</a> + <a href="https://formilyjs-v2.bugduo.com/react/api/hooks/use-field">useField</a>
</Alert>

Specific cases can refer to:

- [Select](https://formilyjs-v2.bugduo.com/antd/components/select)
- [TreeSelect](https://formilyjs-v2.bugduo.com/antd/components/tree-select)
- [Cascader](https://formilyjs-v2.bugduo.com/antd/components/cascader)
