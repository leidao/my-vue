import { vNode } from "./create-elm"
//返回虚拟dom
export function h(tag,props,...children){
   let key = props.key
   delete props.key
   children = children.map(child=>{
     if(typeof child === 'object'){
       return child
     }else{
       return vNode(undefined,undefined,undefined,undefined,child)
     }
   })
   return vNode(tag,props,key,children)
}