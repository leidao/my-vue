
import Vue from 'vue'

let vm = new Vue({
  el:'#app',
  data:()=>({
    msg:'ldx',
    scolle:{
      name:'zf'
    },
    arr:[1,2,{sex:'0'},['12']]
  }),
})

// console.log('vm',vm.arr[3].push(13) ,vm);
setTimeout(()=>{
  // vm.msg = 'zf1';
  // vm.msg = 'zf2';
  // vm.msg = 'zf3';
  // vm.msg = {name:''}
  // vm.msg.name = 'zf'
  // vm.arr[3].push(15)
  vm.arr.push([])
  vm.arr[4].push('name')
  console.log('vm',vm.msg);
  
},1000)
