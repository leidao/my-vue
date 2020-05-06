import { initState } from './observe'
import { Watch } from './observe/watch'
import { compiler } from './util'
import { h, patch, render } from './vdom'
function Vue(options) {  //vue中用户传入的原始数据
  this._init(options)
}
//初始化
Vue.prototype._init = function (options) {
  let vm = this   //缓存this
  vm.$options = options
  initState(vm)   //mvvm初始
  if (options.el) {
    this.$mount(options.el)
  }
}
//调用用户传入的render函数，返回虚拟dom
Vue.prototype._render = function () {
  let vm = this
  let render = vm.$options.render;
  // console.log(render);
  let vnode = render.call(vm, h)
  return vnode;
}
//渲染/更新页面函数
Vue.prototype._updata = function () {
  let vm = this
  let el = vm.$el
  //将对象转成虚拟dom
  let vnode = vm._render()
  if (!vm.preVnode) {
    //初次渲染
    render(vnode, el)
    vm.preVnode = vnode
  } else {
    //进行更新
    //diff比对
    patch(vm.preVnode, vnode)
  }
}
Vue.prototype.$mount = function (el) {
  let vm = this
  vm.$el = query(el)
  const updataCompnent = () => {
    this._updata()
  }
  //渲染Watcher
  new Watch(vm, updataCompnent)
}
Vue.prototype.$watch = function (key, handler, otps = {}) {
  let vm = this
  new Watch(vm, key, handler, otps)
}
function query(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  return el
}
export default Vue