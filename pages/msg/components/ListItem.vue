<template>
  <view class="card-box">
    <view class="title" @tap="clickItem(content.id)">{{ content.briefHead || content.title }}</view>
    <view class="box" v-if="type != OAType.SCHEDULE">
      <view class="category"
        ><text>{{ content.category || "" }}</text></view
      >
      <view class="author desc">{{ content.authorName || "" }}</view>
      <view class="hr"></view>
      <view class="desc">{{ content.releaseTime || "" }}</view>
    </view>
  </view>
</template>

<script setup>
import { OAType } from "@/common/enums/msg.ts";
const props = defineProps({
  type:String,
  content: {
    type: Object,
    default: () => {
      return {
        id: "",
        briefHead: "",
        category: "",
        authorName: "",
        releaseTime: "",
      };
    },
  },
});
function clickItem(id) {
  if (id) {
    let url = "/pages/msg/detail?id=" + id+'&type='+props.type;
    uni.navigateTo({ url });
  }
}
</script>

<style lang="scss">
.card-box {
  background: #ffffff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  margin-bottom: 19rpx;
  padding: 32rpx 36rpx;
  .title {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 36rpx;
  }
  .box {
    display: flex;
    align-items: center;
    margin-top: 19rpx;
    .category {
      background: #e9eefd;
      border-radius: 38rpx 38rpx 38rpx 38rpx;
       margin-right: 19rpx;
      text {
        text-align: center;
        font-size: 19rpx;
        font-weight: 500;
        color: #5e95ff;
        line-height: 23rpx;
        display: inline-block;
        padding: 9rpx 19rpx;
      }
    }
    .hr{
      height: 23rpx;
      border-left: 1px solid #BBBEC9;
      margin: 0 19rpx;
    }
    .desc{
      font-size: 23rpx;
      font-weight: 500;
      color: #BBBEC9;
      line-height: 27rpx;
    }
  }
}
</style>
