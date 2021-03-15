<template>
  <div class="chart-container">
    <Controller id="main" :parent="ggdata"></Controller>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import Controller from "@/components/g6/Controller.vue"
const companydata = require("@/assets/data/company.json")
const xinwoData = require("@/assets/data/xinwoBaoxin.json")
@Component({
  name: "BarChartDemo",
  components: {
    Controller,
  },
})
export default class extends Vue {
  created() {
    this.ggdata = this.handleData()
  }
  private ggdata: object = {}
  private handleData() {
    const targetName = "宝信软件（武汉）有限公司"
    //实际控制人
    let actualController = { name, type: 2, gId: "" }
    const { controllerList } = xinwoData.resultData.P0090008Data
    let controller = controllerList[0].controller
    let percent=controllerList[0].percent
    actualController.name = controller
    actualController.gId = controller

    //节点--控制人，查询的企业
    const controllerNode = {
      id: controller,
      name: controller,
        types:2,//判断是否为最终受益人
      percent:percent,
      dataType: "alps",
      labelCfg: {
        positions: "center",
        style: {
          fontSize: 14,
          fill: "#fff",
          stroke: "#222",
          opacity: "0.3",
          width: 240,
          x: -120,
        },
      },
    }

    const targetNode = {
      id: targetName,
      name: targetName,
      dataType: "hg",
      labelCfg: {
        positions: "center",
        style: {
          fontSize: 20,
          fill: "#0084ff",
          stroke: "#fff",
          opacity: "0.3",
          width: 280,
          x: -140,
        },
      },
    }

    //边
    let edges: any[] = []
    //节点
    let nodes: any[] = []
    const { controlPathList } = controllerList[0]
    let edgItem
    controlPathList.forEach((element: any) => {
      edgItem = {
        source: element.stockHolderName,
        target: element.investedCompanyName,
        label: element.percent,
      }
      nodes.push(element.stockHolderName)
      nodes.push(element.investedCompanyName)

      edges.push(edgItem)
    })

    let _nodes = Array.from(new Set(nodes))
    let graphNodes: any[] = [] //显示在界面上的node
    _nodes.forEach((element: any) => {
      if (element === controllerNode.name) {
        graphNodes.push(controllerNode)
      } else if (element === targetNode.name) {
        graphNodes.push(targetNode)
      } else {
        graphNodes.push({ id: element, name: element })
      }
    })

    return { actualController, pathmap: { edges, nodes: graphNodes } }
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
