#### js垃圾回收机制
```javascript
let obj = {}
obj = null

// weakMap 弱引用
function Fn() {}
let f = new Fn
let map = new WeakMap()
map.set(f, '123')
f = null
```
- js是自动内存管理，内存限制64位约1.4G，32位约0.7G
- 指代的是新生代和老生代的总大小，64位系统新生代大小为32M，老生代为1400M
- 新生代主要使用Scavenge进行管理，新生代分为from和to两个空间，开始回收的时候会检查from中的存活对象，如果存活拷贝到to中，之后互换
- 老生代主要采用Mark-Sweep(标记清除，可能会导致内存碎片的问题)和Mark-Compact(标记整理，将活着的对象移动到左侧，速度慢)
