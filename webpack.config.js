const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve(name){
  return path.resolve(__dirname,name)
}
module.exports = {
  entry:'./src/index.js',
  output:{
    path:resolve('./dist'),
    filename:'index.js'
  },
  resolve:{
    modules:['source','node_modules']
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:resolve('./public/index.html')
    })
  ]
}