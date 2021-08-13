#### 生成器 如何解决异步编程 * yield

```javascript
// 生成的是迭代器，返回的结果是一个对象
function * read() {
  yield 1;
  yield 2;
  return 'ok'
}

let it = read()
let r = it.next() // 迭代一次，让函数执行，碰到yield就停止，返回的结果是一个对象={ value, done }
console.log(r) // { value: 1, done: false }
r = it.next()
console.log(r) // { value: 2, done: false }
r = it.next()
console.log(r) // { value: 'ok', done: true }
```

```javascript
function * read() {
  let a = yield 1;
  console.log(a)
  let b = yield 2;
  console.log(b)
}

let it = read()
it.next() // next方法第一次传递参数是无效的
it.next('hello') // 这次next传递的值会作为上一次yield的返回值，所以此时a = 'hello'
it.next('world') // 这次next传递的值会作为上一次yield的返回值，所以此时b = 'world'
```

```javascript
let fs = require('fs').promises
function * read() {
  try {
    let content = yield fs.readFile('./content.txt', 'utf8');
    let age = yield fs.readFile(content, 'utf8');
    return age
  } catch(e) {
    console.log(e)
  }
}

let it = read()
let { value } = it.next()
value.then(data => {
  let { value } = it.next(data)
  value.then(data => {
    let r = it.next(data)
    console.log(r.value) // 18
  })
})

// 但是这种又变成以前的嵌套了，so...

let co = require('co')
// co的参数是一个迭代器， co内部是基于promise的写法
co(read()).then(data => {
  console.log(data) // 18
})

// 自己写一个co
function co(it) {
  return new Promise((resolve, reject) => {
    function next(val) { // 异步迭代需要借助next函数
      let { value, done } = it.next(val)
      if (done) { // 如果迭代完成，就将结果作为这个promise的结果就可以了
        resolve(value)
      } else {
        Promise.resolve(value).then(y => {
          next(y) // 当第一个promise执行完毕后，继续迭代下一个promise
        }, (err) => {
          it.throw(err)
          // reject(err)
        })
      }
    }
    next()
  })
}
```

#### async + await = generator + co  语法糖
```javascript
async function read() {
  try {
    let content = await fs.readFile('./content.txt', 'utf8');
    let age = await fs.readFile(content, 'utf8');
    return age
  } catch(e) {
    console.log(e)
  }
}

read().then(data => {
  console.log(data) // 18
})
```

