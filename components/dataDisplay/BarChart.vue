<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view class="barpercent">
			<view class="barpercent-title">单位：{{ config.unit }}</view>
			<view class="barpercent-list" v-if="chartsDataBar.length > 0" :style="{ height: config.height + 'px' }">
				<view class="barpercent-item" v-for="(item, index) in chartsDataBar" :key="index">
					<view v-if="item" style="height: 100%;">
						<view class="label">{{ item.name }}</view>
						<view class="percent-bar">
							<view class="active" :style="'width: ' + item.barWidth + '%;'"></view>
							<view class="num">{{ item.value }}/{{ item.target }}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else style="text-align: center;padding: 40px 0;">暂无数据</view>
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
					title: '柱状百分比',
					height: 400,
					apiConfig: {
						name: '',
						method: '',
						path: '',
						requestParamsConfigs: [], //Query Params
						requestHeaderConfigs: [], //Header
						requestBodyConfigs: [], //Body
					},
					labelKey: "",
					valueKey: "",
					targetKey: "",
					unit: ""
				};
			}
		}
	});
	const show = ref(false)
	const chartsDataBar = ref([])

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
		show.value = false;
		let config = props.config;
		if (config.apiConfig.path) {
			let res = await changeApiOptions(config.apiConfig);
			if (!res?.data) {
				show.value = true
				return;
			}
			if (res.data.list && Array.isArray(res.data.list)) {
				chartsDataBar.value = res.data.list.map((ele) => {
					let barWidth = 0;
					if (ele[config.labelKey] && ele[config.valueKey] && ele[config.targetKey]) {
						if (
							ele[config.valueKey] &&
							ele[config.valueKey] >= 0 &&
							ele[config.targetKey] &&
							ele[config.targetKey] >= 0
						) {
							let val = Math.ceil((ele[config.valueKey] / ele[config.targetKey]) * 100);
							barWidth = val <= 100 ? val : 100;
						}
						return {
							name: ele[config.labelKey],
							value: ele[config.valueKey],
							target: ele[config.targetKey],
							barWidth: barWidth,
						};
					}
				});
			} 
		}
		show.value = true;
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

		.barpercent {
			position: relative;
			width: 100%;
			height: 100%;
		}

		.barpercent-title {
			color: #707070;
			font-size: 12px;
			padding-left: 12px;
			width: 100%;
			padding-top: 12px;
		}

		.barpercent-list {
			position: relative;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 24px 0;
		}

		.barpercent-item {
			position: relative;
			height: 24px;
			padding-left: 80px;
			padding-right: 20px;
		}

		.barpercent-item .label {
			position: absolute;
			top: 0;
			left: 0;
			width: 70px;
			height: 100%;
			color: #707070;
			padding-right: 8px;
			text-align: right;
		}

		.barpercent-item .percent-bar {
			position: relative;
			height: 100%;
			width: 100%;
			background-color: rgba(94, 149, 255, .5);
		}

		.barpercent-item .active {
			position: relative;
			height: 100%;
			width: 0;
			background: linear-gradient(270deg, #5e95ff, #695eff);
		}

		.barpercent-item:hover .percent-bar {
			background-color: rgba(255, 196, 96, .5);
		}

		.barpercent-item:hover .active {
			background: linear-gradient(270deg, #ffc45e, #ff9100);
		}

		.barpercent-item .num {
			position: absolute;
			top: 0;
			right: 8px;
			font-size: 12px;
			color: #fff;
			line-height: 24px;
		}
	}
</style>