<template>
  <view class="head-box">
    <view class="title-box">
      <text class="icon"></text>
      <text class="title">{{ props.title }}</text>
    </view>
  </view>
</template>

<script setup>

const props = defineProps({
  iconType: "wallet-filled",
  title: "新闻",
});
</script>

<style lang="scss">
.head-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .icon{
    width: 10rpx;
    height: 38rpx;
    background: linear-gradient(180deg, #5E95FF 0%, rgba(94,149,255,0.16) 100%);
    border-radius: 4rpx 4rpx 4rpx 4rpx;
  }
}
.news-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 30px;
  font-size: 14px;
  color: #02071a;
  border-bottom: 1px solid #f2f2f2;
  padding: 10px;
}
.title-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
}
.title-box .title {
  height: 42rpx;
  font-size: 31rpx;
  font-weight: bold;
  color: #253954;
  line-height: 36rpx;
  margin-left: 14rpx;
}
</style>
