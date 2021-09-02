```javascript
import createMatcher from './create-matcher'
import install from './install.js'
import HashHistory from './history/hash'

class VueRouter {
  constructor(options) { // 需要先将数据格式化
    // matcher 匹配器 处理属树形结构 数据扁平化
    // 这里会返回两个方法， addRoute(动态添加路由)  match(匹配路径)
    this.matcher = createMatcher(options.routes || [])
    // 内部使用history hash模式 路由的初始化工作
    // vue的内部路由有三种history hash abstract
    this.history = new HashHistory(this); // base 表示的是基类 我们所有实现的路由功能公共方法都放在基类上 保证不同的路由api 有相同的使用方法

    this.beforeEachs = []
  }

  match(location) { // 只要路径一切换，调用撇脾气进行匹配 将匹配结果返回
    return this.matcher.match(location)
  }

  push(location) {
    this.history.transitionTo(location, () => {
      window.location.hash = location
    })
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

    history.listen((route) => { // 订阅， 等会路径属性一变化就执行此方法
      app._route = route
    })
  }

  beforeEach(cb) {
    this.beforeEachs.push(cb)
  }
}

VueRouter.install = install

export default VueRouter
```
