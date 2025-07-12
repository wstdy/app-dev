<template>
  <view class="card-box">
    <slot></slot>
  </view>
</template>

<script setup></script>

<style lang="scss">
.card-box {
  display: flex;
  align-items: center;
  flex: 1;
  // box-shadow: 2px 5px 10px rgba(174, 178, 190, 0.1);
  background-color: #fff;
  color: #666;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}
</style>
