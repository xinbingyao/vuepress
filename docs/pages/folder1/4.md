发布 订阅

```javascript
const fs = require('fs')

let events = {
  dataSource: [],
  arr: [],
  on(callback) {
    this.arr.push(callback);
  }
  emit(data) {
    this.dataSource.push(data)
    this.arr.forEach(fn => fn(this.dataSource));
  }
}

events.on(function(result) { // 发布订阅可以实现解耦合
  if (result.length ===2 ) {
    console.log('订阅', result)
  }
})

fs.readFile('a.txt', 'utf8', function(err, data) {
  out(data)
})

fs.readFile('b.txt', 'utf8', function(err, data) {
  out(data)
})
```

```javascript
// 1.每个promise需要提供一个执行器函数（会立即执行）
// 2.new Promise会产生一个promise实例，这个实例上有一个then方法
// 3.executor中需要提供一个成功的方法和一个失败的方法

const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
// 判断x的值
const resolvePromise(promise2, x, resolve, reject) => {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise'))
  }
  let called
  // 判断x是普通值还是promise
  // 如果x不是对象也不是函数，则可能是string， null， undefined
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 如何判断一个对象是不是promise，promise必须要有then方法
    // 可能这个then方法在别人的promise中是通过defineProperty定义的，就可能会发生异常，那就让promise2变为失败
    try { 
      let then = x.then // 获取then方法
      if (typeof then === 'function') {
        // 这里的做法是只取一次then，防止别人在代码里设置了取then的操作，比如第二次取then时报错
        then.call(x, y => { 
          if (called) {
            return
          }
          called = true
          // 这里的意思是如果返回的是一个promise的话，调用这个promise的then方法时，会把值传入resolve和reject
          resolvePromise(promise2, y, resolve, reject) // 解析y，保证是一个普通值
        }, r => {
          if (called) {
            return 
          }
          called = true
          reject(r)
        }) 
      } else {
        // x有then属性，但是then不是方法，而是一个对象或者其他的，所以x不是promise，则变为成功态
        resolve(x)
      }
    } catch(e) {
      if (called) {
        return
      }
      called = true
      // x是对象或者函数，但是没有then方法，则变为失败态
      reject(e)
    }
  } else {
    // x是一个普通值，则变为成功态
    resolve(x)
  }
}

class Promise {  
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onResolvedCallbacks = [] // 存储成功的回调
    this.onRejectedCallbacks = []

    let resolve = (value) => { // value 有可能是一个promise
      if (value instanceof Promise) { // 只能判断他是自己的promise
        return value.then(resolve, reject) // 递归
      }
      if (this.status === PENDING) {
        this.status = RESOLVED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch(err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected)  {
    // 此处是当.then不传参数时的处理，如果一直.then且没有传入函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    // 每次调用then的时候，都返回一个新的promise（我叫promise2）
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            // 判断x的类型，是普通值，还是promise，还是错误
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch(e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value); // AOP切片
              resolvePromise(promise2, x, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  catch(errCallback) { // 没有传入成功的then方法就是catch原理
    return this.then(null, errCallback)
  }

  finally(callback) {
    // finally就是一个then方法
    return this.then((data) => Promise.resolve(callback()).then(() => data), (err) => Promise.resolve(callback()).then(() => { throw err }))
  }

  static resolve(value) { // 如果里面传入的值是一个promise，那么会等待这个promise执行完成
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }

  static reject(value) { // 直接将原因向下抛出，没有等待的效果
    return new Promise((resolve, reject) => {
      reject(value)
    })
  }

  static all(promises) { // 参数可以是promise，也可以是普通值
    return new Promise((resolve, reject) => {
      let resultArr = []
      let idx = 0
      const processData = (data, index) => {
        resultArr[index] = data
        if (++idx === promises.length) {
          resolve(resultArr)
        }
      }
      for(let i = 0; i < promises.length; i++) {
        let currentValue = promises[i]
        if (typeof currentValue.then === 'function') {
          currentValue.then(data => {
            processData(data, i)
          }, reject)
        } else {
          processData(currentValue, i)
        }
      }
    })
  }

  static race(promises) { // 赛跑谁最快就用谁的结果，可以做promise中断处理
    // 谁先成功就用谁，哪个失败就用哪个
  }
}

var p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('有钱了')
  }, 1000)
})

p.then((data) => {
  console.log(data)
}, (err) => {
  console.log(err)
})

console.log(2)

```

