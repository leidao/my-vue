import {observe} from './index'
const arrayProto = Array.prototype
//原型对象克隆，不改变数组自身的原型方法
export const arrayProtoMethods = Object.create(arrayProto)

const methods = [
  'push','pop','shift','unshift','sort','splice','reverse'
]
//遍历数组每一项，进行递归依赖收集
export function dependArray(value){
   for (const key in value) {
     let current = value[key]
     current.__ob__ &&current.__ob__.dep.depend();
     if(Array.isArray(current)){
      dependArray(current)
     }
   }
}
export function observeArray(inserted){
   for (let i = 0; i < inserted.length; i++) {
    observe(inserted[i])
   }
}
methods.forEach(method=>{
  //函数劫持
  arrayProtoMethods[method] = function(...args){
    //执行原生数组方法
    let r = arrayProto[method].apply(this,args)
    // console.log('数组观测');
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args     //获取添加的参数
        break;
      case 'splice':
        inserted = args.slice(2)   //[].splice(0,1,x) 第二个是需要添加的参数
        break;
      default:
        break;
    } 
    if(inserted) observeArray(inserted);
    //数组的更新
    this.__ob__&&this.__ob__.dep.notify()
    return r
  }
})