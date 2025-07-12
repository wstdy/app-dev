<template>
  <view class="wrap">
    <PageHead :title="pageTitle" />
    <view class="card-list" v-if="state.list && state.list.length > 0">
      <view
        v-for="(item, index) in state.list"
        :key="index"
        class="card-item"
        @tap="clickItem(item.url)"
      >
        <view class="item">
          <view class="left">
            <view class="item-icon"><view class="iconfont" :class="item.icon"></view></view>
            <view class="title">{{ item.name ? item.name : "name" }}</view>
          </view>
          <view class="value">{{ item.value }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import PageHead from "./components/Head.vue";
import { USER_INFO_KEY } from "@/common/const/cache.js";
import { reactive, onMounted } from "vue";
const pageTitle = "联系方式";
const state = reactive({
  list: [],
});
onMounted(() => {
  let userInfo = uni.getStorageSync(USER_INFO_KEY);
  state.list = [
    {
      name: "手机",
      value: userInfo.mobile ? userInfo.mobile : "",
      icon: "icon-jibenicon_shouji-mian",
    },
    {
      name: "电话",
      value: userInfo.mobile ? userInfo.mobile : "",
      icon: "icon-dianhua",
    },
    {
      name: "邮箱",
      value: userInfo.email ? userInfo.email : "",
      icon: "icon-youxiang",
    },
    {
      name: "微信",
      value: userInfo.weixin ? userInfo.weixin : "",
      icon: "icon-weixin",
    },
    {
      name: "QQ",
      value: userInfo.qq ? userInfo.qq : "",
      icon: "icon-qq",
    },
  ];
});
</script>

<style lang="scss" scoped>
.card-list {
  padding: 28rpx;
  .card-item {
    background: #ffffff;
    border-radius: 19rpx 19rpx 19rpx 19rpx;
    margin: 20rpx 0;
    position: relative;
    .item {
      display: flex;
      height: 96rpx;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        margin-left: 28rpx;
      }
      .item-icon {
        width: 23rpx;
        height: 23rpx;
        padding: 13rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #E9EEFD;
        .iconfont{
          color: #5e95ff;
        }
      }
      .title {
        margin-left: 20rpx;
        font-size: 27rpx;
        font-weight: 500;
        color: #253954;
        line-height: 32rpx;
      }
      .value{
        font-size: 27rpx;
        font-weight: 500;
        color: #253954;
        line-height: 32rpx;
        margin-right: 28rpx;
      }
    }
  }
}
</style>
