<template>
  <CardBox>
    <view class="flow-card-box">
      <view class="flow-title-box">
        <text class="card-title">{{ content.processName }}</text>
        <view class="btn" v-if="hasApproval" @click="approvalFlow()"
          ><text>待审批</text></view
        >
        <view v-else class="btn" @click="lookFlow()"><text>查看</text></view>
      </view>
      <view class="card-hr"></view>
      <view class="card-content">
        <view class="icon">
          <text class="iconfont icon-jiedian"></text>
        </view>
        <text class="card-content-text">{{
          content.startUserName ? content.startUserName : content.originator
        }}</text>
      </view>
      <view class="card-content">
        <view class="icon">
          <text class="iconfont icon-likaishijian"></text>
        </view>
        <text class="card-content-text">{{
          content.startTime ? content.startTime : content.createTime
        }}</text>
      </view>
      <view class="card-content">
        <view class="icon">
          <text class="iconfont icon-a-1Frenyuanyonghu"></text>
        </view>
        <text class="card-content-text">{{
          content.taskName ? content.taskName : content.processName
        }}</text>
      </view>
    </view>
  </CardBox>
</template>

<script setup>
import CardBox from "@/components/card/CardBox.vue";
import { WorkflowListType } from "@/common/enums/workflow.ts";
const props = defineProps({
  content: {
    type: Object,
    default: () => {
      return {
        processName: "",
        startUserName: "",
        startTime: "",
      };
    },
  },
  hasApproval: false,
  type:{
    type:String,
    default:WorkflowListType.TODO
  }
});
function lookFlow() {
  uni.navigateTo({
    url: "/pages/workflow/look?processId="+props.content.processId+"&type="+props.type
  });
}
function approvalFlow() {
  uni.navigateTo({
    url: "/pages/workflow/approval?taskId="+props.content.taskId+"&processId="+props.content.processId+"&type="+props.type
  });
}
</script>

<style lang="scss">
.flow-card-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28rpx;
}
.flow-title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 28rpx;
  .card-title {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    width: 550rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.btn {
  width: 100rpx;
  height: 42rpx;
  background: #e9eefd;
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  text {
    font-size: 20rpx;
    font-weight: 500;
    color: #5e95ff;
    line-height: 23rpx;
  }
}
.card-hr {
  width: 100%;
  height: 1rpx;
  background: #eeeeee;
  border-radius: 0rpx;
  opacity: 1;
  margin-bottom: 28rpx;
}
.card-content {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10rpx 0;
  .icon {
    width: 35rpx;
    height: 35rpx;
    background: #d9dfea;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .iconfont {
    font-size: 18rpx;
    color: #fff;
  }
  .card-content-text {
    font-size: 27rpx;
    font-weight: 500;
    color: #253954;
    line-height: 32rpx;
    margin-left: 10rpx;
  }
}
</style>
