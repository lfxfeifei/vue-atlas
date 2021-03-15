<template>
  <div id="container" >
  </div>
</template>

<script lang="ts">
import G6 from '@antv/g6';
import { Component, Vue } from "vue-property-decorator";


@Component({
  name: "shareholder",

})
export default class extends Vue {
    mounted() {
      this.g6()
    }
    private baseArr = []
    private i = 1
    private baseData = []
    private handleType(data) {
      let obj:any = {}
      switch(data) {
        case "大股东":
          obj = {
            bgCol: "#fff1f2",
            textCol: "#fd495f"
          }
        break;
        case "实际控制人":
          obj = {
            bgCol: "#fef8ee",
            textCol: "#f2b856"
          }
        break;
        case "最终受益人":
          obj = {
            bgCol: "#ecf6fe",
            textCol: "#0e89ed"
          }
        break;
        case "香港":
          obj = {
            bgCol: "#ebeffb",
            textCol: "#7a82d4"
          }
        break;
        default:
          obj = {
            bgCol: "#fff1f2",
            textCol: "#fd495f"
          }
        break;
      }
      return obj
    }
    private handleCol(data) {
      let str:String = ''
      switch(data) {
        case "1":
           str = "#128bed"
        break;
        case "2":
           str = "#fe5151"
        break;
        case "3":
           str = "#4aceb1"
        break;
        case "4":
           str = "#7985f3"
        break;
        default:
          str = "#128bed"
        break;
      }
      return str
    }
    private g6() {
      G6.registerNode('card-node', {
        draw: function drawShape(cfg, group) {
          // console.log(cfg, 'cfg')
          const r = 5;
          let color = '#128bed';
          const w = cfg.size[0];
          let h = cfg.size[1];
          let Y = -h / 2
          let markerY = 0
          let textY = 55
          // 不同高度， 不同位置
          if(cfg.tags && cfg.tags.length != 0) {
            h = 150
            textY = 100
            Y = -h / 2
            Y += (h - cfg.size[1] ) / 2
            markerY += (h - cfg.size[1] ) / 2
            // color = 'pink'
          }
          const shape = group.addShape('rect', {
            attrs: {
              x: w,
              y: Y,
              width: w, //200,
              height: h, // 60
              stroke: '#ccc',
              radius: r,
              fill: '#fff',
            },
            name: 'main-box',
            draggable: true,
          });

          // group.addShape('rect', {
          //   attrs: {
          //     x: w,
          //     y: Y,
          //     width: w, //200,
          //     height: h / 2, // 60
          //     fill: '#fff',
          //     stroke: '',
          //     radius: [r, r, 0, 0],
          //   },
          //   name: 'title-box',
          //   draggable: true,
          // });

           group.addShape('rect', {
            attrs: {
              x: w,
              y: Y,
              width: 10,
              height: h,
              radius: [r, 0, 0, r],
              fill: this.handleCol(cfg.colType)
            },
          });

          // title text
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              x: w  + 55,
              y: cfg.hasChildren === undefined? Y + 45 : Y + 20,
              fontSize: 28,
              lineHeight: 20,
              fontWeight: "bold",
              text: this.fittingString(cfg.name ),
              fill: "#000",
            },
            name: 'title',
          });
          group.addShape('text', {
            attrs: {
              textBaseline: 'top',
              x: w  + 550,
              y: markerY,
              fontSize: 28,
              lineHeight: 20,
              text: "详情",
              cursor: "pointer",
              fill: "#1286ec",
            },
            name: 'title',
          });

          cfg.children &&
            group.addShape('marker', {
              attrs: {
                x: w + 25,
                y: markerY ,
                r: 12,
                cursor: 'pointer',
                symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
                stroke: '#666',
                lineWidth: 1,
                fill: '#fff',
                color: color
              },
              name: 'collapse-icon',
            });
          if (cfg.tags && cfg.tags.length != 0) {
            let count = 0
            for (let i = 0; i < cfg.tags.length; i++) {
              let bg =  group.addShape('rect', {
                attrs: {
                  fill: this.handleType(cfg.tags[i]).bgCol,
                },
              });
              let text = group.addShape('text', {
                attrs: {
                  textBaseline: 'top',
                  x: 0,
                  y: 30,
                  lineHeight: 20,
                  fontSize: 18,
                  textAlign: 'left',
                  textBaseline: 'middle',
                  text: cfg.tags[i],
                  fill: this.handleType(cfg.tags[i]).textCol
                },
              });

              let box = text.getBBox();

              text.attr({
                x: w + count + 60
              })

              bg.attr({
                x: w + count + 55,
                y: box.minY - 8,
                width: box.width + 15,
                height: box.height + 10,
              })
              count += box.width + 30
            }
          }

          let arr = ["股权比例 :","","持股数 :",""]
          if (cfg.amount !== undefined || cfg.percent !== undefined || cfg.money !== undefined) {

            arr[1] = cfg.percent
            arr[3] = cfg.amount || cfg.money
            if (cfg.money) {
              arr[2] = '认缴金额'
            }
            let count = 0
            let h = (cfg.tags && cfg.tags.length != 0) ? 0 : -35
            for (let i = 0; i < arr.length; i++) {
              let text = group.addShape('text', {
                attrs: {
                  x: 0,
                  y: h + 70,
                  lineHeight: 20,
                  fontSize: 18,
                  textAlign: 'left',
                  textBaselineL: 'middle',
                  text: arr[i],
                  fill: i % 2 == 0? '#898989' : '#ff853f'
                }
              })

              let box = text.getBBox()

              text.attr({
                x: w + count + 60
              })
              count += box.width + 30
              if (i == 1) {
                count += 20
              }
              console.log(arr, '---', count)
            }
          }
          return shape;
        }.bind(this),
        setState(name, value, item) {
          if (name === 'collapsed') {
            const marker = item.get('group').find((ele) => ele.get('name') === 'collapse-icon');
            const icon = value ? G6.Marker.expand : G6.Marker.collapse;
            marker.attr('symbol', icon);
          }
        },
      });
      G6.registerEdge(
        'step-line',
        {
          getControlPoints: function getControlPoints(cfg) {
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            return [
              startPoint,
              {
                x: startPoint.x + 10,
                y: endPoint.y - 10,
              },
              endPoint,
            ];
          },
          draw: function drawShape(cfg,group) {
            const shape = group.addShape('path', {
              attrs: {
                path: [
                  ['M', 100, 100],
                  ['L', 200, 200]
                ],
                stroke: this.handleCol(cfg.target._cfg.model.colType)
              },
              name: 'path-shape'
            })
            return shape
          }.bind(this)
        },
        'loop',
      );
      this.baseData = {
        "id": "13b3dc89-98d3-4c29-b3f7-831ec564d46d",
        "name": "国泰君安证券股份有限公司",
        "colType": "1",
        "identifier": 10,
        "children": [
          {
            "id": "1cb85107-b315-457b-9c28-dc7769695f76",
            "name": "上海国有资产经营有限公司",
            "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "190096.3748万股",
            "colType": "2",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 1,
            "percent": "21.34%",
            "tags": ['大股东'],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0,
            "children": [
              {
               "id": "1cb85107-b315-457b-9c28-12312356f",
                "name": "上海国际集团有限公司",
                "relationType": "shareholder",
                "shType": "十大股东",
                "money": "550000万",
                "colType": "2",
                "hasChildren": true,
                "collapsed": true,
                "identifier": 1,
                "percent": "21.34%",
                "tags": ['大股东'],
                "tagDict": {
                  "upwards": ["存续"],
                  "downwards": [],
                  "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
                },
                "statusCode": "1",
                "isController": 0,
                "children": [
                  {
                    "id": "1231f32-b315-457b-9c28-dc7769695f76",
                    "name": "上海国有资产监督管理委员",
                    "relationType": "shareholder",
                    "shType": "十大股东",
                    "money": "3000000万",
                    "colType": "2",
                    "hasChildren": true,
                    "collapsed": true,
                    "identifier": 1,
                    "percent": "21.34%",
                    "tags": ['大股东',  '实际控制人', '最终受益人'],
                    "tagDict": {
                      "upwards": ["存续"],
                      "downwards": [],
                      "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
                    },
                    "statusCode": "1",
                    "isController": 0,
                  }
                ]
              }
            ]
          },
          {
            "id": "417d61e4-be1d-11e6-8a4c-00163f00240b",
            "name": "香港中央结算（代理人）有限公司",
            "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "139175.092万股",
            "colType": "2",
            "hasChildren": false,
            "identifier": 2,
            "percent": "15.62%",
            "tags": ['香港'],
            "tagDict": {
              "upwards": ["存续", "香港"],
              "downwards": [],
              "upwardsPairs": [
                { "code": "1", "name": "存续", "type": 0 },
                { "code": "HK", "name": "香港", "type": 1 }
              ]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "738bec65-db94-4858-8bdc-f158682a8270",
            "name": "上海国际集团有限公司",
          "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "68221.5791万股",
            "colType": "3",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 3,
            "percent": "7.66%",
            "tags": [],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "03bca8dd-7445-4c87-aee7-80613580f832",
            "name": "深圳市投资控股有限公司",
          "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "60942.8357万股",
            "colType": "4",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 4,
            "percent": "6.84%",
            "tags": ["投资机构"],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "ff4b7241-8cce-4317-abc6-5ae133e5b0c8",
            "name": "中国证券金融股份有限公司",
          "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "26054.7316万股",
            "colType": "4",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 5,
            "percent": "2.92%",
            "tags": [],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "394441fa-f50b-4b99-89c4-141ce74aeb1b",
            "name": "上海城投（集团）有限公司",
          "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "24656.6512万股",
            "colType": "4",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 6,
            "percent": "2.77%",
            "tags": [],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "2b91cfdb-63a1-4c14-b7cf-8cc7e77123a3",
            "name": "深圳能源集团股份有限公司",
            "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "15445.5909万股",
            "colType": "4",
            "hasChildren": true,
            "collapsed": true,
            "identifier": 7,
            "percent": "1.73%",
            "tags": ["上市公司"],
            "tagDict": {
              "upwards": ["存续", "上市"],
              "downwards": ["A股|深圳能源 000027.SZ"],
              "upwardsPairs": [
                { "code": "1", "name": "存续", "type": 0 },
                { "code": "companies", "name": "上市", "type": 2 }
              ]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "08a32aee-be17-11e6-b97b-00163e014a2c",
            "name": "香港中央结算有限公司",
            "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "13488.8063万股",
            "colType": "4",
            "hasChildren": false,
            "identifier": 8,
            "percent": "1.51%",
            "tags": [],
            "tagDict": {
              "upwards": ["存续", "香港"],
              "downwards": [],
              "upwardsPairs": [
                { "code": "1", "name": "存续", "type": 0 },
                { "code": "HK", "name": "香港", "type": 1 }
              ]
            },
            "statusCode": "1",
            "isController": 0
          },
          {
            "id": "8af64ece-5bcd-11eb-9891-00163e0ca5c5",
            "name": "龙山县接待服务中心",
            "relationType": "shareholder",
            "shType": "十大股东",
            "amount": "9005.7532万股",
            "colType": "4",
            "hasChildren": false,
            "identifier": 9,
            "percent": "1.01%",
            "tags": [],
            "tagDict": {
              "upwards": ["存续"],
              "downwards": [],
              "upwardsPairs": [{ "code": "1", "name": "存续", "type": 0 }]
            },
            "statusCode": "1",
            "isController": 0
          }
        ],
        "entType": "0"
      }

      const width = document.getElementById('container').scrollWidth ;
      const height = document.getElementById('container').scrollHeight || 600 ;
      const toolbar = new G6.ToolBar()
      const graph = new G6.TreeGraph({
        plugins: [toolbar],
        container: 'container',
        width ,
        height,
        modes: {
          default: [
            // {
            //   type: 'collapse-expand',
            //   animate: true,
            //   onChange: function onChange(item, collapsed) {
            //     const data = item.get('model');
            //     data.collapsed = collapsed;
            //     return true;
            //   },
            // },
            'drag-canvas',
            // 'zoom-canvas',
          ],
        },
        defaultNode: {
          type: 'card-node',
          size: [650, 110],
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9',
          },
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            // stroke: '#A3B1BF'
          },
        },
        layout: {
          type: 'indented',
          isHorizontal: true,
          direction: 'LR',
          indent: 30,
          getHeight: (d) => {
            let h = 85
            if(d.tags && d.tags.length != 0) {
              h = 125
            }
            return h;
          },
        },
      });
      // graph.node(function(node) {
      //   return {
      //     type: 'card-node',
      //     size: [500, 80],
      //     style: {
      //       fill: '#C6E5FF',
      //       stroke: '#5B8FF9',
      //     },
      //   }
      //   // return {
      //   //   type: "card-node",
      //   //   style: {
      //   //     fill: "#40a9ff",
      //   //     stroke: "#096dd9"
      //   //   },
      //   //   label: node.name,
      //   //   labelCfg: {
      //   //     position: "center",
      //   //     style: {
      //   //       fontSize: 14
      //   //     }
      //   //   }
      //   // };
      // });
      graph.edge(() => {
        return {
          type: 'step-line',
          style: {
            // stroke: '#A3B1BF'
          },
        };
      })
      graph.data(this.baseData);
      graph.render();
      graph.fitView();
      graph.on('node:click', (e) => {
        // this.i++
        // let arr = [
        //   {
        //     amount: "123123.21万股",
        //     percent: "12.2%",
        //     name: "国泰君安" + this.i,
        //     tags: [],
        //     id:"国泰君安" + this.i,
        //   }
        // ]
        const { item, target } = e

        if (e.target.get('name') === 'collapse-icon') {
          const model = item.getModel()
          const { childrenKeys, id, collapsed, recordIndex } = model
          // if (!this.baseArr.includes(id) && !model.children ) {
          //   this.baseArr.push(id)
          //   model.children = arr
          // }
          // 解决 第一次 出问题原因
          if(!e.item.hasState("collapsed")) {
            graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed)
          }
          e.item.getModel().collapsed = !e.item.getModel().collapsed;
          graph.setItemState(e.item, 'collapsed', e.item.getModel().collapsed);
          graph.layout();
        }

      });
    }
    private  fittingString = (str, maxWidth = 400, fontSize = 12) => {
      const ellipsis = '...';
      const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
      let currentWidth = 0;
      let res = str;
      const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
      str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return;
        if (pattern.test(letter)) {
          // Chinese charactors
          currentWidth += fontSize;
        } else {
          // get the width of single letter according to the fontSize
          currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth - ellipsisLength) {
          res = `${str.substr(0, i)}${ellipsis}`;
        }
      });
      return res;
    };
}
</script>

<style lang="scss" scoped>
  #container {
    width:100% ;
    height: 100%;
  }

</style>
