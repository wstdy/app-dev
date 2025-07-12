<template>
	<view class="box">
		<uni-row :gutter="5">
			<uni-col class="gutter-row" :span="12" v-for="(item, index) in boardList" :key="index">
				<view class="text-xs pt-14" :style="labelColorStyle">{{ item.name }}</view>
				<view :style="numColorStyle">
					<mrdotyan-count-to :textStyle="{fontSize:'24px',lineHeight:'30px'}" :startVal="0" :endVal="item.num"
						:decimals="item.decimals"></mrdotyan-count-to>
				</view>
			</uni-col>
		</uni-row>
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		onMounted
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
						name: '',
						method: '',
						path: '',
						requestParamsConfigs: [], //Query Params
						requestHeaderConfigs: [], //Header
						requestBodyConfigs: [], //Body
					},
					title: '数据面板',
					numColor: '#666666',
					labelColor: '#999999',
					dashboard: [{
							name: '主营收入(元)',
							field: '',
						},
						{
							name: '售卡金额(元)',
							field: '',
						},
					],
				};
			}
		}
	});
	const apiData = ref()
	const boardList = ref([{
			name: '主营收入(元)',
			num: 0,
		},
		{
			name: '售卡金额(元)',
			num: 0,
		},
	])
	onMounted(() => {
		changeData()
	})

	const numColorStyle = computed(() => {
		return 'color:' + (props.config.numColor ? props.config.numColor : '#666666');
	});
	const labelColorStyle = computed(() => {
		return 'color:' + (props.config.labelColor ? props.config.labelColor : '#999999');
	});

	async function changeData() {
		let config = props.config;
		if (config.apiConfig.path) {
			boardList.value=[]
			let res = await changeApiOptions(config.apiConfig);
			if (!res?.data) { 
				return;
			}
			apiData.value = res.data;
			config.dashboard.forEach(o => {
				let val = getVal(o.field) ;
				boardList.value.push({
					name: o.name,
					num: val,
					decimals:val%1===0?0:2
				}) 
			})
		}
	}

	function getVal(key) {
		let num = apiData.value[key];
		return isNaN(parseFloat(num)) ? 0 : Number(num);
	}
</script>

<style lang="less" scoped>
	.box {
		border-left: 5px solid #5e95ff;
		text-align: center;
		height: 75px;
	}
</style>