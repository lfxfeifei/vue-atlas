/*
 * @Description: 组件快速生成脚本
 * @Date: 2020-9-17 
 * @LastEditTime: 2020-9-17 
 */

const fs = require('fs')
const path = require('path')
const basePath = path.resolve(__dirname, '../src')

const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1)
if (!dirName) {
  console.log('文件夹名称不能为空！')
  console.log('示例：npm run com ${capPirName}')
  process.exit(0)
}

/**
 * @msg: vue页面模版
 */
const VueTep = `<template>
  <div class="${dirName}-wrap">
    {{data.componentName}}
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator"

  // import {  } from "@/components" // 组件

  @Component({})
  export default class About extends Vue {
    // prop
    @Prop({
      required: false,
      default: ''
    }) name!: string



    created() {
      //
    }
    
    activated() {
      //
    }

    mounted() {
      //
    }

  }
</script>

<style lang="scss">
  @import "@/assets/scss/variables";

  .${dirName}-wrap {
    width: 100%;
  }
</style>

`



fs.mkdirSync(`${basePath}/components/${dirName}`) // mkdir

process.chdir(`${basePath}/components/${dirName}`) // cd views
fs.writeFileSync(`${dirName}.vue`, VueTep) // vue 

process.exit(0)