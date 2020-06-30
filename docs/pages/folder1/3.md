js最核心的技能回调函数  
高阶函数（函数当做参数传递给另一个函数）函数返回另一个函数  
检测数据类型 typeof  Object.prototype.toString.call()不能判断实例 instanceof construcotr  

```javascript
// 属性私有化
// 闭包 函数执行的时候，会生成一个不销毁的内存空间, 不在定义的作用域执行
function isType(type) {
  return function(content) {
    return Object.prototype.toString.call(content) === `[object ${type}]`
  }
}

// 柯里化
let isString = isType('String')
console.log(isString('123'))

let utils = {}
['String', 'Boolean', 'Undefined'].forEach(type => {
  utils['is' + type] = isType(type)
})

// 作业 函数柯里化（写成一个通用格式）函数的反柯里化
let isString = currying(isType, 'String')

```

```javascript
// 我们希望在原有的功能上增加一些方法

function say(who) {
  console.log(who + 'say')
}

Function.prototype.before = function(callback) {

  return (...args) => { // 剩余运算符
    callback()
    this(...args) // 把数组展开，传入
  }
}

let fn = say.before(function() { // AOP 面向切片
  console.log('before say')
})

fn('小狗');  // 'before say'  'say'
// 可以用来一些方法的重写，函数劫持，比如Vue中的数组方法的重写

```

```javascript
const fs = require('fs')

function after(fn, times) {
  let arr = []
  return function (data) {
    arr.push(data)
    if (--times === 0) {
      callback(arr)
    }
  }
}

function fn(arr) {
  console.log(arr)
}

let out = after(fn, 2)

fs.readFile('a.txt', 'utf8', function(err, data) {
  out(data)
})

fs.readFile('b.txt', 'utf8', function(err, data) {
  out(data)
})
```
