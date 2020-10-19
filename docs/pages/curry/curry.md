// 函数柯里化 让函数变得更具体一些

```javascript
function add(a, b, c, d) {
  return a + b + c +d
}

function currying(fn, ...args) {
  if (fn.length === args.length) {
    return fn(...args)
  } else {
    return function(...values) {
      let newArgs = [...args, ...values]
      return currying(fn, ...newArgs);
    }
  }
}

let fn = currying(add, 1, 2)
let newFn = fn(3)
console.log(newFn(4));
// let fn = currying(add, 1, 2, 3, 4);
// console.log(fn);
```

// 反柯里化 让函数的应用范围 变得更广一些
```javascript
function unCurrying(fn) {
  return function(thisValue, ...args) {
    return Function.prototype.apply.call(fn, thisValue, args)
  }
}

let toString = unCurrying(Object.prototype.toString);
console.log(toString('hello'))
```


