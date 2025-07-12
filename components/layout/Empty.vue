<template>
  <view class="empty-box">
    <view class="login-bg"><image :src="KongImg" /></view>
    <text class="text">{{ title }}</text>
  </view>
</template>

<script setup>
import ossConfig from "@/common/config/oss.js";
const KongImg = ossConfig.staticImgUrl + "/img/kong.png";
const props = defineProps({
title:''
});
</script>

<style lang="scss" scoped>
.empty-box {
  height: 800rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* #endif */
  color: #666666;
  border: none;
  .text{
    font-size: 31rpx;
    font-weight: 500;
    color: #BDC3D6;
    line-height: 36rpx;
  }
}
</style>