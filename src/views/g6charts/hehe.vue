<template>
  <div class="chart-container">
    <Controller id="main" :parent="ggdata"></Controller>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Controller from "@/components/g6/hehe.vue";
import hehedata from "@/assets/data/hehe.json";
@Component({
  name: "BarChartDemo",
  components: {
    Controller
  }
})
export default class extends Vue {

    created(){
      
        this.ggdata=hehedata.data
    
    }
  private ggdata: object = {};
}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
