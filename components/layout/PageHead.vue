<template>
  <view class="header">
    <uni-icons class="icon" type="back" size="20" @tap="backPage"></uni-icons>
    <view class="title">{{ props.title }}</view>
    <slot></slot
    ><!-- 下一步 完成 等按钮操作 -->
  </view>
</template>

<script setup>
import { computed } from "vue";
import { CUSTOM_BAR_HEIGHT } from "@/common/const/cache.js";
const props = defineProps({
  title: "",
  backUrl:{
    type:String,
    default:''
  }
});
const customBarHeight = computed(() => {
  return uni.getStorageSync(CUSTOM_BAR_HEIGHT) - 30;
});

function backPage() {
  if(props.backUrl){
    if(props.backUrl==='func'){
      uni.switchTab({
        url: '/pages/func/func'
    });
    }else if(props.backUrl==='home'){
      uni.switchTab({
        url: '/pages/home/home'
    });
    }else if(props.backUrl=='-1'){
      uni.navigateBack({
      delta: 1,
    });
    }else{
      uni.redirectTo({
        url: props.backUrl
      })
    }

  }else{
    uni.navigateBack({
      delta: 1,
    });
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  background-color: #F3F3F3;
  min-height: 64rpx;
  padding: 16rpx;
}
uni-icon {
  height: 27rpx;
  color: #253954;
}
.title {
  flex: 1;
  text-align: center;
  font-size: 35rpx;
  font-weight: bold;
  color: #253954;
  line-height: 42rpx;
}
</style>
