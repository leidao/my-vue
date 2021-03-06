let id = 0;
export class Dep {
  constructor() {
    this.id = id++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend(){
    //防止第三方修改
    if(Dep.target){
      Dep.target.depend(this)
    }
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
const stack = []
export function pushTarget(watcher) {
  Dep.target = watcher
  stack.push(watcher)
}
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}