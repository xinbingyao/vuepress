```javascript 
const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
    getValue(vm,expr){ // [msg]
      let keys = expr.split('.');
      // console.log(keys)
      return keys.reduce((memo,current)=>{ // reduce 他具备迭代的功能
          memo = memo[current]; //  vm.school.name
          return memo
      },vm);
    },
    compilerText(node,vm){ // 编译文本 替换{{school.name}}
        if(!node.expr){
            node.expr = node.textContent; // 给节点增加了一个自定义属性 为了方便后续的更新操作
        }
        node.textContent = node.expr.replace(defaultRE,function (...args) {
            // console.log(args)
            // console.log(util.getValue(vm,args[1]), '-------')
            return JSON.stringify(util.getValue(vm,args[1]))
        });
    }
}
export function compiler(node,vm){ // node 就是文档碎片 
    let childNodes = node.childNodes; // 只有第一层 只有儿子 没有孙子
    // 将类数组转化成数组
    [...childNodes].forEach(child=>{ // 一种是元素 一种是文本 
        if(child.nodeType == 1){ //1 元素  3表示文本
            compiler(child,vm); // 编译当前元素的孩子节点
        }else if(child.nodeType == 3){
            util.compilerText(child,vm);
        }
    });
}
```
