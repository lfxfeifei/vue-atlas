<template>
  <div class="chart-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="tab1" name="first">
        <!-- <shareholder v-if="activeName == 'first'"></shareholder> -->
      </el-tab-pane>
      <el-tab-pane label="tab2" name="second">
        <!-- <investment v-if="activeName == 'second'"/> -->
      </el-tab-pane>
      <el-tab-pane label="tab3" name="third">
        <!-- <beneficiary v-if="activeName == 'third'"></beneficiary> -->
      </el-tab-pane>
      <el-tab-pane label="tab4" name="fourthly">
        <!-- <relation v-if="activeName == 'fourthly'"></relation> -->
      </el-tab-pane>
      <el-tab-pane label="tab5" name="fifth">
        <!-- <stock v-if="activeName == 'fifth'"></stock> -->
      </el-tab-pane>
      <el-tab-pane label="tab6" name="sixth">
        <!-- <framework v-if="activeName == 'sixth'"></framework> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";


@Component({
  name: "echartsDemo",
  components: {}
})
export default class extends Vue {
    private activeName: string = 'first';
    created(){

    }
}
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 0 50px;
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
