module.exports = {
  base: '/',
  port: '9345',
  title: '',
  description: '4maz1nG の 前端记录',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],//浏览器的标签栏的网页图标，第一个'/'会遍历public文件夹的文件
  ],
  themeConfig: {
    // displayAllHeaders: true, // 默认值：false
    logo: '/avatar.jpg',//网页顶端导航栏左上角的图标
    // navbar: true, // 禁用所有页面的导航栏
    nav: [
      { text: '首页', link: '/' },
      // {
      //   text: '分类',
      //   ariaLabel: '分类', //用于识别的label
      //   items: [
      //     { text: '111', link: '/pages/folder1/2.md' },
      //     { text: '222', link: '/pages/folder1/3.md' },//点击标签会跳转至link的markdown文件生成的页面
      //   ]
      // },
      { text: 'Github', link: 'https://github.com/xinbingyao' },//格式三：跳转至外部网页，需http/https前缀
    ],
    //侧边导航栏：会根据当前的文件路径是否匹配侧边栏数据，自动显示/隐藏
    sidebar: {
      '/pages/': [
        {
          title: 'Javascript',   // 一级菜单名称
          collapsable: true, // false为默认展开菜单, 默认值true是折叠,
          sidebarDepth: 1,    //  设置侧边导航自动提取markdown文件标题的层级，默认1为h2层级
          children: [
            ['callback/callback.md', 'Callback'],
            ['promise/promise.md', 'Promise'],
            ['generator/generator.md', 'Generator生成器'],
            ['es/es.md', 'ES基础核心内容'],
            ['es-module/es-module.md', 'ES Module'],
            ['http/http.md', 'HTTP'],
            ['curry/curry.md', '函数柯里化'],
            ['es/es-template.md', 'ES模板引擎'],
            ['call-apply-bind/call-apply-bind.md', 'call apply bind原理'],
            ['data-structor/data-structor.md', '数据结构'],
            ['reduce/reduce.md', 'Reduce Compose'],
            ['eventloop/eventloop.md', 'js事件环']
          ]
        },
        {
          title: 'Vue2',
          collapsable: true,
          children: [
            ['1.md', '子菜单2-1']
          ]
        },
        {
          title: 'other',
          collapsable: true,
          children: [
            ['viewport/viewport.md', 'Viewport'],
            ['mianshi/mianshi.md', 'Interview']
          ]
        }
      ],

      //...可添加多个不同的侧边栏，不同页面会根据路径显示不同的侧边栏
    }
  }
}