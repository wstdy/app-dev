<template>
  <view class="page-box">
    <view class="logo-box">
      <view class="logo-img"></view>
      <view class="title-box">
        <view class="left"><image :src="avatarImg"></image></view>
        <view class="right">
          <view class="name">{{ state.userInfo.name }}</view>
          <view class="vip">
            <view class="vip-text">超级管理员</view>
            <view class="image-box"><image :src="vipImg" mode="heightFix"></image></view>
          </view>
        </view>
      </view>
    </view>
    <CardList :list="userInfoList"></CardList>
    <view class="logout-box" @tap="out"><text>退出登录</text></view>
  </view>
</template>

<script setup>
import ossConfig from "@/common/config/oss.js";
import CardList from "./components/CardList.vue";
import { USER_INFO_KEY } from "@/common/const/cache.js";
import { reactive, computed, onMounted } from "vue";
import { useUserStore } from "@/common/store/user";
const userStore = useUserStore();
const state = reactive({
  userInfo: {
    name: "管理员",
    avatar: "",
  },
});
const vipImg = ossConfig.staticImgUrl + "/img/star.png";
const avatarImg = computed(() => {
  return ossConfig.staticImgUrl + "/img/user.png";
  // state.userInfo.avatar || ossConfig.staticImgUrl + "/img/user.png";
});
onMounted(() => {
  let userInfo = uni.getStorageSync(USER_INFO_KEY);
  if (userInfo.name) state.userInfo.name = userInfo.name;
  if (userInfo.avatar) state.userInfo.avatar = userInfo.avatar;
});
const userInfoList = [
  {
    icon: "icon-a25",
    name: "联系方式",
    url: "/pages/my/contact",
  },
  {
    icon: "icon-saoyisao",
    type: 'scan',
    name: "扫一扫",
    url: "",
	},
  {
    icon: "icon-erweima",
    name: "我的二维码",
    url: "/pages/my/qrcode",
  },
  {
    icon: "icon-xiugaimima",
    name: "修改密码",
    url: "/pages/my/modify",
  }
];
async function out() {

  try {
    await userStore.logout(state.phoneLogin);
  } catch (error) {}
}
</script>

<style lang="scss">
.page-box {
  z-index: 1;
  height: 100%;
  min-height: 100vh;
  overflow: scroll;
  padding: 0 28rpx 108rpx 28rpx;
  background: linear-gradient(180deg, #d5e7ff 0%, rgba(213, 231, 255, 0) 100%);
}

.logo-box {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  .logo-img {
    position: absolute;
    top: -147rpx;
    right: -157rpx;
    height: 261rpx;
    width: 354rpx;
    border-radius: 50%;
    border: 62rpx solid #cfe6ff;
  }
  .title-box {
    margin: 102rpx 0 57rpx 0;
    display: flex;
    .left {
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
    .right {
      .name {
        font-size: 46rpx;
        font-weight: bold;
        color: #253954;
        line-height: 54rpx;
      }
      .vip {
        width: 188rpx;
        height: 50rpx;
        position: relative;
        margin-top: 15rpx;
        .image-box {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 1;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .vip-text {
          position: absolute;
          top: 11rpx;
          left: 53rpx;
          bottom: 0;
          right: 0;
          z-index: 2;
          font-size: 23rpx;
          font-weight: 500;
          color: #ffffff;
          line-height: 27rpx;
        }
      }
    }
  }
}
.logout-box {
  position: fixed;
  bottom: 196rpx;
  width: 692rpx;
  height: 96rpx;
  background: #e7ebf2;
  border-radius: 58rpx 58rpx 58rpx 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  text{
    font-size: 38rpx;
    font-weight: 500;
    color: #B7BACA;
  }
}
</style>
