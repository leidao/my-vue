import {Observer} from './observer'
import { Watch } from './watch';
import { Dep } from './dep';

export function initState(vm) {
  //做不同的初始化工作
  let opts = vm.$options;
  if (opts.data) {
    initData(opts.data, vm)
  }
   if(opts.computed){
     initComputed(vm)
   }
   if(opts.watch){     
     initWatch(vm)
   }
}
  //代理
function proxy(vm, source, data) {
  let keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    //vm.msg == vm._data.msg
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key]
      },
      set(newValue) {
        if (data[key] === newValue) return;
        data[key] = newValue
      }
    })
  }

}
//初始化data，渲染watcher
function initData(data, vm) {
  //vm._data 临时变量
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  //代理
  proxy(vm, '_data', data)
  observe(data)
}
//初始化wtach，监视watcher
function initWatch(vm){
  let watch = vm.$options.watch
  let keys = Object.keys(watch)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const userDef = watch[key]
    let opts = {user:true}
    let handler;
    if(typeof userDef === 'object'){
      opts.deep = userDef.deep
      opts.immediate = userDef.immediate
      handler = userDef.handle
    }else{
      handler = userDef
    }
    vm.$watch(key,handler,opts)
  }
}
//初始化计算属性，计算watcher
function initComputed(vm){
  let computed = vm.$options.computed;
  let keys = Object.keys(computed)
  let computedWatch = vm._computed = Object.create(null)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const handler = computed[key]
    computedWatch[key] = new Watch(vm,handler,()=>{},{lazy:true})
    Object.defineProperty(vm,key,{
      get:computedGetter(vm,key)
    })
  }
}
function computedGetter(vm,key){
  let watcher = vm._computed[key]
  return function(){
     if(watcher){
       if(watcher.dirsty){
         //调用计算函数
         //将计算watcher进行依赖收集
         watcher.evalueate()
       }
       if(Dep.target){
         //循环watcher中每一个dep，进行渲染watcher依赖收集
        watcher.addDep()
       }
       return watcher.value
     }
  }
}
export function observe(data) {
  //data不是对象或者为null的话，直接结束
  if (typeof data !== 'object' || typeof data === 'null') {
    return
  }
  //优化，防止重复递归观测
  if(data.__ob__){
    return data.__ob__
  }
  return new Observer(data)
}