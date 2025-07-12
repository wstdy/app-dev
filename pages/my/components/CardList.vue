<template>
  <view class="card-list" v-if="list && list.length > 0">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="card-item"
      @tap="clickItem(item)"
    >
      <view class="left-item">
      <view class="icon-box">
        <view class="iconfont" :class="item.icon"></view>
      </view>
        <view class="text">{{ item.name ? item.name : "name" }}</view>
      </view>
      <uni-icons class="uni-icon" color="#BDC3D6" type="right" size="14"></uni-icons>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  list: Array,
});
function clickItem(item) {
  if (item.type == "scan") {
    scan();
  } else if (item.url) {
    uni.navigateTo({ url: item.url });
  }
}
function scan() {
  // #ifdef H5
  uni.showModal({
    title: "提示",
    content: "抱歉H5界面暂不支持扫码功能",
    showCancel: false,
    confirmText: "确定",
  });
  // #endif
  // #ifdef MP-WEIXIN
  uni.scanCode({
    success: (res) => {
      this.result = res.result;
    },
  });
  // #endif
  // #ifdef APP-PLUS
  uni.scanCode({
    success: (res) => {
      this.result = res.result;
    },
  });
  // #endif
}
</script>

<style lang="scss">
.card-list {
  background-color: #fff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  padding: 28rpx;
}
.card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  line-height: 30px;
  padding: 20rpx 0;
  .iconfont {
    color: #ced5e3;
  }
  .uni-icon{
    font-size: 19rpx;
    font-weight: 700;
  }
  .left-item {
    display: flex;
    align-items: center;
    .text {
      font-size: 31rpx;
      font-weight: bold;
      color: #253954;
      line-height: 36rpx;
      margin-left: 30rpx;
    }
  }
}
.icon-box{
  width: 38rpx;
  height: 38rpx;
  background: #F6F7F9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 9rpx;
}
</style>
