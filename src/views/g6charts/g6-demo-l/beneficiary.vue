<template>
  <div id="container" >
  </div>
</template>

<script lang="ts">
import G6 from '@antv/g6';
import { Component, Vue } from "vue-property-decorator";
import beneficiary from "@/assets/data/beneficiary.json";


@Component({
  name: "shareholder",

})
export default class extends Vue {
    mounted() {
      this.g6()
    }
    public g6Data = beneficiary
    private g6() {
      G6.registerNode(
      'card-node',
      {
        drawShape:(cfg, group) => {
          let color = this.handleCirceCol(cfg.category)
          // console.log(cfg, 'cfg',color)
          const shape = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: 20,
              fill:color
            },
            name: 'main-box',
            draggable: true,
          });
          const bbox = shape.getBBox()
          shape.attr({
            x: 0 ,
            y: -10,
          })

          return shape;
        },
      },
      'single-node',
       );
       const tooltip = new G6.Tooltip({
          // offsetX and offsetY include the padding of the parent container
          // offsetX 与 offsetY 需要加上父容器的 padding
          offsetX: 16 + 10,
          offsetY: 24 + 10,
          // the types of items that allow the tooltip show up
          // 允许出现 tooltip 的 item 类型
          itemTypes: ['node', 'edge'],
          // custom the tooltip's content
          // 自定义 tooltip 内容
          getContent: (e) => {
            const outDiv = document.createElement('div');
            outDiv.style.width = 'fit-content';
            //outDiv.style.padding = '0px 0px 20px 0px';
            outDiv.innerHTML = `
              <ul>
                <li>Type: ${e.item.getType()}</li>
              </ul>
              <ul>
                <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
              </ul>`;
            return outDiv;
          },
        });
      // console.log(beneficiary, 'beneficiary')
      G6.Util.processParallelEdges(this.g6Data.edges);
      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 900
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        plugins: [tooltip],
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
        },
        layout: {
          type: 'force',
          // workerEnabled: true,
          nodeSize: 80,
           preventOverlap: true,
          linkDistance: () => {
            return 200
          },
          nodeSpacing: (d) => {
              return 15
          },
          // nodeStrength: (d) => {
          //   if(d.category == 1) {
          //     return 100
          // }
        },
        // animate: true,
        defaultNode: {
          type: "card-node",
          // type: 'circle',
          // size: [40],
          // color: '#5B8FF9',
          // style: {
          //   fill: 'red',
          //   lineWidth: 3,
          // },
          labelCfg: {
            style: {
              fill: '#999',
              fontSize: 14,
              background: {
                fill: '#ffffff',
                stroke: 'rgba(47, 84, 235, 0.2)',
                padding: [2, 2, 2, 2],
                radius: 2,
              },
            },
            position: 'bottom',
          },
        },
        defaultEdge: {
          size: 1,
          color: '#e2e2e2',
          type: 'quadratic',
          labelCfg: {
            autoRotate: true,
          },
          style: {
            endArrow: {
              path: 'M 0,0 L 8,4 L 8,-4 Z',
              fill: '#e2e2e2',
            },
          },
        },
      })
      graph.data(this.g6Data);
      graph.render();
      const forceLayout = graph.get('layoutController').layoutMethod;
      graph.on('node:dragstart',  (e) => {
        graph.layout();
        this.refreshDragedNodePosition(e);
      });
      graph.on('node:drag',  (e) => {
        forceLayout.execute();
        this.refreshDragedNodePosition(e);
      });
      graph.on('node:dragend',  (e) => {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });
      graph.on("node:click", this.handleNodeClick)

    }
    private refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
    private handleNodeClick(e) {
      // console.log(e.item._cfg, 'e')
      let target = e.item._cfg.id
      this.$message({
        message: `${target}被点击了`,
        type: 'success'
      });
    }
    private handleCirceCol(type) {
      let color
      switch (type) {
        case '0':
          color = "#fba92a"
          break;
        case '1':
          color = "#f00"
          break;
        case '2':
          color = "#73f953"
          break;
        case '3':
          color = "#c6e5ff"
          break;
        default:
          color = "#c6e5ff"
      }
      return color
    }
  }
</script>

<style lang="scss" scoped>
  #container {
    width:100% ;
    height: 100%;
  }

</style>
