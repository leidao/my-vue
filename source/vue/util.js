const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export const util = {
  getValue(expr,vm){
    //scolle.name =》 [scolle,name]  arr[2],数组分割未做
     let v = expr.split('.')
     return v.reduce((pre,next)=>{
       pre = pre[next];
       return pre;
     },vm)
  },
  //编译文本
   compilerText(node,vm){
    node.textContent = node.textContent.replace(defaultRE,function(...args){
       return util.getValue(args[1],vm)
    })
   }
}

export function compiler(node,vm) {
  let childNodes = node.childNodes;
  [...childNodes].forEach(child => {
    // 1-元素  3-文本
    if (child.nodeType === 1) {
      compiler(child,vm)
    } else if (child.nodeType === 3) {
      util.compilerText(child,vm)
    }
  })
}