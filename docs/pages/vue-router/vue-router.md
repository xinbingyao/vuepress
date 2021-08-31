用了这个插件后，会给每个组件增加两个属性， $route 放的所有路由相关的属性 $router 放了一些方法($router放在了Vue.prototype)
还提供了两个组件 router-view router-link(Vue.component)

```javascript
Vue.use(VueRouter) // 调用install方法
```
- create-route-map.js
```javascript
export default function createRouteMap(routes, oldPathList, oldPathMap) {
  let pathList = oldPathList || []
  let pathMap = oldPathMap || Object.create(null)
  // 数组扁平化
  routes.forEach(route => {
    // addRouteRecord 根据用户的路径 实现格式化数据
    addRouteRecord(routes, pathList, pathMap)
  })
  return {
    pathList,
    pathMap
  }
}

function addRouteRecord(route, pathList, pathMap, parent) {
  let path = parent ? parent.path + '/' + route.path : route.path
  let record = {
    path,
    component: route.component,
    // todo...
    parent
  }
  if (!pathMap[path]) {
    pathList.push(path)
    pathMap[path] = record
  }
  if (route.children) {
    route.children.forEach(route => {
      addRouteRecord(route, pathList, pathMap, record)
    })
  }
}
```

- create-matcher.js
```javascript
import createRouteMap from './create-route-map'
import { createRoute } from './history/base'

export default function createMatcher(routes) {
  // 将数据扁平化处理, 创建路由映射表
  // pathList 表示所有路径的集合 [ / /home /a /b ]
  // pathMap { /: home,  /about: about }
  let { pathList, pathMap } = createRouteMap(routes)
  function addRoutes(routes, pathList, pathMap) {
    createRouteMap(routes, pathList, pathMap)
  }

  function match(location) { // 匹配对应记录的
    // todo...
    console.log('match', location)
    let record = pathMap[location]
    console.log(record)
    return createRoute(record, {
      path: location
    })
  }

  return {
    addRoutes,
    match
  }
}

```

- install.js
```javascript
const install = (_Vue) => {
  // 默认希望可以将router放到任何组件中使用
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) { // 根实例
        this._routerRoot = this
        this._router = this.$options.router

        // 路由初始化
        this._router.init(this) // 这里的this为根实例

      } else { // 子组件中是没有router属性的
        // 子组件上都有一个_routerRoot属性可以获取到最顶层的根实例
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    }
  })
}

export default install
```

- index.js
```javascript
import createMatcher from './create-matcher'
import install from './install.js'
import HashHistory from './history/hash'

class VueRouter {
  constructor(options) {
    // matcher 匹配器 处理属树形结构 数据扁平化
    // 这里会返回两个方法， addRoute(动态添加路由)  match(匹配路径)
    this.matcher = createMatcher(options.routes || [])
    // 内部使用history hash模式 路由的初始化工作
    // vue的内部路由有三种history hash abstract
    this.history = new HashHistory(this); // base 表示的是基类 我们所有实现的路由功能公共方法都放在基类上 保证不同的路由api 有相同的使用方法
  }
  match(location) { // 只要路径一切换，调用撇脾气进行匹配 将匹配结果返回
    return this.matcher.match(location)
  }
  init(app) { // app是最顶层的Vue实例
    // 需要获取到路由的路径 进行跳转， 匹配到对应的组件进行渲染 
    // 当第一次匹配完成后 需要监听路由的变化 之后完成后续的更新操作

    const history = this.history
    const setupHashListener = () => { // 跳转成功后的回调
      history.setupListener(); // 监听路由变化的方法 父类
    } 
    history.transitionTo( // 跳转的方法 父类
      history.getCurrentLocation(), // 获取当前路径的方法 子类
      setupHashListener) 
  }
}

VueRouter.install = install

export default VueRouter
```

history模块
- base.js
```javascript
export function createRoute(record, location) {
  let res = [] // 如果匹配到了路径 需要将这个路径放进来
  if (record) {
    while(record) {
      res.unshift(record)
      record = record.parent
    }
  }
  return {
    ...location,
    matched: res // 路径匹配结果
  }
}

class History {
  constructor(router) {
    this.router = router
    this.current = createRoute(null, {
      path: '/' // 默认路由就是/
    })
  }
  transitionTo(location, callback) { // 最好屏蔽一下 如果多次调用 路径相同不需要跳转
    // 需要根据路径获取到对应的组件
    let r = this.router.match(location)
    this.current = r
    callback && callback()
  }
  setupListener() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(window.location.hash.slice(1));
    })
  }
}

export default History
```

- hash.js
```javascript
import History from './base';

function ensureSlash() {
  if (window.location.hash) { // firefox不兼容 window.locatio.href拿
    window.location.hash = '/'
  }
}

class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;

    // 确保页面一加载就要有hash值
    ensureSlash();
  }
}
```