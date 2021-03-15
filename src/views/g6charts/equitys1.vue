<template>
  <div class="chart-container">
 
     
      <equitys1 id="main" :parent="ggdata" ></equitys1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import equitydata from "@/assets/data/equity.json";
import equitys1 from '@/components/g6/equitys1.vue'


@Component({
  name: 'BarChartDemo',
  components: {
    equitys1
  }
})

 export default class extends Vue {
  
       private ggdata:object=equitydata.data
     
       
    
        
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
