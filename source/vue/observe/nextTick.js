
let callbacks = []
function flushCallbacks(){
  callbacks.forEach(cb=>cb())
}
export default function nextTick(cb){
  callbacks.push(cb)
  let timerFunc = ()=>{
    flushCallbacks()
  }
  if(Promise){
    return Promise.resolve().then(timerFunc)
  }
  if(MutationObserver){  //h5api
    let mutation = new MutationObserver(timerFunc)
    let node = document.createTextNode(1)
    mutation.observe(node,{characterData:true})
    node.textContent = 2
    return
  }
  if(setImmediate){
    setImmediate(timerFunc,0)
    return
  }
  setTimeout(timerFunc,0)
}