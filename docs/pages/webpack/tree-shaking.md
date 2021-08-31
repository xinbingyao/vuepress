tree-shaking 默认只支持es6语法，因为es6是静态导入
只在生产环境下使用
```javascript
import { minus } from './calc';
```


## dllPlugin 动态链接库 优化打包速度
怎么打包第三方库

package.json
```javascript
scripts: {
  "dll": "webpack --config webpack.dll.js"
}
```

webpack.dll.js
```javascript
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');
module.exports = {
  mode: 'production', // development
  // entry: ['react', 'react-dom']
  entry: './src/calc.js',
  output: {
    // library: 'react',
    library: 'calc', // 打包后接收自执行函数的名字叫calc
    libraryTarget: 'commonjs2', // 默认用var模式， commonjs umd this var 
    filename: 'calc',
    // filename: 'react.dll.js',
    path: path.resolve(__dirname, 'dll')
  },
  plugins: [
    new DllPlugin({
      name: 'react',
      path: path.resolve(__dirname, 'dll/manifest.json')
    })
  ]
}

// 本地使用了import React 语法， 需要先去manifest.json查找，找到后悔加载对应的库的名字，可能会引用某个模块， 会去dll.js中查找

// 之后还要去webpack.config.js中去配置
// webpack.config.js
const DllReferencePlugin = require('webpack').DllReferencePlugin
const AddAssetHtmlPlugin = require('add-assets-html-webpack-plugin')
plugins: [
  new DllReferencePlugin({
    manifest: path.resolve(__dirname, 'dll/manifest.json')
  }),
  new AddAssetHtmlPlugin({
    filepath: path.resolve(__dirname, './dll/*.dll.js')
  })
]
```