<template>
  <view class="pie-box">
    <Pie :progress="props.progress" :type="props.type" />
    <view class="pie-item">
      <view class="item">
        <view class="pie-title"><text class="icon green"></text><text>目标金额</text></view>
        <view class="pie-desc">¥180,000.00</view>
      </view>
      <view class="item">
        <view class="pie-title"><text class="icon blue"></text><text>完成金额</text></view>
        <view class="pie-desc">¥113,250.00</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Pie from "@/components/info/Pie.vue";
const props = defineProps({
  progress: 40,
  type: "blue",
});
</script>

<style lang="scss">
.pie-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pie-box .pie-item {
  flex-basis: 50%;
  line-height: 27px;
  .item {
    background: #f8f9ff;
    border-radius: 10rpx 10rpx 10rpx 10rpx;
    padding: 15rpx 30rpx;
    margin-bottom: 10rpx;
    .pie-title {
      font-size: 20rpx;
      font-weight: 500;
      color: #253954;
      line-height: 2;
      .icon {
        display: inline-block;
        width: 15rpx;
        height: 15rpx;
        border-radius: 4rpx 4rpx 4rpx 4rpx;
        margin-right: 6rpx;
      }
      .green{
        background: #3cd09e;
      }
      .blue{
        background: #5E95FF;
      }
    }
    .pie-desc {
      font-size: 31rpx;
      font-weight: bold;
      color: #253954;
      line-height: 36rpx;
    }
  }
}
</style>
