<template>
  <!-- 流程记录 -->
  <view>
    <block v-if="state.list.length > 0">
      <view class="wrap">
        <view class="roams-btn" @click="changeList"
          ><text>{{ btnTitle }}</text></view
        >
        <view class="roams-box" v-for="(item, index) in state.list" :key="index">
          <view class="time-box">
            <view class="big-circular"><view class="small-circular"></view></view>
            <view class="time-text">{{ item.startTime }}</view>
          </view>
          <view class="content-box">
            <view class="border" v-if="index < state.list.length - 1"></view>
            <view class="content">
              <view class="node-box">
                <view class="node-text">节点类型：</view>
                <view class="node-view">{{ item.nodeType }}</view>
              </view>
              <view class="node-box">
                <view class="node-text">节点名称：</view>
                <view class="node-view">{{ item.nodeName }}</view>
              </view>
              <view class="node-box" v-if="item.multiInstance">
                <view class="node-text">当前节点审批类型：</view>
                <view class="node-view">会签审批</view>
              </view>
              <view class="node-box">
                <view class="node-text">审批信息：</view>
                <view class="node-view">{{ item.comment }}</view>
              </view>
              <view class="node-box" v-if="item.circulateMessage">
                <view class="node-text">传阅信息：</view>
                <view class="node-view">{{ item.circulateMessage }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <Empty title="流程记录为空" />
    </block>
  </view>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { getSelfRecordList } from "@/common/api/workflow/index";
import Empty from "@/components/layout/Empty.vue";
const props = defineProps({
  content: Array,
  processId: "",
});
const state = reactive({
  list: [],
  isSelf: false,
});
const btnTitle = computed(() => {
  return state.isSelf ? "仅查看本人" : "查看所有";
});
onMounted(() => {
  changeList();
});
async function changeList() {
  state.list = [];
  state.isSelf = !state.isSelf;
  if (state.isSelf) {
    if(props.content.length>0&&Array.isArray(props.content[0].records)){
      state.list = props.content[0].records;
    }
  } else {
    try {
      let res = await getSelfRecordList({ processId: props.processId });
      if(res.data&&Array.isArray(res.data.taskRecords)){
        state.list = res.data.taskRecords;
      }
    } catch (error) {}
  }
}
</script>

<style lang="scss">
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
    .node-text {
      font-size: 22rpx;
      font-weight: bold;
      color: #bbbec9;
      margin: 10rpx 0;
    }
    .node-view {
      font-size: 28rpx;
      font-weight: bold;
      color: #253954;
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
