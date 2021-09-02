```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex) // 默认会执行当前插件的install方法

// 通过 Vue中的一个属性 store 创建一个store的实例
const store = new Vuex.Store({
  plugins: [
    createLogger() // 每次提交，希望看状态的变化
  ],
  modules: { // 模块名不能和state中的属性一致，会覆盖掉
    a: {
      state: {}
    },
    b: {
      modules: {
        c: {
          state: {}
        }
      },
      state: {

      }
    }
  },
  state: {
    age: 10
  },
  getters: {
    oldAge(state) {
      return state.age + 20
    }
  },
  mutations: {

  },
  actions: {

  }
})

store.registerModule('d', {
  state: {
    
  }
})

export default store
```