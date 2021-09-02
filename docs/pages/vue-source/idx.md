```javascript
import { initState } from './observe'
import Watcher from './observe/watcher';
import {compiler,util} from './util';
import { h, patch, render } from './vdom'


function Vue(options) {
  this._init(options); // 初始化vue
}

Vue.prototype._init = function(options) {
  let vm = this
  vm.$options = options

  // MVVM原理 需要数据重新初始化
  initState(vm); // data computed watch

  if (vm.$options.el) {
    vm.$mount()
  }

}

function query(el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  }
  return el
}

Vue.prototype._update = function(vnode) {
  // 用户传入的数据， 去更新视图
  console.log('_update')
  let vm = this
  let el = vm.$el;

  let preVnode = vm.preVnode
  if (!preVnode) { // 初次渲染
    vm.preVnode = vnode // 把上一次渲染的节点保存
    render(vnode, el)
  } else {
    vm.$el = patch(preVnode, vnode)
  }

  // ------------- 一下逻辑 讲完虚拟dom 会用虚拟dom来重写
  // 要循环这个元素 将里面的内容 换成我们的数据
  // let node = document.createDocumentFragment();
  // let firstChild;
  // while(firstChild = el.firstChild){ // 每次拿到第一个元素就将这个元素放入到文档碎片中
  //   node.appendChild(firstChild); // appendChild 是具有移动的功能 
  // }
  // // todo 对文本进行替换
  // compiler(node,vm);
  // el.appendChild(node);
  // 需要匹配{{}}的方式来进行替换
  // 依赖收集 属性变化了 需要重新渲染 watcher 和 dep
}

Vue.prototype._render = function() {
  let vm = this
  let render = vm.$options.render
  let vnode = render.call(vm, h)
  return vnode
}

Vue.prototype.$mount = function() {
  let vm = this
  let el = vm.$options.el // 获取元素
  el = vm.$el = query(el) // 获取当前挂载的节点

  // 渲染时通过watcher来渲染
  // vue2.0 组件级别更新 new Vue产生一个组件
  let updateComponent = () => { // 更新组件、渲染的逻辑
    vm._update(vm._render()); // 更新组件
  }
  new Watcher(vm, updateComponent); // 渲染watcher，默认会调用updateComponent这个方法
}

Vue.prototype.$watch = function(expr, handler, opts) {
  // 创建一个watcher, user: true表示是用户的watcher
  let vm = this
  new Watcher(vm, expr, handler, { user: true, ...opts })
}

export default Vue
```