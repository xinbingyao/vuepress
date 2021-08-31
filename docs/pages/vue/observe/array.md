```javascript
import { observe } from './index'

let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push',
  'shift',
  'pop',
  'unshift',
  'reverse',
  'splice',
  'sort'
]

export function observerArray(inserted) {
  // console.log(inserted, 'observerArray')
  for (let i = 0; i < inserted.length; i++) {
    observe(inserted[i])
  }
}

export function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let currentItem = value[i]; // 有可能也是一个数组
    currentItem.__ob__ && currentItem.__ob__.dep.depend();
    if (Array.isArray(currentItem)) { // 递归收集，如果数组嵌套数组一直嵌套
      dependArray(currentItem)
    }
  }
}


methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    let result = oldArrayProtoMethods[method].apply(this, args) // aop 切片编程
    
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }


    if (inserted) {
      observerArray(inserted)
    }

    console.log('调用了数组更新的方法了')
    this.__ob__.dep.notify(); // 通知视图更新
    return result
  }
})
```