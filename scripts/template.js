/*
 * @Description: 页面快速生成脚本-分散

 */
const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1)
if (!dirName) {
    console.log('文件夹名称不能为空！')
    console.log('示例：npm run tep ${capPirName}')
    process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{data.pageName}}
  </div>
</template>

<script lang="ts" src="./${dirName}.ts"></script>

<style lang="scss">
  @import './${dirName}.scss'
</style>

`

// ts 模版
const tsTep = `import { Component, Vue } from "vue-property-decorator"

// import {  } from "@/components" // 组件

@Component({})
export default class About extends Vue {
  // Getter
  // @Getter ${dirName}.author
    
  // Action
  // @Action GET_DATA_ASYN

 
  created() {
    //
  }
    
  activated() {
    //
  }

  mounted() {
    //
  }

  // 初始化函数
  init() {
    //
  }
    
}
`

// scss 模版
const scssTep = `@import "@/assets/scss/variables.scss";

.${dirName}-wrap {
  width: 100%;
}
`






fs.mkdirSync(`${basePath}/views/${dirName}`) // mkdir

process.chdir(`${basePath}/views/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue 
fs.writeFileSync(`${dirName}.ts`, tsTep) // ts
fs.writeFileSync(`${dirName}.scss`, scssTep) // scss




process.exit(0)