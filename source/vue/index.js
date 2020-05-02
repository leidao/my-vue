import { initState } from './observe'
import { Watch } from './observe/watch'
import {compiler} from './util'
function Vue(options) {  //vue中用户传入的原始数据
  this._init(options)
}
Vue.prototype._init = function (options) {
  let vm = this   //缓存this
  vm.$options = options
  initState(vm)   //mvvm初始
  if (options.el) {
    this.$mount(options.el)
  }
}

Vue.prototype._updata = function () {
  let vm = this
  let el = vm.$el
  let firstChild;
  //文档碎片
  let node = document.createDocumentFragment();
  while (firstChild = el.firstChild) {
    //append具有移动的功能
    node.append(firstChild)
  }
  //编译
  compiler(node,vm);
  el.append(node)

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
function query(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  return el
}
export default Vue