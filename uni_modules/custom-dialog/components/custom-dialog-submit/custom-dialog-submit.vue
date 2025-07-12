<template>
   <view class="btn-list">
      <view class="btn submit-btn">
          <text class="text">{{ props.title }}</text>
      </view>
    </view>
</template>

<script setup>
const props = defineProps({
  title:{
    type:String,
    default:'确认'
  }
});
</script>

<style lang="scss" scoped>
.btn-list {
  .btn {
    height: 96rpx;
    border-radius: 48rpx 48rpx 48rpx 48rpx;
    margin: 20rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .text {
      font-size: 31rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .submit-btn {
    background: #5e95ff;
  }
}
</style>
