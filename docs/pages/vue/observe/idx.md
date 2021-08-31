```javascript
import Dep from './dep'
import Observer from './observer'
import Watcher from './watcher'

export function initState(vm) {
  let opts = vm.$options
  if (opts.data) {
    initData(vm)
  }

  if (opts.computed) {
    initComputed(vm)
  }

  if (opts.watch) {
    initWatch(vm)
  }
}

export function observe(data) {
  // console.log(data, '=========observe==========')
  if (typeof data !== 'object' || data == null) {
    return
  }
  if (data.__ob__) { // 已经被监测过了
    return data.__ob__
  }
  return new Observer(data)
}

// 代理数据
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

// 将用户插入的数据，通过Object.defineProperty重新定义
function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

  // 会将对vm上的取值操作和赋值操作代理给vm._data属性
  for (let key in data) {
    proxy(vm, '_data', key)
  }

  // 观察数据
  observe(data);
}

function createComputedGetter(vm, key) {
  let watcher = vm._watchersComputed[key] // 计算属性watcher
  return function() { // 用户取值时执行
    if (watcher) {
      if (watcher.dirty) { // 如果页面取值，而且dirty为true时，就会调用watcher的get方法
        watcher.evaluate();
      }
      if (Dep.target) { // 如果还有watcher，那么给计算属性添加上watcher
        watcher.depend();
      }
      return watcher.value;
    }
  }
}

function initComputed(vm) {
  let computed = vm.$options.computed
  let watchers = vm._watchersComputed = Object.create(null) // 存储
  // console.log(computed, 'init computed')
  for (let key in computed) {
    let userDef = computed[key]
    // lazy表示是计算属性watcher 默认刚开始这个方法不会执行
    watchers[key] = new Watcher(vm, userDef, () => {}, { lazy: true })
    // 取值用
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key)
    })
  }
}

function createWatcher(vm, key, handler, opts) {
  vm.$watch(key, handler, opts)
}

function initWatch(vm) {
  let watch = vm.$options.watch
  for (let key in watch) {
    let userDef = watch[key]
    let handler = userDef
    if (userDef.handler) {
      handler = userDef.handler
    }
    createWatcher(vm, key, handler, { immediate: userDef.immediate })
  }
}
```