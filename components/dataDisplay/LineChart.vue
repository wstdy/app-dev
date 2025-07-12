<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
			<view class="fixed">
				<view class="fixed-item" v-for="(item, index) in config.dataList" :key="index"
					:class="index ===  itemIndex ? 'active' : ''" @click="showIndex(index)">
					{{ item.title }}
				</view>
			</view>
		</view>
		<view class="echarts-tag-box" v-if=" config &&  config.count &&  config.count.show">
			<view class="echarts-tag-content">
				<view class="echarts-tag-num">
					{{ count }}
					<text class="echarts-tag-unit">{{ config.count.unit }}</text>
				</view>
				<view class="echarts-tag-label">{{ config.count.title }}</view>
			</view>
		</view>
		<view :style="{width: '100%',height:config.height*2+'rpx'}" v-if="show">
			<view v-for="(item, index) in config.dataList" :key="index">
				<qiun-data-charts type="mix" :chartData="chartsDataLine" :opts="item.options" v-if="index === itemIndex" />
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		onUnmounted,
		ref,
		computed
	} from 'vue';
	import {
		changeApiOptions
	} from '@/common/api/magic-api/useApiRequest.js';
	const props = defineProps({
		config: {
			type: Object,
			default: () => {
				return {
					title: '折线/柱状图',
					height: 300,
					condition: {
						"color": "#b92d2d",
						"selected": "#49eea7"
					},
					dataList: [{
						title: 'ddddd', 
						valueKey: "name",
						apiConfig: {
							name: '',
							method: '',
							path: '',
							requestParamsConfigs: [], //Query Params
							requestHeaderConfigs: [], //Header
							requestBodyConfigs: [], //Body
						},
						indicator: [{
							color: "",
							gradualEndColor: "",
							gradualStartColor: "",
							name: "d",
							showAreaStyle: false,
							type: "line",
							value: "value1"
						}],
						options: {
							extra: {
								mix: {
									column: {
										seriesGap: 120,
									},
									area: {
										gradient: true,
										opacity: 6
									}
								}
							},
							yAxis: {
								data: [{
									type: 'value', //value数值,categories类别
									position: 'left',
									title: '折线',
									titleFontColor: '#EB88E2',
									titleFontSize: 24,
									min: 0,
									max: 200,
									format: 'lineYAxis',
									axisFormat: '{value}元',
									fontColor: '#EB88E2',
									axisLine: false
								}, {
									position: 'right',
									min: 0,
									max: 200,
									title: '柱状图',
									format: 'lineYAxisTwo',
									axisFormat: '{value}个',
									axisLineColor: '#EB88E2'
								}]
							},
							xAxis: {
								title: 'aaa',
								titleFontColor: '#EB88E2',
								titleFontSize: 10,
								fontColor: '#FA7D8D',
								axisLine: true,
								axisLineColor: '#FA7D8D',
								format: 'lineXAxis',
								axisFormat: '{value}年',
							},
							dataLabel: false,
							legend: {
								show: true,
								position: 'bottom', //'top','left','right' 图例相对画布的显示位置
								float: 'left', //'left','right','top','bottom' 图例位置对齐方向
								margin: 28,
								padding: 10,
								fontColor: '#FA7D8D',
								//backgroundColor:'rgba(255,255,255,1)'
							}
						}
					}],
					count: {
						show: true,
						unit: 'sdsd',
						title: 'ererer',
					},
					line: {
						"smooth": false,
						"stack": false,
						"showAreaStyle": true,
						"gradualStartColor": "",
						"gradualEndColor": "",
						"showSymbol": true
					}
				};
			}
		}
	});
	const count=ref(0)
	const refreshFunc = ref();
	let fontcolor = computed(() => {
		return props.config && props.config.condition && props.config.condition.color ?
			props.config.condition.color :
			'#595959';
	});
	let selectedcolor = computed(() => {
		return props.config && props.config.condition && props.config.condition.selected ?
			props.config.condition.selected :
			'#3399ff';
	});
	const chartsDataLine = ref({
		"categories": ["2016", "2017", "2018", "2019", "2020", "2021"],
		"series": [{
			"name": "曲面",
			"data": [70, 50, 85, 130, 64, 88],
			"type": "area",
			"style": "straight",
			pointShape: 'circle',
			legendShape: 'diamond', //diamond◆, circle●, triangle▲, square■, rect▬, line-, none 无
			"color": "#f04864"
		}, {
			"name": "柱1",
			"index": 1,
			"color": "#f04864",
			"data": [40, {
				"value": 30,
				"color": "#f04864"
			}, 55, 110, 24, 58],
			"type": "column"
		}, {
			"name": "柱2",
			"index": 1,
			"data": [50, 20, 75, 60, 34, 38],
			"type": "column"
		}, {
			"name": "曲线",
			"data": [70, 50, 85, 130, 64, 88],
			"type": "line",
			"style": "straight",
			"color": "#1890ff",
			"disableLegend": true,
			pointShape: 'circle'
		}, {
			"name": "折线",
			"data": [120, 140, 105, 170, 95, 160],
			"type": "line",
			"color": "#2fc25b",
			textColor: '#f04864',
			textSize: 6,
			pointShape: 'circle',
			addPoint: true, //仅针对line,area,mix有效
			//linearColor:[[0,'#0EE2F8'],[0.3,'#2BDCA8'],[0.6,'#1890FF'],[1,'#9A60B4']]
		}]
	})
	const itemIndex = ref(0)
	const show = ref(true);
	onMounted(() => {
		getServerData();

		//设置定时器  定时更新数据

		refreshFunc.value = setInterval(() => {
			getServerData()
		}, 5 * 60000)

	})
	onUnmounted(() => {
		clearInterval(refreshFunc.value);
	})

	function showIndex(index) {
		itemIndex.value = index;
		getServerData()
	}

	async function getServerData() {
		show.value = false
		let config = props.config;
		let curItemConfig = config.dataList[itemIndex.value]
 
		if (curItemConfig.apiConfig.path) {
			let res = await changeApiOptions(curItemConfig.apiConfig);
			if (!res?.data) {
				show.value = true
				return;
			}
 
			chartsDataLine.value.categories = res.data.list.map(o => {
				return o[curItemConfig.valueKey]
			})
			chartsDataLine.value.series = [];
			count.value=0;
			curItemConfig.indicator.forEach(o => {
				let type = 'line';
				if (o.type == 'line') {
					type = 'line';
					if (o.showAreaStyle && o.gradualStartColor || config.line.showAreaStyle && config.line
						.gradualStartColor) {
						type = 'area'
					}
				} else if (o.type == 'bar') {
					type = 'column'
				}
				let data=res.data.list.map(k => {
					if(config.count.show) count.value+=k[o.value]
						return k[o.value]
					})
				
				chartsDataLine.value.series.push({
					"name": o.name,
					"data": data,
					"type": type,
					"style": config.line.smooth ? 'curve' : "straight",
					 //legendShape: 'circle', //diamond◆, circle●, triangle▲, square■, rect▬, line-, none 无
					"color": o.color,
					addPoint: config.line.showSymbol,
					pointShape: config.line.showSymbol ? 'circle' : 'none',
					textColor: config.fontColor,
					textSize:config.fontSize,
				})
			})
		}
		show.value = true 
	}
