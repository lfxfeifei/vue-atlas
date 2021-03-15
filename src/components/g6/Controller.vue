
<template>
  <div class="conmenubox">
    <div id="container"></div>
    <div class="detailbox" v-if="detailshow">
      <div class="companydetail">{{company.name}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import G6 from "@antv/g6";

@Component
export default class extends Vue {
  @Prop() private parent: Object;
  private detailshow: boolean = false;
  private company: any = {
    name: ""
  };
  mounted() {
    // this.$nextTick(() => {
    this.g6();
    // })
  }

  private g6() {
    G6.registerNode(
      "sql",
      {
        drawShape(cfg, group) {
          console.log(cfg, group);
          const rect = group.addShape("rect", {
            //设置图中表格的文字距离位置
            attrs: {
              x: cfg.labelCfg ? cfg.labelCfg.style.x : -90,
              y: cfg.labelCfg ? -25 : -40,
              width: cfg.labelCfg ? cfg.labelCfg.style.width : 180, //每个框框的大小
              height: cfg.labelCfg ? 50 : 80,
              radius: 5,
              stroke: "#0084ff", //name属性字体颜色
              fill: cfg.labelCfg ? cfg.labelCfg.style.fill : "#fff",
              lineWidth: 1
            },
            name: "rect-shape"
          });
          //   if (cfg.dataType != "image") {
          const content = cfg.name.replace(/(.{12})/g, "$1\n");
          group.addShape("text", {
            attrs: {
              text: cfg.labelCfg ? cfg.name : content,
              x: 0,
              y: 0,
              fill: cfg.labelCfg ? cfg.labelCfg.style.stroke : "#222",
              fontSize: cfg.labelCfg ? cfg.labelCfg.style.fontSize : 14,
              textAlign: "center",
              textBaseline: "middle",
              lineHeight: 18
            },
            name: "text-shape"
          });

          //   }
          if (cfg.types == 2) {
            group.addShape("rect", {
              //设置图中表格的文字距离位置
              attrs: {
                x: -70,
                y: -90,
                width: 140, //每个框框的大小
                height: 60,
                radius: 1,
                fill: "#FD485E",
                lineWidth: 1
              },
              name: "rect-shape"
            });

            group.addShape("text", {
              attrs: {
                text: "实际控制人",
                x: 0,
                y: -70,
                fill: "#fff",
                fontSize: 18,
                textAlign: "center",
                textBaseline: "middle",
                lineHeight: 18
              },
              name: "text-shape"
            });
            group.addShape("text", {
              attrs: {
                text: "受益股份 " + cfg.percent,
                x: 0,
                y: -45,
                fill: "#fff",
                fontSize: 14,
                textAlign: "center",
                textBaseline: "middle",
                lineHeight: 18
              },
              name: "text-shape"
            });
          }

          return rect;
        }
      },
      "single-node"
    );

    const width = document.getElementById("container").scrollWidth;
    const height = document.getElementById("container").scrollHeight || 500;
    const graph = new G6.Graph({
      container: "container",
      width,
      height,
      layout: {
        type: "dagre",
        nodesepFunc: d => {
          return 100;
        },
        ranksep: 40,
        controlPoints: true
      },
      fitView: true,
      fitCenter: true,
      defaultNode: {
        type: "sql" //默认使用上面设置的类
      },
      modes: {
        default: [
          "drag-canvas",
          "zoom-canvas",

          "drag-node" //允许拖拽画布，放缩画布、拖拽节点
        ]
      }
      //   fitView: true
    });

    graph.edge(edge => {
      return {
        id: edge.id,
        type: "line",
        style: {
          endArrow: {
            path: G6.Arrow.triangle(10, 10, 1),
            d: 1,
            fill: "#128bed"
          },
          lineWidth: 1,
          fillColor: "#f1f1f1"
        },
        labelCfg: {
          style: {
            fill: "#128bed"
          }
        }
      };
    });

    graph.data(this.parent.pathmap);
    graph.render();

    graph.on("node:click", e => {
      if (this.detailshow == false) {
        graph.translate(300, 10);
      }
      this.detailshow = true;
      this.company.name = e.item._cfg.id;
    });
    graph.on("canvas:click", e => {
      if (this.detailshow) {
        this.detailshow = false;

        graph.translate(-300, -10);
      }
    });
  }
}
</script>

<style lang="scss" scoped>
#main {
  width: 100%;
  height: 100%;
}
#container {
  width: 100%;
  height: 100%;
}
.conmenubox {
  position: relative;
  .detailbox {
    width: 250px;
    height: 300px;
    background: #ffffff;
    position: absolute;
    padding: 10px;
    top: 80px;
    left: 15px;
    -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px;
    border-radius: 6px;
  }
}
</style>
