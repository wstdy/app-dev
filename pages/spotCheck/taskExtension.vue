<template>
  <view>
    <!-- 导航 -->
    <view class="header">
      <view class="headerContent">
        <view>
          <uni-icons type="back" size="20" @tap="clickLeft">返回</uni-icons>
        </view>
        <view class="title">任务延期</view>
        <view></view>
      </view>
    </view>

    <!-- 卡片组件 -->
    <view class="padding">
      <view class="content">
        <CardComponent :cardData="cardData"></CardComponent>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from '@dcloudio/uni-app';
import CardComponent from './components/cardComponent.vue';

const cardData = ref<{
  id: Number,
  taskName: String,
  status: String,
  progress: String,
  route: String,
  department: String,
  specialty: String,
  position: String,
  planStartTime: String,
  planEndTime: String,
  progressRate: String,
  handler: String,
}>({})

onLoad(options => {
  if ('params' in options) {
    const obj = JSON.parse(decodeURIComponent(options.params));
    cardData.value = obj.task
  }
})

const clickLeft = () => {
  uni.navigateTo({
    url: "/pages/spotCheck/index"
  })
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

.content {
  margin-top: 28rpx;
}

.padding {
  padding: 0 28rpx;
}
</style>