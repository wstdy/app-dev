<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view v-if="dataList.length > 0" class="menu-box">
			<view class="menu-item" v-for="(item, index) in dataList" :key="index">
				<view class="menu-icon">
					<view class="bg" :style="'background-color:' + item.color + ''"></view>
					<uni-icons custom-prefix="antfont" :color="item.color" :type="item.icon" size="24" class="icon"></uni-icons>
				</view>
				<view class="menu-title">
					<text class="name">{{ item.name }}</text>
					<text class="num">{{ item.count }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		getMyTaskCount
	} from "@/common/api/workflow/index";
	import {
		onMounted,ref
	} from 'vue';
	const props = defineProps({
		config: {
			type: Object,
			default: () => {
				return {
					title: '我的任务',
				};
			}
		}
	});
	const dataList = ref([{
			icon: 'ant-design:container-twotone',
			name: '待办任务',
			count: 0,
			color: '#ff0033',
		},
		{
			icon: 'ant-design:tasks',
			name: '委托任务',
			count: 0,
			color: '#ff880e',
		},
		{
			icon: 'ant-design:list-check',
			name: '已办任务',
			count: 0,
			color: '#6fc86f',
		},
	])
	onMounted(async () => {
	
		let res = await getMyTaskCount(); 
		dataList.value = [{
				icon: 'ant-design:container-twotone',
				name: '待办任务',
				count: res.data.pendingCount,
				color: '#ff0033',
			},
			{
				icon: 'ant-design:tasks',
				name: '委托任务',
				count: res.data.delegateCount,
				color: '#ff880e',
			},
			{
				icon: 'ant-design:list-check',
				name: '已办任务',
				count: res.data.finishedCount,
				color: '#6fc86f',
			},
		]; 
	});
</script>

<style lang="less" scoped>
	.box {
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

			.title-style {
				margin: 12px 0 0;
				line-height: 18px;
				padding-left: 6px;
				border-left: 6px solid #5e95ff;
			}
		}

		.item {
			width: 100%;
			height: 100%;
		}
	}

	.menu-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;

		.menu-item {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 8px;

			.menu-icon {
				position: relative;
				height: 40px;
				display: flex;
				justify-content: center;
				align-items: center;

				.bg {
					border-radius: 50%;
					opacity: 0.1;
					height: 40px;
					width: 40px;
					position: relative;
				}

				.icon {
					position: absolute;
					top: 0;
					left: 0;
					height: 40px;
					width: 40px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}

			.menu-title {
				color: #262626;
				font-size: 14px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-left: 8px;

				.num {
					font-size: 22px;
					color: #666;
					line-height: 26px;
					font-weight: 600;
				}

				.name {
					color: #999;
					font-size: 12px;
				}
			}
		}
	}
</style>