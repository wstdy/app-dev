<template>
  <view class="header" :style="{ paddingTop: customBarHeight + 'px' }">
    <uni-icons class="icon" type="back" size="20" @tap="backPage"></uni-icons>
    <view class="title">{{ props.title }}</view>
  </view>
</template>

<script setup>
import { CUSTOM_BAR_HEIGHT } from "@/common/const/cache.js";
import { computed } from "vue";
const props = defineProps({
  title: "",
});

const customBarHeight = computed(() => {
  return uni.getStorageSync(CUSTOM_BAR_HEIGHT) - 40;
});

function backPage() {
  uni.navigateBack({
    delta: 1,
  });
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  height: 84rpx;
  background: #ffffff;
}
.icon {
  margin-left: 28rpx;
}
.title {
  flex: 1;
  text-align: center;
  font-size: 35rpx;
  font-weight: bold;
  color: #253954;
}
</style>
