
<template>
    <div>
        <div id="main"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
    import G6 from '@antv/g6'
    
    @Component
  
    export default class extends Vue {
      @Prop() private parent:Object; 
       mounted() {
            // this.$nextTick(() => {
                 this.g6()
            // })
        }
    
         private g6(){
            
           G6.registerNode(
              "sql", 
            {
                drawShape(cfg,group){
                     const rect = group.addShape("rect", {
                            //设置图中表格的文字距离位置
                        attrs: {
                            x: -100,
                            y: -50,
                            width: 210,  //每个框框的大小
                            height: 100,
                            radius: 10,
                            stroke: "#5B8FF9",//name属性字体颜色
                            fill: "#C6E5FF",
                            lineWidth: 3,
                        },
                        name: "rect-shape",
                    });
                    if (cfg.name) {
                        console.log(cfg.name)
                        group.addShape("text", {
                            attrs: {
                            text: cfg.name,
                            x: 0,
                            y: 0,
                            fill: "#000",
                            fontSize: 16,
                            textAlign: "center",
                            textBaseline: "middle",
                            // fontWeight: "bold",
                            },
                            name: "text-shape",
                        });
                    }
                    return rect;
                    
                },
            },
             "single-node"
           )
      
    
            const graph = new G6.Graph({
                container: "main",
                width:1500,
                height:1000,
                layout: {
                    type: "dagre", //布局  默认Random
                    rankdir: 'LR', // 可选，默认为图的中心
                    nodesep:200,
                    ranksep: 120,
                    controlPoints: true,
                },
                defaultNode: {
                    type: "sql",//默认使用上面设置的类
                },
                defaultEdge: {
                    type: "polyline",
                    style: {
                        radius: 20,
                        offset: 45,
                        endArrow: true,
                        lineWidth: 2,
                        stroke: "#C2C8D5",
                    },
                },
                nodeStateStyles: {
                    selected: {
                        stroke: "#d9d9d9",
                        fill: "#5394ef",
                    },
                    //   鼠标 hover 上节点，即 hover 状态为 true 时的样式
                    hover: {
                        fill: "lightsteelblue",
                    },
                },
                modes: {
                    default: [
                        "drag-canvas",
                        "zoom-canvas",
                        "click-select",
                        "drag-node", //允许拖拽画布，放缩画布、拖拽节点
                        {
                        type: "tooltip",
                        // formatText(model) {
                           
                        //     const cfg = model.conf;

                        //     const text = [];
                        //     cfg.forEach((row) => {
                        //     text.push(row.label + ":" + row.value + "<br>");
                        //     });
                        //     return text.join("\n");
                        // },
                        offset: 30,
                        },
                    ],
                },
                fitView: true,
            });
         
            graph.data(this.parent);
            graph.render();
      
        };
       
    
    
        
    }
</script>

<style lang="scss" scoped>
  
</style>
