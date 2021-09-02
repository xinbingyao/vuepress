```javascript
let Vue

let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key])
  })
}

class ModuleCollection {
  constructor(options) {
    console.log('111')
    // 深度遍历将所有的子模块都遍历一遍
    this.register([], options)
  }

  register(path, rootModule) {
    let rawModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }

    rootModule.rawModule = rawModule // 双向记录(registerModule动态注册模块会用到)

    if (!this.root) {
      this.root = rawModule
    } else {
      // 找到模块的父级
      let parentModule = path.slice(0, -1).reduce((root, cur) => {
        return root._children[current]
      }, this.root)
      parentModule._children[path[path.length - 1]] = rawModule
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (moduleName, module) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

// 获取最新的state，为了配合persitst（vuex持久化存储）
function getState(store, path) {
  let local = path.reduce((newState, cur) => {
    return newState[cur]
  }, store.state)
  return local
}

function installModule(store, rootState, path, rawModule) {

  let getters = rawModule._raw.getters
  // 根据当前用户传入的配置，算一下需不需要增加一个前缀
  let root = store.modules.root // 获取到最终整个格式化的结果
  let namespace = path.reduce((str, cur) => {
    root = root._chilren[cur]
    str = str + (root._raw.namespaced ? cur + '/' : '')
    return str
  }, '')
  if (path.length > 0) { // 说明有子模块
    // Vue响应式原理，不能增加不存在的属性
    let parentState = path.slice(0, -1).reduce((root, cur) => {
      return rootState[cur]
    }, rootState)
    Vue.set(rootState, path[path.length - 1], rawModule.state)
  }

  if (getters) {
    forEach(getters, (getterName, value) => {
      Object.defineProperty(store.getters, namespace+getterName, {
        get: () => {
          // return value(rawModule.state)
          return value(getState(store, path))
        }
      })
    })
  }

  let mutations = rawModule._raw.mutations // 取mutation
  if (mutations) {
    forEach(mutations, (mutationName, value) => {
      let arr = store.mutations[namespace+mutationName] || (store.mutations[namespace+mutationName] = [])
      arr.push((payload) => {
        // value(rawModule.state, payload) // 真正执行mutation的地方
        value(getState(store, path), payload) // 真正执行mutation的地方
        store.subs.forEach(fn => fn({ type: namespace+mutationName, payload: payload}, store.state))
      })
    })
  }

  let actions = rawModule._raw.actions // 取用户的action
  if (actions) {
    forEach(actions, (actionName, value) => {
      let arr = store.actions[namespace+actionName] || (store.actions[namespace+actionName] = [])
      arr.push((payload) => {
        value(store, payload)
      })
    })
  }

  forEach(rawModule._children, (moduleName, rawModule) => {
    installModule(store, rootState, path.concat(moduleName), rawModule)
  })
}

class Store {
  constructor(options) {
    // 获取用户new实例时传入的所有属性
    this.vm = new Vue({ // 创建Vue的实例 保证状态更新可以刷新视图
      data: { // 默认这个状态 会被使用Object.defineProperty重新定义
        state: options.state
      }
    })

    this.strict = options.strict || false
    this.getters = {}
    this.mutations = {}
    this.actions = {}
    this.subs = []

    // 1.需要将用户传入的数据进行格式化操作
    this.modules = new ModuleCollection(options)
    // 2.递归的安装模块
    installModule(this, this.state, [], this.modules.root);

    let plugins = options.plugins
    plugins.forEach(plugin => plugin(this))

    // 同步方法中不允许有异步
    if (this.strict) {
      this.vm.$watch(() => {
        return this.vm.state
      }, function() {
        console.assert(this._committing, '不能异步调用')
      }, { deep: true, sync: true}) // 监控了是否采用同步的方式更改了数据
    }

  }

  _withCommit(fn) {
    const committing = this._committing
    this._committing = true
    fn()
    this._committing = committing
  }

  replaceState(newState) {
    this.vm.state = newState
  }

  subscribe(fn) {
    this.subs.push(fn)
  }

  commit = (mutationName, payload) => { // es7写法，这个里面的this，永远指向当前store的实例
    this.mutations[mutationName].forEach(fn => fn(payload)); // 发布
  }

  dispatch = (actionName, payload) => {
    this.actions[actionName].forEach(fn => fn(payload))
  }

  // 类的属性访问器
  get state() { // 获取实例上的state属性就会执行此方法
    return this.vm.state
  }

  registerModule(moduleName, module) {
    if (!Array.isArray(moduleName)) {
      moduleName = [moduleName]
    }
    this.modules.register(moduleName, module); // 数据格式化
    // 将模块安装
    installModule(this, this.state, moduleName, module.rawModule)
  }
}

const install = (_Vue) => {
  Vue = _Vue; // Vue的构造函数

  Vue.mixin({
    beforeCreate() {
      // 把父组件的store属性 放到每个组件的实例上
      if (this.$options.store) { // 根实例
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store
      }
    }
  })
}

// 辅助函数
export const mapState = (stateArr) => {
  let obj = {}

  stateArr.forEach(stateName => {
    obj[stateName] = function() {
      return this.$store.state[stateName]
    }
  })

  return obj
}

export const mapGetters = (gettersArr) => {
  let obj = {}
  
  gettersArr.forEach(getterName => {
    obj[getterName] = function() {
      return this.$store.getters.[getterName]
    }
  })

  return obj
}

// 这里只写了一种传对象的方式
export const mapMutations = (obj) => {
  let res = {}
  Object.entries(obj).forEach(([key, value]) => {
    res[key] = function(...args) {
      this.$store.commit(value, ...args)
    }
  })
}

export const mapActions = (obj) => {
  let res = {}
  Object.entries(obj).forEach(([key, value]) => {
    res[key] = function(...args) {
      this.$store.dispatch(value, ...args)
    }
  })
}


export default {
  Store,
  install
}
```