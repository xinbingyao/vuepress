## 同源策略
同域：协议、域名、端口
这三个其中有一个不一样，就是跨域

## 为什么浏览器不支持跨域 
cookie  localStorage
dom元素也有同源策略 iframe
ajax 也不支持跨域

## 实现跨域
- jsonp
- cors 纯后端提供
- postMessage 两个页面通信可以用这个
- document.domain 子域和父域
- window.name
- location.hash
- http-proxy
- nginx
- websocket


## jsonp
缺点：只求发送get请求（script去引），不支持post put delete
      不安全 xss攻击
```javascript
function jsonp({ url, params, cb }) {
  let script = document.createElement('script')
  return new Promise((resolve, reject) => {
    window[cb] = function(data) {
      resolve(data)
      document.removeChild(script)
    }
    params = { ...params, cb }
    let arr = []
    for (let key in params) {
      arr.push(`${key}=${params[key]}`)
    }
    script.src = `${url}?${arr.join('&')}`
    document.body.appendChild(script)
  })
}

jsonp({
  url: 'http://localhost:3000/say',
  params: {
    wd: '我爱你'
  },
  cb: 'show'
}).then(data => {
  console.log(data); // 我不爱你
})

// 后端 express
let express = require('express')
let app = express()

app.get('/say', (req, res) => {
  let { wd, cb }= req.query
  res.send(`${cb}('我不爱你')`)
})
app.listen(3000)
```

## cors（最常用，安全性高）服务器验证
server1
```javascript
let express = require('express')
let app = express()
app.use(express.static(__dirname))
app.listen(3000)
```

index.html
```html
<script>
  let xhr = new XMLHttpRequest()
  // 正常cookie不能跨域，设置携带凭证为true，告诉要带上cookie，同时服务端设置
  document.cookie = 'name=zfpx'
  xhr.withCredentials = true;
  xhr.open('GET', 'http://localhost:4000/getData', true);
  // 想传点数据，需要服务器允许
  xhr.setRequestHeader('name', 'zfpx')
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
        console.log(xhr.response)
      }
    }
  }
  xhr.send()
</script>
```

server2
```javascript
let express = require('express')
let app = express()
let whiteList = ['http://localhost:3000']

app.use((req, res, next) => {
  let origin = req.headers.origin;
  if (whiteList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许那个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 允许返回头，如果前端要取name的话，浏览器h会报unsafe的错，所以需要设置，设置多个用逗号隔开
    res.setHeader('Access-Control-Expose-Headers', 'name')
    // 但是可能浏览器过一会还是会去检测发送options请求，所以在这里可以设置预检测存活时间来防止
    res.setHeader('Access-Control-Max-Age', 6000)
    if (req.method === 'OPTIONS') {
      res.end() // options请求不做任何处理 
    }
  }
  next()
})
app.get('/getData', (req, res) => {
  // { origin: 'http://localhost:3000', host: 'localhost:4000' }
  console.log(req.headers);
  res.end('我不爱你')
})
app.use(express.static(__dirname))
app.listen(4000)
```

## postMessage(主流常用)
两个页面通信

a.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe src="http://localhost:4000/b.html" frameborder="0" id="frame" onload="load()"></iframe>
  <script>
    function load() {
      let frame = document.getElementById('frame')
      frame.contentWindow.postMessage('我爱你', 'http://localhost:4000')
      window.onmessage = function(e) {
        console.log(e.data)
      }
    }
  </script>
</body>
</html>
```

a.server
```javascript
let express = require('express')
let app = express()
app.use(express.static(__dirname))
app.listen(3000)
```


b.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    window.onmessage = function(e) {
      console.log(e.data)
      e.source.postMessage('我不爱你'， e.origin)
    }
  </script>
</body>
</html>
```

b.server
```javascript
let express = require('express')
let app = express()
app.use(express.static(__dirname))
app.listen(4000)
```


## window.name
基本不用

a b c 三个HTML，b.html只做中间层,ab同源

a.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="iframe" src="http://localhost:4000/c.html" onload="load()"></iframe>
  <script>
    let first = true
    function load() {
      let iframe = document.getElementById('iframe')
      if (first) {
        iframe.src = 'http://localhost:3000/b.html'
        first = false
      } else {
        // c切换到b之后，c的name属性还在，所以就可以取到name
        console.log(iframe.contentWindow.name)
      }
    }
  </script>
</body>
</html>
```


## hash
a: iframeC src #
b: window.paren.parent = location.hash
c: iframB src #


## domain
一级域名 二级域名

a.html 'http://a.zf.cn:3000/a.html'
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="iframe" src="http://b.zf.cn:3000/b.html" onload="load()"></iframe>
  <script>
    // 关键
    document.domain = 'zf.cn'
    function load() {
      console.log(iframe.contentWindow.a); // 100
    }
  </script>
</body>
</html>
```
b.html 'http://b.zf.cn:3000/b.html'
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    // 关键
    document.domain = 'zf.cn'
    var a = 100
  </script>
</body>
</html>
```










 