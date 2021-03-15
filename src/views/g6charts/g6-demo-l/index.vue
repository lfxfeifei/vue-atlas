<template>
  <div class="chart-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="股东持股" name="first">
        <shareholder v-if="activeName == 'first'"></shareholder>
      </el-tab-pane>
      <el-tab-pane label="中国地图" name="second">
        <investment v-if="activeName == 'second'"/>
      </el-tab-pane>
      <el-tab-pane label="最终收益人" name="third">
        <beneficiary v-if="activeName == 'third'"></beneficiary>
      </el-tab-pane>
      <el-tab-pane label="关联关系" name="fourthly">
        <relation v-if="activeName == 'fourthly'"></relation>
      </el-tab-pane>
      <el-tab-pane label="股权穿透" name="fifth">
        <stock v-if="activeName == 'fifth'"></stock>
      </el-tab-pane>
      <el-tab-pane label="企业架构" name="sixth">
        <framework v-if="activeName == 'sixth'"></framework>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";


import shareholder from "./shareholder.vue";
import investment from "./investment.vue";
import beneficiary from "./beneficiary.vue";
import relation from "./relation.vue";
import stock from "./stock.vue";
import framework from "./framework.vue";
@Component({
  name: "g6DemoL",
  components: {
    shareholder,
    investment,
    beneficiary,
    relation,
    stock,
    framework
  }
})
export default class extends Vue {
    private activeName: string = 'sixth';
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
