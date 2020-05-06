
import Vue from 'vue'

let vm = new Vue({
  el: '#app',
  data: () => ({
    msg: 'ldx',
    first: 'ldx',
    last: 'zh',
    scolle: {
      name: 'zf'
    },
    arr: [1, 2, { sex: '0' }, ['12']]
  }),
  computed: {
    fullName() {
      return this.first + '-' + this.last
    }
  },
  watch: {
    "msg.but": {
      handle(a, b) {
        console.log('watch触发', a, b)
      },
      immediate: true,
      deep: true
    }
  },
  render(h) {
    return h('ul', { id: 'content', style: { background: 'blue' } },
      h('li', { class: 'warp', style: { color: 'yellow' } }, this.msg),
      h('li', { class: 'warp', style: { color: 'yellow' } }, this.fullName),
      h('li', { class: 'warp', style: { color: 'yellow' } }, 'b'),
      h('li', { class: 'warp', style: { color: 'yellow' } }, 'n'),
      h('li', { class: 'warp', style: { color: 'yellow' }, }, 'a'),
      h('li', { class: 'warp', style: { color: 'yellow' } }, 'e'),
      h('li', { class: 'warp', style: { color: 'yellow' }, key: 'a' }, 'a')
    )
  }
})

// console.log('vm',vm.arr[3].push(13) ,vm);
setTimeout(() => {
  // vm.msg = 'zf1';
  // vm.msg = 'zf2';
  // vm.msg = 'zf3';
  vm.msg = { but: '' }
  vm.first = 'wo'
  setTimeout(() => {
    vm.msg.but = 'zf'
    vm.last = 'why'
  }, 1000)
  // vm.msg.but = 'zf'
  // vm.msg.but = 'zf2'
  // vm.arr[3].push(15)
  // vm.arr.push([])
  // vm.arr[4].push('name')
  console.log('vm', vm);
}, 1000)

// import { h, render, patch } from './vdom'

// let vnode = h('ul', { id: 'content', style: { background: 'red' } },
//   h('li', { class: 'warp', style: { color: 'yellow' },key:'a' }, 'a'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'b'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'c'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'h'),
// );
// let container = document.querySelector('#app')
// render(vnode, container)
// // console.log('vnode',vnode);

// let newVNode = h('ul', { id: 'content', style: { background: 'blue' } },
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'c'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'c'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'b'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'n'),
//   h('li', { class: 'warp', style: { color: 'yellow' }, }, 'a'),
//   h('li', { class: 'warp', style: { color: 'yellow' } }, 'e'),
//   h('li', { class: 'warp', style: { color: 'yellow' },key:'a' }, 'a'),

// );
// setTimeout(() => {
//   patch(vnode, newVNode)

// }, 1000)