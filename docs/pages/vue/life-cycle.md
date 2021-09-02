## 生命周期

生命周期中this绑定当前实例，同步执行

```javascript
Vue.mixin({ // globalApi 里有
  beforeCreate() {
    console.log('初始化前的公共逻辑')
  }
})
// 导致这个方法来源不知道怎么来的   Vue3.0 compositionApi 来解决这个问题

let vm = new Vue({
  el: '#app',
  beforeCreate() { // 创建前
  // 初始化之前，没有进行数据观测，只是调用了初始化父子关系 及 内部事件（$on $off $emit 等）
  // 一般情况下会混入公共逻辑 Vue.mixin
    console.log('before created', this)
  },
  created() {
    // 没有真实的挂载元素 只是初始化数据 无法获取到dom元素
    console.log('created')
  },
  beforeMount() {
    // 在第一次调用render之前执行
    console.log('before mount')
  },
  // template: '<div>hello world</div>',
  render(h) {
    console.log('render')
    return h('div', this.msg)
  }
  mounted() {
    // 创建出真实的DOM 替换掉老节点 vm.$el（渲染的真实DOM） 替换掉el
    console.log('mounted')
  },
  beforeUpdate() {
    // 可以做一些合并更新的操作
    console.log('before update')
  },
  updated() { 
    // 不要在这更新数据，会死循环
    console.log('updated')
  },
  beforeDestroy() {
    // 做自定义事件的解绑 $off ，还可以取消DOM的事件绑定   定时器的清理
    // 触发： 组件切换或者手动销毁vm.$destroy()（只是移除监听）
    console.log('before destroy')
  },
  destroyed() {
    console.log('destroyed')
  },
  data() {

  }
})
```

父子组件生命周期
父：beforeCreate created beforeMount render 
子：beforeCreate created beforeMount mounted 
父：mounted                                         


![desc](/lifecycle.png)