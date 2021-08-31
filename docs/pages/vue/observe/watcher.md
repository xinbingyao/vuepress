```javascript
import { util } from "../util"
import { pushTarget, popTarget } from "./dep"

let id = 0

class Watcher { // 每一个watch都有一个唯一标识
  /**
   * @param {*} vm 当前组件的实例 new Vue
   * @param {*} exprOrFn 用户可能传入的是一个表达式或函数
   * @param {*} cb 用户传入的回调函数，比如vm.$watch('msg', cb)
   * @param {*} opts 其他参数
   */
  constructor(vm, exprOrFn, cb = () => {}, opts = {}) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = () => {
        return util.getValue(vm, exprOrFn)
      }
    }
    if (opts.user) { // 标识是用户自己写的watcher
      this.user = true
    }
    this.lazy = opts.lazy // 标识是计算属性watcher
    this.dirty = this.lazy
    this.cb = cb
    this.opts = opts
    this.deps = []
    this.depsId = new Set()
    this.id = id++
    this.immediate = opts.immediate
    // 创建watcher的时候，先将表达式对应的值取出来（老值）
    this.value = this.lazy ? undefined : this.get() // 默认创建一个watcher，会调用自身的get方法, 计算属性watcher默认不调用get
    if (this.immediate) { // 如果有immediate， 就直接运行用户定义的函数
      this.cb(this.value)
    }
  }

  get() {
    // 会把计算属性watcher放到stack里，Dep.target指向计算属性watcher
    pushTarget(this); // 保存watcher
    // 执行这个函数，会将当前的计算属性watcher存起来
    let value = this.getter.call(this.vm)
    popTarget(); // Dep.target置空，方便下次使用
    return value
  }

  evaluate() {
    this.value =this.get();
    this.dirty = false
  }

  addDep(dep) { // 同一个watcher，不应该重复记录dep
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep); // 让watcher记住了当前的dep
      dep.addSub(this); // dep也记住了watcher
    }
  }

  depend() {
    let i = this.deps.length
    console.log(i)
    while(i--) {
      console.log(this.deps[i])
      // 把watcher添加到依赖中
      this.deps[i].depend()
    }
  }

  update() { // 如果立即调用get 会导致页面你刷新， 所以需要异步来更新
    // console.log('update', this.id)
    if (this.lazy) {
      // 计算属性依赖的值变化了 稍后取值时重新计算即可
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }

  run() {
    let value = this.get(); // 新值
    if (this.value !== value) {
      this.cb(value, this.value)
    }
  }
}

let queue = []
let has = {}

function flushQueue() {
  // 等待当前这一轮全部更新后，再去让watcher 依次执行
  queue.forEach(watcher => watcher.run())
  queue = []
  has = {}
}

function queueWatcher(watcher) { // 对重复的watcher进行过滤操作
  let id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher); // 相同的watcher只会存一个到queue中

    // 延迟清空队列
    nextTick(flushQueue)
  }
}

let callbacks = []
function flushCallbacks() {
  callbacks.forEach(cb => cb())
}

function nextTick(cb) { // cb就是flushQueue
  callbacks.push(cb);
  // 异步刷新
  let timerFunc = () => {
    flushCallbacks()
  }

  if (Promise) {
    // console.log('promise')
    return Promise.resolve().then(timerFunc)
  }

  if (MutationObserver) {
    // console.log('mutationObserver')
    let observer = new MutationObserver(timerFunc)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, { characterData: true })
    textNode.textContent = 2
    return
  }

  if (setImmediate) {
    return setImmediate(timerFunc)
  }

  setTimeout(timerFunc, 0)

}

export default Watcher
```