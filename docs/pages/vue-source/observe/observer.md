```javascript
import { observe } from './index.js'
import { arrayMethods, observerArray, dependArray } from './array.js';
import Dep from './dep.js';

export function defineReactive(data, key, value) {
  let childOb = observe(value); // 递归观察
  // console.log(childOb, '<<<<<<<<<<childOb')
  let dep = new Dep(); // dep可以收集依赖，收集的是watcher
  Object.defineProperty(data, key, {
    get() { // 只要对这个属性进行了取值操作，就会将当前的watcher存入进去
      if (Dep.target) {
        // debugger;
        dep.depend(); // 让dep中存watcher，我还希望让这个watcher中也存放dep，实现一个多对多的关系
        if (childOb) { // 数组的依赖收集
          childOb.dep.depend(); // 数组也收集了当前渲染watcher
          dependArray(value); // 收集儿子的依赖
        }
      }
      console.log('获取数据')
      return value
    },
    set(newValue) {
      console.log('设置数据')
      if (value === newValue) return
      observe(value); // 如果设置的值是一个对象，也是要观察的
      value = newValue
      dep.notify()
    }
  })
}

class Observer { // es6类
  constructor(data) { // data 就是定义的vm._data
    // console.log(data, '----observer constructor------')
    this.dep = new Dep(); // 此dep专门为数组而设定
    Object.defineProperty(data, '__ob__', {
      get: () => this
    })
    if (Array.isArray(data)) { // 如果是数据，需要重写push等方法
      data.__proto__ =  arrayMethods // 通过原型链来查找重写的方法
      // 当调用数组的方法时，手动通知
      observerArray(data); // 观察数据中的每一项
    } else {
      // console.log('是对象')
      this.walk(data)
    }
    
  }

  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i< keys.length; i++) {
      let key = keys[i]
      let value = data[key]
      defineReactive(data, key, value)
    }
  }
}



export default Observer
```