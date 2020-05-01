
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

console.log('vm',vm.arr[3].push(13) ,vm);
