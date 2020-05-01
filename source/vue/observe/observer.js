import {arrayProtoMethods,observeArray} from './array'
import {observe} from './index'
export class Observer{
  constructor(data){
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
  observe(value)
  Object.defineProperty(data,key,{
    get(){
      console.log('获取。。。');
      
      return value
    },
    set(newValue){
      console.log('设置。。。');
      
     if(value === newValue) return
     value = newValue;
    }
  })
}