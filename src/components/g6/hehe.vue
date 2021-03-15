
<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import G6 from "@antv/g6";

@Component
export default class extends Vue {
  @Prop() private parent: Object;

  mounted() {
    console.log(this.parent);
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
          const rect =cfg.dataType != "image"?group.addShape("rect", {
            //设置图中表格的文字距离位置
            attrs: {
                x: cfg.labelCfg ? cfg.labelCfg.style.x : -140,
                y: -50,
              width: cfg.labelCfg ? cfg.labelCfg.style.width : 280, //每个框框的大小
              height: 100,
              radius: 10,
              stroke: cfg.labelCfg ? cfg.labelCfg.style.stroke : "#5B8FF9", //name属性字体颜色
              fill: cfg.labelCfg ? cfg.labelCfg.style.fill : "#C6E5FF",
              lineWidth: 3
            },
            name: "rect-shape"
          }):group.addShape("image", {

            attrs: {
             x: -80,
             y: -180,
             width: 160, //每个框框的大小
             height: 160,
             img: cfg.logo,


             clipCfg: {
                show: true,
                type: 'circle',
             },
            },

            name: "image-shape"
          });
        //   if (cfg.dataType != "image") {
            group.addShape("text", {
              attrs: {
                text: cfg.name,
                x: 0,
                y: 0,
                fill: cfg.labelCfg ? cfg.labelCfg.style.stroke : "#000",
                fontSize: cfg.labelCfg ? cfg.labelCfg.style.fontSize : 18,
                textAlign: "center",
                textBaseline: "middle",
                fontWeight: "bold"
              },
              name: "text-shape"
            });
        //   }
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
          return 200;
        },
        ranksep: 80,
        controlPoints: true
      },
      fitView: true,
      fitCenter: true,
      defaultNode: {
        type: "sql", //默认使用上面设置的类


      },
      //   defaultEdge: {
      //     type: "polyline",
      //     style: {
      //       radius: 20,
      //       offset: 45,
      //       endArrow: true,
      //       lineWidth: 4,
      //       stroke: "#C2C8D5",
      //       fontSize: 18,

      //     }
      //   },

      modes: {
        default: [
          "drag-canvas",
          "zoom-canvas",
          // "click-select",
          "drag-node", //允许拖拽画布，放缩画布、拖拽节点
          {
            // type: "tooltip",
            // formatText(model) {
            //     const cfg = model.conf;
            //     const text = [];
            //     cfg.forEach((row) => {
            //     text.push(row.label + ":" + row.value + "<br>");
            //     });
            //     return text.join("\n");
            // },
            offset: 20
          }
        ]
      }
      //   fitView: true
    });

    graph.edge(edge => {
      return {
        id: edge.id,
        type: "line",
        style: {
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 4,
          stroke: edge.isRed == 1 ? "#ff7d18" : "#C2C8D5"
        },
        labelCfg: {
          refY: -30,
          refX: 60,
          style: {
            fill: edge.isRed == 1 ? "#ff7d18" : "#C2C8D5",
            fontSize: 23
          }
        }
      };
    });

    graph.data(this.parent.pathmap);
    graph.render();
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
</style>
