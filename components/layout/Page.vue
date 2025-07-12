<template>
  <view class="page-box">
    <view class="title-box">
      <view class="header-title">{{ props.title }}</view>
      <text class="iconfont icon icon-sousuo"></text>
    </view>
    <slot></slot>
  </view>
</template>

<script setup>
const props = defineProps({
  title: "名称",
});
</script>

<style lang="scss">
.page-box {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 100vh;
  overflow: scroll;
  background: #f6f9ff;
  padding: 0 28rpx 108rpx 28rpx;
  .title-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-title {
      padding-top: 40rpx;
      padding-bottom: 44rpx;
      font-size: 38rpx;
      font-weight: bold;
      color: #253954;
      line-height: 45rpx;
    }
    .icon {
      font-weight: 700;
      font-size: 48rpx;
    }
  }
}

</style>
