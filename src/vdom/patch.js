//渲染真实dom
export function render(vnode,container){
    let node = createElm(vnode)
    container.appendChild(node)
}
//创建真实dom节点
function createElm(vnode){
   let {tag,props,children,text} = vnode
   if(tag){  //如果有标签
     vnode.el = document.createElement(tag)
     updataProperties(vnode)
     //递归创建标签元素中的子节点，
     children.map(child=>{
      render(child,vnode.el)
     })
   }else{
     //创建文本节点
     vnode.el = document.createTextNode(text)
   }
   //返回真实dom
   return vnode.el
}
//更新节点
function updataProperties(vnode,oldProps={}){
  let {props} = vnode
  for (const key in props) {
   if(key === 'class'){ //class,单独处理
    vnode.el.className = props[key]
   }else if(key === 'style'){  //{style : {background:'red'}}  el.style.background = 'red
     let styleValue = props[key]
     for (const styleName in styleValue) {
      vnode.el.style[styleName] = styleValue[styleName]
     }
   }else {  //{id:'wrap'}   el.id = 'wrap'
    vnode.el.key = props[key]
   }
  }
}
//核心逻辑，diff比对
export function patch(newVNode,oldVNode){
  
}