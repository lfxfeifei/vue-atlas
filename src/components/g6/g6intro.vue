
<template>
    <div>
        <div id="mountNode"></div>
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
            const graph = new G6.Graph({
                container: 'mountNode',  // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
                width: 500,              // Number，必须，图的宽度
                height: 300              // Number，必须，图的高度
            });
            graph.data(this.parent);  // 读取 Step 2 中的数据源到图上
            graph.render();    // 渲染图
      
        };
       
    
    
        
    }
</script>

<style lang="scss" scoped>
  
</style>
