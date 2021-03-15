<template>
  <div class="investment" id="map" >

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Scene, LineLayer, PointLayer } from '@antv/l7'
import { CountryLayer } from '@antv/l7-district';
import { Mapbox } from '@antv/l7-maps';


@Component({
  name: "investment",
  components: {
  }
})
export default class extends Vue {

    private ProvinceData = [
      {
        name: '云南省',
        code: 530000,
        value: 17881.12
      },
      {
        name: '黑龙江省',
        code: 230000,
        value: 16361.62
      },
      {
        name: '贵州省',
        code: 520000,
        value: 14806.45
      },
      {
        name: '北京市',
        code: 110000,
        value: 30319.98
      },
      {
        name: '河北省',
        code: 130000,
        value: 36010.27
      },
      {
        name: '山西省',
        code: 140000,
        value: 16818.11
      },
      {
        name: '吉林省',
        code: 220000,
        value: 15074
      },
      {
        name: '宁夏回族自治区',
        code: 640000,
        value: 3705.18
      },
      {
        name: '辽宁省',
        code: 210000,
        value: 25315.35
      },
      {
        name: '海南省',
        code: 460000,
        value: 4832.05
      },
      {
        name: '内蒙古自治区',
        code: 150000,
        value: 17289.22
      },
      {
        name: '天津市',
        code: 120000,
        value: 18809.64
      },
      {
        name: '新疆维吾尔自治区',
        code: 650000,
        value: 12199.08
      },
      {
        name: '上海市',
        code: 310000,
        value: 32679.87
      },
      {
        name: '陕西省',
        code: 610000,
        value: 24438.32
      },
      {
        name: '甘肃省',
        code: 620000,
        value: 8246.07
      },
      {
        name: '安徽省',
        code: 340000,
        value: 30006.82
      },
      {
        name: '香港特别行政区',
        code: 810000,
        value: 0
      },
      {
        name: '广东省',
        code: 440000,
        value: 97277.77
      },
      {
        name: '河南省',
        code: 410000,
        value: 48055.86
      },
      {
        name: '湖南省',
        code: 430000,
        value: 36425.78
      },
      {
        name: '江西省',
        code: 360000,
        value: 21984.78
      },
      {
        name: '四川省',
        code: 510000,
        value: 40678.13
      },
      {
        name: '广西壮族自治区',
        code: 450000,
        value: 20353.51
      },
      {
        name: '江苏省',
        code: 320000,
        value: 92595.4
      },
      {
        name: '澳门特别行政区',
        code: 820000,
        value: null
      },
      {
        name: '浙江省',
        code: 330000,
        value: 56197.15
      },
      {
        name: '山东省',
        code: 370000,
        value: 76469.67
      },
      {
        name: '青海省',
        code: 630000,
        value: 2865.23
      },
      {
        name: '重庆市',
        code: 500000,
        value: 20363.19
      },
      {
        name: '福建省',
        code: 350000,
        value: 35804.04
      },
      {
        name: '湖北省',
        code: 420000,
        value: 39366.55
      },
      {
        name: '西藏自治区',
        code: 540000,
        value: 1477.63
      },
      {
        name: '台湾省',
        code: 710000,
        value: null
      }
    ];
    created(){
    }
    mounted() {
      this.init()
    }

