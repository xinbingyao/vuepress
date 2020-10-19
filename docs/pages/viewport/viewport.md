1.CSS像素(逻辑像素)和设备像素(物理像素)

- screen.width/height
  含义：用户屏幕的完整大小
  度量：设备的像素
  兼容性问题：IE8里，不管使用IE7模式还是IE8模式，都以CSS的pixels来度量

- window.innerWidth/innerHeight
  含义：包含滚动条尺寸的浏览器完成尺寸
  度量：CSS像素
  兼容性问题：IE不支持，Opera用设备pixels来度量

- 滚动移位 scrolling offset window.pageX/YOffset
  含义：页面的移位
  度量：CSS像素
  兼容性问题：pageXOffset 和 pageYOffset 在 IE 8 及之前版本的IE不支持, 使用”document.body.scrollLeft” and “document.body.scrollTop” 来取代，现代浏览器使用 document.documentElement.scrollLeft 和 document.documentElement.scrollTop

- viewport
  viewport是严格的等于浏览器窗口的宽度和高度
  body的宽度就是其父元素HTML的宽度，HTML的宽度受viewport所限制，所以HTML的宽度就是viewport的宽度的100%

- document.documentElement.clientWidth/Height
  含义：viewport的尺寸(不包含滚动条)
  度量：CSS像素
  兼容性问题： 无

- document.documentElement.offsetWidth/Height
  含义：HTML的尺寸
  度量： CSS像素
  兼容性问题：IE用这个值标示viewport的尺寸而非HTML

- 事件坐标 Event coordinates
  兼容性问题：IE不支持pageX/Y,IE使用CSSpixels来度量screanX/Y
  - pageX/Y
    从HTML页面原点到事件触发点的CSS像素
  - clientX/Y
    从viewport原点(浏览器窗口)到事件触发点的CSS像素
  - screenX/Y
    从用户显示器窗口原点到事件触发点的设备像素

- media query
  有两个相关的media查询：width/height 和 device-width/device-height
  - width/height
    使用 document.documentElement.clientWidth/Height，即viewport的值，该值以CSS像素来度量
  - device-width/height
    使用 screen.width/height 来作为判定值，该值以设备像素来度量


移动设备浏览器的问题
  设备的宽度是移动设备浏览器和桌面浏览器的最大区别，如果有一个width: 10%的侧边栏，因为viewport太窄，所以侧边栏在移动设备上会显示的很窄，所以为了有更好的体验，最显然的解决方式是让让viewport更宽。因此这个需求分为了2个方面：虚拟的viewportvisualviewport和布局的viewportlayoutviewport。

- 物理像素
  物理像素又被称为设备像素，他是显示设备中一个最微小的物理部件。每个像素可以根据操作系统设置自己的颜色和亮度。正是这些设备像素的微小距离欺骗了我们肉眼看到的图像效果。

- 设备独立像素
  设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。

- CSS像素
  CSS像素是一个抽像的单位，主要使用在浏览器上，用来精确度量Web页面上的内容。一般情况之下，CSS像素称为与设备无关的像素(device-independent pixel)，简称DIPs。

- 屏幕密度
  屏幕密度是指一个设备表面上存在的像素数量，它通常以每英寸有多少像素来计算(PPI)。

- lib-flexible库
  制作H5适配的开源库
  ```javascript
  <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
  ```