promise中的链式调用（核心）
```javascript
let fs = require('fs')

let { promisify } = require('util') // node里的一个包

let promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, data) {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}

function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

read('./a.txt', 'utf8').then(data => {
  console.log(data)
}, err => {
  console.log(err)
})

// promise特性， then方法连个函数返回值可以返回一个promise
read('./a.txt', 'utf8').then(data => {
  return read(data, 'utf8')
}, err => {
  console.log(err)
}).then(data => {
  console.log(data)
}, err => {
  console.log(err)
})

read('./a.txt', 'utf8').then(data => {
  return read(data, 'utf8')
}).then(data => {
  console.log(data)
}).catch(err => {
  console.log('err', err) // 专门用来捕获错误，第一步和第二步都能捕获
})

// 如果自己有捕获错误，他就不会找catch
// 这个函数还可以返回普通值，只要不是error，不是promise 都叫普通值，会将这个值作为下一次then的结果
read('./a.txt', 'utf8').then(data => {
  return read(data, 'utf8')
}, err => {
  console.log('自己的错误')
  // return undefined
  // throw new Error('error')
}).then(data => {
  console.log(data)
}).catch(err => {
  console.log('err', err)
}).then(data => {
  console.log(data)
})

// promise如果返回一个错误，调用自己的err,如果没有自己的err,会找catch，catch执行完后，默认返回undefined，会进入下一次then方法，undefined作为值传递给函数

```


#### 第一次promise.then之后，返回普通值的情况  (还有promise 、错误)
```javascript
// 链式调用的实现， 是每一次都返回一个新的promise
let promise = new Promise((resolve, reject) => {
  resolve()
})

let promise2 = promise.then(() => {
  return 1000
})

promise2.then(data => {
  console.log(data) // 1000
})
```

```javascript
let promise = new Promise((resolve, reject) => {
  resolve()
})

// then中的成功功函数是异步执行，这时候Promise2就产生了，这时候会循环引用的错误
let promise2 = promise.then(() => {
  return promise2
})

promise2.then(() => {
  console.log('成功')
}, err => {
  console.log(err)
})
```

#### 第一次promise.then，返回promise的情况
```javascript
let promise = new Promise((resolve, reject) => {
  resolve()
})

let promise2 = promise.then(() => {
  // // x是一个普通值
  // return 1000
  // x是一个promise
  return new Promise((resolve, reject) => {
    resolve('ok')
    // reject('fail')
  })
  // x是一个错误
})

promise2.then((data) => {
  console.log(data) // 1000 或 'ok'
})
```

```javascript
// 穿透
let promise = new Promise((resolve) => {
  resolve(100)
})

promise.then().then().then(data => {
  console.log(data) // 100
})
```

#### promise规范测试
```javascript
// promises-aplus-tests 有一个入口 promises-aplus-tests + 文件名
Promise.defer = Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd
}
```

#### 解决嵌套问题
```javascript
// 解决了上面的那个read函数里面还有嵌套的写法
function read(...args) {
  // 延迟对象
  let dfd = Promise.defer()
  fs.readFile(...args, function(err, data) {
    if (err) {
      dfd.reject(err)
    }
    dfd.resolve(data)
  })
  return dfd.promise
}

read('a.txt', 'utf8').then(data => {
  console.log(data)
})
```

#### finally es9语法 只能在高版本node中使用
```javascript
Promise.resolve(100).finally(() => { // 如果finally返回一个promise，那么会等待这个promise执行完成
  console.log('成功')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('123')
    }, 5000)
  })
}).then(data => {
  console.log(data)
})

Promise.reject(100).finally(() => {
  console.log('成功')
}).catch(data => {
  console.log(data)
})
```

#### all
```javascript
const fs = require('fs').promises // node10以上才支持
fs.readFile('a.txt', 'utf8').then(data => {
  console.log(data)
})
// Promise.all全部成功才成功，如果有任何一个失败了就会执行失败的逻辑
Promise.all([fs.readFile('a.txt', 'utf8'), fs.readFile('b.txt', 'utf8'), 2, 3, 4]).then(data => {
  console.log(data)
}, err => {
  console.log(err)
})

```

