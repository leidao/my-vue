# 阅读vue源码，手写精简版vue
### 前言
目前分成三个分支完成：(__所有功能只实现核心逻辑__)  
1.v1.0:实现对象劫持，数组劫持，代理，对象依赖收集，数组依赖收集，异步批量更新，nextTick函数，watch，computed功能  
2.v2.0:实现render函数，虚拟dom，diff算法功能  
3.v3.0:实现template模版，ast解析功能  
### 项目运行
```
git clone https://github.com/leidao/my-vue.git

cd my-vue

npm install

npm run serve
```
> 搭建了一个极简版webpack，主要功能是先从source文件夹中查找引用包，没有在从node_modules中查找引用包



