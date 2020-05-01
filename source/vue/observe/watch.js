export class Watch{
  constructor(vm,exprOrFn,cb=()=>{},opts={}){
    this.vm = vm
    this.exprOrFn = exprOrFn
    if(typeof exprOrFn === 'function'){
      this.getter = exprOrFn
    }
    this.cb = cb
    this.opts = opts
    this.get()
  }
  get(){
    this.getter()
  }
}