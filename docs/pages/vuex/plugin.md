以 createLogger 为例

```javascript
function logger(store) {
  store.subscribe((mutation, newState) => {
    let prevState = JSON.stringify(store.state)
    console.log(prevState)
    console.log(mutation)
    console.log(JSON.stringify(newState))
    prevState = JSON.stringify(newState)

  })
}
```


#### vue-persists 可以实现vuex的数据持久化
```javascript
function persitst(store) {
  let lcoal = localStorage.getItem('VUEX:state')
  if (local) {
    // api
    store.replaceState(JSON.parse(local)) // 会用local替换掉所有的状态
  }
  store.subscribe((mutation, state) => {
    // 这里需要做节流 throttle lodash
    localStorage.setItem('VUEX:state', JSON.stringify(state))
  })
}
```