</script>

<style lang="less" scoped>
	.box {
		width: 100%;
		height: 100%;
		padding-top: 40px;

		.item-title {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 40px;
			line-height: 40px;
			color: #666;
			font-size: 14px;
			padding-left: 10px;
			font-weight: 700;
			box-sizing: border-box;

			.title-style {
				margin: 12px 0 0;
				line-height: 18px;
				padding-left: 6px;
				border-left: 6px solid #5e95ff;
			}

			.fixed {
				position: absolute;
				top: 5px;
				right: 6px;
				height: 30px;
				line-height: 30px;
				text-align: center;
				display: flex;
				align-items: center;

				.fixed-item {
					padding: 0 20px;
					cursor: pointer;
					margin: 0 4px;
					color: v-bind(fontcolor);
				}

				.fixed-item:hover {
					color: v-bind(fontcolor);
					background-color: #f5f5f5;
				}

				.active {
					color: #fff;
					// background-color: @primary-color;
					background-color: v-bind(selectedcolor);
					border-radius: 4px;
				}

				.active:hover {
					color: #fff;
					// background-color: @primary-color;
					background-color: v-bind(selectedcolor);
					border-radius: 4px;
				}
			}
		}

		.item {
			height: 100%;
			width: 100%;
			-webkit-tap-highlight-color: transparent;
			user-select: none;
			position: relative;
		}
	}

	.echarts-tag-box {
		box-sizing: border-box;
		height: 86px;
		padding: 20px 24px;
		width: 100%;
		top: 0;
		left: 0;

		.echarts-tag-content {
			position: relative;
			height: 100%;
			width: 100%;
			background-color: #fff;
			box-shadow: 0 3px 6px 1px rgba(0, 0, 0, 0.16);
			display: flex;
			justify-content: space-between;
			padding: 0 16px;
			align-items: center;
			box-sizing: border-box;
		}

		.echarts-tag-num {
			font-size: 24px;
			color: #5e95ff;
		}

		.echarts-tag-label {
			font-size: 14px;
			color: #707070;
		}
	}
</style>