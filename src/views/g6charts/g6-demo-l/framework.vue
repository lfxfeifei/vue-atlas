<template>
  <div id="container" >
  </div>
</template>

<script lang="ts">
import G6 from '@antv/g6';
import { Component, Vue } from "vue-property-decorator";
import { mockData } from  './framework.js'
@Component({
  name: "stock",

})
export default class extends Vue {
    mounted() {
      this.g6()
    }
    public data = mockData
    public dataArr = []
    public i = 0
    private g6() {
      const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
        return [
          ['M', x - r, y - r],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x + 2 - r, y - r],
          ['L', x + r - 2, y - r],
        ];
      };
      const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
        return [
          ['M', x - r, y - r],
          ['a', r, r, 0, 1, 0, r * 2, 0],
          ['a', r, r, 0, 1, 0, -r * 2, 0],
          ['M', x + 2 - r, y - r],
          ['L', x + r - 2, y - r],
          ['M', x, y - 2 * r + 2],
          ['L', x, y - 2],
        ];
      };

      const color = '#128BED'
      const person = 'red'
      const minWidth = 60

      const BaseConfig = {
        nameFontSize: 12,
        childCountWidth: 22,
        countMarginLeft: 0,
        itemPadding: 16,
        nameMarginLeft: 4,
        rootPadding: 18,
      };

      G6.registerNode('treeNode', {
        draw: (cfg:any, group: any) => {
          let label = cfg.name || cfg.desc || ''
          const rootNode = cfg.parent
          const hasChildren = cfg.hasChildren || (cfg.children && cfg.children.length !== 0)
          const {
            childCountWidth,
            countMarginLeft,
            itemPadding,
            nameMarginLeft,
            rootPadding,
          } = BaseConfig;

          let width = 0;
          const height = 28;
          const x = 0;
          const y = -height / 2;
          let n = 30;
          let markerX = 24;
          const keyShapeAttrs = {
            x: rootNode? x + 20: x,
            y,
            height,
            radius: 4,
            fill: rootNode? color : 'transparent',
            stroke: cfg.hiddenChildren === false? 'transparent' : color
          };
          const keyShape = group.addShape('rect', {
            attrs: keyShapeAttrs,
            name: 'root-key-shape-rect-shape',
          });

          // // + -
          let marker = ''
          if (hasChildren && !rootNode) {
            marker = group.addShape('marker', {
              attrs: {
                x: 0,
                y: 6,
                r: 6,
                cursor: 'pointer',
                symbol: cfg.collapsed ? EXPAND_ICON : COLLAPSE_ICON,
                stroke: color,
                lineWidth: 1,
                fill: '#fff',
                color: color
              },
              name: 'collapse-icon',
            });
          }

           // 名称文本
          const text = group.addShape('text', {
            attrs: {
              text: rootNode? cfg.name.replace(/(.{6})/g, '$1\n') : label,
              x: rootNode? x * 2 + 30 : x * 2,
              y: y + 10,
              textAlign: 'left',
              textBaseline: 'top',
              lineHeight: 16,
              fontFamily: 'PingFangSC-Regular',
              fill: rootNode? '#fff' : '#000'
            },
            cursor: 'pointer',
            name: 'name-text-shape',
          });
          let box = text.getBBox()
          const textWidth = box.width;
          const textHeight = box.height;
          width = textWidth + itemPadding + nameMarginLeft;
          width = width < minWidth ? minWidth : width;

          let pathY = -6
          let circleX = width + 30
          let pathX = width + 30

          if (cfg.desType === 'up') {
            n = -50
            markerX = box.x + width - 44
          }
          if (cfg.desType === 'up' && cfg.hiddenChildren === false) {
            markerX = -55
            circleX -= 80
            pathX -= 80
          }
          let rightArr = ['E-10', 'E-12', 'E-13', 'E-14', 'E-06']
          if (!rightArr.includes(cfg.classType)) {
            pathX += 10
          }
          let path = [
            [ 'M', 12 + pathX, pathY ],
            [ 'L', 12 + pathX, 12 + pathY ],
            [ 'L', 2 + pathX, 6 + pathY ],
            [ 'L', 12 + pathX, pathY ],
          ]
          if (rightArr.includes(cfg.classType)) {
            path = [
              [ 'M', 12 + pathX, pathY ],
              [ 'L', 12 + pathX, 12 + pathY ],
              [ 'L', 22 + pathX, 6 + pathY ],
              [ 'L', 12 + pathX, pathY ],
            ]
          }

          if (cfg.hiddenChildren === false) {
            group.addShape('path', {
              attrs: {
                fill: cfg.isPerson? person : color,
                path,
              }
            })
            group.addShape('circle', {
              attrs: {
                r: 5,
                fill: color,
                x: circleX,
                y:  pathY + 6
              }
            })
          }

          marker && marker.attr({
            x: markerX
          })
          rootNode && text.attr({
            y: -5
          })
          !rootNode && text.attr({
            x: n + (width - textWidth) / 2
          })

          keyShape.attr({
            width,
            height: rootNode? textHeight : height
          })
          !rootNode && keyShape.attr({
            x: n
          })
          return keyShape;
        },
        setState(name, value, item) {
          if (name === 'collapsed') {
            const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
            const icon = value ? EXPAND_ICON : COLLAPSE_ICON;
            marker.attr('symbol', icon);
          }
        },
      });

      G6.registerEdge('smooth', {
        draw(cfg, group) {
          const { startPoint, endPoint } = cfg;
          const path = [
            ['M', startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
            ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
            ['L', endPoint.x, endPoint.y],
          ];

          const shape = group.addShape('path', {
            attrs: {
              stroke: '#AAB7C4',
              path,
            },
            name: 'smooth-path-shape',
          });
          return shape;
        },
      });


      const container = document.getElementById('container');
      const width = container.scrollWidth;
      const height = container.scrollHeight || 500;
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'treeNode',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5],
          ],
        },
        defaultEdge: {
          type: 'smooth',
        },
        layout: {
          type: 'compactBox',
          direction: 'H',
          getId: function getId(d) {
            return d.id;
          },
          getHeight: function getHeight() {
            return 16;
          },
          getWidth: function getWidth(d) {
            let name = d.name || d.desc || ''
            const labelWidth = G6.Util.getTextSize(name, BaseConfig.nameFontSize)[0];
            let width =
              BaseConfig.itemPadding +
              BaseConfig.nameMarginLeft +
              labelWidth +
              BaseConfig.rootPadding +
              BaseConfig.childCountWidth;
              width = Math.max(width, 100)
            return width;
          },
          getVGap: function getVGap() {
            return 15;
          },
          getHGap: function getHGap() {
            return 30;
          },
          getSide: (d) => {
            if(d.data.desType === 'down') {
              return "left"
            }
            return "right"
          }
        },
      });
      graph.data(this.data);
      graph.render();
      graph.fitView();

      graph.on('node:click', (e) => {
        if (e.item._cfg.model && e.item._cfg.model.parent) return
        let desType = e.item._cfg.model && e.item._cfg.model.desType
        this.i++
        let arr = [
          {
            name: "国泰君安" + this.i,
            hasChildren: true,
            collapsed: true,
            scale: "22.2%"
          },
          {
            name: "乐视控股" + this.i,
            hasChildren: true,
            collapsed: true
          },
          {
            name: "贾跃亭" + this.i,
            hasChildren: true,
            collapsed: true,
            isPerson: true
          },
        ]
        let time = new Date().getTime()
        let handleArr = (arr) => {
          if (Object.prototype.toString.call(arr) !== "[object Array]") return []
          arr = arr.map(item => {
            return {
              ...item,
              id: item.name + time + this.i++,
              desType
            }
          })
          return arr
        }
        arr = handleArr(arr)
        const { item, target } = e
        if (
          e.target.get('name') === 'collapse-icon' ||
          e.target.get('name') === 'root-key-shape-rect-shape' ||
          e.target.get('name') === 'name-text-shape'
          ) {
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
      })

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
