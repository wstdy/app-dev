<template>
  <view class="news-item">
    <view class="title">{{ props.title }}</view>
    <view class="date-box"><span class="icon iconfont icon-likaishijian"></span><view class="date">2023-08-08 10:09:44</view></view>
    <view class="hr"></view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: "新闻",
});
</script>

<style lang="scss">
.news-item {
  .title {
    font-size: 26rpx;
    font-weight: bold;
    color: #253954;
    line-height: 2;
  }
  .hr {
    height: 0rpx;
    opacity: 1;
    border: 2rpx solid #f3f4f8;
    margin: 20rpx 0;
  }
  .date-box{
    display: flex;
    align-items: center;
    .icon{
      margin-right: 6rpx;
      color: #D9DFEA;
    }
    .date{
      font-size: 23rpx;
      font-weight: 500;
      color: #BDC3D6;
      line-height: 27rpx;
    }
  }
}
</style>
