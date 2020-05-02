import {pushTarget,popTarget} from './dep'
import nextTick from './nextTick'
let id = 0
export class Watch {
  constructor(vm, exprOrFn, cb = () => { }, opts = {}) {
    this.id = id++;
    this.deps = [];
    this.depId = new Set();
    this.vm = vm
    this.exprOrFn = exprOrFn
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.cb = cb
    this.opts = opts
    this.get()
  }
  //调用编译函数
  get() {
    console.log('xxx');
    //将当前watcher挂载
    pushTarget(this)
    this.getter()
    popTarget()
  }
  //更新
  update(){
    //每次更新时注意当前watcher
    //watcher队列
    queueWatch(this)
  }
  depend(dep){
    //获取每一个dep的id
     let id = dep.id
     //过滤同一个dep，同一个属性只会进行一个渲染watcher依赖收集
     if(!this.depId.has(id)){
       this.depId.add(id)
       //将dep和watcher相互记忆
       this.deps.push(dep)
       dep.addSub(this)
     }
  }
  run(){
    this.get()
  }
}
let hasId = {};
let queue = [];
function queueWatch(watcher){
   let id = watcher.id
   if(!hasId[id]){  //过滤同一个watcher
     hasId[id] = true;
     queue.push(watcher)  //将不同watcher存入队列
     nextTick(flushQueue)
   }
}
function flushQueue(){
  //取出队列中的watcher依次执行更新方法
  queue.forEach(watcher=>watcher.run())
  //清空队列，下次继续执行
  hasId = {}
  queue = []
}
