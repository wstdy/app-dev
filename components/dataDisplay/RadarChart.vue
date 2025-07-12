<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view :style="{width: '100%',height:config.height*2+'rpx'}" v-if="show">
			<qiun-data-charts type="radar" :chartData="chartsDataRadar" :opts="config.options" />
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
					title: '雷达图',
					height: 300,
					labelKey: '', 
					apiConfig: {
						name: '',
						method: '',
						path: '',
						requestParamsConfigs: [], //Query Params
						requestHeaderConfigs: [], //Header
						requestBodyConfigs: [], //Body
					},
					indicator: [{
						"value": "value1",
						"name": "指标1"
					}, {
						"value": "value2",
						"name": "指标2"
					}, {
						"value": "value3",
						"name": "指标3"
					}],
					options: {
						dataLabel: true,
						"legend": {
							"show": true,
							"position": "bottom",
							"lineHeight": 25,
						},
						"extra": {
							"radar": {
								radius: 100,
								"gridType": "circle",
								"gridColor": "#CCCCCC",
								border: true,
								"opacity": 0.2,
							},
						}
					}
				};
			}
		}
	});
	const chartsDataRadar = ref({
		"categories": [],
		"series": [{
			"name": "成交量1",
			pointShape: 'diamond',
			"data": [90, 110, 165]
		}, {
			"name": "成交量2",
			"data": [190, 210, 105]
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
		let config = props.config;
		chartsDataRadar.value.categories = config.indicator.map(o => {
			return o.name
		})
		if (config.apiConfig.path) {
			let res = await changeApiOptions(config.apiConfig);
			if (!res?.data) {
				show.value = true
				return;
			}
			chartsDataRadar.value.series = res.data.list.map((ele) => {
				let data = config.indicator.map(o => {
					return ele[o.value]
				})
				return {
					name: ele[config.labelKey],
					pointShape: config.pointShape||'circle',
					legendShape:config.options.legend.legendShape||'circle',
					data: data || []
				};
			});
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