<template>
  <div class="chart-container">
    <MapChart
      height="100%"
      width="100%"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MapChart from '@/components/Charts/mapChart.vue'

@Component({
  name: 'MapChartDemo',
  components: {
    MapChart
  }
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
