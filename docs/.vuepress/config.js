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
            ['eventloop/eventloop.md', 'js事件环'],
            ['cross-origin-resource-sharing/cors.md', '跨域通信']
          ]
        },
        {
          title: 'Webpack',
          collapsable: true,
          children: [
            ['webpack/webpack.md', 'webpack'],
            ['webpack/bundle-analyze', '打包分析'],
            ['webpack/dynamic-loading', '动态加载'],
            ['webpack/cdn', 'CDN加速'],
            ['webpack/tree-shaking', '摇树'],
            ['webpack/optimize', '优化'],
          ]
        },
        {
          title: 'Vue2',
          collapsable: true,
          children: [
            ['1.md', 'mark'],
            ['vue/life-cycle.md', '生命周期'],
            ['vue/component.md', '组件']
          ]
        },
        {
          title: 'Vue2源码',
          collapsable: true,
          children: [
            {
              title: 'observe',
              collapsable: true,
              children: [
                ['vue-source/observe/idx.md', 'index.js'],
                ['vue-source/observe/array.md', 'array.js'],
                ['vue-source/observe/dep.md', 'dep.js'],
                ['vue-source/observe/observer.md', 'observer.js'],
                ['vue-source/observe/watcher.md', 'watcher.js'],
              ]
            },
            {
              title: 'vdom',
              collapsable: true,
              children: [
                ['vue-source/vdom/idx.md', 'index.js'],
                ['vue-source/vdom/create-element.md', 'create-element.js'],
                ['vue-source/vdom/h.md', 'h.js'],
                ['vue-source/vdom/patch.md', 'patch.js'],
              ]
            },
            ['vue-source/util.md', 'util.js'],
            ['vue-source/idx.md', 'index.js']
          ]
        },
        {
          title: 'vuex',
          collapsable: true,
          children: [
            ['vuex/idx.md', 'store.js'],
            ['vuex/vuex.md', 'vuex.js'],
            ['vuex/plugin.md', 'vuex插件']
          ]
        },
        {
          title: 'vue-router',
          collapsable: true,
          children: [
            ['vue-router/idx.md', 'router.js'],
            ['vue-router/vue-router.md', 'index.js'],
            ['vue-router/install.md', 'install.js'],
            ['vue-router/create-matcher.md', 'create-matcher.js'],
            ['vue-router/create-router-map.md', 'create-router-map.js'],
            {
              title: 'history',
              collapsable: true,
              children: [
                ['vue-router/history/base.md', 'base.js'],
                ['vue-router/history/hash.md', 'hash.js'],
              ]
            },
            {
              title: 'components',
              collapsable: true,
              children: [
                ['vue-router/components/router-link.md', 'router-link.js'],
                ['vue-router/components/router-view.md', 'router-view.js'],
              ]
            }
          ]
        },
        {
          title: 'other',
          collapsable: true,
          children: [
            ['viewport/viewport.md', 'Viewport'],
            ['mianshi/mianshi.md', 'Interview'],
            ['jwt/jwt.md', 'JWT']
          ]
        },
        {
          title: 'Node',
          collapsable: true,
          children: [
            ['node/node.md', 'index']
          ]
        },
        {
          title: 'TypeScript',
          collapsable: true,
          children: [
            ['typescript/basic/01.md', '01'],
            ['typescript/basic/02.md', '02'],
            ['typescript/basic/03.md', '03'],
            ['typescript/basic/04.md', '04'],
            ['typescript/basic/05.md', '05'],
            ['typescript/basic/06.md', '06'],
            ['typescript/basic/07.md', '07'],
            ['typescript/basic/08.md', '08'],
            ['typescript/basic/09.md', '09'],
            ['typescript/basic/10.md', '10'],
            ['typescript/basic/11.md', '11'],
            ['typescript/basic/12.md', '12'],
            ['typescript/basic/13.md', '13'],
            ['typescript/basic/14.md', '14'],
            ['typescript/basic/15.md', '15'],
            ['typescript/basic/16.md', '16'],
            ['typescript/basic/17.md', '17'],
            ['typescript/basic/18.md', '18'],
            ['typescript/basic/19.md', '19'],
            ['typescript/basic/20.md', '20'],
            ['typescript/basic/21.md', '21'],
            ['typescript/basic/22.md', '22'],
            ['typescript/basic/23.md', '23'],
            ['typescript/basic/24.md', '24'],
            ['typescript/basic/25.md', '25'],
            ['typescript/basic/26.md', '26'],
            ['typescript/basic/27.md', '27'],
            ['typescript/basic/28.md', '28'],
            ['typescript/basic/29.md', '29'],
            ['typescript/basic/30.md', '30'],
            ['typescript/basic/31.md', '31'],
            ['typescript/basic/32.md', '32'],
            ['typescript/basic/33.md', '33'],
            ['typescript/basic/34.md', '34'],
            ['typescript/basic/35.md', '35'],
            ['typescript/basic/36.md', '36'],
            ['typescript/basic/37.md', '37'],
            ['typescript/basic/38.md', '38'],
            ['typescript/basic/39.md', '39'],
          ]
        }
      ],

      //...可添加多个不同的侧边栏，不同页面会根据路径显示不同的侧边栏
    }
  }
}