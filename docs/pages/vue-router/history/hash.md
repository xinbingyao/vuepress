```javascript
import History from './base';

function ensureSlash() {
  if (window.location.hash) { // firefox不兼容 window.locatio.href拿
    return
  }
  window.location.hash = '/'
}

class HashHistory extends History {
  constructor(router) {
    super(router);
    this.router = router;

    // 确保页面一加载就要有hash值
    ensureSlash();
  }
}

export default HashHistory
```