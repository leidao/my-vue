import {Observer} from './observer'
export function initState(vm) {
  //做不同的初始化工作
  let opts = vm.$options;
  if (opts.data) {
    initData(opts.data, vm)
  }
  //  if(opts.computed){
  //    initComputed()
  //  }
  //  if(opts.data){
  //    initWatch()
  //  }
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
function initData(data, vm) {
  //vm._data 临时变量
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}
  //代理
  proxy(vm, '_data', data)
  observe(data)
}
export function observe(data) {
  //data不是对象或者为null的话，直接结束
  if (typeof data !== 'object' || typeof data === 'null') {
    return
  }
  return new Observer(data)
}