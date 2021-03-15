<template>
  <div class="chart-container">
      <div v-html="md" class='markdown-body'></div>
     
      <g6intro id="main" :parent="ggdata" ></g6intro>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
   const marked = require('marked')
import g6intro from '@/components/g6/g6intro.vue'
import helloMarked from './helloMarked.md' //导入！！！注意使用你存放的路径
@Component({
  name: 'BarChartDemo',
  components: {
    g6intro
  }
})

 export default class extends Vue {
      
         private md=""
        created() {
        // 调用marked函数，传入helloMarked，返回一段html
             this.md = marked(helloMarked)
        }
       private ggdata:object={
           // 点集
            nodes: [{
                id: 'node1', // String，该节点存在则必须，节点的唯一标识
                x: 100,      // Number，可选，节点位置的 x 值
                y: 200       // Number，可选，节点位置的 y 值
            },{
                id: 'node2', // String，该节点存在则必须，节点的唯一标识
                x: 300,      // Number，可选，节点位置的 x 值
                y: 200       // Number，可选，节点位置的 y 值
            }],
            // 边集
            edges: [{
                source: 'node1', // String，必须，起始点 id
                target: 'node2'  // String，必须，目标点 id
            }]
       }
     
       
    
        
    }
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  overflow: scroll;
}


.markdown-body {
    box-sizing: border-box;
    min-width: 200px;
    max-width: 980px;
    margin: 0 auto;
    padding: 45px;
    font-size:18px;
    text-align: left;
}
@media (max-width:80% ) {
    .markdown-body {
        padding: 15px;
    }
}
#main{
    padding-left: 100px;
}

</style>
