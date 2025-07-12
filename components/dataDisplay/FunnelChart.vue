<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view :style="{width: '100%',height:config.height*2+'rpx'}" v-if="show">
			<qiun-data-charts type="funnel" :chartData="chartsDataFunnel" :opts="config.options" />
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
					title: '漏斗图',
					height: 200,
					labelKey: '',
					valueKey: '',
					apiConfig: {
						name: '',
						method: '',
						path: '',
						requestParamsConfigs: [], //Query Params
						requestHeaderConfigs: [], //Header
						requestBodyConfigs: [], //Body
					},
					fontSize: 12,
					fontColor: "#000000", 
					options: {
						labelFormat: "",
						dataLabel: true,
						color: [],
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							position: "left",
							float: 'bottom',
							margin: 30,
							pointShape: 'circle',
							fontColor: "#000",
						},
						extra: {
							funnel: {
								"activeOpacity": 0.3,
								"activeWidth": 10,
								"border": true,
								"borderWidth": 2,
								"borderColor": "#FFFFFF",
								"fillOpacity": 1,
								"labelAlign": "left",
								type: 'triangle' //倒三角，pyramid金字塔
							}
						}
					}
				};
			}
		}
	});
	const chartsDataFunnel = ref({
		"series": [{
			"data": [{
				"name": "一班",
				"value": 50
			}, {
				"name": "二班",
				"value": 30
			}, {
				"name": "三班",
				"value": 20
			}, {
				"name": "四班",
				"value": 18
			}, {
				"name": "五班",
				"value": 8
			}]
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
			chartsDataFunnel.value.series[0].data = res.data.list.map((ele) => {
				return {
					name: ele[config.labelKey],
					value: ele[config.valueKey],
					textColor: config.fontColor,
					textSize: config.fontSize,
					legendShape:config.options.legend.legendShape||'circle' 
				};
			});
			chartsDataFunnel.value.series[0].format = 'seriesFormat'
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