#### 传送门 teleport

- to 属性可以设置为body，也可以设置为 #hello 这种的，会把里面的元素插入到 to元素里面
- 例子就是蒙层的实现
```html
<template>
  <teleport to="body">
    <div class="mask"></div>
  </teleport>
</template>
```
```javascript
app.config.globalProperties.name = 'hello'

// toRefs 可以结构对象，对里面的属性代理
// toRef 是可以对对象不存在的属性代理
// watchEffect 立即执行， 不需要传递侦听内容，自动感知，不能获取之前的值
setup() {
  const { ref, reactive, toRefs, toRef, computed, watch, watchEffect,
  onRenderTracked,
  onRenderTriggered,
  onBeforeMount
  onMounted,
  provide,
  inject
  } = Vue
  const age = toRef(obj, 'age')

  // 惰性
  watch([() => nameObj.name, () => nameObj.haha], ([newName, newHaha], [oldName, oldHaha]) => {

  }, {
    immediate: true
  })

  watch(name, () => {

  })

  const stop = watchEffect(() => {
    console.log(name)
    setTimeout(() => {
      stop()
    }, 5000)
  })
}
```

