<template>
    <view class="card-box">
      <view class="card-head">
				<slot name="head"></slot>
       
			</view>
      <view class="hr"></view>
      <view class="card-content">
				<slot name="content"></slot>
			</view>
    </view>
</template>

<script setup></script>

<style lang="scss">
.card-box {
  background-color: #fff;
  color: #666;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 28rpx;
}
.card-head {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 6rpx 0 0 0;
}
.card-content {
  
}
.hr{
  height: 0rpx;
  opacity: 1;
  border: 2rpx solid #F3F4F8;
  margin: 24rpx 0;
}
</style>
