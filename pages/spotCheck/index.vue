<template>
  <view>
    <!-- 导航 -->
    <view class="header">
      <view class="headerContent">
        <view>
          <uni-icons type="back" size="20" @tap="clickLeft">返回</uni-icons>
        </view>
        <view class="title">点检任务</view>
        <view>
          <button class="action-btn" @click="clickRight">
            任务认领
          </button>
        </view>
      </view>
    </view>

    <!-- 内容 -->
    <view class="padding">

      <view class="content">
        <view>
          <uni-segmented-control :current="current" :values="items" :style-type="styleType" :active-color="activeColor"
            @clickItem="onClickItem" />
        </view>

        <view v-if="current === 0" style="margin-top: 28rpx;">
          <view>
            <uni-segmented-control :current="current0" :values="items0" :style-type="styleType"
              :active-color="activeColor" @clickItem="onClickItem0" />
          </view>
          <view v-if="current0 === 0">
            <OneComponent :listData="oneListData" :buttonShow="true"></OneComponent>
            <TableCardComponent :listData="oneListData" :buttonShow="true"></TableCardComponent>
          </view>
          <view v-if="current0 === 1">00000011111111111111111</view>
        </view>

        <view v-if="current === 1" style="margin-top: 28rpx;">
          <view>
            <uni-segmented-control :current="current1" :values="items1" :style-type="styleType"
              :active-color="activeColor" @clickItem="onClickItem1" />
          </view>
          <view v-if="current1 === 0">1111000</view>
          <view v-if="current1 === 1">1111111111</view>
        </view>

      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom } from "@dcloudio/uni-app";

import TableCardComponent from "./components/TableCardComponent.vue";
import { ref, reactive, computed } from "vue";
const items = ref(["今日任务", "已办任务"]);
const items0 = ref(["待认领", "已认领"]);
const items1 = ref(["待认领", "已认领"]);
const current = ref(0);
const current0 = ref(0);
const current1 = ref(0);
const activeColor = ref('#007aff');
const styleType = ref('button');

const oneListData = ref([
  {
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
  },
  {
    id: 2,
    taskName: 'XXXXXXX点检任务',
    status: '已认领',
    progress: '未开始',
    route: 'xxxxxxx点检路线',
    department: '设备部',
    specialty: '电气',
    position: '电气点检员',
    planStartTime: '2025-04-09 11:00:00',
    planEndTime: '2025-04-09 15:00:00',
    progressRate: '25/25',
    handler: '张三'
  },
  {
    id: 3,
    taskName: 'XXXXXXX点检任务',
    status: '已认领',
    progress: '已完成',
    route: 'xxxxxxx点检路线',
    department: '设备部',
    specialty: '电气',
    position: '电气点检员',
    planStartTime: '2025-04-09 11:00:00',
    planEndTime: '2025-04-09 15:00:00',
    progressRate: '25/25',
    handler: '张三'
  },
  {
    id: 4,
    taskName: 'XXXXXXX点检任务',
    status: '已认领',
    progress: '已延期',
    route: 'xxxxxxx点检路线',
    department: '设备部',
    specialty: '电气',
    position: '电气点检员',
    planStartTime: '2025-04-09 11:00:00',
    planEndTime: '2025-04-09 15:00:00',
    progressRate: '25/25',
    handler: '张三'
  },
]);
uni.setStorageSync('key', oneListData.value)

onLoad((options) => {
  state.searchKeyword = "";
  if (options && options.type) {
    state.type = options.type;
  }
  if (options && options.backUrl) {
    state.backUrl = options.backUrl;
  }
});
onReachBottom(() => { });
// const customBarHeight = computed(() => {
//   return uni.getStorageSync(CUSTOM_BAR_HEIGHT) + 20;
// });

const clickLeft = () => {
  console.log('11')
  // uni.navigateTo({
  //   url: "/pages/home/home"
  // })
  uni.switchTab({
    url: '/pages/home/home'
  });
}
const clickRight = () => {

}

const onClickItem = (e) => {
  current.value = e.currentIndex
}
const onClickItem0 = (e) => {
  current0.value = e.currentIndex
}
const onClickItem1 = (e) => {
  current1.value = e.currentIndex
}
</script>

<style scoped>
.header {
  background-color: #F3F3F3;
  min-height: 64rpx;
  padding: 16rpx;
}

.headerContent {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

uni-icon {
  height: 27rpx;
  color: #253954;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 35rpx;
  font-weight: bold;
  color: #253954;
  line-height: 42rpx;
}

.action-btn {
  margin: 0 10rpx;
  font-size: 26rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  color: #666;
}

.content {
  margin-top: 28rpx;
}

.padding {
  padding: 0 28rpx;
}
</style>
