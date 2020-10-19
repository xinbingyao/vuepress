

```javascript
// let fs = require('fs')
// let ejs = require('ejs')
// let html = fs.readFileSync('./index.html', 'utf8')
// let r = ejs.render(html, { arr: [1, 2, 3]})

let template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <%arr.forEach(item=>{%>
    <h1><%=item%></h1>
  <%})%>
</body>
</html>`

function render(template, renderObj) {
  let head = "let str = '' \r\n with(obj){ \r\n str = `"
  
  template = template.replace(/<%=(.+?)%>/g, function() {
    return '${'+arguments[1]+'}'
  })

  let content = template.replace(/<%(.+?)%>/g, function() {
    return '`\r\n' + arguments[1] + '\r\n str += `';
  });

  let tail = '`\r\n} \r\n return str'
  return new Function('obj', head + content + tail)(renderObj).toString();
}

let r = render(template, { arr: [1,2,3]})
console.log(r)

// 模板引擎的实现原理
// new Function 来执行脚本 with来实现作用域， 字符串拼接拿到想要的结果
// new Function传递字符串，相当于在字符串外部套一个匿名函数，第一个参数为形参('obj')
```