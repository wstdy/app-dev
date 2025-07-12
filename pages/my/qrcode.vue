<template>
  <view class="wrap">
    <view class="bg">
      <view class="header" :style="{ paddingTop: customBarHeight + 'px' }">
        <uni-icons class="icon" type="back" size="20" @tap="backPage"></uni-icons>
        <view class="title">我的二维码</view>
      </view>
    </view>
    <view class="content">
      <view class="user-box">
        <view class="user-img"><image :src="avatarImg"></image></view>
      </view>
      <view class="box">
        <view class="title">{{ state.name }}</view>
        <view class="role">超级管理员</view>
        <view class="code-box">
          <XjrSoftCode mode="widthFix" class="qrcode" />
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { computed ,onMounted,reactive} from "vue";
import { CUSTOM_BAR_HEIGHT } from "@/common/const/cache.js";
import XjrSoftCode from "@/components/qrcode/XjrSoft.vue";
import ossConfig from "@/common/config/oss.js";
import { USER_INFO_KEY } from "@/common/const/cache.js";
const state = reactive({
  name: "管理员"
});
const avatarImg = computed(() => {
  return ossConfig.staticImgUrl + "/img/user.png";
});
const customBarHeight = computed(() => {
  return uni.getStorageSync(CUSTOM_BAR_HEIGHT) - 30;
});
onMounted(() => {
  let userInfo = uni.getStorageSync(USER_INFO_KEY);
  if (userInfo.name) state.name = userInfo.name;
});
function backPage() {
  uni.navigateBack({
    delta: 1,
  });
}
</script>

<style lang="scss">
.wrap {
  background: #f6f9ff;
  height: 100vh;
  position: relative;
}
.bg {
  background-size: 100% 100%;
  height: 525rpx;
  .header {
    display: flex;
    align-items: center;
    min-height: 64rpx;
    padding: 28rpx;
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
  .role {
    font-size: 27rpx;
    font-weight: 500;
    color: #bbbec9;
    line-height: 32rpx;
    margin-bottom: 38rpx;
  }
}
.content {
  position: absolute;
  top: 355rpx;
  left: 0;
  right: 0;
  .user-box {
    position: absolute;
    top: -65rpx;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .user-img {
    width: 131rpx;
    height: 131rpx;
    background: #d1e4fe;
    border-radius: 50%;
    border: 4rpx solid #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 34rpx;
    image {
      width: 61rpx;
      height: 71rpx;
    }
  }
}
.box {
  width: 615rpx;
  height: 798rpx;
  background: #dce9fa;
  box-shadow: 0rpx 0rpx 38rpx 0rpx rgba(211, 230, 253, 0.5);
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    font-size: 38rpx;
    font-weight: bold;
    color: #253954;
    line-height: 45rpx;
    margin-top: 111rpx;
  }
  .role {
    font-size: 27rpx;
    font-weight: 500;
    color: #bbbec9;
    line-height: 32rpx;
    margin-top: 9rpx;
  }
}

.code-box {
  width: 481rpx;
  height: 481rpx;
  border-radius: 10rpx 10rpx 10rpx 10rpx;
  background-color: #ffffff;
  padding: 28rpx;
  margin-top: 38rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
