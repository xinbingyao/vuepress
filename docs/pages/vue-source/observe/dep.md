```javascript
let id = 0

class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }

  notify() {
    this.subs.forEach(watcher => watcher.update())
  }

  depend() {
    if (Dep.target) { // 为了防止直接调用depend
      Dep.target.addDep(this)
    }
  }
}

let stack = []
// 用来保存当前的watcher
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}

export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length-1]
}

export default Dep
```