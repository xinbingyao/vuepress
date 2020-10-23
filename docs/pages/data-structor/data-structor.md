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
  二叉搜索树
  ```javascript
  class Node {
    constructor(element) {
      this.element = element;
      this.left = null;
      this.right = null
    }
  }

  class Tree {
    constructor() {
      thsi.root = null
    }
    insertTree(root, node) {
      if (node.element < root.element) {
        if (!root.left) {
          root.left = node
        } else {
          this.insertTree(root.left, node)
        }
      } else {
        if (!root.right) {
          root.right = node
        } else {
          this.insertTree(root.right, node)
        }
      }
    }
    append(element) {
      let node = new Node(element)
      if (!this.root) {
        this.root = node
      } else {
        this.insertTree(this.root, node)
      }
    }
  }

  let tree = new Tree()
  tree.append(100)
  tree.append(20)
  tree.append(80)
  tree.append(30)
  tree.append(60)
  console.dir(tree. { depth: 100 })

  // 树的遍历：广度 深度
  ```

- 链表 
  单向链表(简版)
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
    removeAt(idx) {
      let i = 0;
      let current = this.head; // 从头开始找
      let prev = null
      if (idx === 0) {
        this.head = this.head.next
      } else {
        while(i++ < idx) {
          prev = current
          current = current.next
        }
        prev.next = current.next
      }
      this.length--
    }
    insertAt(idx, element) {
      let node = new Node(element);
      if (idx === 0) {
        let oldHead = this.head;
        this.head = node
        this.head.next = oldHead
      } else {
        let i = 0;
        let current = this.head
        let prev = null
        while (i++ < idx) {
          prev = current
          current = current.next
        }
        prev.next = node
        node.next = current
      }
      this.length++
    }
  }

  let ll = new LinkList()
  ll.append(3);
  ll.append(4);

  ll.removeAt(1);
  ll.insertAt(1, 100);
  console.dir(ll,{ depth: 1000 })
  ```