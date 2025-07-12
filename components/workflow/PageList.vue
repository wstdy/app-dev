<template>
  <view>
    <view class="list-box" v-if="state.list.length>0">
    <FlowCard
      v-for="(item, index) in state.list"
      :key="index"
      :content="item"
      :hasApproval="hasApproval"
      :type="props.type"
    ></FlowCard>
  </view>
  <Empty v-else title="暂无数据"/>
  </view>
  
</template>

<script setup>
import { reactive, computed, watch } from "vue";
import { onReachBottom, onShow } from "@dcloudio/uni-app";
import FlowCard from "./components/FlowCard.vue";
import Empty from "@/components/layout/Empty.vue";
import {
  getTodoTasks,
  getFinishedTasks,
  getCirculatedTasks,
  getMyProcess,
} from "@/common/api/workflow/index";
import { WorkflowListType } from "@/common/enums/workflow.ts";
const props = defineProps({
  pageSize: 5,
  // keyword: "",
  type: WorkflowListType.TODO,
});
const state = reactive({
  limit: 1,
  size: props.pageSize,
  total: 0,
  list: [],
  keyword: ""
});
const hasApproval = computed(() => {
  return props.type == WorkflowListType.TODO; //待办列表 审批流程
});
onReachBottom(async () => {
  if (state.list.length < state.total) {
    state.limit += 1;
    await getList(state.keyword);
  }
});
onShow(async () => {
  await initList();
});
async function initList() {
  state.list = [];
  resetParams();
  await getList();
}
function resetParams() {
  state.total = 0;
  state.limit = 1;
  state.list = [];
  state.size = props.pageSize;
}
async function getList(keyword) {
  if(keyword==undefined){
    state.keyword = '';
  }else{
    state.keyword = keyword;
  }
  try {
    let res = null;
    let params = {
      keyword: state.keyword,
      limit: state.limit,
      size: state.size,
    };
    if (props.type == WorkflowListType.TODO) {
      res = await getTodoTasks(params);
    } else if (props.type == WorkflowListType.FINISHED) {
      res = await getFinishedTasks(params);
    } else if (props.type == WorkflowListType.CIRCULATED) {
      res = await getCirculatedTasks(params);
    } else if (props.type == WorkflowListType.MY) {
      res = await getMyProcess(params);
    }
    state.total = res.data && res.data.total ? res.data.total : 0;
    if (res.data && res.data.list && res.data.list.length > 0) {
      state.list = [...state.list, ...res.data.list];
    }
  } catch (error) {}
}
defineExpose({ getList,resetParams });
</script>

<style lang="scss">
.list-box {
  border: none;
  border-radius: 20rpx;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
</style>
