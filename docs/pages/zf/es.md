### es6基础用法

```javascript
// es6规范 尽量不要使用var
// var导致的问题
// 1.重复声明的问题
var a = 1;
var a = 2;
// 2.变量提升的问题 ，在JS中导致变量提升有哪几种方式var function import
console.log(a) // undefined
var a = 1;
// 3.var 默认会把变量声明到全局上， let不会被声明到window，可以和{}代码块组合成一个作用域
{
  let a = 1;
}
console.log(a) // a is not defined

let a = 100;
{
  console.log(a); // ReferenceError: Cannot access 'a' before initialization  暂存死区
  let a = 1;
}
console.log(a);

// 4.var 是没有作用域的概念
for (var i = 0; i < 3; i++) { // 相当于在外面var一个i
  setTimeout(() => {
    console.log(i); // 3 3 3
  }, 0) // 在浏览器默认0， 代表不少于4ms执行
}

for (let i = 0; i < 3; i++) { // 相当于在括号内let一个i
  setTimeout(() => {
    console.log(i); // 0 1 2
  }, 0)
}

// 5.我们声明的变量有些是不需要更改的，但是可以随意更改
const PI = 3.14;
PI = 100; // Assignment to constant variable. 不能深度改变

const PI = { // 如果是引用空间， 可以修改空间的内容
  r: 3.14
}
PI.r = 100;
```

#### 解构赋值
```javascript
let [a, b] = [1, 2, 3]
let [, a, b] = [1, 2, 3]
// 与剩余运算符结合,只能用到最后一个参数中
let [, ...args] = [1, 2, 3]
console.log(args) // [2, 3]

// es6语法中默认值就是 =    通过 : 来改名字
let { name, age1= 0, age: age2 } = { name: 'zf', age: 10 }

let { b, ...obj } = { a: 1, b: 2, c: 3 }
```

#### set 集合
```javascript
// 数据结构：链表 队列 栈 集合 hash表 图 树
let arr1 = [1, 1, 2]
ler arr2 = [1, 2, 3, 4]
let set = new Set(arr1) // 集合不能有重复的项
console.log(set); // Set { 1, 2 }

let arr = [...arr1, ...arr2] // 展开运算符
let union = new Set(arr);
console.log(union); // Set { 1, 2, 3, 4 }

// 交集
function intersection(a, b) {
  let s1 = new Set(a);
  let s2 = new Set(b); // set 可以判断是否存在 用get，has方法
  // 什么叫类数组：有索引，有长度，有迭代器
  // [...s1] Array.from(s1) 区别：Array.from不借助自身的迭代器，而 ... 这种语法能展开的内容必须要有迭代器
  return [...s1].filter(item => {
    return s2.has(item)
    // 如果求差集
    // return !s2.has(item)
  })
}

console.log(intersection(arr1, arr2)); // [1, 2]

// 数组中的...是es6语法，而{...{}}对象中的...是es7语法
console.log([...{
  0: 1,
  1: 2,
  length: 2,
  [Symbol.iterator]:function * () {
    let idx = 0
    while(idx !== this.length) {
      yield this[idx++]
    }
  }
}])
```

#### map 映射表
```javascript
// map的key可以使任何值，不能放重复项
let map = new Map([ ['a',1], [{a:1}: {b:1}], [{a:1}: {b:1}] ])
console.log(map); // Map { 'a' => 1, { a: 1 } => { b: 1 } }

// map.forEach     ... set    get
map.set('b', 1);
map.get('b')

// WeakMap 不会导致内存泄漏
let a = {b: 1};
let m = new WeakMap(); // WeakMap WeakSet 表示都是弱引用 （key只能是个对象）
m.set(a, 100);
a = null
console.log(m);
```

