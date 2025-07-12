<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view :style="{width: '100%',height:config.height*2+'rpx'}" v-if="show">
			<qiun-data-charts type="gauge" :chartData="chartsDataGauge" :opts="options" />
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
					title: '仪表盘',
					height: 250,
					apiConfig: {
						name: '',
						method: '',
						path: '',
						requestParamsConfigs: [], //Query Params
						requestHeaderConfigs: [], //Header
						requestBodyConfigs: [], //Body
					},
					labelKey: '',
					valueKey: '',
				};
			}
		}
	});
	const chartsDataGauge = ref({
		"categories": [{
			"value": 0.2,
			"color": "rgb(84, 112, 198)"
		}, {
			"value": 1,
			"color": "rgb(230, 235, 248)"
		}],
		"series": [{
			"name": "完成率",
			"data": 0.2
		}]
	})
	const options = ref({
		extra: {
			gauge: {
				width: 10,
				splitLine: {
					fixRadius: -15,
					color: '#000',
					width: 10,
					childWidth: 5
				},
				labelOffset: 25,
				pointer: {
					width: 15,
					color: 'rgb(84, 112, 198)'
				}
			}
		},
		title: {
			name: '20',
			color: '#000',
			fontSize: 20,
			offsetY: 60
		},
		subtitle: {
			name: '实时速度',
			color: '#666666',
			fontSize: 15,
			offsetY: 15
		}
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
			let labelKey = config.labelKey ? config.labelKey : 'name';
			let valueKey = config.valueKey ? config.valueKey : 'value';

			let obj = res.data.list
				.filter((_, i) => i === 0)
				.map((ele) => {
					return {
						name: ele[labelKey],
						value: ele[valueKey] || 0
					};
				});

			if (obj?.length > 0) {
				options.value.title.name = obj[0].value;
				let val = parseInt(obj[0].value) / 100 > 1 ? 1 : parseInt(obj[0].value) / 100
				chartsDataGauge.value.series[0].data = val
				chartsDataGauge.value.categories[0].value = val
				options.value.subtitle.name = obj[0].name
			} 
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