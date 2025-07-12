<template>
  <view>
    <view class="bar-title">
      <view class="title"><text class="bar-icon">Top</text><text>超级管理员</text></view>
      <text class="desc">￥876.989.00</text>
    </view>
    <Bar :percent="60" />
    <view class="hr"></view>
    <view class="bar-title">
      <view class="title"><text class="bar-icon">Top</text><text>超级管理员</text></view>
      <text class="desc">￥876.989.00</text>
    </view>
    <Bar :percent="60" />
    <view class="hr"></view>
  </view>
</template>

<script setup>
import Bar from "@/components/info/Bar.vue";
const props = defineProps({
  progress: 40,
  type: "blue",
});
</script>

<style lang="scss">
.bar-title {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  .title {
    font-size: 27rpx;
    font-weight: bold;
    color: #253954;
    line-height: 2;
  }
  .desc {
    font-size: 23rpx;
    font-weight: bold;
    color: #bdc3d6;
    line-height: 2;
  }
}
.bar-icon {
  font-weight: 700;
  margin-right: 6px;
}
.hr{
  width: 100%;
  height: 30rpx;
}
</style>
