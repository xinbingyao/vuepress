### jwt

JSON Web Token （JWT）是目前最流行的跨域身份验证解决方案
解决问题：session不支持分布式架构，无法支持横向扩张，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。

优点：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

## JWT包含了使用，分隔的三部分
- header
```javascript
{ "typ": "JWT", "alg": "HS256" } base64编码
```
- Payload
```javascript
WT 规定了7个官方字段  还有用户自己的信息
iss(issuer):签发人
exp(expiration time):过期时间
sub(subject):主题
aud(audience):受众
nbf(Not Before):生效时间
iat(Issued At):签发时间
jti(JWT ID):编号
```

- Signature 签名
对前两部分的签名，防止数据篡改

JWT 作为一个令牌（token)，有些场合坑会放到URL（比如:api.example.com/?token=xxx)。Base64有三个字符+、/和=，在URL里面有特殊含义，所以要被替换掉：=被省略、+替换成-，/替换成_。这就是Base64URL算法。

- Authorization: Bearer <token>
- http://www.xxx.com/pwa?token=xxxxx
- post请求也可以放在请求体中

```javascript
let myJwt = {
  unscape(str) {
    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  },
  escape(content) {
    return content.replace(/\=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  },
  toBase64Url(content) {
    let base64 = this.escape(Buffer.from(content).toString('base64'));
    return base64
  },
  sign(content, secret) {
    let hmac = require('crypto').createHmac('sha256', secret).update(content).digest('base64');
    return this.escape(hmac)
  },
  encode(content, secret) {
    let header = this.toBase64Url(JSON.stringify({ "typ": "JWT", "alg": "HS256" }))
    content = this.toBase64Url(JSON.stringify(content));

    let sign = this.sign(header + '.' + content, secret); // 加验算法 crpto
    return header + '.' + content + '.' + sign
  },
  decode(token, secret) {
    let [ header, content, sign ] = token.split('.');

    let newSign = this.sign(header+'.'+content, secret);
    if (sign !== newSign) { // 签名被改过
      throw new Error('签名被篡改了');
    } else {
      return JSON.parse(Buffer.from(this.unscape(content), 'base64').toString())
    }
  }
}
```