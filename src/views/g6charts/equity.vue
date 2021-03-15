<template>
  <div class="chart-container">
 
     
      <equity id="main" :parent="ggdata" ></equity>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mockData } from "./catejson.js"
import equity from '@/components/g6/equity.vue'


@Component({
  name: 'BarChartDemo',
  components: {
    equity
  }
})

 export default class extends Vue {
  
       private ggdata:object=mockData.data
     
       
    
        
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
