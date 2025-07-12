<template>
	<view class="box">
		<view class="item-title">
			<text>{{ config.title }}</text>
			<view @tap="clickItem()" class="more">更多</view>
		</view>
		<view v-if="dataList.length == 0">暂无数据</view>
		<view class="list-box" v-else>
			<view class="row" v-for="(item, index) in dataList" :key="index" @tap="selectRow(item)">
				<view>
					<view class="item text-c6">{{ item.startUserName }} - {{ item.taskName }}</view>
					<view class="item text-xs">{{ item.startTime }}</view>
				</view>

				<uni-icons :size="14" color="#999999" custom-prefix="antfont" type="ant-design-right-arrow"
					class="icon"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		getTodoTasks
	} from "@/common/api/workflow/index";
	import {
		onMounted,
		ref
	} from 'vue';
	const props = defineProps({
		config: {
			type: Object,
			default: () => {
				return {
					title: '待办事项',
					maxRows: 2,
				};
			}
		}
	});
	const dataList = ref([{
			startUserName: '管理员',
			taskName: '任务名称',
			startTime: '2023-06-30 08:45:25',
		},
		{
			startUserName: '管理员',
			taskName: '任务名称',
			startTime: '2023-06-30 08:45:25',
		},
	])

	onMounted(async () => {
		await getList();
	});
	async function getList() {
		const searchParams = {
			...{
				limit: 1,
				size: props.config.maxRows,
			},
		};
		const res = await getTodoTasks(searchParams);
		dataList.value = res.data?.list || [];
	}

	function clickItem() {

		uni.navigateTo({
			url: '/pages/workflow/index?type=todo'
		});

	}

	function selectRow(row) {

		uni.navigateTo({
			url: "/pages/workflow/approval?taskId=" + row.taskId + "&processId=" + row.processId
		});

	}
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
			color: #666;
			font-size: 14px;
			padding: 0 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-weight: 700;
			box-sizing: border-box;

			text {
				line-height: 18px;
				padding-left: 6px;
				border-left: 6px solid #5e95ff;
			}

			.more {
				color: #5e95ff;
				font-size: 12px;
				font-weight: 400;
			}
		}

		.list-box {
			.row {
				border-bottom: 1px solid #f0f0f0;
				cursor: pointer;
				color: #999;
				font-size: 14px;
				padding: 8px 8px 4px 0;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.item {
					padding: 0 10px 4px;

					&.text-c6 {
						color: #666
					}
				}
			}
		}
	}
</style>