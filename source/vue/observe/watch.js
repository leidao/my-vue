import { pushTarget, popTarget } from './dep'
import { util } from '../util'
import nextTick from './nextTick'
let id = 0
let seen = new Set()
export class Watch {
  constructor(vm, exprOrFn, cb = () => { }, opts = {}) {
    this.id = id++;
    this.deps = [];
    this.depId = new Set();
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = () => {
        return util.getValue(exprOrFn, vm)
      }
    }
    this.cb = cb
    this.opts = opts
    //监视watcher标识
    this.user = opts.user
    //深度监视
    this.deep = opts.deep
    //立即执行
    this.immediate = opts.immediate
    //计算watcher标识
    this.lazy = opts.lazy;
    //是否重新执行计算函数标识
    this.dirsty = this.lazy;
    this.value = this.get()
    if (this.immediate) {
      this.cb(this.value)
    }
  }
  //调用编译函数
  get() {
    //将当前watcher挂载
    pushTarget(this)
    //编译时将渲染watcher进行依赖收集，取值时将监视watcher进行依赖收集
    //调用计算函数取值时将使用的data数据对应的计算watcher进行依赖收集
    let value = this.getter.call(this.vm)
    if (this.deep) {
      traverse(value, seen)
      seen.clear()
    }
    popTarget()
    return value
  }
  //更新
  update() {
    //每次更新时注意当前watcher
    //watcher队列
    if(this.lazy){
      //如果时计算属性
      //计算属性依赖的值变化了 稍后取值时重新计算
      this.dirsty = true
    }else{
      queueWatch(this)
    }
  }
  depend(dep) {
    //获取每一个dep的id
    let id = dep.id
    //过滤同一个dep，同一个属性只会进行一个渲染watcher依赖收集
    if (!this.depId.has(id)) {
      this.depId.add(id)
      //将dep和watcher相互记忆
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  addDep(){
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  //渲染watcher和监视watcher使用
  //值改变，触发更新，渲染页面，调用watch函数
  run() {
    let value = this.get()
    if (this.user) {  //如果是监视watcher，执行回调函数
      this.cb(value, this.value)
      //将老值重新赋值
      this.value = value
    }
  }
  //计算watcher使用
  evalueate(){
    this.value = this.get()
    this.dirsty = false
  }
}
let hasId = {};
let queue = [];
function queueWatch(watcher) {
  let id = watcher.id
  if (!hasId[id]) {  //过滤同一个watcher
    hasId[id] = true;
    queue.push(watcher)  //将不同watcher存入队列
    nextTick(flushQueue)
  }
}
function flushQueue() {
  //取出队列中的watcher依次执行更新方法
  queue.forEach(watcher => watcher.run())
  //清空队列，下次继续执行
  hasId = {}
  queue = []
}
function traverse(val, seen) {
  // debugger
  let isA = Array.isArray(val)
  //如果是基本值，不用在收集依赖
  if (typeof val !== 'object' || typeof val === 'null') {
    return
  }
  if (val.__ob__) {
    //如果是循环引用类型，直接结束
    let id = val.__ob__.dep.id
    if (seen.has(id)) {
      return
    }
    seen.add(id)
  }
  if (isA) {
    let i = val.length
    while (i--) {
      //val[i],进行了取值操作，会触发监视watcher依赖收集
      traverse(val[i], seen)
    }
  } else {
    let keys = Object.keys(val)
    let i = keys.length
    //val[keys[i]],进行了取值操作，会触发监视watcher依赖收集
    while (i--) {
      traverse(val[keys[i]], seen)
    }
  }
}
