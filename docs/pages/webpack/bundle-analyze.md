
```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
module.exports = (env) => {
  return {
    entry: {
      'a': './src/a.js',
      'b': './scr/b.js'
    },
    output: {
      filename: '[name].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index.html',
        chunks: ['a']
      }),
      new HtmlWebpackPlugin({
        template: './login.html',
        filename: 'login.html',
        chunks: ['b', 'a']
      }),
      env !== 'development' && new BundleAnalyzerPlugin()
    ]
  }
}
```

- 如果两个入口都引入了同一个库，比如jquery，打包的时候会把jquery打包到各自的代码块中，但是这样不合理，和业务逻辑绑定了，所以要把jquery分离出来，这时候就需要用到splitChunks
```javascript
module.exports = (env) => {
  return {
    optimization: {
      splitChunks: {
        chunks: 'async', // 支持异步代码分割
        minSize: 30000, // 文件超过30k就会抽离
        maxSize: 0,
        minChunks: 1, // 最少模块引用一次才抽离
        maxAsyncRequests: 5, // 最多5个请求
        maxInitialRequests: 3, // 最多首屏加载3个请求
        automaticNameDelimiter: '~', // 名字以****~a~b
        automaticNameMaxLength: 30, // 最长名字大小
        name: true,
        cacheGroups: { // 缓存组
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
  }
}
```

