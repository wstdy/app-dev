<template>
  <view class="wrap" v-if="props.relationSchemaId">
    <!-- 关联任务列表 -->
    <view class="rel-box">
      <view class="title">任务名称：{{ props.relationSchemaName }}</view>
      <view class="box" @click="shareToggle">
        <view class="text"><slot></slot></view>
        <view class="icon">...</view>
      </view>
    </view>
    <custom-dialog ref="relationRef" title="选择前置任务" :hasCloseIcon="true" :hasFooterIcon="true">
      <view class="relation-box">
        <CardBox v-for="(item, index) in data.dataSource" :key="index">
          <view class="card-box">
            <view class="title-box">
              <text class="title">{{
                item.taskName ? item.taskName : item.schemeName
              }}</text>
              <view class="check-item" @click="checkFlow(item)">
                <view
                  class="checked"
                  v-if="data.processInstanceIds.includes(item.processId)"
                >
                  <view class="icon"></view>
                </view>
                <view class="kong" v-else></view>
              </view>
            </view>
            <view class="card-hr"></view>
            <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-huiyuan"></text>
              </view>
              <text class="text">任务：{{ item.schemaName }}</text>
            </view>
            <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-a-1Frenyuanyonghu"></text>
              </view>
              <text class="text">发起者：{{ item.originator }}</text>
            </view>
            <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-likaishijian"></text>
              </view>
              <text class="text">发起时间：{{ item.createTime }}</text>
            </view>
          </view>
        </CardBox>
      </view>
      <template #footer>
        <custom-dialog-submit @tap="confirm"></custom-dialog-submit>
      </template>
    </custom-dialog>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue";
import CardBox from "@/components/card/CardBox.vue";
import { getRelationTasks } from "@/common/api/workflow/index";
const props = defineProps({
  launchId: String,
  relationSchemaName: String,
  relationSchemaId: String,
  itemIndex: Number,
  processId: String,
});
const emits = defineEmits(["submit"]);
const relationRef = ref();
const data = reactive({
  dataSource: [],
  processInstanceIds: [],
  pagination: {
    current: 1,
    total: 0,
    pageSize: 15,
  },
  submitParams: {
    taskId: "",
    taskName: "",
    processId: "",
  },
});
async function shareToggle() {
  data.processInstanceIds = props.processId ? [props.processId] : [];
  let res = await getRelationTasks({
    schemaId: props.launchId,
    relationSchemaId: props.relationSchemaId,
    ...{
      limit: data.pagination.current,
      size: data.pagination.pageSize,
    },
  });
  if (res && res.data && res.data.list) data.dataSource = res.data.list;
  relationRef.value.open();
}
function checkFlow(item) {
  data.processInstanceIds = [item.processId];
  data.submitParams = {
    itemIndex: props.itemIndex,
    taskId: item.taskId,
    taskName: item.taskName,
    processId: item.processId,
  };
}
function confirm() {
  emits("submit", data.submitParams);
  relationRef.value.close();
}
</script>

<style lang="scss">
.rel-box {
  padding: 28rpx;
  background: #ffffff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  margin-top: 19rpx;
  .title {
    font-size: 31rpx;
    font-weight: 500;
    color: #253954;
    line-height: 36rpx;
  }
  .box {
    height: 77rpx;
    background: #f6f9ff;
    border-radius: 10rpx 10rpx 10rpx 10rpx;
    opacity: 1;
    border: 2rpx solid #f2f2f2;
    margin-top: 19rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 23rpx;
    .text {
      font-size: 27rpx;
      font-weight: 500;
      color: #bdc3d6;
      line-height: 32rpx;
    }
    .icon {
      font-size: 27rpx;
      font-weight: 500;
      color: #253954;
      line-height: 32rpx;
      margin-top: -20rpx;
    }
  }
}
.relation-box{
  margin-bottom: 120rpx;
}
.card-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 28rpx;
    .title {
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
    .text {
      font-size: 27rpx;
      font-weight: 500;
      color: #253954;
      line-height: 32rpx;
      margin-left: 10rpx;
    }
  }
  .check-item {
    .kong {
      width: 27rpx;
      height: 27rpx;
      background: #ffffff;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      border: 2rpx solid #e7ebf2;
      border-radius: 50%;
    }
    .checked {
      width: 27rpx;
      height: 27rpx;
      background: #ffffff;
      opacity: 1;
      border: 2rpx solid #5e95ff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 15rpx;
        height: 15rpx;
        background: #5e95ff;
        border-radius: 50%;
      }
    }
  }
}

</style>
