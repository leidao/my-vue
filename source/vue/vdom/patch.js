//渲染真实dom
export function render(vnode, container) {
  let node = createElm(vnode)
  container.appendChild(node)
}
//创建真实dom节点
function createElm(vnode) {
  let { tag, props, children, text } = vnode
  if (tag) {  //如果有标签
    vnode.el = document.createElement(tag)
    updataProperties(vnode)
    //递归创建标签元素中的子节点，
    children.map(child => {
      render(child, vnode.el)
    })
  } else {
    //创建文本节点
    vnode.el = document.createTextNode(text)
  }
  //返回真实dom
  return vnode.el
}
//更新节点
function updataProperties(vnode, oldProps = {}) {
  let newProps = vnode.props || {}
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  let el = vnode.el
  for (const key in oldStyle) {  //循环老节点样式，如果新节点上不存在，删除老节点上的该样式
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (const key in oldProps) {// 如果新节点中没有这个属性了 那就直接删除掉dom上的这个属性
    if (!newProps[key]) {
      delete el[key]
    }
  }
  for (const key in newProps) { //遍历新节点props，依次赋值，前面删除过新节点不存在的样式
    if (key === 'class') { //class,单独处理
      el.className = newProps[key]
    } else if (key === 'style') {  //{style : {background:'red'}}  el.style.background = 'red
      let styleValue = newProps[key]
      for (const styleName in styleValue) {
        el.style[styleName] = styleValue[styleName]
      }
    } else {  //{id:'wrap'}   el.id = 'wrap'
      el[key] = newProps[key]
    }
  }
}
//核心逻辑，diff比对
export function patch(oldVNode, newVNode) {
  if (oldVNode.tag !== newVNode.tag) {  //标签不一样，直接替换
    oldVNode.el.parentNode.replaceChild(createElm(newVNode), oldVNode.el)
  }
  if (newVNode.tag == undefined) {   //文本内容不一样
    if (newVNode.text !== oldVNode.text) {
      oldVNode.el.textContent = newVNode.text
    }
  }
  let el = newVNode.el = oldVNode.el
  updataProperties(newVNode, oldVNode.props)

  //--------------------------------------------
  //比对父节点的子节点
  let oldChildren = oldVNode.children || [];
  let newChildren = newVNode.children || [];
  if (newChildren.length > 0 && oldChildren.length > 0) {
    //新老节点的子节点都存在    
    updataChildren(el, newChildren, oldChildren)
  } else if (newChildren.length > 0) {
    //新节点的子节点存在，老节点的子节点不存在，直接创建新节点的真实dom
    for (let i = 0; i < newChildren.length; i++) {
      const child = newChildren[i];
      el.appendChild(createElm(child))
    }
  } else if (oldChildren.length > 0) {
    //新节点的子节点不存在，老节点的子节点存在，直接删除老节点的真实dom
    el.innerHTML = ''
  }
}
function updataChildren(el, newChildren, oldChildren) {
  //vue使用双指针算法进行虚拟dom比对
  let newStartIndex = 0;
  let newStartVnode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex]
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex]
  const makeIndexByKey = () => {
    let map = {}
    oldChildren.map((child, index) => {
      let key = child.key 
      if(key) map[key] = index
    })
    return map
  }
  let map = makeIndexByKey()
  //越界条件，开始指针没有大于尾指针
  while (newStartIndex <= newEndIndex && oldStartIndex <= oldEndIndex) {
    if(oldStartVnode == undefined){
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if(oldEndVnode == undefined){
      oldEndVnode = oldChildren[--oldEndIndex];
    }else if (isSomeVnode(oldStartVnode, newStartVnode)) {
      //如果老节点的开始元素和新节点的开始元素相等
      patch(oldStartVnode, newStartVnode)
      //新老节点指针向后移
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSomeVnode(oldEndVnode, newEndVnode)) {
      //如果老节点的尾元素和新节点的尾元素相等
      patch(oldEndVnode, newEndVnode)
      //新老节点的尾指针向前移
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSomeVnode(oldStartVnode, newEndVnode)) {
      //如果老节点的开始元素和新节点的尾元素相等
      patch(oldStartVnode, newEndVnode)
      //将老节点的开始元素移动到老节点的尾元素的下一个元素之前
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    else if (isSomeVnode(oldEndVnode, newStartVnode)) {
      //如果老节点的尾元素和新节点的开始元素相等
      patch(oldEndVnode, newStartVnode);
      //将老节点的尾元素移动到老节点的开始元素前面
      el.insertBefore(oldEndVnode.el, oldStartVnode.el);
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex]
    } else {
      //乱序----在比对过程中只比对标签一样的元素，不一样的元素在patch开始阶段直接替换了
      let key = newStartVnode.key
      let moveIndex = map[key]
      //如果标签一样，key不一样，将新节点的开始元素插入老节点的开始元素前面
      if( moveIndex== undefined){
        el.insertBefore(createElm(newStartVnode),oldStartVnode.el);
        newStartVnode = newChildren[++newStartIndex];
      }else{
        let  moveNode = oldChildren[moveIndex];
        oldChildren[moveIndex] = undefined;
         //如果标签一样，key也一样，找到老节点key相同的元素，移动老节点的开始元素前面
        el.insertBefore(moveNode.el,oldStartVnode.el)
        //防止数组塌陷，重新赋值
        newStartVnode = newChildren[++newStartIndex];
      }
    }
  }

  if (newStartIndex <= newEndIndex) {
    //如果新节点有多余节点，需要插入到老节点中
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // let ele = oldChildren[i] == null ? null : oldChildren[i].el
      //如果之前newEndIndex有移动过，说新节点的尾元素有插入到老节点的最后，
      //那么新节点剩下元素插入到新节点的尾元素（老节点的尾元素）的前面
      //如果之前newEndIndex没有移动，那么新节点剩下的元素插入到null（和appendChild作用相同）的前面
      let ele = newChildren[newEndIndex+1] == null? null:newChildren[newEndIndex+1].el;
      //insertBefore(需要插入的元素,在哪个元素之前插入)
      //可以往后插入，也可以向前插入
      el.insertBefore(createElm(newChildren[i]), ele)
    }
  }
  if(oldStartIndex <= oldEndIndex){
    //如果老节点有剩余节点，需要删除
    for (let index = oldStartIndex; index <= oldEndIndex; index++) {
      let child = oldChildren[oldStartIndex]
      if(child != undefined){
        el.removeChild(child.el)
      }
    }
  }
}
function isSomeVnode(newVnode, oldVnode) {
  return (newVnode.tag === oldVnode.tag) && (newVnode.key === oldVnode.key)
}