// js运行机制 同步 异步
// js 从上到下执行

// js 执行一个script脚本的时候 宏任务 样式渲染
- 异步代码肯定会在同步代码之后执行 当前定时器 存放的队列也是一个宏任务
```javascript
setTimeout(() => {
  console.log('ok')
}, 1000)

for (;true;) {

}
// 上面代码OK永远不会打印
```

- 默认主线只有一条 执行js的时候只能同时执行一个(单线程) 异步方法也是会创建一个线程的
// 进程 计算机分配任务和调度任务的基本单位
// 一个进程中可以放多个线程 js 的主线程只有一个

// 事件环
```javascript
// 宏任务
setTimeout(() => {
  console.log(1)
}, 1000)

setTimeout(() => {
  console.log(2)
}, 1000)

setTimeout(() => {
  console.log(3)
}, 1000)

// 微任务 js主栈执行完之后执行， 有一个微任务队列
Promise.resolve().then(() => {
  console.log('then')
})

// 先清空微任务 在去从宏任务队列中取出一个来执行
```
![desc](/eventloop.jpg)

[浏览器事件环](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

## 宏任务 微任务
- 微任务：promise.then MutationObserver process.nextTick(Node)
- 宏任务：script ajax 事件 requestFrameAnimation setTimeout setInterval setImmediate (ie下) MessageChannel I/O  UI rendering

```javascript
setTimeout(() => {
  console.log('timeout')
  Promise.resolve().then(data => {
    console.log('then1')
  }).then(data => {
    console.log('then4')
  })
  Promise.resolve().then(data => {
    console.log('then2')
  })
  Promise.resolve().then(data => {
    console.log('then3')
  })
}, 0)

Promise.resolve().then(data => {
  console.log('then')
  setTimeout(() => {
    console.log('timeout1')
  })
})
// then timeout then1 then2 then3 then4 timeout1

// 默认会执行当前脚本 先把脚本执行完毕后 取出所有的微任务进行处理，处理完毕后，从宏任务获取第一个任务执行，第一个宏任务执行完毕，会再次清空微任务，再一次去取宏任务
```

Vue.nextTick() 延迟执行某个函数(异步API 可以等待同步代码都执行完毕后 再去执行这里的回调)
Vue的特点 异步更新数据 会在当前代码执行完毕后 把更新(异步)操作 放到队列中