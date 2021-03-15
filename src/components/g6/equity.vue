
<template>
  <div>
    <div id="mountNode"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from "vue-property-decorator";
import G6 from "@antv/g6";

@Component
export default class extends Vue {
  @Prop() private parent: Object;
  private tackdatas:Object={
      nodes:[],
      edges:[],
  }
  mounted() {
    // this.$nextTick(() => {

    this.g6();

    // })
  }


  private g6() {
    var graph = new G6.TreeGraph({
      container: "mountNode",
      width: 1100,
      height: 900,

      modes: {
        //交互模式
        // 存在 default 和 edit 两种 mode（交互模式）:
        // default 模式中包含点击选中节点行为和拖拽画布行为;
        // edit 模式中包含点击节点弹出编辑框行为和拖拽节点行为。
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
       
              var data = item.get("model");
              data.collapsed = collapsed;
              return true;
            }
          },
          "drag-canvas",
          "zoom-canvas",
          "drag-node" //允许拖拽画布，放缩画布、拖拽节点
        ]
      },
      // 节点在默认状态下的样式配置（style）和其他配置
      defaultNode: {
        size: 100,

        type: "circle",
        style: {
          fill: "#40a9ff",
          stroke: "green",
          padding: [3, 2, 3, 2],
          radius: 2,
          lineWidth: 1
        },
        labelCfg: {
          style: {
            fill: "#fff",
            fontSize: 14
          }
        }
      },
      // 边在默认状态下的样式配置（style）和其他配置
      defaultEdge: {
        type: "cubic-horizontal",

        style: {
          stroke: "#f00",
          //   startArrow:{
          //     path: G6.Arrow.vee(10, 20, 15),
          //     d: 25,
          //     fill: "#f00",
          //     stroke: "#0f0",
          //     opacity: 0.5,
          //     lineWidth: 3
          //   },
          endArrow: {
            path: G6.Arrow.vee(10, 20, 15),
            d: 25,
            fill: "#f00",
            stroke: "#0f0",
            opacity: 0.5,
            lineWidth: 3
          }
        }
      },
      layout: {
        // Object，可选，布局的方法及其配置项，默认为 random 布局。
        type: "mindmap",
        direction: "H",
        getHeight: function getHeight() {
          return 50;
        },
        getWidth: function getWidth() {
          return 249;
        },
        getVGap: function getVGap() {
          return 30;
        },
        getHGap: function getHGap() {
          return 40;
        }
      }
    });

    graph.node(function(node) {
      return {
        size: 100,
        type: "circle",
        style: {
          fill: "#40a9ff",
          stroke: "#096dd9"
        },
        label: node.id,
        labelCfg: {
          position: "center",
          style: {
            fontSize: 14
          }
        }
      };
    });

    graph.edge(function(node) {
        console.log(node.source._cfg.model)
      return {
        type: "cubic-horizontal",
        color: "#f00",
        label: node.source._cfg.model.label,
        labelCfg: {
          position: "center",
          style: {
            fontSize: 14
          }
        }
      };
    });

    graph.data(this.parent);
    graph.render();
    graph.fitView();
    graph.zoom(0.3);
  }
}
</script>

<style lang="scss" scoped>
</style>
