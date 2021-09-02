```javascript
import Vue from 'vue'
import About from './views/About.vue'
import Router from 'vue-router'
// 用了这个插件后，会给每个组件增加两个属性， $route 放的所有路由相关的属性 $router 放了一些方法($router放在了Vue.prototype)

// 还提供了两个组件 router-view router-link(Vue.component)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: 'about',
      component: About
    }
  ]
})
```
