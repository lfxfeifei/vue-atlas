<!-- helloMarked.md -->

# 安装 & 引用
在项目中引入 G6 有以下两种方式：npm 引入，CDN 引入。

### 在项目中使用 npm 包引入
Step 1: 使用命令行在项目目录下执行以下命令：

`npm install --save @antv/g6`

Step 2: 在需要用的 G6 的 JS 文件中导入：

`import G6 from '@antv/g6'`

### 在 HTML 中使用 CDN 引入
Step 1: 使用命令行在项目目录下执行以下命令：

`<script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-{$version}/build/g6.js"></script>`

注意
+ 在 {$version} 中填写版本号，例如 3.1.0；
+ 最新版为 3.1.0，可以在 npm 查看最新版本；
+ 详情参考 Github 分支：https://github.com/antvis/g6/tree/master 。


# 快速试用
创建一个 G6 的关系图仅需要下面几个步骤：
1. 创建关系图的 HTML 容器；
2. 数据准备；
3. 创建关系图；
4. 配置数据源，渲染。

### Step 1 创建容器
需要在 HTML 中创建一个用于容纳 G6 绘制的图的容器，通常为 div 标签。G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。
`<div id="mountNode"></div>`
### Step 2 数据准备
引入 G6 的数据源为 JSON 格式的对象。该对象中需要有节点（nodes）和边（edges）字段，分别用数组表示：

```
const data = {
  // 点集
  nodes: [{
    id: 'node1', // String，该节点存在则必须，节点的唯一标识
    x: 100,      // Number，可选，节点位置的 x 值
    y: 200       // Number，可选，节点位置的 y 值
  },{
    id: 'node2', // String，该节点存在则必须，节点的唯一标识
    x: 300,      // Number，可选，节点位置的 x 值
    y: 200       // Number，可选，节点位置的 y 值
 }],
  // 边集
  edges: [{
    source: 'node1', // String，必须，起始点 id
    target: 'node2'  // String，必须，目标点 id
  }]
};

```

注意 
+ nodes 数组中包含节点对象，唯一的 id 是每个节点对象中必要的属性，x、 y 用于定位；
+ edges 数组中包含边对象，source 和 target 是每条边的必要属性，分别代表了该边的起始点 id 与 目标点 id。
+ 点和边的其他属性参见链接：[G6 的内置节点和边。](https://www.yuque.com/antv/g6/default-node)

### Step 3 创建关系图
创建关系图（实例化）时，至少需要为图设置容器、宽和高：
```
    const graph = new G6.Graph({
    container: 'mountNode',  // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 800,              // Number，必须，图的宽度
    height: 500              // Number，必须，图的高度
    });

```
### Step 4 配置数据源，渲染
```
graph.data(data);  // 读取 Step 2 中的数据源到图上
graph.render();    // 渲染图

```

# 完整代码
```
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Tutorial Demo</title>
        </head>
        <body>
            /* 图的画布容器 */
            <div id="mountNode"></div>
            /* 引入 G6 */
            <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.1.0/build/g6.js"></script>
            <script>
                // 定义数据源
                const data = {
                    // 点集
                    nodes: [{
                        id: 'node1',
                        x: 100,
                        y: 200
                    },{
                        id: 'node2',
                        x: 300,
                        y: 200
                    }],
                    // 边集
                    edges: [
                    // 表示一条从 node1 节点连接到 node2 节点的边
                    {
                        source: 'node1',
                        target: 'node2'
                    }
                    ]
                };
                // 创建 G6 图实例
                const graph = new G6.Graph({
                    container: 'mountNode', // 指定图画布的容器 id，与第 9 行的容器对应
                    // 画布宽高
                    width: 800,
                    height: 500
                });
                // 读取数据
                graph.data(data);
                // 渲染图
                graph.render();
            </script>
        </body>
    </html>

```

