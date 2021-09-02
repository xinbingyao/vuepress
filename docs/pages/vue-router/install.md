```javascript
import RouterView from './components/router-view'
import RouterLink from './components/router-link'
let Vue

const install = (_Vue) => {
  Vue = _Vue
  // 默认希望可以将router放到任何组件中使用
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) { // 根实例
        this._routerRoot = this
        this._router = this.$options.router // VueRouter的实例

        // 路由初始化
        this._router.init(this) // 这里的this为根实例

        // 将current属性定义成响应式的， 这样稍后更新current，就可以刷新视图了

        // 给当前根实例增加了一个_route属性 ，他取自当前的history中的current
        Vue.util.defineReactive(this, '_route', this._route.history.current);
        // 每次更新路径后，需要更新_route属性

      } else { // 子组件中是没有router属性的
        // 子组件上都有一个_routerRoot属性可以获取到最顶层的根实例
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })
  // 实现了一个代理功能
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    }
  })

  // 全局组件
  Vue.component('RouterView', RouterView)
  Vue.component('RouterLink', RouterLink)
}

export default install
```