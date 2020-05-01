import {arrayProtoMethods,observeArray,dependArray} from './array'
import {observe} from './index'
import { Dep } from './dep'
export class Observer{
  constructor(data){
    this.dep = new Dep()
    //给每一个属性值上定义__ob__属性
    Object.defineProperty(data,'__ob__',{
      get:()=>this
    })
    if(Array.isArray(data)){
      //通过修改数组的原型链，重写数组7个会改写自身的原型方法
     data.__proto__ = arrayProtoMethods
     //观测数组中的每一项
     observeArray(data)
    }else{
     this.walk(data)
    }
  }
  walk(data){
     let keys = Object.keys(data)
     for (let i = 0; i < keys.length; i++) {
       const key = keys[i];
       const value = data[key]
       defineReactive(data,key,value)
     }
  }
}

function defineReactive(data,key,value){
  //递归观测对象的值
  let childObj = observe(value)
  //每一个属性对应一个dep实例
  let dep = new Dep()
  Object.defineProperty(data,key,{
    //在组件中使用了对应的属性才会进行依赖收集
    get(){
      //每一个属性名和属性值（引用类型）都有一个对应的dep，
      //对象使用属性名上的dep进行依赖收集，数组使用属性值上的dep进行依赖收集
      if(Dep.target){
        //对象的依赖收集
        dep.depend()
        if(childObj){
          //数组的依赖收集
          childObj.dep.depend()
          dependArray(value)
        }
      }
      return value
    },
    set(newValue){
     if(value === newValue) return
     //新增的值进行观测
     observe(newValue)
     value = newValue;
     //更新视图
     dep.notify()
    }
  })
}