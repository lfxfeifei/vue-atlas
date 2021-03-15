<template>
  <div class="noLaundering" v-loading="loading">
    <div v-if="beneficiary">
      <!-- <div class="title">
        <span
          v-for="(item, index) in nodeClasses"
          :key="index"
          class="itemTitle"
          :style="{ color: item.selected ? item.style.fillColor : '#ccc' }"
          icon="el-icon-info"
          @click="
            item.selected = !item.selected
            select(item)
          "
        >
          <li />
          {{ item.name }}
        </span>
      </div>-->
      <div ref="chartContainer" id="container"></div>
    </div>
    <div v-if="!beneficiary && !loading" class="data-null">暂无数据</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { NetChart } from '@dvsl/zoomcharts'
import G6 from "@antv/g6";
export default {
  name: "NoLaundering",
  data() {
    return {
      currentGraph: null,
      loading: false,
      noLaunderingCharts: null,
      nodeClasses: [
        {
          className: "0",
          name: "查询企业",
          selected: true,
          style: {
            radius: 30,
            fillColor: "#3b90dd"
          }
        },
        {
          className: "1",
          name: "中间节点",
          selected: true,
          style: {
            fillColor: "#5bada8",
            radius: 30
          }
        },
        {
          className: "2",
          name: "直接或间接控股",
          selected: true,
          style: {
            fillColor: "#547a94",
            radius: 30
          }
        },
        {
          className: "3",
          name: "关键管理人员",
          selected: true,
          style: { fillColor: "#f0a620", radius: 30 }
        }
      ],
      // beneficiary: { "data": [{ "draggable": true, "name": "贾跃亭", "category": 3 }, { "draggable": true, "name": "赵凯", "category": 3 }, { "draggable": true, "name": "吴孟", "category": 3 }, { "draggable": true, "name": "乐视控股（北京）有限公司", "category": 0 }], "links": [{ "source": "贾跃亭", "value": "执行董事", "target": "乐视控股（北京）有限公司" }, { "source": "赵凯", "value": "监事", "target": "乐视控股（北京）有限公司" }, { "source": "吴孟", "value": "经理", "target": "乐视控股（北京）有限公司" }, { "source": "贾跃亭", "value": "92.07%", "target": "乐视控股（北京）有限公司" }] }
      beneficiary: {
        data: [
          { category: 3, draggable: true, name: "何姗姗" },
          { category: 3, draggable: true, name: "向锐" },
          {
            category: 0,
            draggable: true,
            name: "巨量引擎（上海）计算机科技有限公司"
          },
          {
            category: 1,
            draggable: true,
            name: "北京巨量引擎网络技术有限公司"
          },
          { category: 1, draggable: true, name: "今日头条有限公司" },
          { category: 1, draggable: true, name: "字节跳动有限公司" },
          { category: 2, draggable: true, name: "张一鸣" }
        ],
        links: [
          {
            source: "何姗姗",
            target: "巨量引擎（上海）计算机科技有限公司",
            value: "监事"
          },
          {
            source: "向锐",
            target: "巨量引擎（上海）计算机科技有限公司",
            value: "执行董事"
          },
          {
            source: "北京巨量引擎网络技术有限公司",
            target: "巨量引擎（上海）计算机科技有限公司",
            value: "100.00%"
          },
          {
            source: "今日头条有限公司",
            target: "北京巨量引擎网络技术有限公司",
            value: "100.00%"
          },
          {
            source: "字节跳动有限公司",
            target: "今日头条有限公司",
            value: "100.00%"
          },
          { source: "张一鸣", target: "字节跳动有限公司", value: "98.81%" }
        ]
      }
      // beneficiary: { "data": [{ "draggable": true, "name": "李庆文", "category": 3 }, { "draggable": true, "name": "李剑平", "category": 3 }, { "draggable": true, "name": "胡新胜", "category": 3 }, { "draggable": true, "name": "张鹏", "category": 3 }, { "draggable": true, "name": "张习刚", "category": 3 }, { "draggable": true, "name": "黄明", "category": 3 }, { "draggable": true, "name": "张建军", "category": 3 }, { "draggable": true, "name": "孙新春", "category": 3 }, { "draggable": true, "name": "张福萍", "category": 3 }, { "draggable": true, "name": "徐明", "category": 3 }, { "draggable": true, "name": "梁继福", "category": 3 }, { "draggable": true, "name": "李红安", "category": 3 }, { "draggable": true, "name": "宋喜茜", "category": 3 }, { "draggable": true, "name": "程大勇", "category": 3 }, { "draggable": true, "name": "金龙精密铜管集团股份有限公司", "category": 0 }, { "draggable": true, "name": "重庆万州经济技术开发（集团）有限公司", "category": 1 }, { "draggable": true, "name": "重庆市万州区国有资产监督管理委员会", "category": 2 }, { "draggable": true, "name": "重庆万州经开区股权投资基金合伙企业（有限合伙）", "category": 1 }, { "draggable": true, "name": "重庆三峡产业投资有限公司", "category": 1 }], "links": [{ "source": "李庆文", "value": "监事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "李剑平", "value": "董事兼副总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "胡新胜", "value": "董事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "张鹏", "value": "副董事长兼副总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "张习刚", "value": "监事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "黄明", "value": "董事长兼总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "张建军", "value": "董事兼副总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "孙新春", "value": "副总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "张福萍", "value": "监事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "徐明", "value": "董事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "梁继福", "value": "职工代表监事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "李红安", "value": "副总经理", "target": "金龙精密铜管集团股份有限公司" }, { "source": "宋喜茜", "value": "董事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "程大勇", "value": "董事", "target": "金龙精密铜管集团股份有限公司" }, { "source": "重庆万州经济技术开发（集团）有限公司", "value": "92.81%", "target": "金龙精密铜管集团股份有限公司" }, { "source": "重庆市万州区国有资产监督管理委员会", "value": "51.00%", "target": "重庆万州经济技术开发（集团）有限公司" }, { "source": "重庆万州经开区股权投资基金合伙企业（有限合伙）", "value": "33.33%", "target": "重庆万州经济技术开发（集团）有限公司" }, { "source": "重庆三峡产业投资有限公司", "value": "19.99%", "target": "重庆万州经开区股权投资基金合伙企业（有限合伙）" }, { "source": "重庆万州经济技术开发（集团）有限公司", "value": "100.00%", "target": "重庆三峡产业投资有限公司" }] }
    };
  },
  watch: {
    beneficiary: {
      handler(newVal) {
        const dom = this.$refs.chartContainer;
        if (!dom) return;
        if (!this.currentGraph && newVal) {
          this.init();
        }
      },
      immediate: true
    }
  },
  computed: {},
  mounted() {
    this.init();
  },
  methods: {
    // select(item) {
    //   if (!item.selected) {
    //     this.currentGraph.getNodes().forEach(node => {
    //       if (node._cfg.model.className == item.className) {
    //         node.hide()
    //         this.currentGraph.getEdges().forEach(edge => {
    //           edge.hide()
    //         })
    //       }
    //     })

    //   } else {
    //     this.currentGraph.getNodes().forEach(node => {
    //       if (node._cfg.model.className == item.className) {
    //         node.show()
    //       }
    //     })
    //     this.currentGraph.getEdges().forEach(edge => {
    //       edge.show()
    //     })
    //   }
    // },
    async init() {
      if (!this.beneficiary) return;

      this.loading = true;
      let dnodes = [];
      this.beneficiary.data.map(item => {
        if (item.category != 3) {
          dnodes.push(item);
        }
      });
      const data = this.beneficiary;

      const link = data.links || [];
      const node = dnodes || [];
      // 实例化netChart对象
      const nodes = node.map(item => {
        return {
          id: item.name,
          className: item.category + "",
          style: { fillColor: "#87bde8", label: item.name }
        };
      });

      const links = link.map(item => {
        return {
          source: item.source,
          target: item.target,
          label: item.value,
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
      const datas = {
        nodes: nodes,
        edges: links
      };
      console.log(datas);

      G6.registerNode(
        "sql",
        {
          drawShape(cfg, group) {
            const rect =
              cfg.className == 2
                ? group.addShape("circle", {
                    attrs: {
                      stroke:
                        cfg.className == 0
                          ? "#128bed"
                          : cfg.className == 2
                          ? "#FD485E"
                          : "#3da5f9",
                      fill: cfg.className == 0 ? "#128bed" : "#fff",
                      lineWidth: 1
                    },
                    name: "circle-shape"
                  })
                : group.addShape("rect", {
                    //设置图中表格的文字距离位置
                    attrs: {
                      radius: 3,
                      stroke:
                        cfg.className == 0
                          ? "#128bed"
                          : cfg.className == 2
                          ? "#FD485E"
                          : "#128bed",
                      fill: cfg.className == 0 ? "#128bed" : "#fff",
                      lineWidth: 1
                    },
                    name: "rect-shape"
                  });
            const content = cfg.id.replace(/(.{12})/g, "$1\n");
            const text = group.addShape("text", {
              attrs: {
                text: cfg.className == 0 ? cfg.id : content,
                fill: cfg.className == 0 ? "#fff" : "#333",
                fontSize: cfg.className == 0 ? 14 : 12,
                textAlign: "center",
                textBaseline: "middle",
                lineHeight: 17
              },
              name: "text-shape"
            });
            const bbox = text.getBBox();
            if (cfg.className == 2) {
              rect.attr({
                r: 40,
                width:
                  cfg.className == 0
                    ? bbox.width + 20
                    : cfg.className == 2
                    ? 80
                    : 160,
                height: cfg.className == 0 ? 30 : 60
              });
            } else {
              rect.attr({
                x:cfg.className == 0? -bbox.width / 2 - 10
                    : cfg.className == 2
                    ? -40
                    : -80,
                y: cfg.className == 0 ? -15 : -30,
                width:
                  cfg.className == 0
                    ? bbox.width + 20
                    : cfg.className == 2
                    ? 80
                    : 160,
                height: cfg.className == 0 ? 30 : 60
              });
            }

            return rect;
          }
        },
        "single-node"
      );
      const tooltip = new G6.Tooltip({
        // offsetX and offsetY include the padding of the parent container
        // offsetX 与 offsetY 需要加上父容器的 padding
        offsetX: 24,
        offsetY: 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ["node", "edge"],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: e => {
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          //outDiv.style.padding = '0px 0px 20px 0px';
          outDiv.innerHTML = `
      <h4>Custom Content</h4>
      <ul>
        <li>Type: ${e.item.getType()}</li>
      </ul>
      <ul>
        <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
      </ul>`;
          return outDiv;
        }
      });

      G6.Util.processParallelEdges(datas.edges);
      const dContainer = document.getElementById("container");
      const width = dContainer.scrollWidth;
      const height = 700;

      const graph = new G6.Graph({
        container: "container",
        width,
        height,
        // 设置为true，启用 redo & undo 栈功能
        enabledStack: true,
        fitCenter: true,
        plugins: [tooltip],
        layout: {
          type: "dagre",
          nodesepFunc: d => {
            return 100;
          },
          ranksep: 30,
          controlPoints: true
        },

        defaultNode: {
          type: "sql" //默认使用上面设置的类
        },
        // defaultEdge: {
        //   type: 'quadratic',
        //   style: {
        //     radius: 20,
        //     offset: 45,
        //     endArrow: true,
        //     lineWidth: 2,
        //     stroke: '#C2C8D5'
        //   },
        //   labelCfg: {
        //     autoRotate: true,
        //     style: {
        //       fill: '#333'
        //     }
        //   }
        // },
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-node" //允许拖拽画布，放缩画布、拖拽节点
          ]
        }
      });

      graph.data(datas);
      graph.render();
      this.loading = false;
      graph.on("node:mouseenter", e => {
        graph.setItemState(e.item, "active", true);
      });
      graph.on("node:mouseleave", e => {
        graph.setItemState(e.item, "active", false);
      });
    }
  },
  beforeDestroy() {
    this.currentGraph = null;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.noLaundering {
  .title {
    display: flex;
    justify-content: flex-end;
    right: 0px;
    z-index: 9;
    font-size: 14px;
    padding: 10px;
    .itemTitle {
      li {
        width: 10px;
        text-align: center;
      }
      display: flex;
      line-height: 30px;
      cursor: pointer;
      margin: 5px;
    }
  }
  .container {
    min-height: 470px;
  }
  .data-null {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }
}
</style>
