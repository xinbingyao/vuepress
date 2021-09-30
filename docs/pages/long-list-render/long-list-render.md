## 超长列表渲染性能优化

![desc](/queue.jpg)

```html
<script>
  for (let i = 0; i < 10000; i++) {
    let li = document.createElement('li')
    document.body.appendChild(li)
  }
</script>
```

- 分片
缺点：会导致页面dom元素过多 造成页面的卡顿
```html
<script>
  let total = 10000
  let index = 0; // 偏移量
  let id = 0; // 递增内容
  function load() {
    index += 20
    if (index < total) {
      // setTimeout 也行
      requestAnimationFrame(() => {
        let fragment = document.createDocumentFragment()
        for (let i = 0; i < 20; i++) {
          let li = document.createElement('li')
          li.innerHTML = id++
          fragment.appendChild(li)
        }
        container.appendChild(fragment)
        load()
      })
    }
  }
  load()
</script>
```

- 只渲染当前的可视区域

keywords: scrollTop start end offset visibleData viewport scroll-bar scroll-list

