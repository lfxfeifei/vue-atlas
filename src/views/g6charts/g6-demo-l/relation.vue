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
          const circle = group.addShape('circle', {
            attrs: {
              fill:color
            },
            name: 'circle-shape',
          });
          const content = cfg.id.replace(/(.{5})/g, "$1\n")
          const text = group.addShape('text', {
            attrs: {
              text: content,
              fill:"#fff",
              fontSIze: 8,
              fontWeight: "bold"
            },
            name: 'text-shape',
          });
          const bbox = text.getBBox()
          circle.attr({
            x: cfg.id.length > 5 ? (bbox.width + 3) / 2 : 10 ,
            y: cfg.id.length > 5 ? -(bbox.width - 10) / 2 : -5,
            r: cfg.id.length > 5 ? bbox.width : 20
          })

          return circle;
        },
      },
      'single-node'
       );
      // console.log(beneficiary, 'beneficiary')
      G6.Util.processParallelEdges(this.g6Data.edges);
      const width = document.getElementById('container').scrollWidth;
      const height = document.getElementById('container').scrollHeight || 900
      const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
        },
        layout: {
          type: 'force',
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
          // labelCfg: {
          //   style: {
          //     fill: '#999',
          //     fontSize: 14,
          //     background: {
          //       fill: '#ffffff',
          //       stroke: 'rgba(47, 84, 235, 0.2)',
          //       padding: [2, 2, 2, 2],
          //       radius: 2,
          //     },
          //   },
          //   position: 'bottom',
          // },
        },
        defaultEdge: {
          size: 1,
          color: '#e2e2e2',
          type: 'quadratic',
          labelCfg: {
            autoRotate: true,
          },
          style: {
            endArrow: true,
            lineWidth: 2,
            stroke: "#c2c8d5",
            labelCfg: {
              style: {
                fill: "#c2c8d5",
                fontSize: 10
              }
            }
          },
        },
      })
      console.log(this.g6Data, '///')
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

    }
    private refreshDragedNodePosition(e) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
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
