# 阅读vue源码，手写精简版vue
### 前言
目前分成三个分支完成：(__所有功能只实现核心逻辑__)  
1.`v1.0`: 实现对象劫持，数组劫持，代理，对象依赖收集，数组依赖收集，异步批量更新，nextTick函数，watch，computed功能  
2.`v2.0`: 实现render函数，虚拟dom，diff算法功能    
3.`v3.0`: 实现template模版编译，ast解析功能  
### 项目运行
```
git clone https://github.com/leidao/my-vue.git

cd my-vue

npm install

npm run serve
```
> 搭建了一个极简版webpack，主要功能是先从source文件夹中查找引用包，没有在从node_modules中查找引用包
<!-- ### 说明
> #### `v1.0` mvvm
1.vue的代理过程：在实例化Vue时初始化data数据(__initData__)，如果data是函数就调用，返回对象，不是函数直接取值。对data第一层
  数据进行代理(__proxy(vm, '_data', data)__)，将data对象上的每一个属性都挂载到vm(__vue实例__)上，方便直接取(__this.msh__)。
2.vue的数据劫持过程：代理后，实例化Observer类,在Observer类中判断，如果是数组，就改写其隐式原型(__arrayProtoMethods__)，
  重写原型对象上7个会修改自身的方法，用户调用这7个原型方法后会触发更新逻辑(__重新渲染页面__)，并且增加对新增值的数据劫持逻辑(__observeArray__)，如果是对象，调用walk方法，遍历对象每一个属性，调用defineReactive方法，对属性值进行递归劫持(__observe__)，使用object.defineProperty对属性进行绑定，当修改属性值时，会触发更新逻辑(__重新渲染页面__)并且增加对新增值的数据劫持逻辑(__observe__)  
3.vue的依赖收集：如果用户传入‘el’，就会进行页面挂载(__$mount__)，实例化一个渲染watcher，并传入更新函数，在Watch中调用更新函
  数，渲染页面，如果页面中使用了data中定义的函数，那么就会进行取值，这时就会进行对象的依赖收集(__dep.depend__)，这时「依赖收集」的目的是将渲染watcher对象存放到当前闭包中的订阅者Dep的subs中，在数据劫持的过程中每一个属性都创建了一个对应的dep实例。 -->




