
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
    // this.$nextTick(() => {
    this.g6();
    // })
  }

  private g6() {
    // 折叠图标
    const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 2 - r, y - r],
        ["L", x + r - 2, y - r]
      ];
    };
    // // // 展开图标
    const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
      return [
        ["M", x - r, y - r],
        ["a", r, r, 0, 1, 0, r * 2, 0],
        ["a", r, r, 0, 1, 0, -r * 2, 0],
        ["M", x + 2 - r, y - r],
        ["L", x + r - 2, y - r],
        ["M", x, y - 2 * r + 2],
        ["L", x, y - 2]
      ];
    };
    // 自定义连线
   G6.registerEdge("flow-line", {
      draw(cfg, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;

        const { style } = cfg;
        const shape = group.addShape("path", {
          attrs: {
            stroke:cfg.target._cfg? cfg.target._cfg.model.fill:"#1890ff",
            endArrow: style.endArrow,
            path: [
                ['M', startPoint.x, startPoint.y],
          // ['L', endPoint.x / 3 + 1 / 3 * startPoint.x , startPoint.y], // 三分之一处
          ['L', endPoint.x / 3 + 2 / 3 * startPoint.x , endPoint.y],   // 三分之二处
          ['L', endPoint.x, endPoint.y]
            ]
          }
        });

        return shape;
      }
    });
    // 自定义节点
    G6.registerNode(
      "tree-node",
      {
        drawShape: function drawShape(cfg, group) {
          // 边框样式设置
          let rect = group.addShape("rect", {
            attrs: {
              fill: cfg.fill || "#fff", // 背景色
              stroke: cfg.fill ? "#fff" : "#40a9ff", // 边框色
              opacity: cfg.fill && cfg.depth ? 0.15 : 1 // 透明度
            },
            name: "rect-shape"
          });
          if (cfg.depth == 2) {
            rect = group.addShape("rect", {
              attrs: {
                fill: "#fff", // 背景色
                stroke: cfg.fill, // 边框色
                opacity: 0.5 // 透明度
              },
              name: "rect-shape"
            });
          }

          const content = cfg.name.replace(/(.{15})/g, "$1\n");
          // 字体样式设置
          const text = group.addShape("text", {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              textAlign: "left",
              textBaseline: "middle",
              fill: cfg.depth ? "#000" : "#fff" // 字体颜色
            },
            name: "rect-shape"
          });
          const bbox = text.getBBox();
          const hasChildren = cfg.children && cfg.children.length > 0;
          // 第一级元素 增加数量显示
          if (cfg.depth == 1) {
            // 目前写死距离
            const leftData = {
              "2": 4,
              "4": 16,
              "7": 34
            };
            group.addShape("text", {
              attrs: {
                text: cfg.children.length,
                x: leftData[content.length],
                y: 20,
                textAlign: "left",
                textBaseline: "middle",
                fill: "#000" // 字体颜色
              },
              name: "rect-shape"
            });
            if (hasChildren) {
              group.addShape("marker", {
                attrs: {
                  x: cfg.x > 0 ? bbox.maxX + 14 : -16,
                  y: bbox.minX + bbox.height + 2,
                  r: 6,
                  symbol: cfg.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
                  stroke: cfg.fill,
                  lineWidth: 1
                },
                name: "collapse-icon"
              });
            }
            rect.attr({
              x: hasChildren && cfg.x < 0 ? bbox.minX - 32 : bbox.minX - 16,
              y: bbox.minY - 16,
              width: hasChildren ? bbox.width + 48 : bbox.width + 32,
              height: bbox.height + 48,
              radius: 4
            });
          } else {
            // 无子数据 返回样式
            if (!hasChildren) {
              rect.attr({
                x: bbox.minX - 8,
                y: bbox.minY - 6,
                width: bbox.width + 16,
                height: bbox.height + 12,
                radius: 4
              });
            } else {
              // 有子数据 非根元素
              if (cfg.depth) {
                rect.attr({
                  x: cfg.x > 0 ? bbox.minX - 8 : bbox.minX - 24,
                  y: bbox.minY - 6,
                  width: cfg.x > 0 ? bbox.width + 32 : bbox.width + 30,
                  height: bbox.height + 12,
                  radius: 4
                });
              } else {
                rect.attr({
                  x: bbox.minX - 16,
                  y: bbox.minY - 16,
                  width: bbox.width + 32,
                  height: bbox.height + 32,
                  radius: 4
                });
              }
            }
          }
          return rect;
        }
      },
      "single-node"
    );
    // 绘制大小
    const width = document.getElementById("container").scrollWidth;
    const height = document.getElementById("container").scrollHeight || 500;
    // 工具栏
    const toolbar = new G6.ToolBar();
    // mini图
    // const minimap = new G6.Minimap()
    // 基础配置
    const graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
              const data = item.get("model");

              const icon = item
                .get("group")
                .find(element => element.get("name") === "collapse-icon");
              if (collapsed) {
                icon.attr("symbol", EXPAND_ICON);
              } else {
                icon.attr("symbol", COLLAPSE_ICON);
              }
              data.collapsed = collapsed;
              return true;
            }
          },
          "drag-canvas",
          "zoom-canvas"
        ]
      },
      defaultNode: {
        type: "tree-node"
      },
       defaultEdge: {
        // cubic-horizontal 曲线 polyline 直线 line 默认线
        type: "flow-line"
      },

      nodeStateStyles: {
        hover: {
          lineWidth: 1
        }
      },
      layout: {
        type: "compactBox",
        direction: "H",
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 4;
        },
        getWidth: function getWidth() {
          return 80;
        },
        getVGap: function getVGap() {
          return 30;
        },
        getHGap: function getHGap() {
          return 140;
        }
      },
      plugins: [toolbar]
    });

    G6.Util.traverseTree(this.parent, function(item) {
      item.id = item.name + item.fill;
    });
    // 渲染
    graph.data(this.parent);
    graph.render();
    graph.fitView();

    // 事件监听
    graph.on("node:mouseenter", evt => {
      const { item } = evt;
      if (item._cfg.model.depth == 1) {
        item._cfg.keyShape.attrs.opacity = 0.3;
      }
      if (item._cfg.model.depth == 2) {
        item._cfg.keyShape.attrs.opacity = 1;
      }
      graph.setItemState(item, "hover", true);
    });
    graph.on("node:mouseleave", evt => {
      const { item } = evt;
      if (item._cfg.model.depth == 1) {
        item._cfg.keyShape.attrs.opacity = 0.15;
      }
      if (item._cfg.model.depth == 2) {
        item._cfg.keyShape.attrs.opacity = 0.3;
      }
      graph.setItemState(item, "hover", false);
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
</style>
