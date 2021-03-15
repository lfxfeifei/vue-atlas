<template>
	<div id="layout">
		<div id="product_tree"></div>
		<!-- <div id='download' @click="downloadfun()">⬇</div> -->
		<div id="rtbtn" onclick="javascript:history.go(-1);">
			<!-- <img src="../../assets/rtbtn1.png" alt=""> -->
		</div>
	</div>
</template>
<script>
import * as d3 from "d3";
	import $ from 'jquery'
	export default {
		name: 'tree',
		data() {
			let _this = this;
			return {
				proCorpid: this.$route.query.corpid,
				Slide: 0,
				self: '',
				screenWidth: document.body.clientWidth,
				arr: [],
				tree: document.getElementById('product_tree')
			};
		},
		watch: {
			screenWidth(val) { //监听屏幕高宽度 重新绘制图片
				if (!this.timer) {
					this.screenWidth = val
					this.timer = true
					let that = this
					setTimeout(function() {
						// console.log(that.screenWidth)
						let tree = document.getElementById('product_tree')
						tree.style.width = that.screenWidth + "px";
						tree.innerHTML = ''
						that.drawing()
						that.timer = false
					}, 500) //延时
				}
			}
		},
		mounted: function() {
			var _this = this;
			_this.self = _this;
			var tree = document.getElementById('product_tree')

			function resize() { //设置tree的宽度为屏幕的高度 高度为屏幕的宽度
				var html = document.getElementsByTagName('html')[0];
				var width = html.clientWidth;
				var height = html.clientHeight;
				var max = width > height ? width : height;
				var min = width > height ? height : width;
				tree.style.width = max + "px";
				tree.style.height = min + "px";
				tree.style.backgroundColor = "#FFF"
			}
			resize();
			//禁止浏览器body多的部分滚动 若页面内容过长 将不能滑动
			tree.addEventListener('touchmove', (e) => {
				e.preventDefault();
				e.stopPropagation();
			}, {
				passive: false
			})
			window.addEventListener("resize", resize)
			this.drawing()
			window.onresize = () => { //监听屏幕宽度
				return (() => {
					window.screenWidth = document.body.clientWidth
					_this.screenWidth = window.screenWidth
				})()
			};
		},
		methods: {
			downloadfun() { //canvas图片转img下载功能
				// 				//获取svg内容
				var _this = this;
				var html = document.getElementsByTagName('html')[0]; //获取可视区域宽

				var Bwidth = html.clientWidth;//转换屏幕宽高
				var Bheight = html.clientHeight;
				var Bmax = Bwidth > Bheight ? Bwidth : Bheight;
				var Bmin = Bwidth > Bheight ? Bheight : Bwidth;


				var canvas = document.createElement("canvas");
				var g = document.getElementsByTagName('g')[0].getBBox()
				var svgbox = $('#product_tree svg')
				var gbox = document.getElementsByClassName('gbox')[0];
				var x = (g.width / 2 - html.clientWidth / 2) //计算偏移位置
				var y = 0;
				g.y < 0 ? y = Math.abs(g.y) : y = 0
				// gbox.style.transform = "translate(" + x + 'px' + "," + (y-60) + "px" + ")  scale(1)"; //偏移位置
				gbox.style.transform = "translate(" + x + 'px' + "," + y + "px" + ")  scale(1)"; //偏移位置
				svgbox.attr('width', g.width)
				svgbox.attr('height', g.height)
				var svg = document.getElementById('product_tree').innerHTML;
				var c = canvas.getContext('2d');
				//新建Image对象
				var img = new Image();
				//svg内容
				img.src = 'data:image/svg+xml,' + unescape(encodeURIComponent(svg)); //svg内容中可以有中文字符
				img.src = 'data:image/svg+xml,' + svg; //svg内容中不能有中文字符
				//图片初始化完成后调用
				var cwidth = g.width;
				var imgfile = null;
				img.onload = function() {
					//将canvas的宽高设置为图像的宽高
					canvas.width = cwidth;
					canvas.height = g.height +60;
					//canvcas画图片
					c.fillStyle = "#fff";
					c.fillRect(0, 0, canvas.width, canvas.height);
					c.drawImage(img, 0, 30);
					var a = document.createElement("a");
					a.download = "fallback";
					a.herf = canvas.toDataURL("image/png");
					imgfile = a.herf
					if(imgfile.length<100){
						alert('图大')
					}else{
						_this.$http.post(_this.BASEURL +'/profund/mail/file',JSON.stringify({
								'image':imgfile
							})).then(res=>{
								console.log(res)
							}).catch(res=>{

						})
					}

				}
				//图片转换为base64后 传给后端 发邮件

				gbox.style.transform = ''
				svgbox.attr('width', Bmax)
				svgbox.attr('height', Bmin)
			},
			drawing() {
				var  treeData = {};
				var _obj = {};
				var rootName = ''; //根节点的名字
				var selfthis = this.self;
				var ajaxurl = this.BASEURL //请求地址
				var corpid = this.proCorpid;
				var rootRectWidth = 0; //根节点rect的宽度
				var downwardLength = 0,
					upwardLength = 0;
				var tree = document.getElementById('product_tree')
				var Slidenum = this.Slide
				var treeChart = function(d3Object) {
					this.d3 = d3Object;
					this.directions = ['upward', 'downward'];
				};
				treeChart.prototype.drawChart = function() {
					var newTree = {}
					var self = this;

					selfthis.$http.post(ajaxurl + 'profund/familysearch', JSON.stringify({
						"companyType": 0,
						"corpid": corpid
					})).then(response => {
						var res=response.data;
						if (res.status === 'success') {
							treeData = JSON.parse(JSON.stringify(res.data))
							console.log(treeData)
							rootName = res.data.downward.name; //获取根节点名称
							rootRectWidth = rootName.length * 16; //设置第一个节点的宽度
							//获得upward第一级节点的个数
							upwardLength = res.data.upward.children.length;
							//获得downward第一级节点的个数
							downwardLength = res.data.downward.children.length;
							self.graphTree(self.getTreeConfig());

						} else if (res.status === 'error' && res.error === 10328) {
							alert('暂无数据')
							history.go(-1)

						}
					});
				};

				treeChart.prototype.getTreeConfig = function() {
					var treeConfig = {
						'margin': {
							'top': 10,
							'right': 5,
							'bottom': 0,
							'left': 30
						}
					}

					treeConfig.chartWidth = tree.clientWidth;
					treeConfig.chartHeight = tree.clientHeight;
					treeConfig.centralHeight = treeConfig.chartHeight / 2;
					treeConfig.centralWidth = treeConfig.chartWidth / 2;
					treeConfig.linkLength = 150;
					treeConfig.duration = 0; //动画时间
					return treeConfig;
				};

				treeChart.prototype.graphTree = function(config) {
					var self = this;
					var d3 = this.d3;
					var linkLength = config.linkLength;
					var duration = config.duration;
					var hasChildNodeArr = [];
					var id = 0;

					var diagonal = function(obj) { //折线
						// console.log(obj)
						var s = obj.source;
						var t = obj.target;
						return "M" + (s.x) + "," + s.y + "L" + s.x + "," + (s.y + (t.y - s.y) / 2) + "L" + t.x + "," +
							(s.y + (t.y - s.y) / 2) + "L" + (t.x) + "," + t.y;
					}

					var zoom = d3.behavior.zoom().scaleExtent([0.2, 1.8]).on('zoom', redraw) //缩放

					var svg = d3.select('#product_tree') //定义svg大小
						.append('svg')
						.attr("class", "linkG")

						.attr('xmlns', 'http://www.w3.org/2000/svg')
						.attr('width', config.chartWidth + config.margin.right + config.margin.left)
						// .attr('width',3200)
						.attr('height', config.chartHeight + config.margin.top + config.margin.bottom)
						.on('mousedown', disableRightClick)
						.call(zoom)
						.on('dblclick.zoom', null)
						.on('doubleTap.zoom', null);

					// 					var treeG = svg.append('g') //添加g元素
					// 						.attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
					var treeG = svg.append('g') //添加g元素
						.attr('class', 'gbox')
						.attr('transform', 'translate(' + 0 + ',' + 0 + ') scale(1)');
					//初始化树节点并更新图表。
					for (var d = 0; d < this.directions.length; d++) {
						var direction = this.directions[d];
						var data = treeData[direction];

						data.x0 = config.centralWidth;
						data.y0 = config.centralHeight;
						data.children.forEach(collapse);
						update(data, data, treeG);
					}

					function update(source, originalData, g) {
						var direction = originalData['direction'];
						var forUpward = direction == 'upward';
						var node_class = direction + 'Node';
						var link_class = direction + 'Link';
						var downwardSign = (forUpward) ? -1 : 1; //上下树
						var nodeColor = (forUpward) ? '#37592b' : '#8b4513';

						var statusUp = true;
						var statusDown = true;
						var nodeSpace = 140;
						var tree = d3.layout.tree().sort(sortByDate).nodeSize([nodeSpace, 10]);
						var nodes = tree.nodes(originalData);
						var links = tree.links(nodes);
						var offsetX = -config.centralWidth;


						//过滤调不展示的类型  开始 1-风险P2P关联方
						// //（'类型字典: ; 2-科创板;3-香港企业;4-上市公司;
						// 5-事业单位;6-保险公司;7-央企控股;8-国企控股;10-新三板;  12-P2P公司 ...待填写',）


						nodes.forEach(i => { //遍历所有数据
							i.corptag = i.corptag.filter(item => { //找出数组中要展示的类型其他都过滤掉    返回到原本数组
								return item == '2' || item == '3' || item == '4' || item == '5' || item == '6' || item == '7' || item ==
									'8' || item == '10' ||item =='12'
							})
						})
						//过滤调不展示的类型 开始


						nodes.forEach(function(d) {
							d.y = downwardSign * (d.depth * linkLength) + config.centralHeight;
							d.x = d.x - offsetX;
							if (d.grade == 'origin') {
								d.x = config.centralWidth;
								d.y += downwardSign * 0; // 上下两树图根节点之间的距离
							}
						});

						// Update the node.
						var node = g.selectAll('g.' + node_class)
							.data(nodes, function(d) {
								return d.id || (d.id = ++id);
							});

						var nodeEnter = node.enter().append('g')
							.attr('class', node_class)
							.attr('id', function(d) { //给g元素添加id属性
								return 'g' + d.corpid
							})
							.attr('transform', function(d) {
								return 'translate(' + source.x0 + ',' + source.y0 + ')';
							})
							.style('cursor', function(d) {
								return (d.grade == 'origin') ? '' : (d.children || d._children) ? 'pointer' : '';
							})

						// 添加科创等标签开始
						// 条件 1 标签两字  2标签自身不能折行 多个标签要换换行
						// 		//
// 							nodes.map(item => {
// 								return	item.corptag = [7,3,6,12]
// 							})
							// 测试时候添加的假数据

						//动态添加节点
						d3.selectAll('g').attr('ces', function(d) {

							if (d && d.corpid) { //判断有corpid的节点
								let newId = '#g' + d.corpid
								let arr = d.corptag
								let glist = d3.select(newId)

								//因tree形会绘制两次
								//声明的全局遍历 判断之前是否同id添加过 如果是false就添加 添加完以后改为true 二次渲染不会再进来
								if (!_obj[d.corpid]) {
									_obj[d.corpid] = true;
									setTimeout(() => {
										for (let i = 0; i < arr.length; i++) { //根据数据量去添加对于元素
											glist.append('rect')
												.attr('class', 'itembox')
												.attr('width', 26)
												.attr('height', 12)
												.style('fill', colorget(arr[i])) //动态设置颜色
												.style('x', getX(i)) //动态设置x
												.style('y', getY(i, forUpward, arr)) //动态设置Y
												.attr('rx', 2)

											glist.append('text')
												.attr('x', arr[i] == 10 ? getX(i) + 1.5 : getX(i) + 5)
												.attr('y', getY(i, forUpward, arr) + 9)
												.text(getName(arr[i]))
												.style('font-size', '7')
												.style('fill', textColor(arr[i]))
												.style('letter-spacing', '1px')
										}
									})
								}

							}
						})

						//（'类型标签: 1-风险P2P关联方 ; 2-科创板;3-香港企业;4-上市公司;
						// 5-事业单位;6-保险公司;7-央企控股;8-国企控股;10-新三板;...待填写',）
						//标签方法
						function textColor(num) { //标签文字色号
							num = Number.parseInt(num)
							var a = ''
							switch (num) {
								case 2:
									a = '#2954A3' //科创
									break
								case 3:
									a = '#F26A3A' //香港
									break
								case 4:
									a = '#5AA9DE' //上市
									break
								case 5:
									a = '#88B764' //事业
									break
								case 6:
									a = '#815BDE' //保险
									break
								case 7:
									a = '#33DA9F' //央企
									break
								case 8:
									a = '#F0B822' //国企
									break
								case 10:
									a = '#F022A2' //新三板
									break
								case 12:
									a = '#AA2929'//p2p
							}
							return a
						}

						function getName(num) { //标签文本名字
							num = Number.parseInt(num)
							var a = ''
							switch (num) {
								case 2:
									a = '科创' //科创
									break
								case 3:
									a = '香港' //香港
									break
								case 4:
									a = '上市' //上市
									break
								case 5:
									a = '事业' //事业
									break
								case 6:
									a = '保险' //保险
									break
								case 7:
									a = '央企' //央企
									break
								case 8:
									a = '国企' //国企
									break
								case 10:
									a = '新三板' //新三板
									break
								case 12 :
									a = 'P2P'
							}
							return a
						}

						function getY(i, forUpward, listlength) { // 数组下标 方向 以及数组
							let num = 0;
							let a = 0;
							if (listlength) {
								a = listlength.length //获取长度
							} else {
								a = 0
							}

							if (forUpward) { //上
								if (i < 4) {
									num = -15
								} else {
									num = 0
								}
							} else { //下
								if (a > 4) { //down时候 长度小于4的时候全部-30位置的y
									if (i < 4) { //大于4的时候
										num = -45
									} else {
										num = -30
									}
								} else {
									num = -30
								}
							}
							return num
						}

						function getX(i) { //X位置
							if (i == 0 || i == 4) {
								i = -58
							} else if (i == 1 || i == 5) {
								i = -28
							} else if (i == 2 || i == 6) {
								i = 2
							} else if (i == 3 || i == 7) {
								i = 32
							}

							return i
						}

						function colorget(num) { //颜色库
							num = Number.parseInt(num)
							var a = ''
							switch (num) {
								case 2:
									a = '#E9F3FF' //科创
									break
								case 3:
									a = '#FEECE6' //香港
									break
								case 4:
									a = '#DCF3FF' //上市
									break
								case 5:
									a = '#EBFFDC' //事业
									break
								case 6:
									a = '#EBE2FF' //保险
									break
								case 7:
									a = '#D6FFF1' //央企
									break
								case 8:
									a = '#FFF2CC' //国企
									break
								case 10:
									a = '#FFD9F1' //新三板
									break
								case 12:
									a = '#FFC4C4' //p2p
							}
							return a
						}
						// 添加标签结束
						function addHeight(d) { //添加位置距离整数
							if (d.corptag.length > 0 && d.corptag.length <= 4) {
								return 15
							} else if (d.corptag.length > 4) {
								return 30
							} else {
								return 0
							}

						}

						function deviation(d) { //矩形以及元素domn方向y轴改变
							let num = 0;
							if (forUpward) {
								num = 0;
							} else {
								if (d.corptag.length > 4) {
									num = -30
								} else if (d.corptag.length <= 4 && d.corptag.length > 0) {
									num = -15
								} else {
									num = 0
								}
							}
							return num
						}

						function transformY(d) { //up方向元素偏移
							let num = 0;
							if (!forUpward) { //down方向时候不动
								num = 0;
							} else {
								if (d.corptag.length > 0 && d.corptag.length <= 4) {
									num = 15
								} else if (d.corptag.length > 4) {
									num = 30
								} else {
									num = 0
								}
							}
							return 'translateY(' + num + 'px' + ')'
						}

						///开始设置节点
						nodeEnter.append("svg:rect")
							.attr("x", function(d) {
								return (d.grade == 'origin') ? (-rootRectWidth / 2) : -60;
							})
							.attr("y", (d) => {

								return (d.grade == 'origin') ? -20 : forUpward ? -20 : deviation(d) + -20; //有标签时候 down方向的矩形y轴偏移

							})
							.attr("width", (d) => {
								return (d.grade == 'origin') ? rootRectWidth : 120;
							})
							.attr("height", (d) => {
								return (d.grade == 'origin') ? "40" : (d.type == '2') ? 40 : 50 + addHeight(d) //设置节点高度
							})
							.attr("rx", 5) //圆角
							.style("stroke", (d) => {
								return (d.grade == 'origin') ? "rgb(233,233,233)" : "rgb(230,230,230)";
							})
							.style('stroke-width', "1.2")

							.style('fill', (d) => {
								return (d.grade == 'origin') ? "rgb(83,99,187)" : (d.type == '2') ? "rgb(230,234,248)" : "#FFF";
							})



						nodeEnter.append('circle')
							.attr('r', 1e-6)


						nodeEnter.append("text") //上面一层文字
							.attr("class", "linkname")
							.attr("x", function(d) {
								return (d.grade == 'origin') ? '0' : "-55";
							})
							.attr('dy', function(d) {
								return (d.grade == 'origin') ? '.35em' : forUpward ? -5 : -5;
							})
							.attr("text-anchor", function(d) {
								return (d.grade == 'origin') ? 'middle' : "start";
							})
							.text(function(d) {
								if (d.grade == 'origin') {
									// return ((forUpward) ? '根节点TOP' : '根节点Bottom');
									return rootName;
								}
								if (d.repeated) {
									// console.log(d.repeated)
									return '[Recurring] ' + d.name;
								}
								return (d.name.length > 10) ? d.name.substr(0, 10) : d.name;
							})
							.style('cursor', "pointer")
							.style({
								'fill-opacity': 1e-6,

								'fill': function(d) {
									return (d.grade == 'origin') ? '#fff' : getcolor(d);
								},
								'font-size': function(d) {
									return (d.grade == 'origin') ? 14 : 11;
								}
							})
							.style("letter-spacing", (d) => {
								return (d.grade == 'origin') ? "1px" : '0'
							})
							.style('transform', transformY) //up方向偏移方法
							.on('click', routeType)

						nodeEnter.append("text") //中间一层 上一层的折行
							.attr("class", "linkname")
							.attr("x", "-55")
							.attr("dy", function(d) {
								return (d.grade == 'origin') ? '.35em' : forUpward ? (d.type != 2) ? "8" : "0" : '8';
							})
							.attr("text-anchor", function() {
								return (d.grade == 'origin') ? 'middle' : "start";
							})
							.text(function(d) {
								return (d.grade == 'origin') ? '' : d.name.length > 17 ? d.name.substr(10, 7) + '...' : d.name.substr(10,
									7);
							})
							.style({
								// 'fill': "#337ab7",
								'font-size': function(d) {
									return (d.grade == 'origin') ? 14 : 11;
								},
								'fill': function(d) {
									return (d.grade == 'origin') ? '#fff' : getcolor(d);
								},
								'cursor': "pointer"
							})
							.style('transform', transformY) //up方向偏移方法
							.on('click', routeType) //路由跳转

						nodeEnter.append("text") //认缴金额一层
							.attr("x", "-55")
							.attr("dy", function(d) {
								return (d.grade == 'origin') ? '.35em' : forUpward ? ((d.type == 2) ? "10" : "24") : '23';
							})
							.attr("text-anchor", "start")
							.attr("class", "linkname")
							.style("fill", "#000")
							.style('font-size', 10)
							.text(function(d) {
								var str = (d.grade == 'origin') ? '' : (d.amount != 0 && d.amount != null) ? "认缴金额:" + d.amount + "万元" :
									"认缴金额:未公开"; //金额
								return (str.length > 14) ? str.substr(0, 14) + ".." : str;
							})
							.style('transform', transformY) //up方向偏移方法


						nodeEnter.append("text") //股比
							.attr("x", "10")
							.attr("dy", function(d) {
								return (d.grade == 'origin') ? '.35em' : forUpward ? ((d.type == 2) ? "32" : "42") : deviation(d) + -23;
							})
							.attr("text-anchor", "start")
							.attr("class", "linkname")
							.style("fill", "rgb(0,132,255)")
							.style('font-size', 10)
							.text(function(d) {
								return (d.grade == 'origin') ? "" : (d.proportion) ? d.proportion + '%' : ''; //股比
							})
							.style('transform', transformY) //up方向偏移方法

						// 原有节点更新到新位置
						var nodeUpdate = node.transition()
							.duration(duration)
							.attr('transform', function(d) {
								return 'translate(' + d.x + ',' + d.y + ')';
							});
						nodeUpdate.select('circle')

							.attr('r', function(d) {
								return (d.grade == 'origin') ? 0 : (d.number > 0) ? 6 : 0;
							})
							.attr('cy', function(d) {
								return (d.grade == 'origin') ? -20 : (forUpward) ? -28 : 38;
							})
							.style('fill', function(d) {
								return d.number > 0 ? "rgb(83,99,187)" : "";
							})

						//代表是否展开的+-号

						nodeEnter.append("svg:text")
							.attr("class", "isExpand")
							.attr("x", "0")
							.attr("dy", function(d) {
								return forUpward ? -22 : 44;
							})
							.attr("text-anchor", "middle")
							.style("fill", "#fff")

							.style('font-size', '18px')
							.text(function(d) {
								if (d.grade == 'origin') {
									return '';
								}
								return d.number > 0 ? "+" : "";
							})
							.on('click', click)

						nodeUpdate.select('text').style('fill-opacity', 1)
						var nodeExit = node.exit().transition()
							.duration(duration)
							.attr('transform', function(d) {
								return 'translate(' + source.x + ',' + source.y + ')';
							})
							.remove();
						nodeExit.select('circle')
							.attr('r', 1e-6)
						nodeExit.select('text')
							.style('fill-opacity', 1e-6);

						var link = g.selectAll('path.' + link_class)
							.data(links, function(d) {
								return d.target.id;
							})
							.attr('fill', 'none')


						//******************************************私募管理人标签 start******************************************//
						//提示框
						var tsk = nodeEnter.append("svg:rect")
							.attr("x", -64)
							.attr("y", function(d) {
								return forUpward ? -42 : -42 + deviation(d);
							})
							.attr('rx', 2)
							.attr('ry', 2)
							.attr("width", function(d) {
								if (d.name == 'origin') {
									return 0
								} else {
									return (d.shareholdertype == 'GP') ? "55" : d.corptype == 1 ? '48' : d.prodid ? '40' : '0' //私募管理人标签
								}
							})
							.attr("height", 15)

							.style("fill", function(d) {
								return (d.shareholdertype == 'GP') ? "#0073ff" : d.corptype == 1 ? '#ffbc00' : d.prodid ? '#2ca111' : ''
							})
						//三角形
						nodeEnter.append("svg:path")
							.attr("fill", (d) => {
								return (d.shareholdertype == 'GP') ? "#0073ff" : d.corptype == 1 ? '#ffbc00' : d.prodid ? '#2ca111' : ''
							})
							.attr("d", function(d) {
								if (d.name == 'origin') {
									return ""
								} else {
									return (d.shareholdertype == 'GP' || d.corptype == 1 || d.prodid) ? "M-53 -20 L-60 -30 L-46 -30 Z" : ""; //私募管理人标签
								}
							})
							.style('transform', (d) => { //为down时候 看是否存在标签 更改三角定位 使用translatey做y轴偏移
								let num = 0;
								if (forUpward) {
									num = 0;
								} else {
									if (d.corptag.length > 0 && d.corptag.length <= 4) {
										num = -15
									} else if (d.corptag.length > 4) {
										num = -30
									} else {
										num = 0
									}
								}
								return 'translateY(' + num + 'px' + ')'
							})

						nodeEnter.append("svg:text") //三角形中的文字
							.attr("x", -60)
							.attr("dy", function(d) {
								return forUpward ? "-32" : -32 + deviation(d);
							})
							.attr("text-anchor", "start")
							.style("fill", "#fff")
							.style("font-size", 7)
							.style('letter-spacing', 1)
							.text(function(d) {
								// console.log(d)
								return (d.shareholdertype == 'GP') ? "本基金管理人" : d.corptype == 1 ? '私募管理人' : d.prodid ? '私募产品' : ''
							});
						//******************************************私募管理人标签 end******************************************//

						link.enter().insert('path', 'g')
							.attr('class', link_class)
							.attr('d', function(d) {
								var o = {
									x: source.x0,
									y: source.y0,
								};
								return diagonal({
									source: o,
									target: o,
								});

							})
							.attr("id", function(d, i) {
								return "mypath" + i;
							})
							.attr('fill', 'none')
							.attr('stroke', 'rgb(51, 51, 51)')


						link.transition()
							.duration(duration)
							.attr('d', diagonal)


						link.exit().transition()
							.duration(duration)
							.attr('d', function(d) {
								var o = {
									x: source.x0,
									y: source.y0,
								};
								return diagonal({
									source: o,
									target: o,
								});
							})
							.remove();
						nodes.forEach(function(d) {
							d.x0 = d.x;
							d.y0 = d.y;
						});

					function routeType(d) { //路由跳转
							//'产品类型：1-私募基金；2-基金专户；3-证券公司资管计划；4-期货公司资管计划；5-信托计划；6-保险公司资管计划；7-银行理财计划；8-券商直投基金；9-资产支持专项计划（ABS）；10-公募基金；',
							// 机构类型字典 '1-私募管理人；2-期货公司；3-证券公司；4-基金子公司；5-信托公司；6-银行；7-公募基金公司；8-上市公司；9-新三板上市公司；10-律师事务所；11-会计师事务所；12-支付机构；99-其他机构；',
							console.log(window.location.href)
							// d为点击的当前元素
							if (d.corpid && d.corptype == '1') {
								window.location.href = '/ManagersDetails' + '?corpid=' + d.corpid
								return false
							} else if (d.prodid) {
								window.location.href = '/ProBaseInfo' + '?prodid=' + d.prodid
								return false
							} else {
								return false
							}
						}

					function getcolor(d) { //设置跳转颜色区分
							let Color = ''
							if (d.corpid && d.corptype == '1') {
								Color = '#0066cc'
							} else if (d.prodid) {
								Color = '#0066cc'
							} else {
								Color = '#333333'
							}
							return Color
						}

						function getNode(type, id) {

							selfthis.$http.post(ajaxurl + 'profund/familysearch', JSON.stringify(comment)).then(response => {
								var res = response.data;

								if (res.status === 'success') {
									if (type == 1) {
										mynodes = res.data.upward
									} else if (type == -1) {
										mynodes = res.data.downward
									}
								}
							})
							return mynodes;
						}

					function click(d) {
							var companyType //请求参数
							if (forUpward) { //定义请求参数的值 1 = 股东      -1 = 对外投资
								companyType = 1; //参数类型
								_obj = {}//重新渲染前 清空 判断标签的条件
							} else {
								companyType = -1; //参数类型
							}
							if (d.children) {
								d._children = d.children;
								d.children = null;

								update(d, originalData, g); //重新渲染数据
								d3.select(this).text("+").style({
									'font-weight': '400',
									'font-size': '18px',

								})

							} else {

								d.children = d._children;
								d._children = null;
								selfthis.$http.post(ajaxurl + 'profund/familysearch', JSON.stringify({
									'companyType': companyType,
									'corpid': d.corpid
								})).then(response => {

									var res = response.data;
									if (res.status === 'success') {
										if (companyType == 1) {
											d.children = res.data.upward.children;
										} else if (companyType == -1) {
											d.children = res.data.downward.children;
										}

										update(d, originalData, g); //重新渲染数据
										d3.select(this).text("-").style({
											'font-weight': '600',
											'font-size': '23px'
										})
										// expand all if it's the first node
										if (d.name == 'origin') {
											d.children.forEach(expand);
										}
									}
								})



							}

						}
					}

					function expand(d) {
						if (d._children) {
							d.children = d._children;
							d.children.forEach(expand);
							d._children = null;
						}
					}


					function collapse(d) {
						if (d.children && d.children.length != 0) {
							d._children = d.children;
							d._children.forEach(collapse);
							d.children = null;
							hasChildNodeArr.push(d);
						}
					}

					function redraw() {
						//强制横屏后 手机端出现touch事件方向
						//错误问题 以及ios 安卓兼容性问题
						//根据浏览器内核判断手机和pc 重新计算方向 顺时针九十度x,y规则 a[0] = b[1]  a[1] = -b[0]
						var html = document.getElementsByTagName('html')[0];
						var width = html.clientWidth;
						var height = html.clientHeight;
						var a = []
						var u = navigator.userAgent;
						var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
						var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
						if (isAndroid) {
							a = d3.event.translate; //是安卓
						} else if (isiOS) {
							if (window.orientation == 90 || window.orientation == -90) { //判断屏幕方向
								// console.log("横屏")
								a = d3.event.translate;
							} else {
								var b = d3.event.translate;
								a[0] = b[1]
								a[1] = -b[0]
							}
						} else { //pc端
							if (width < height) {
								var b = d3.event.translate;
								a[0] = b[1]
								a[1] = -b[0]
							} else {
								a = d3.event.translate;
							}

						}

						treeG.attr('transform', 'translate(' + a + ')' +
							' scale(' + d3.event.scale + ')');
					}


					function disableRightClick() {
						// stop zoom
						if (d3.event.button == 2) {
							console.log('No right click allowed');
							d3.event.stopImmediatePropagation();
						}
					}


					function sortByDate(a, b) {
						var aNum = a.name.substr(a.name.lastIndexOf('(') + 1, 4);
						var bNum = b.name.substr(b.name.lastIndexOf('(') + 1, 4);
						return d3.ascending(aNum, bNum) ||
							d3.ascending(a.name, b.name) ||
							d3.ascending(a.id, b.id);
					}


				};

				var d3GenerationChart = new treeChart(d3);
				d3GenerationChart.drawChart();
			}
		}

	}
</script>

<style scoped="scoped">
#product_tree {
	touch-action: none;
	z-index: 999;

}

#rtbtn {
	position: fixed;
	width: 25px;
	height: 25px;
	top: 20px;
	border-radius: 4px;
	box-sizing: content-box;
	background: #fff;
	border: 1px solid rgb(83, 99, 187);
	z-index: 9999;
	text-align: center;
	right: 30px;
}

#rtbtn img {
	width: 26px;
}

#download {
	position: fixed;
	width: 25px;
	height: 25px;
	top: 20px;
	border-radius: 4px;
	background: #fff;
	border: 1px solid rgb(83, 99, 187);
	z-index: 9999;
	text-align: center;
	right: 80px;
}

@media screen and (orientation:portrait) {

	/*屏幕旋转90*/
	#product_tree {
		transform-origin: 0 0;
		transform: rotateZ(90deg) translateY(-100%);
	}
}

#product_tree>.centralText {
	font: 23spx sans-serif;
	fill: #222;
}

#product_tree>.downwardNode text,
#product_tree>.upwardNode text {
	font: 15px sans-serif;
}

</style>