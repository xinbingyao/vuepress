## webpack优化
purgecss-webpack-plugin glob --save-dev
```javascript
glob
主要功能是查找匹配文件
let paths = glob.sync('./src/**/*', { nodir: true })
// 删除无意义的CSS，只能配合mini-css-extract-plugin
plugins: [
  new PurgeCssWebpackPlugin({
    path: paths
  })
]
```

## 图片压缩 image-wepback-loader 和file-loader配合使用
```javascript
// loader是从下到上，在file-laoder之前对图片进行压缩
{
  test: /\.(jpe?g|png|gif)/,
  use: [
    {
      loader: 'file-loader'
    },
    env !== 'development' && {
      loader: 'image-wepback-loader',
      options: {
        // 自查，有清晰度等
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75
        }
      }
    }
  ].filter(Boolean)
}
```