#### 展开运算符
```javascript
let obj = { name: 'zf', age: 10 }
// 拷贝
let newObj = {...obj}
// 拷贝前和拷贝后没有关系的话，就是深拷贝
// 浅拷贝 表示拷贝后的结果，还有引用以前的引用空间

let arr = [1, 2, 3, [4]]; // 数组里如果放的是对象， slice方做到的是浅拷贝
let newArr = arr.slice(0);
newArr[3][0] = 100
console.log(arr); // [1, 2, 3, [100]]

// 如何实现深拷贝（使用递归）
// 特点1：考察当前数据类型校验，2：循环引用问题
let obj = null;
function deepClone(value, hash = new WeakMap) {
  if (value == undefined) {
    return value
  }
  // typeof 不是对象就是 string number boolean function
  if (typeof value !== 'object') {
    return value
  }
  if (value instanceof RegExp) {
    return new RegExp(value)
  }
  if (value instanceof Date) {
    return new Date(value)
  }
  let v = hash.get(value);
  if (v) { // 如果映射表中有，直接返回拷贝后的结果
    return v
  }
  // 对象 数组 拷贝
  // 这个instance就是拷贝后的结果，我希望将它先存依赖，下次如果再拷贝直接返回就好了
  let instance = new value.constructor; // new Object / new Array
  hash.set(value, instance) // 将拷贝前的和拷贝后的做一个映射表
  for(let key in value) { // 将当前对象中的数据拷贝到新的对象中
    if (value.hasOwnProperty(key)) {
      instance[key] = deepClone(value[key], hash)
    }
  }
  return instance
}

deepClone() // string number 基础类型  function 函数  拷贝的是对象（正则，日期。。。）或数组 undefined null

// 循环引用问题，如果当前这个对象已经被拷贝过了，就不要拷贝了
var b = {}
var a = {b: b}
b.a = a
let newObj = deepClone(a)
```

#### defineProperty（es5）
```javascript
// 劫持数据：修改原对象
let el = {
  _content: '',
  get html() {
    return this._content
  },
  set html(value) {
    console.log(value)
    this._content = value
  }
}

el.html = '123'

// Vue2中的写法
let obj = {}
let newA = undefined;
Object.defineProperty(obj, 'a', { // 当前定义属性石可以自己增加一些配置
  enumerable: false, // 可枚举 如果用es5来模拟es6的类，需要使用此方法
  configurable: false, // 能不能被配置，判断是否能被重新定义
  writable: true, // 如果有get和set，就不能有writable
  get() {
    return newA
  },
  set(value) {
    newA = value
  }
})

Vue.set(obj, 'a', 1)
// Object.freeze() 性能优化
let obj1 = Object.freeze({ a: 1}); // 当前被冻结后的对象不能再次被改写
Object.defineProperty(obj1, 'qqq', { // Cannot define property qqq, object is not extensible
  get() {},
  set() {}
}) 

// 数据劫持 Vue 要监控数据的变化，数据变化后需要更新视图
let data = { // 给所有属性都重新定义，增加get和set
  a: 1,
  b: 2,
  obj: { a: 1 }
}
const update = () => {
  console.log('update view') // 模拟更新视图
}
// 不支持数组，Array.push shift unshift pop reverse sort splice等
function defineReactive(target, key, value) {
  observer(value); // 如果是深层次，需要递归处理
  // 内部源码中会判断，如果不能修改，直接不会重新定义属性
  if (!Object.getOwnPropertyDescriptor(target, key).configurable) return
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue
      }
    }
  })
}
function observer(data) {
  if (typeof data !== 'object') {
    return
  }
  for (let i in data) {
    defineReactive(data, key, data[key])
  }
}

observer(data)
data.a = 100
console.log(data) // { a: [getter/setter] }
```

#### proxy 代理 + reflect 反射（es6）
```javascript
const update = () => {
  console.log('更新')
}

let handler = {
  get(target, key) {
    if (typeof target[key] === 'object') {

      return new Proxy(target[key], handler)
    }
    // return target[key];
    // Reflect能反射13种
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    console.log('set', key)
    let oldValue = target[key]
    console.log(oldValue, 'oldValue')
    if (oldValue !== value) {
      update();
      return Reflect.set(target, key, value) // 返回布尔值
    }
    return true
  }
}

// let obj = {
//   a: 1,
//   b: 2,
//   c: {
//     c: 100
//   }
// }
// 不需要掌握更新值的API， 可以代理不存在属性，而Vue2 defineProperty就不行，所以Vue3采用了Proxy
// let proxy = new Proxy(obj, handler)
// proxy.c = 100;

let obj = [1, 2, 3]
let proxy = new Proxy(obj, handler)
proxy.push('123'); // push '123' 后，会改length,要在最后返回一个true
// proxy.d = 100
// console.log(obj); // [ 1, 2, 3, d: 100 ]

// 以后所有对象Object的新方法都会放到 Reflect上，原有的方法也会迁移到Reflect上
let obj = Object.freeze({ a: 1})
let flag = Reflect.defineProperty(obj, 'c', {
  get() {
    return 100
  }
})
console.log(flag); // false
```