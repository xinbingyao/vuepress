```javascript
import createRouteMap from './create-route-map'
import { createRoute } from './history/base'

export default function createMatcher(routes) {
  // 将数据扁平化处理, 创建路由映射表
  // pathList 表示所有路径的集合 [ / /home /a /b ]
  // pathMap { /: home,  /about: about }
  let { pathList, pathMap } = createRouteMap(routes)
  function addRoutes(routes, pathList, pathMap) {
    createRouteMap(routes, pathList, pathMap)
  }

  function match(location) { // 匹配对应记录的
    // todo...
    console.log('match', location)
    let record = pathMap[location]
    console.log(record)
    return createRoute(record, {
      path: location
    })
  }

  return {
    addRoutes,
    match
  }
}

```