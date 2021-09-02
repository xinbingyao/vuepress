## 组件

- 为什么要组件化开发  可以抽离组件实现复用的效果
- 可以方便维护代码
- 可以组件级别更新 给每一个组件都添加一个watcher
- 能抽离成单个组件就尽量抽离 可以减少更新

```javascript
// 构建一个子类，返回的是一个构造器 f VueComponent(options) { this._init(options) }
let Ctor = Vue.extend({
  template: '<div>{{msg}}</div>',
  data() { // data必须是一个函数，为了防止组件之间的数据互相引用
    return {
      msg: 'hello'
    }
  }
})

// 可以手动挂载组件
document.body.appendChild(new Ctor().$mount().$el);

// Vue.component 会调用Vue.extend方法
Vue.component('my-component', Ctor)

```

### 组件间通信

- 数据传递的关系： 父子传递、子父传递、平级通信、跨级通信

#### 父子传递
  props可以传属性和方法，子组件给函数传值，父组件拿到值做处理
  还可使用$emit $on 来实现绑定事件（v-model：value+input的语法糖，也可以自定义v-model)
  .sync（也是一个语法糖）
```html
// 父组件
<template>
  <son :num="num" @click="handleClick"></son>

  <son :num="num" @update:money="val => num = val"></son>
  <!-- 等价于上面 -->
  <son :num.sync="num" ></son>
</template>

<script>
  export default {
    data() {
      return {
        num: 1
      }
    },
    methods: {
      handleClick(value) {
        // do something
        this.num += value // 3
      }
    }
  }
</script>

// 子组件内
<template>
  {{ num }}
  <button @click="change"></button>
</template>

<script>
  export default {
    props: {
      num: {
        type: Number
      }
    },
    methods: {
      change() {
        this.$emit('click', 2)
        // .sync
        this.$emit('update:num', 2)
      }
    }
  }
</script>
```

#### 跨级通信
父子孙：
1）在父组件中提供，在子组件中注入，会造成单向数据流混乱 自己实现工具库的话，可以采用这个方式
尽量不要直接更改父组件的数据
```html
// 父组件
<script>
  export default {
    provide() { // 提供者
      return {
        parent: this // 直接将这个组件暴露出去
      }
    }
  }
</script>

// 子组件
<template>
  {{ parent.num }}
</template>

<script>
  export default {
    inject: ['parent']
  }
</script>
```

2）$parent（父组件） $children（子组件） 可以直接出发儿子的事件或者父亲的事件
```html
// 父组件
<template>
  <son @haha="haha"></son>
</template>

// 孙子组件
<template>
  <button @click="$parent.$emit('haha', 'hello')"></button>
</template>
```

```javascript
// 如果有很多子组件嵌套，就会产生$parent.$parent...这种写法，所以element-ui实现了$dispatch
Vue.prototype.$dispatch = function(eventName, componentName, value) {
  let parent = this.$parent
  while (parent) {
    if (parent.$options.name === componentName) { // 触发指定的父级
      parent.$emit(eventName, value); // 没有绑定触发，不会有任何影响
      break;
    }
    parent = parent.$parent
  }
}

// 上下传递 $broadcast
Vue.prototype.$broadcast = function(eventName, componentName, value) {
  // 需要找到所有儿子组件进行触发
  let children = this.$children // 数组
  function broadcast(children) {
    for (let i = 0; i < children.length; i++) {
      if (componentName === child.$options.name) {
        child.$emit(eventName, value)
        return
      } else {
        if (child.children) {
          broadcast(child.$children)
        }
      }
    }
  }
}

```


### $attrs $listeners 表示的是所有的属性和方法的合集

- $attrs和props是互斥的，如果在props里用了，attrs里就会减少，$attrs是响应式的，父亲变了，数据也会更新
```html
<template>
  <son :a="1" :b="2" :c="3" :d="4" @click="click" @mousedown="mousedown"></son>
</template>

<script>
  export default {
    methods: {
      click() {},
      mousedown() {}
    }
  }
</script>

// son
<template>
  <!-- { c: 3, d: 4 } -->
  {{ $attrs }}
  <other-comp v-bind="$attrs" v-on="$listeners"></other-comp>
</template>
<script>
  export default {
    inheritAttrs: false, // 这些属性，虽然没用，但是我不希望增加到DOM元素上
    props: ['a', 'b']
  }
</script>
```

#### ref 
- 在普通元素上操作DOM元素 也可以给组件添加ref 可以获取组件的实例
- v-for 里获取是一组DOM

#### eventBus 
- 子组件如何监听父组件的mounted？就可以使用此方法
```javascript
// 只适合小规模的通信，大规模会导致事件不好维护
var eventHub = new Vue()
// 然后在组件中，可以使用 $emit，$on，$off 分别来分发、监听、取消监听事件
export default {
  created() {
    eventHub.$on('add-todo', this.addTodo)
  },
  // 最好在组件销毁前 
  beforeDestroy: function () {
    // 清除事件监听
    eventHub.$off('add-todo', this.addTodo)
  },
}
```

#### slot插槽的用法

- 作用域插槽
父组件
```html
<template>
  <son>
    <!-- 插槽默认使用的是当前组件的父级数据 -->
    <!-- v-slot:header <==> #header -->
    <template v-slot:header>{{ msg }}</template>
    <!-- 作用域插槽 希望用当前组件的数据，只能采用作用域插槽将数据传递出来 -->
    <template v-slot:footer="{ a, b }">{{ isShow }}</template>
  </son>
</template>
```

子组件
```html
<template>
  <div>
    <slot name="header"></slot>
    <div>内容</div>
    <slot name="footer" a="1" b="2" :isShow="isShow"></slot>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShow: true
      }
    }
  }
</script>
```