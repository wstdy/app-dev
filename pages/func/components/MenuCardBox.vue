<template>
  <view class="card-box">
    <view class="card-title">
        <text class="icon"></text>
        <text class="title">{{ props.title }}</text>
        <text class="desc">{{ props.desc }}</text>
      </view>
    <view class="hr-box"><view class="hr"></view></view>
    <slot></slot>
  </view>
</template>

<script setup>
const props = defineProps({
  title: "系统应用",
  desc: '长按可以操作应用'
});
</script>

<style lang="scss">
.card-box {
  background: #FFFFFF;
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}
.card-title {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  .icon {
    width: 10rpx;
    height: 40rpx;
    background: linear-gradient(180deg, #5e95ff 0%, rgba(94, 149, 255, 0.16) 100%);
    border-radius: 4rpx 4rpx 4rpx 4rpx;
    opacity: 1;
    margin-right: 14rpx;
  }
  .title {
    height: 44rpx;
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 44rpx;
    margin-right: 14rpx;
  }
  .desc {
    height: 34rpx;
    font-size: 23rpx;
    font-weight: bold;
    color: #bdc3d6;
    line-height: 34rpx;
  }
}
.hr-box{
  width: 100%;
  .hr{
    border: 2rpx solid #F3F4F8;
  }
}
</style>
