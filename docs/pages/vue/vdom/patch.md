```javascript
export function render(vnode, container) {
  // console.log(oldVnode, container)
  let el = createElm(vnode)
  container.appendChild(el)
  return el
}

function createElm(vnode) {
  const { tag, children, props, key, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      render(child, vnode.el)
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.props || {}
  let el = vnode.el

  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  // 稍后会用到这个更新操作 主要的作用就是 根据新的虚拟节点 来修改dom元素
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  // 如果下次更新时 应该用新的属性来 更新老的节点
  // 如果老的中有属性 新的中没有
  for (let key in oldProps) {
    if (!newProps[key]) {
      delete el[key]
    }
  }

  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      console.log(key)
      el[key] = newProps[key]
    }
  }

}


export function patch(oldVnode, newVnode) {
  // 先对比 标签不一样
  if (oldVnode.tag !== newVnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
  }

  // 标签一样了，如果就节点没有tag，则是文本
  if (!oldVnode.tag) {
    if (oldVnode.text !== newVnode.text) {
      oldVnode.el.textContent = newVnode.text
    }
  }

  // 标签一样，属性不一样
  let el = newVnode.el = oldVnode.el
  updateProperties(newVnode, oldVnode.props) 

  // 比较孩子
  let oldChildren = oldVnode.children || []
  let newChildren = newVnode.children || []
  // console.log(oldChildren, newChildren)
  if (oldChildren.length > 0 && newChildren.length > 0) {
    updateChildren(el, oldChildren, newChildren)
  } else if (oldChildren.length > 0) { // 老的有孩子，新的没孩子
    console.log(11111111)
    el.innerHTML = ''
  } else if (newChildren.length > 0) { // 老的没孩子，新的有孩子
    for (let i = 0; i < newChildren.length; i++) {
      let child = newChildren[i]
      el.appendChild(createElm(child))
    }
  }

  return el
}

function isSameVnode(oldVnode, newVnode) {
  return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

function updateChildren(parent, oldChildren, newChildren) {
  // vue增加了很多优化策略，因为在浏览器中最常见的操作dom为开头或结尾插入

  let oldStartIndex = 0
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  function makeIndexByKey(children) {
    let map = {}
    children.forEach((item, index) => {
      map[item.key] = index
    })
    return map
  }

  let map = makeIndexByKey(oldChildren)
  // console.log(map)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
    } else if (isSameVnode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode); // 用新的属性来更新老的属性, 而且还要递归比较儿子
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode); 
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 老的首和新的尾一样 abcd dcba
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 老的尾和新的首一样 abcd  dabc
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 两个列表 乱序 不复用
      // 会先拿新节点的第一项 去老街店中匹配  如果匹配不到直接将这个节点插入到老节点开头的前面，如果能查到，则直接移动老节点到指针的前面
      // 可能老节点中还有剩余 则直接删除老节点中剩余的属性
      let moveIndex = map[newStartVnode.key]
      if (moveIndex == undefined) {
        // 没找到
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = undefined
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, newStartVnode)
      }
      newStartVnode = newChildren[++newStartIndex]
      
    }
  }

  // 说明新节点还有剩余，需要将剩余的插入
  if (newStartIndex <= newEndIndex) { 
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // console.log(createElm(newChildren[i]), '00000000000000')
      let ele = newChildren[newEndIndex+1] == null ? null : newChildren[newEndIndex+1].el
      // insertBefore第二个参数传null，为在最后插入
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }

  // 乱序剩余的删除
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child != undefined) {
        parent.removeChild(child.el)
      }
    }
  }

  // 循环 尽量不要使用索引作为key 可能会导致重新创建当前元素的所有子元素
}
```