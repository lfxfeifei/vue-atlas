<template>
  <div id="container" >
  </div>
</template>

<script lang="ts">
import G6 from '@antv/g6';
import { Component, Vue } from "vue-property-decorator";
import beneficiary from "@/assets/data/beneficiary.json";
import { mockData } from  './stock.js'
import stockData from  './stocks.js'
@Component({
  name: "stock",

})
export default class extends Vue {
    mounted() {
      this.g6()
    }
    public g6Data = beneficiary
    public data = []
    public dataArr = []
    public i = 0
    private g6() {
      let color = "#128BED"
      let baseObj:any = stockData.topData
      baseObj.children = [
        ...baseObj.children,
        ...stockData.bottomData.children.map(item => {
          return {
            ...item,
            bottom: true
          }
        })
      ]
      console.log(stockData, 'stockData', baseObj)
      this.data = mockData

      G6.Util.traverseTree(this.data, (d) => {
        d.leftIcon = {
          style: {
            fill: '#e6fffb',
            stroke: '#e6fffb',
          },
          img: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ',
        };
        return true;
      });

      G6.registerNode(
        'icon-node',
        {
          options: {
            size: [60, 20],
            stroke: color,
            fill: '#91d5ff',
          },
          draw(cfg, group) {
            const styles = this.getShapeStyle(cfg);
            const { labelCfg = {} } = cfg;

            const w = styles.width;
            const h = styles.height;


            let width = 100
            let height = 40

            if (cfg.parent) {
              width += 100
            }
            const keyShape = group.addShape('rect', {
              attrs: {
                ...styles,
                x: -w / 2,
                y: -h / 2,
                width: width,
                height: height
              },
            });

            cfg.hasChildren &&
            group.addShape('marker', {
              attrs: {
                x: -10,
                y: cfg.bottom? h / 2 : -h / 2  ,
                r: 8,
                cursor: 'pointer',
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                stroke: color,
                lineWidth: 1,
                fill: '#fff',
                color: color
              },
              name: 'collapse-icon',
            });
            let path = 'M-14,40 L-10,46 L-6, 40.1 L-14,40'
            if (cfg.bottom) {
              // path = 'M-14,-25 L-10,-31 L-6, -25.1 L-14,-25'
              path = 'M-14,-26 L-10,-20 L-6, -25.9 L-14,-26'
            }
            !cfg.parent && group.addShape('path', {
              attrs: {
                stroke:color,
                fill: color,
                path,
              },
            });
            // let content = '';
            // cfg.name && (content = cfg.name.replace(/(.{8})/g, '$1\n'));

           (cfg.name) &&
              group.addShape('text', {
                attrs: {
                  ...labelCfg.style,
                  text: cfg.name ,
                  x:  -30 ,
                  y: h / 4,
                },
              });

            return keyShape;
          },
          setState(name, value, item) {
          if (name === 'collapsed') {
            const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
            const icon = value ? G6.Marker.expand : G6.Marker.collapse;
            marker.attr('symbol', icon);
          }
        },
          update: undefined,
        },
        'rect',
      );

      G6.registerEdge('flow-line', {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;

          const { style } = cfg;
          const shape = group.addShape('path', {
            attrs: {
              stroke: style.stroke,
              // endArrow: style.endArrow,
              path: [
                ['M', startPoint.x , startPoint.y ],
                ['L', startPoint.x , (startPoint.y + endPoint.y) / 2],
                ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
                ['L', endPoint.x , endPoint.y ],
              ],
            },
          });

          return shape;
        },
      });

      const defaultStateStyles = {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      };

      const defaultNodeStyle = {
        fill: '#fff',
        stroke: color,
        radius: 5,
      };

      const defaultEdgeStyle = {
        stroke: '#91d5ff',
        endArrow: {
          path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
          fill: '#91d5ff',
          d: -20,
        },
      };

      const defaultLayout = {
        type: 'compactBox',
        direction: 'V',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 40;
        },
        getHGap: function getHGap() {
          return 70;
        },
        getSide: (d) => {
          if (d.data.bottom === true) {
            return 'right';
          }
          return 'left';
        },
      };

      const defaultLabelCfg = {
        style: {
          fill: '#000',
          fontSize: 12,
        },
      };

      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;

      const minimap = new G6.Minimap({
        size: [150, 100],
      });
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        linkCenter: true,
        // plugins: [minimap],
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
        },
        defaultNode: {
          type: 'icon-node',
          size: [120, 40],
          style: defaultNodeStyle,
          labelCfg: defaultLabelCfg,
        },
        defaultEdge: {
          type: 'flow-line',
          style: defaultEdgeStyle,
        },
        nodeStateStyles: defaultStateStyles,
        edgeStateStyles: defaultStateStyles,
        layout: defaultLayout,
      });

      graph.data(this.data);
      graph.render();
      graph.fitView();

      graph.on('node:mouseenter', (evt) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', true);
      });

      graph.on('node:mouseleave', (evt) => {
        const { item } = evt;
        graph.setItemState(item, 'hover', false);
      });

      graph.on('node:click', (e:any) => {
        console.log(e, 'ee')
        let bottom = e.item._cfg.model.bottom
        this.i++
        let arr = [
          {
            id: "张三" + this.i,
            name: "张三" + this.i,
            "hasChildren": true,
            "collapsed": false,
            children: [
              {
                id: "赵武" + this.i,
                name: "赵武" + this.i,
              }
            ]
          },
          {
            id: "李四" + this.i,
            name: "李四" + this.i,
          },
        ]
        function handleArr(arr) {
          if (Object.prototype.toString.call(arr) !== "[object Array]") return []
          arr = arr.map(item => {
            return {
              ...item,
              bottom,
              children: handleArr(item.children)
            }
          })
          return arr
        }
        arr = handleArr(arr)
        const { item, target } = e

        if (e.target.get('name') === 'collapse-icon') {
          const model = item.getModel()
          const { childrenKeys, id, collapsed, recordIndex } = model
          if (!this.dataArr.includes(id) && !model.children ) {
            this.dataArr.push(id)
            model.children = arr
          }
          // 解决 第一次 出问题原因
          if(!e.item.hasState("collapsed")) {
            graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed)
          }
          e.item.getModel().collapsed = !e.item.getModel().collapsed;
          graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed);
          graph.layout();
        }
      });

      if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
    }
  }
</script>

<style lang="scss" scoped>
  #container {
    width:100% ;
    height: 100%;
  }

</style>
