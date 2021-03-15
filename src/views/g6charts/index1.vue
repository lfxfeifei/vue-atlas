<template>
  <div class="chart-container">
    <g6index id="main" :parent="ggdata"></g6index>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import g6index from "@/components/g6/index.vue";
import companydata from "@/assets/data/company.json";
@Component({
  name: "BarChartDemo",
  components: {
    g6index
  }
})
export default class extends Vue {

    created(){
        console.log(companydata)
    }
  private ggdata: object = {
    // 点集
    nodes: [
      {
        id: "1",
        dataType: "hg",
        name: "BEGIN" + "\n" + "A",
        // size: 40,//字体大小
        // visible: true,//控制是否隐藏
        // label: "BEGIN根据专营店ID查询大区小区", //文本
        // type: "circle",//圆形===映射节点的形状
        // lineWidth: 22, //映射边的粗细
        labelCfg: {
          positions: "center", // 标签的属性，标签在元素中的位置
          style: {
            // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
            fontSize: 20, // 标签的样式属性，文字字体大小
            fill: "#000", // 样式属性，元素的填充色
            stroke: "#888", // 样式属性，元素的描边色
            opacity: "0.3" //透明度
          }
        }
      },
      {
        id: "2",
        dataType: "hg",
        name: "A" + "\n" + "B"
        // label: "A校验计划周、推荐数、浮动上下限数据",
      },
      {
        id: "3",
        dataType: "alps",
        name: "B" + "\n" + "C"
      },
      {
        id: "4",
        dataType: "sql",
        name: "UPDATE_A" + "\n" + "D"
      },
      {
        id: "5",
        dataType: "sql",
        name: "UPDATECHECK" + "\n" + "E"
      },
      {
        id: "6",
        dataType: "sql",
        name: "UPDATE" + "\n" + "F"
      },
      {
        id: "7",
        dataType: "sql",
        name: "UPDATE_B" + "\n" + "G"
      },
      {
        id: "8",
        dataType: "sql",
        name: "ADD_A" + "\n" + "H"
      },
      {
        id: "9",
        dataType: "sql",
        name: "ADD" + "\n" + "I"
      },
      {
        id: "10",
        dataType: "sql",
        name: "EXIT" + "\n" + "J"
      }
    ],
    edges: [
      {
        source: "1",
        target: "2"
      },
      {
        source: "2",
        target: "3"
      },
      {
        source: "2",
        target: "4",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "2",
        target: "5",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "2",
        target: "6",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "2",
        target: "7",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "3",
        target: "8",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "4",
        target: "8",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "5",
        target: "8",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "6",
        target: "8",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "7",
        target: "8",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "8",
        target: "9",
        // 线条备注
        label: "DATACHECK"
      },
      {
        source: "9",
        target: "10",
        // 线条备注
        label: "DATACHECK"
      },
     
    ]
  };
}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
