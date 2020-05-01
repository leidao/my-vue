import {pushTarget,popTarget} from './dep'
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
    //将当前watcher挂载
    pushTarget(this)
    this.getter()
    popTarget()
  }
  //更新
  update(){
    console.log('xxx');
    //每次更新时注意当前watcher
    this.get()
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
}