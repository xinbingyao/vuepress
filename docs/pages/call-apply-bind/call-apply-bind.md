- call
  改变this指向   让函数执行
```javascript
function fn() {
  console.log(this, arguments)
}

Function.prototype.call = function(thisValue, ...args) {
  if (typeof thisValue !== 'object') {
    thisValue = new Object(thisValue)
  };
  let context = this; // context 就是 fn
  thisValue.f = context;
  thisValue.f(...args); // 就是将当前的this 挂载到需要改变的this指向上
  delete thisValue.f;
}
fn.call(1, 2, 3, 4, 5)

function fn2() {
  console.log('fn2')
}

// 多次.call后的结果是？
fn.call.call.call(fn2);
// fn.call.call.call(fn2) === call.call(fn2)
fn.call找的是原型上的call方法，多次.call还是call方法，最后相当于是call方法点call里传了fn2，--> this为fn2，--> fn2.f = fn2  --> fn2.f()，其实就是让fn2执行
```


- apply
  和call的区别主要是在参数上，apply可以传递数组
```javascript
Function.prototype.apply = function(thisValue, args) {
  if (typeof thisValue !== 'object') {
    thisValue = new Object(thisValue)
  };
  let context = this; // context 就是 fn
  thisValue.f = context;
  thisValue.f(...args); // 就是将当前的this 挂载到需要改变的this指向上
  delete thisValue.f;
}

function fn() {
  console.log(this, arguments);
}
// 如果fn上面也有apply方法，那么怎么执行原型上的apply方法呢？
fn.apply = function() {
  cosnole.log('inner apply')
}
// 先.call改变apply函数里的this指向为fn,执行apply方法， 把后面的参数传给apply, 把fn挂载到1上，再执行fn(传递[2,3,4])
Function.prototype.apply.call(fn, 1, [2, 3, 4]) // 老写法
Reflect.apply(fn, 1, [2, 3, 4]) // 新写法
```

- bind的作用 返回一个新的函数并且可以改变this指向
```javascript
function fn(...args) {
  console.log(this, args)
}

Function.prototype.bind = function(thisValue, ...args) {
  if (typeof thisValue !== 'object') {
    thisValue = new Object(thisValue)
  };
  thisValue.f = this
  return function(...values) {
    thisValue.f(...args, ...values);
  }
}


let bindFunc = fn.bind(1, 2)
bindFunc = bindFunc.bind(5)
bindFunc(3)
// this是啥？ 1 永远是第一次bind的时候的this

```