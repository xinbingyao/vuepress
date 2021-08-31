## cdn加载
```javascript
const AddCdnPlugin = require('add-asset-html-cdn-wepback-plugin')
// htmlWebpackExternalsPlugin webpack-cdn-plugin
externals: {
  'jquery': '$', // 不去打包代码中的jquery
}，
plugins: [
  new AddCdnPlugin(true, {
    'jquery': 'cdn链接‘
  })
]
```
