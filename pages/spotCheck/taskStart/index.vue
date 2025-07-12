<template>
	<uni-nav-bar @clickLeft="clickLeft" @clickRight="clickRight" height="65px" left-icon="left" leftText="返回"
		rightText="扫一扫" title="点检任务" />
	<view>
		<uni-segmented-control :current="current" :values="items" style-type="button" active-color="#007aff"
			@clickItem="onClickItem" />
	</view>
	<view>
		<view class="title">基本信息</view>
		<CardComponent :cardData="cardData" />
	</view>
	<view class="area">
		<view class="title">点检区域未完成2个</view>
		<view class="area-box">
			<view class="area-top">
				<view>点检区域</view>
				<view>点检结果</view>
			</view>
			<view class="area-content">
				<view v-for="area in AreaList" :key="area.id" class="c-item">
					<view class="m-name">{{ area.name }}</view>
					<view class="m-value" @click="clickArea(area)">
						<span>{{ area.value }}</span>
						<uni-icons type="right" color="#a4a4a4"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { ref, reactive, computed } from "vue";
import CardComponent from "../components/CardComponent.vue";

const current = ref(0)
const items = ref(["点检记录", "点检记事"])
const cardData = reactive({
    id: 1,
    taskName: 'XXXXXXXX点检任务',
    status: '待认领',
    progress: '点检中',
    route: 'xxxxxxx点检路线',
    department: '设备部',
    specialty: '电气',
    position: '电气点检员',
    planStartTime: '',
    planEndTime: '2025-04-09 15:00:00',
    progressRate: '15/25',
    handler: ''
  })
const oneListData = ref([])
const AreaList = ref([
	{ id: '1', name: '区域一', value: '未完成', },
	{ id: '2', name: '区域二', value: '未完成', },
	{ id: '3', name: '区域三', value: '未完成', },
])

const onClickItem = (e: any) => {
	current.value = e.currentIndex
}

const clickArea = (item: any) => {
	console.log('item', item)
}

onLoad((options) => {
	// const { taskId } = options
	// const storeListData = uni.getStorageSync('key')

	// if (storeListData?.length && taskId) {
	// 	let currentData = storeListData.filter((v: any) => v.id == taskId)
	// 	console.log('currentData', currentData)
	// 	oneListData.value = currentData
	// }
});
onReachBottom(() => { });

const clickLeft = () => {
	console.log('11')
	uni.navigateTo({
		url: "/pages/spotCheck/index"
	})
};

const clickRight = () => {

}

</script>

<style scoped lang="less">
.title {
	padding: 0.5rem;
}

.content {
	margin-top: 28rpx;
}

.padding {
	padding: 0 28rpx;
}

.area {
	padding: 0.2rem;

	.area-box {
		border-radius: 0.5rem;
		background: white;

		.area-top {
			padding: 0.7rem;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px #e6e6e6 solid;
		}

		.area-content {
			padding: 0.2rem;

			.c-item {
				padding: 0.7rem;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px #e6e6e6 solid;
			}
		}
	}
}
</style>
