<template>
   <view class="opinion-wrap">
    <view class="opinion-box" v-if="props.value&&props.value.length > 0">
      <view class="opinion-item" v-for="(item, index) in props.value" :key="index">
        <view class="content">
          <span>审批结果：{{ getApproveTypeName(item.approveType, item.approveResult) }}</span
          ><span> 审批意见：{{ item.approveComment }}</span>
        </view>
        <view class="esignature-box" v-if="item.approveStampUrl">
          <image :src="item.approveStampUrl" />
        </view>
        <view class="approve">
          <span>{{ item.approveUserName ? item.approveUserName : '审批人' }}</span>
          <span>{{ item.approveTime }}</span>
        </view>
        <view class="hr"></view>
      </view>
    </view>
    <view class="opinion-box" v-else>
      <view class="placeholder">（该组件仅用于接收工作流审批意见，不可手动编辑）</view>
    </view>
  </view>
</template>

<script setup>
import { ApproveType } from "@/common/enums/workflow.ts";
const props = defineProps({
  value:Array
});
function getApproveTypeName(type, approveResult = '') {
    if (type == ApproveType.AGREE) {
      return '同意';
    } else if (type == ApproveType.DISAGREE) {
      return '拒绝';
    } else if (type == ApproveType.REJECT) {
      return '驳回';
    } else if (type == ApproveType.FINISH) {
      return '结束';
    } else if (type == ApproveType.OTHER) {
      return approveResult;
    } else {
      return '其他';
    }
  }
</script>

<style scoped>
  .opinion-box {
    min-height: 240rpx;
    border: 1px solid #dcdfe6;
    overflow-y: auto;
    padding: 4rpx 10rpx;
  }

  .opinion-item {
    position: relative;
    padding: 40rpx;
  }

  .esignature-box {
    position: absolute;
    width: 240rpx;
    top: 100rpx;
    right: 20rpx;
  }
  .esignature-box,uni-image {
      width: 100rpx;
      height: 100rpx;
  } 
  .esignature-box image {
    width: 100%;
    height: 100%;
  }
  .esignature-box img {
    width: 100%;
    height: 100%;
  }
  .content {
    height: 160rpx;
    padding-left: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .approve {
    position: absolute;
    right: 20rpx;
    top: 120rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hr {
    margin-top: 20rpx;
    border-top: 1px solid #dcdfe6;
  }

  .placeholder {
    color: #dcdfe6;
  }
</style>