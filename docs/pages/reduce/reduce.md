- reduce 收敛函数(可以把数组n项收敛成一个结果)

```javascript
let r = [1, 2, 3, 4, 5].reduce((previousValue, currentValue, currentIndex, arr) => {
  return previousValue + currentValue
}); // reduce的初始值， 会把这个值传递给previousValue， 如果数组为空，则直接将结果返回
console.log(r)
```

- 求平均数
```javascript
let r1 = [
  { score: 1 },
  { score: 2 },
  { score: 3 },
  { score: 4 }
].reduce((previousValue, currentValue, currentIndex, arr) => {
  if (arr.length - 1 === currentIndex) {
    return (previousValue + currentVlaue.score) / arr.length
  }
  return previousValue + currentValue.score
}, 0)
```

- 数组扁平化
```javascript
[1, [2, [3, [4, [5]]]]].flat(2) // es7语法，参数为展开层数

function flatten(arr) {

  arr.reduce((previousValue, currentValue, currentIndex, arr) => {
    if (Array.isArray(currentValue))) {
      return previousValue.concat(flatten(currentValue)); 
    } else {
      previousValue.push(currentValue)
    }
    return previousValue
  }, [])
}

flatten([1, [2, [3, [4, [5]]]]])
```

- 合并为对象
```javascript
let keys = ['name', 'age']
let values = ['zf', 10]
keys.reduce((previousValue, currentValue, currentIndex, arr) => {
  previousValue[currentValue] = values[currentIndex]
  return previousValue
}, {})

// 逗号运算符
keys.reduce((previousValue, currentValue, currentIndex, arr) => (
  previousValue[currentValue] = values[currentIndex]
  , previousValue
), {})
```

- compose redux 中间件 将多个函数 组合成一个函数
```javascript
function sum(a, b, c) {
  return a + b + c;
}

function addCurrency(value) {
  return '$' + value;
}

function len(value) {
  return value.length
}

len(addCurrency(sum('a', 'b', 'c'))); // 这种写法太恶心了

function compose(...fns) {
  return function(...values) {
    let lastFn = fns.pop();
    return fns.reduceRight((prev, current) => {
      return current(prev)
    }, lastFn(...values))
  }
}

// 简化
const compose = (...fns) => (...values) => fns.reduceRight((prev, current) => current(prev), fns.pop()(...values))

function compose(...fns) {
  return fns.reduce((prev, next) => {
    return function(...values) {
      return prev(next(...values))
    }
  })
}

let result = compose(len, addCurrency, sum)('a', 'b', 'c')
// 核心就是收敛
```
- 箭头函数  没有this 没有arguments 没有原型
```javascript
let a = 1;
let obj = {
  a: 100,
  fn() {
    console.log(this.a); // 100
  },
  fn() {
    setTimeout(function() {
      console.log(this.a); // undefined， window.setTimeout，this为window
    })
  },
  fn() {
    // this => obj
    setTimeout(() => {
      console.log(this.a); // 100
    })
  },
  fn: () => {
    setTimeout(() => {
      console.log(this.a); // undefined
    })
  },
  
}

obj.fn()
```