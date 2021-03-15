<template>
  <div class="register">
    <el-container>
      <div class="tree-svg" id="treeId"></div>
    </el-container>
  </div>
</template>

<script>
const imgUrl = 'http://www.ect888.com/u/system/202004/29111213utvw.png';
import d3 from 'd3'
const diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.x, d.y]; });
export default {
  name: 'register',
  components: {

  },
  computed: {

  },
  data() {
    return {
      root: {
        "name": "北京云计算科技有限公司",
        "size": "1",
        "children": [{
          "name": "合肥分公司",
          "size": "11",
        }, {
          "name": "上海分公司",
          "size": "12",
        }, {
          "name": "杭州分公司",
          "size": "13",
        }, {
          "name": "无锡分公司",
          "size": "14",
        }]
      },
      tree: null,
      zm: null,
      height: 750,
      count: 0,
      duration: 800,

    };
  },
  created() {
    var that = this
    var tree = d3.layout.tree().nodeSize([60, 60]);
    that.tree = tree
  },
  mounted() {
    var that = this;
    var svg = d3.select("#treeId").append("svg").attr("width", 960).attr("height", 650)
      .call(that.zm = d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", d => { svg.attr("transform", "translate(" + d3.event.translate + ")"); }))
      .append("g")
      .attr("transform", "translate(" + 480 + "," + 50 + ")");

    that.zm.translate([512, 50]);
    that.svg = svg
    that.root.x0 = 0;
    that.root.y0 = that.height / 2;

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }
    // Initialize the display to show a few nodes.
    that.root.children.forEach(collapse);

    that.update(that.root);
  },
  methods: {
    update(source) {
      var that = this
      // Compute the new tree layout.
      var nodes = that.tree.nodes(that.root).reverse(),
        links = that.tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function (d) { d.y = d.depth * 180; });
      // Update the nodes…
      var node = that.svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++that.count); });

      // Enter any new nodes at the parent's previous position.
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + source.x0 + "," + source.y0 + ")";
        })
        .on("click", d => that.click(d));

      // nodeEnter.append('image')
      //   .attr('xlink:href', d => {
      //     return d.image
      //   })
      //   .attr('x', d => {
      //     return d.children || d._children ? -25 : -25
      //   })
      //   .attr('y', -50)
      nodeEnter
        .append("rect")
        .attr("x", d =>
          -20
        )
        // .attr("y", d =>
        //   0
        // )
        .attr("type", d => d.id)
        .attr("width", d => 50)
        .attr("height", d => 50)
        .style('stroke', function (d) {
          return '#CCC'
        })
        .style('fill', '#fff')
      nodeEnter.append("text")
        .attr("x", "5")
        .attr("y", "25")
        .attr("font-size", "12px")
        .attr('text-anchor', function (d) {
          return 'middle'
        })
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1e-6);

      // Transition nodes to their new position.
      var nodeUpdate = node.transition()
        .duration(that.duration)
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

      nodeUpdate.selectAll('image')
        .attr('width', 50)
        .attr('height', 50)

      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      var nodeExit = node.exit().transition()
        .duration(that.duration)
        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

      nodeExit.select('image')
        .attr('width', 0)
        .attr('height', 0)

      nodeExit.select("text")
        .style("fill-opacity", 1e-6);

      // Update the links…
      var link = that.svg.selectAll("path.link")
        .data(links, function (d) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert("svg:path", "g")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", "2")
        .attr("d", function (d) {
          var o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link.transition()
        .duration(that.duration)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(that.duration)
        .attr("d", function (d) {
          var o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    click(d) {
      const that = this
      // #重点关注这个函数的不同之处。尤其是else部分
      let mnodes;
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      } else {
        mnodes = that.getNode(d.size);
        d.children = mnodes;
      }
      that.update(d);
    },
    getNode(id) {
      // #自定义的一个新的以同步方式从后台取数据的ajax函数
      let nodes = [];
      switch (id) {
        case '11':
          nodes = [{
            "name": "张三"
          }, {
            "name": "李四"
          }, {
            "name": "王五"
          }];
          break;
        case '12':
          nodes = [{
            "name": "赵六"
          }, {
            "name": "周七"
          }, {
            "name": "吴八"
          }];
          break;
        case '13':
          nodes = [{
            "name": "王九"
          }, {
            "name": "李斯"
          }, {
            "name": "司马十"
          }];
          break;
        case '14':
          nodes = [{
            "name": "好一二三"
          }, {
            "name": "当十二"
          }, {
            "name": "张十三"
          }];
          break;
      }

      return nodes;
    },
  }
};


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register {
  padding-top: 50px;
  width: 100%;
}
.tree-svg {
  margin: 0 auto;
  border: 1px solid #f00;
}
</style>