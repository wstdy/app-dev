<template>
  <!-- 查看流程 -->
  <FlowInfo  v-if="state.visible" :backUrl="state.backUrl"  :title="state.pageTitle" :data="data" :disabled="true">
  </FlowInfo>
</template>

<script setup>
import {reactive } from "vue";
import FlowInfo from "./components/FlowInfo.vue"; //流程详情
import { onLoad } from "@dcloudio/uni-app";
import { getViewInfo } from "@/common/api/workflow/index";
import userTaskItem from "./hooks/userTaskItem";
import { WorkflowListType } from "@/common/enums/workflow.ts";
const title = "查看流程-";
const state = reactive({
  visible: false,
  pageTitle: "",
  backUrl:'',
  type:WorkflowListType.TODO
});
const props = defineProps({
  id: String,
  processId: String
});
const { data, initProcessData } = userTaskItem();
onLoad(async(options) => {
  state.searchKeyword = '';
  if(options&&options.type){
    state.type = options.type;
    if (state.type == WorkflowListType.TODO) {
      state.backUrl = '/pages/workflow/index?type=todo';
    } else if (state.type == WorkflowListType.FINISHED) {
      state.backUrl = '/pages/workflow/index?type=finished';
    } else if (state.type == WorkflowListType.CIRCULATED) {
      state.backUrl = '/pages/workflow/index?type=circulated';
    } else if (state.type == WorkflowListType.MY) {
      state.backUrl = '/pages/workflow/index?type=my';
    }
  }
  if(options&&options.processId){
    try {
      let res = await getViewInfo(options.processId);
    initProcessData(res.data);
    data.processId = options.processId;
    state.pageTitle = title + data.item.name;
    state.visible = true;
    } catch (error) {
      console.log('error: ', error);
    }
    
  }
});
</script>

<style lang="scss" scoped>
.approval-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  color: #02071a;
  line-height: 20px;
  z-index: 2;
  background-color: #fff;
  box-shadow: 5px -5px 8px hsla(0, 0%, 89.8%, 0.3);
}
.approval-content-box {
  padding: 14px;
  background-color: #fff;
}
.approval-content {
  background-color: #f5f6fa;
}
</style>
