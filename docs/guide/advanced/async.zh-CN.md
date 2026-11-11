# 实现异步数据源

异步数据源管理，核心体现在[Field](https://formilyjs-v2.bugduo.com/core/zh-CN/api/models/field)模型中的 dataSource 属性，我们可以在 effects 中修改 Field 的 dataSource，也可以在 reactions 中修改 dataSource 属性。

如果字段组件内部(比如 Select)有消费 dataSource 属性，当 dataSource 发生变化时，对应组件会自动重渲染。

<Alert>
注意：如果是业务自定义组件，请手动映射dataSource到自定义组件中，可以使用 <a href="https://formilyjs-v2.bugduo.com/react/zh-CN/api/shared/connect">connect</a>，也可以使用 <a href="https://formilyjs-v2.bugduo.com/react/zh-CN/api/shared/observer">observer</a> + <a href="https://formilyjs-v2.bugduo.com/react/zh-CN/api/hooks/use-field">useField</a>
</Alert>

具体案例可以参考：

- [Select](https://formilyjs-v2.bugduo.com/antd/zh-CN/components/select)
- [TreeSelect](https://formilyjs-v2.bugduo.com/antd/zh-CN/components/tree-select)
- [Cascader](https://formilyjs-v2.bugduo.com/antd/zh-CN/components/cascader)
