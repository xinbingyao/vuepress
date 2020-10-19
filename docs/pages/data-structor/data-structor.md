// js中的数据结构 队列 栈 hash表(key => value)  图 树 链表 集合

- 队列
  先进先出  数组  .push   .shift

- 栈
  先进后出  .push  .pop
  js函数的执行，就是典型的栈结构
```javascript
  function a() {
    function b() {
      function c() {

      }
      c()
    }
    b()
  }
  a()
```
执行上下的文的创建和销毁是一个栈结构
![desc](/function.jpg)

- hash表
  map es6 可以有一个key 查找快
  set 可以放不重复的项

- 图
  邻接表 来表示
  ![desc](/tu.jpg)

- 树
  二叉树 红黑树 平衡树

- 链表
  单向链表
  ```javascript
  class Node {
    constructor(element) {
      this.element = element
      this.next = null
    }
  }

  class LinkList {
    constructor() {
      this.head = null
      this.length = 0
    }
    append(node) {
      if (!this.head) {
        this.head = node
      } else {
        let current = this.head
        while (current.next) {
          current = current.next
        }
        current.next = node
      }
      this.length++
    }
  }

  let ll = new LinkList()
  ll.append(3);
  ll.append(4)
  ```