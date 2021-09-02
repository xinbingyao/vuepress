```javascript
export default {
  functional: true, // 函数式组件 没有状态 函数没有this，也不能实例化
  render(h, { parent, data }) {
    // FunctionalRenderContext(router-view渲染的外层作用域): { data: { attrs: { a: 1}}, props: { a: 1}, parent: VueComponent, slots, scopedSlots, listeners, injections, children }
    console.log(options)
    let route = parent.$route
    let depth = 0; // 默认肯定需要先渲染第一个

    // $vnode表示“占位符”vnode  ，还有一种是渲染vnode，就是一个组件里的内容，比如<div></div>
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }

    data.routerView = true
    let record = route.matched[depth]
    if (!record) {
      return h()
    }
    return h(record.component, data)
  }
}
```