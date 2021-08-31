webpack 核心概念
1.entry: 入口文件
2.module: 模块，一切皆模块，从入口触发，递归查找所有依赖模块
3.chunk: 代码块，打包过程的一个中间概念，实现代码的合并和分割
4.loader: 模块转换器，用于把模块原内容按照需求转换成新内容
5.plugin: 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或你想做的事情
6.output: 输出结果
7.context: 项目打包的路径上下文

webpack会从entry里配置的module开始递归解析依赖的所有module。每找到一个module，就会根据配置的loader去找出对应的转换规则，对module进行转换后，再解析出当前module依赖的module。这些模块会以entry为单位进行分组，一个entry和其所有依赖的module被分到一个组也就是一个chunk。最后webpack会把所有chunk转换出文件输出。在整个流程中webpack会在恰当的时机执行plugin里的定义的逻辑。

## 文件指纹
- [name] 代码块的名字 entry里的key
- [hash] 代表一次编译 不管改多少文件，每次编译都产生同一个新的hash
- [chunkhash] 同一个入口，生成的文件chunkhash都是一样的
- [contenthash] 是基于文件内容生成的，只要文件内容不变，不管多少编译，contenthash都一样

## postcss的主要功能只有两个
- 把CSS解析成JavaScript可以操作的抽象语法树结构（abstract syntax tree）
- 调用插件来处理ast并得到结果

## babel-loader
内部会调用babel-core 实现语法转换 core是空引擎，core需要靠插件来实现转换

## babel-runtime
@babel/plugin-transform-runtime
webpack 打包的时候，会自动优化重复引入公共方法的问题
```javascript
[
  "@babel/plugin-transform-runtime",
  {
    "corejs": true,
    "helpers": true,
    "regenerator": true,
    "useESModules": true,
  }
]
```

## 引入字体
```javascript
{
  test: /\.(woff|ttf|eot|svg|otf)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 1024 * 1024
    }
  }
}

// index.css
@font-face {
  src: url('./fonts/HabanoST.otf');
  font-family: 'HabanoST'
}
```

## resolve
核心是缩小查找范围，减少查找时间的
```javascript
resolve: {
  extensions: ['.js', '.jsx', '.json', '.css'], // 指定查找扩展名
  alias: {
    'bootstrap': path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css')
  },
  modules: ['node_modules'], // 查找模块的目录
  // 加载一个模块的时候，一般会找模块目录里的package.json中的main字段
  mainFields: ['modules', 'main'],
  // 主文件
  mainFiles: ['index']
},
// 只有找loader的时候才会用到
resolveLoader: {
  modules: [path.resolve('loaders'), path.resolve('node_modules')]
}
```

## noParse
不解析
```javascript
// 用来配置哪些模块文件不需要进行解析
noParse: /jquery|lodash/
noParse(moduleName) {
  return /jquery|lodash/.test(moduleName)
}
```
