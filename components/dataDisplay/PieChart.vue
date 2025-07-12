<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view :style="{width: '100%',height:config.height*2+'rpx'}" v-if="show">
			<qiun-data-charts :type="config.pieType" :chartData="chartsDataPie" :opts="config.options" />
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
					apiConfig: {
						name: "chart-radar",
						method: "GET",
						path: "test/chart-radar",
						requestParamsConfigs: [{
							"name": "keyword",
							"dataType": "String",
							"assignmentType": "value",
							"value": "",
							"config": ""
						}],
						requestHeaderConfigs: [],
						requestBodyConfigs: []
					},
					labelKey: "name",
					valueKey: "value1",
					title: "饼图",
					height: 300,
					fontSize: 12,
					fontColor: "#000000", 
					pieType: 'rose', //rose玫瑰图，pie饼图，ring环形图
					options: {
						labelFormat: "{b}: {d}",
						dataLabel: true,
						"legend": {
							"show": true,
							"position": "bottom",
							"float": "center",
							"margin": 8,
							"legendShape": "circle",
							"fontColor": "#000"
						},
						"extra": {
							"pie": {
								"customRadius": 80,
								"labelWidth": 10,
								"border": false,
							},
							rose: {
								type: "area",
								minRadius: 80,
								labelWidth: 10,
								border: false,
							},
							ring: {
								ringWidth: '50%', //内圈大小  
								labelWidth: 10,
								border: false,
								customRadius: 80 //外圈大小 
							}
						}
					}
				};
			}
		}
	});
	const chartsDataPie = ref({
		"series": [{
			"data": [{
				name: '一月',
				value: 10,
				textColor: '#efefde',
				textSize: 15
			}, {
				name: '二月',
				value: 110
			}, {
				name: '三月',
				value: 210
			}, {
				name: '四月',
				value: 310
			}, {
				name: '五月',
				value: 410
			}],
		}]
	})
	const show = ref(true);
	const refreshFunc = ref();
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

	async function getServerData() {
		show.value = false
		let config = props.config
		if (config.apiConfig.path) {
			let res = await changeApiOptions(config.apiConfig);
			if (!res?.data) {
				show.value = true
				return;
			}
			
			chartsDataPie.value.series[0].data = res.data.list.map((ele) => {
				return {
					name: ele[config.labelKey],
					value: ele[config.valueKey],
					textColor: config.fontColor,
					textSize: config.fontSize,
					legendShape:config.options.legend.legendShape||'circle'
				};
			});
			chartsDataPie.value.series[0].format = 'seriesFormat'
			
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
		}
	}
</style>