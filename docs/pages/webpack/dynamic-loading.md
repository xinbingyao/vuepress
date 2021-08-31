## 动态加载文件
会使用jsonp动态加载文件，实现代码分割
```javascript
let btn = document.createElement('button');

btn.addEventListener('click', () => {
  import('./calc').then(data => {
    data.add(1, 2); // 3
  })
})

btn.innerHTML = '点我'
document.body.appendChild(btn)

```
```javascript
// webpack.config.js
module.exports = (env) => {
  return {
    mode: env,
    output: {
      filename: 'bundle.js', // 同步打包的名字
      chunkFilename: '[name].min.js', // 异步打包的名字
    }
  }
}

// 或者使用webpack的魔法字符串， 这样名字就会对应到上面的name
import(/* webpackChunkName: 'video' */'./calc').then(data => {
  console.log(data)
})
```