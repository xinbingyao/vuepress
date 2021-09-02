```javascript
export function createRoute(record, location) {
  let res = [] // 如果匹配到了路径 需要将这个路径放进来
  if (record) {
    while(record) {
      res.unshift(record)
      record = record.parent
    }
  }
  return {
    ...location,
    matched: res // 路径匹配结果
  }
}

function runQueue(queue, iterator, callback) {
   function step(index) {
     if (index == queue.length) return callback(); // 调用路由更新逻辑
     let hook = queue[index]
     iterator(hook, () => step(index+1))
   }

   step(0)
}

class History {
  constructor(router) {
    this.router = router
    this.current = createRoute(null, {
      path: '/' // 默认路由就是/
    })
  }
  transitionTo(location, callback) { // 最好屏蔽一下 如果多次调用 路径相同不需要跳转
    // 需要根据路径获取到对应的组件
    let r = this.router.match(location)

    // 为了保证不会多次触发页面更新，相同路由
    if (location == this.current.path && r.matched.length == this.current.matched.length) {
      return
    }

    callback && callback()
    // 在更改路径之前，需要执行钩子
    let queue = this.router.beforeEachs
    const iterator = (hook, next) => {
      // 钩子，from, to, next
      // 调用用户的方法 传入next， 用户会手动调用next方法
      hook(this.current, r, next)
    }
    runQueue(queue, iterator, () => {
      this.updateRoute(r, callback)
    })


    
  }

  updateRoute(r) {
    // 将当前路径进行更新
    this.current = r
    // 路径一变，需要更新，视图会重新渲染
    this.cb && this.cb(r)
    
  }

  setupListener() {
    window.addEventListener('hashchange', () => {
      this.transitionTo(window.location.hash.slice(1));
    })
  }

  listen(cb) {
    this.cb = cb
  }
}

export default History
```