<template>
  <!-- 流程记录 -->
  <view>
    <block v-if="content.length > 0">
      <view class="wrap">
        <view class="roams-box" v-for="(item, index) in content" :key="index">
          <view class="time-box">
            <view class="big-circular"><view class="small-circular"></view></view>
            <view class="time-text">{{ item.approveTime }}</view>
          </view>
          <view class="content-box">
            <view class="border" v-if="index < content.length - 1"></view>
            <view class="content">
              <view class="node-box">
                <view class="node-text">{{ item.approveUserName }}</view>
                <view class="node-text">【{{ item.taskName }}：</view>
                <view class="node-view" :class="getTagCls(item)">{{ item.approveResult }}</view>
                <view class="node-text">】</view>
              </view>
              <view class="node-box">
                <view class="node-view">{{ item.approveComment || '无审批意见' }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <block v-else-if="showEmpty">
      <Empty title="流程记录为空" />
    </block>
  </view>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import Empty from "@/components/layout/Empty.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  content: Array,
  processId: "",
});

const showEmpty = computed(() => {
  return !route.path.includes('launch');
});

const state = reactive({
  list: [],
});
onMounted(() => {
});
function getTagCls(item) {
  return {
    agree: item.approveType === 0,
    reject: item.approveType === 2,
    tag: true
  };
}
</script>

<style lang="scss">
.tag {
    padding-right: 4px;

    &.agree {
        color: #52c41a;
    }

    &.reject {
        color: #eaa63c;
    }
}
.wrap {
  padding: 40rpx 20rpx 100rpx 20rpx;
  position: relative;
}
.header {
  color: #409eff;
  border-bottom: 2px solid #409eff;
  padding: 10px 10px 5px;
  width: 70px;
}
.roams-btn {
  position: absolute;
  top: 16rpx;
  right: 12rpx;
  background: #e9eefd;
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  padding: 9rpx 21rpx;
  text {
    font-size: 19rpx;
    font-weight: bold;
    color: #5e95ff;
    line-height: 23rpx;
  }
}
.roams-box {
  display: flex;
  flex-direction: column;
  .time-box {
    display: flex;
    align-items: center;
  }
  .time-text {
    font-size: 27rpx;
    font-weight: bold;
    color: #253954;
    line-height: 32rpx;
    margin-left: 20rpx;
  }
  .content-box {
    display: flex;
  }
  .border {
    width: 1rpx;
    margin-left: 12rpx;
    border-left: 1px dotted #c0c0c0;
  }
  .content {
    flex: 1;
    background: #ffffff;
    border-radius: 19rpx 19rpx 19rpx 19rpx;
    padding: 28rpx;
    margin: 10px 0 20rpx 20rpx;
  }
  .node-box {
    margin-bottom: 30rpx;
    display: flex;
    .node-text {
      font-size: 28rpx;
      font-weight: bold;
      color: #bbbec9;
      // margin: 10rpx 0;
    }
    .node-view {
      font-size: 28rpx;
      font-weight: bold;
      // color: #253954;
    }
  }

  .big-circular {
    width: 27rpx;
    height: 27rpx;
    background: #D5E3FF;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .small-circular {
    width: 15rpx;
    height: 15rpx;
    background: #5E95FF;
    border: 3rpx solid #ffffff;
    border-radius: 50%;
  }
}
</style>
