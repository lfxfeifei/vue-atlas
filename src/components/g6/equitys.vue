
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
    // 自定义节点
    G6.registerNode(
      "sql",
      {
        drawShape(cfg, group) {
          const rect = group.addShape("rect", {
            //设置图中表格的文字距离位置
            attrs: {
              fill: cfg.fill || "#fff", // 背景色
              stroke: cfg.fill ? "#fff" : "#40a9ff", // 边框色
              opacity: cfg.fill && cfg.depth ? 0.15 : 1 // 透明度
            },
            name: "rect-shape"
          });
          const content = cfg.name.replace(/(.{8})/g, "$1\n");
          const text = group.addShape("text", {
            attrs: {
              text: content,
              x: 0,
              y: 0,
              fill: "#000",
              fontSize: 18,
              textAlign: "center",
              textBaseline: "middle"
              // fontWeight: "bold",
            },
            name: "rect-shape"
          });
       
          const bbox = text.getBBox();
          const hasChildren = cfg.children && cfg.children.length > 0;
          if (cfg.dtype == 1) {
            if (cfg.hasNode) {
              group.addShape("marker", {
                attrs: {
                  x: bbox.maxX - 69,
                  y: bbox.minY - 12,
                  r: 14,
                  symbol: cfg.collapsed ? COLLAPSE_ICON :EXPAND_ICON,
                  stroke: "#f00",
                  lineWidth: 2
                },
                name: "collapse-icon"
              });
            }
          }else{
             if (cfg.hasNode) {
              group.addShape("marker", {
                attrs: {
                  x: bbox.maxX - 69,
                  y: bbox.minY + 76,
                  r: 14,
                  symbol: cfg.collapsed ? COLLAPSE_ICON :EXPAND_ICON,
                  stroke: "#f00",
                  lineWidth: 2
                },
                name: "collapse-icon"
              });
            }
          }

          rect.attr({
            x: bbox.minX - 16,
            y: cfg.hasNode && cfg.x < 0 ? bbox.minY - 32 : bbox.minY - 22,
            width: bbox.width + 32,
            height: cfg.hasNode ? bbox.height + 48 : bbox.height + 36,
            radius: 4
          });
          return rect;
        }
      },
      "single-node"
    );

    // 绘制大小
    const width = document.getElementById("container").scrollWidth;
    const height = document.getElementById("container").scrollHeight;
    // 工具栏
    // const toolbar = new G6.ToolBar();
    // mini图
    // const minimap = new G6.Minimap()
    // 基础配置
    const graph = new G6.Graph({
      container: "container",
      width,
      height,
      layout: {
        type: "dagre", //布局  默认Random
        rankdir: "H", // 可选，默认为图的中心
        nodesep: 50,
        ranksep: 60,
        controlPoints: true
      },
      defaultNode: {
        type: "sql" //默认使用上面设置的类
      },
      defaultEdge: {
        type: "polyline",
        style: {
          radius: 50,
          offset: 45,
          endArrow: true,
          lineWidth: 2,
          stroke: "#C2C8D5"
        }
      },
      nodeStateStyles: {
        selected: {
          stroke: "#d9d9d9",
          fill: "#5394ef"
        },
        //   鼠标 hover 上节点，即 hover 状态为 true 时的样式
        hover: {
          fill: "lightsteelblue"
        }
      },
      modes: {
        default: [
      
   
          "drag-canvas",
          "zoom-canvas",
          // "click-select",
          // "drag-node", //允许拖拽画布，放缩画布、拖拽节点
        
        ]
      }

      // plugins: [toolbar]
    });
    const data = {};
    data.nodes = [];
    data.edges = [];
    G6.Util.traverseTree(this.parent, function(item) {
      item.id = JSON.stringify(item.id);
      item.holderList.forEach(element => {
        element.dtype = 1;
        element.id = JSON.stringify(element.id);
        let obj = {};
        obj.source = element.id;
        obj.target = item.id;
        data.edges.push(obj);
      });
      item.investorList.forEach(element => {
        element.dtype = 2;
        element.id = JSON.stringify(element.id);
        let obj = {};
        obj.source = item.id;
        obj.target = element.id;
        data.edges.push(obj);
      });
      data.nodes.push(...item.holderList);
      data.nodes.push(...item.investorList);
      let orr = item;
      data.nodes.push(orr);
    
    });
    // 渲染
    graph.data(data);
    graph.render();
    graph.fitView();
  graph.on('node:click', function (evt) {
  const item = evt.item;

  const nodeId = item.get('id');


    // const childData=[
    //   {
    //                 "amount": "5000万人民币",
    //                 "companyType": "0",
    //                 "percentFloat": "1.0",
    //                 "name": "上海生腾数据科技有限公司",
    //                 "isHoldingCompany": true,
    //                 "id": 3075030723,
    //                 "source": 5,
    //                 "hasNode": true,
    //                 "percent": "100%",
    //                 "brand": "启信宝"
    //             },
    //             {
    //                 "amount": "150万元",
    //                 "regStatus": "注销",
    //                 "companyType": "0",
    //                 "percentFloat": "0.2496",
    //                 "name": "上海派尔弗投资中心（有限合伙）",
    //                 "id": 3051183167,
    //                 "source": 7,
    //                 "hasNode": false,
    //                 "percent": "24.96%"
    //             },
    // ]

    // graph.addChild(childData, nodeId);

  
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