    private init() {
      const scene = new Scene({
        id: 'map',
        map: new Mapbox({
          pitch: 40,
          style: {
            version: 8,
          sources: {},
            layers: [
              {
                id: 'background',
                type: 'background',
                paint: {
                  'background-color': '#2b2b3a'
                }
              }
            ]
          },
          // center: [ 3.438, 40.16797 ],
          center: [ 104.195397, 35.86166 ],
          zoom: 1.91329
        })
      });
      scene.on('loaded', () => {
        Promise.all([
          fetch('https://gw.alipayobjects.com/os/basement_prod/dbd008f1-9189-461c-88aa-569357ffc07d.json').then(d => d.json()),
          fetch('https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json').then(d => d.text()),
          fetch('https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json').then(d => d.text())
        ]).then(([ world, dot, flyline ]) => {
          let ProvinceData = [
            {
              name: '云南省',
              code: 530000,
              value: 17881.12
            },
            {
              name: '黑龙江省',
              code: 230000,
              value: 16361.62
            },
            {
              name: '贵州省',
              code: 520000,
              value: 14806.45
            },
            {
              name: '北京市',
              code: 110000,
              value: 30319.98
            },
            {
              name: '河北省',
              code: 130000,
              value: 36010.27
            },
            {
              name: '山西省',
              code: 140000,
              value: 16818.11
            },
            {
              name: '吉林省',
              code: 220000,
              value: 15074
            },
            {
              name: '宁夏回族自治区',
              code: 640000,
              value: 3705.18
            },
            {
              name: '辽宁省',
              code: 210000,
              value: 25315.35
            },
            {
              name: '海南省',
              code: 460000,
              value: 4832.05
            },
            {
              name: '内蒙古自治区',
              code: 150000,
              value: 17289.22
            },
            {
              name: '天津市',
              code: 120000,
              value: 18809.64
            },
            {
              name: '新疆维吾尔自治区',
              code: 650000,
              value: 12199.08
            },
            {
              name: '上海市',
              code: 310000,
              value: 32679.87
            },
            {
              name: '陕西省',
              code: 610000,
              value: 24438.32
            },
            {
              name: '甘肃省',
              code: 620000,
              value: 8246.07
            },
            {
              name: '安徽省',
              code: 340000,
              value: 30006.82
            },
            {
              name: '香港特别行政区',
              code: 810000,
              value: 0
            },
            {
              name: '广东省',
              code: 440000,
              value: 97277.77
            },
            {
              name: '河南省',
              code: 410000,
              value: 48055.86
            },
            {
              name: '湖南省',
              code: 430000,
              value: 36425.78
            },
            {
              name: '江西省',
              code: 360000,
              value: 21984.78
            },
            {
              name: '四川省',
              code: 510000,
              value: 40678.13
            },
            {
              name: '广西壮族自治区',
              code: 450000,
              value: 20353.51
            },
            {
              name: '江苏省',
              code: 320000,
              value: 92595.4
            },
            {
              name: '澳门特别行政区',
              code: 820000,
              value: null
            },
            {
              name: '浙江省',
              code: 330000,
              value: 56197.15
            },
            {
              name: '山东省',
              code: 370000,
              value: 76469.67
            },
            {
              name: '青海省',
              code: 630000,
              value: 2865.23
            },
            {
              name: '重庆市',
              code: 500000,
              value: 20363.19
            },
            {
              name: '福建省',
              code: 350000,
              value: 35804.04
            },
            {
              name: '湖北省',
              code: 420000,
              value: 39366.55
            },
            {
              name: '西藏自治区',
              code: 540000,
              value: 1477.63
            },
            {
              name: '台湾省',
              code: 710000,
              value: null
            }
          ];
          new CountryLayer(scene, {
            data: ProvinceData ,
            joinBy: [ 'NAME_CHN', 'name' ],
            depth: 1,
            provinceStroke: '#783D2D',
            cityStroke: '#EBCCB4',
            cityStrokeWidth: 1,
            fill: {
              color: {
                field: 'NAME_CHN',
                values: [
                  // '#feedde',
                  // '#fdd0a2',
                  // '#fdae6b',
                  // '#fd8d3c',
                  // '#e6550d',
                  // 'transparent'
                ]
              }
            },
            popup: {
              enable: true,
              Html: props => {
                return `<span>${props.NAME_CHN}</span>`;
              }
            }
          });

          let dotData = eval(dot);
          let flydata = eval(flyline).map(item => {
            const latlng1 = item.from.split(',').map(e => { return e * 1; });
            const latlng2 = item.to.split(',').map(e => { return e * 1; });
            return { coord: [ latlng1, latlng2 ] };
          });
          // const worldFill = new PolygonLayer()
          //   .source(world)
          //   .color('#98E3FA')
          //   .shape('fill')
          //   .style({
          //     opacity: 1
          //   });
          world = {
            ...world,
            features: world.features.filter(item => {
              return item.properties.name == '中国'
            })
          }
          dotData = [
            { lng: '110.106537', lat: '20.026789'},
            { lng: '122.256905', lat: '30.065098'},
            { lng: '118.686467', lat: '11.189592'},
          ]
          flydata = [
            { coord: [
              [ 104.195397, 35.86166 ],
              [ 110.106537, 20.026789  ]
            ]},
            { coord: [
              [ 104.195397, 35.86166 ],
              [ 122.256905, 30.065098  ]
            ]},
            { coord: [
              [ 104.195397, 35.86166 ],
              [ 118.686467, 11.189592  ]
            ]},
          ]
          console.log(world, 'world')
          console.log(dotData, 'dotData')
          console.log(flydata, 'flydata')


          const worldLine = new LineLayer()
            .source(world)
            .color('#41fc9d')
            .size(0.5)
            .style({
              opacity: 0.8
            });
          const dotPoint = new PointLayer()
            .source(dotData, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat'
              }
            })
            .shape('circle')
            .color('#ffed11')
            .animate(true)
            .size(40)
            .style({
              opacity: 1.0
            });
          const flyLine = new LineLayer()
            .source(flydata, {
              parser: {
                type: 'json',
                coordinates: 'coord'
              }
            })
            .color('#ff6b34')
            .shape('arc3d')
            .size(2)
            .active(true)
            .animate({
              interval: 2,
              trailLength: 2,
              duration: 1
            })
            .style({
              opacity: 1
            });
          // scene.addLayer(worldFill);


          // scene.addLayer(worldLine);
          scene.addLayer(dotPoint);
          scene.addLayer(flyLine);
        });

      });

    }
}
</script>

<style lang="scss" scoped>
.investment {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
