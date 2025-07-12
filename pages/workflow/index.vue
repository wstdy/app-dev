<template>
  <view>
    <PageHead :title="pageTitle" :backUrl="state.backUrl"/>
    <view class="padding">
      <Search @search="search" />
      <view class="content">
        <PageList ref='pageListRef' :pageSize="10" :type="state.type" :keyword="state.searchKeyword">
        </PageList>
      </view>
    </view>
  </view>
</template>

<script setup>
import PageHead from "@/components/layout/PageHead.vue";
import Search from "@/components/layout/Search.vue";
import PageList from "@/components/workflow/PageList.vue";
import { WorkflowListType } from "@/common/enums/workflow.ts";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
// import { CUSTOM_BAR_HEIGHT } from "@/common/const/cache.js";
import { ref,reactive, computed } from "vue";
const state = reactive({
  type: WorkflowListType.TODO,
  searchKeyword: "",
  backUrl:'func'
});
const pageListRef = ref();
onLoad((options) => {
  state.searchKeyword = "";
  if (options && options.type) {
    state.type = options.type;
  }
  if (options && options.backUrl) {
    state.backUrl = options.backUrl;
  }
});
onReachBottom(() => {});
// const customBarHeight = computed(() => {
//   return uni.getStorageSync(CUSTOM_BAR_HEIGHT) + 20;
// });
const pageTitle = computed(() => {
  switch (state.type) {
    case WorkflowListType.TODO:
      return "我的待办列表";
    case WorkflowListType.CIRCULATED:
      return "我的传阅列表";
    case WorkflowListType.MY:
      return "我的任务列表";
    case WorkflowListType.FINISHED:
      return "我的已办列表";
    default:
      return "";
  }
});
function search(val) {
  pageListRef.value.resetParams();
  state.searchKeyword = val;
  pageListRef.value.getList(val);
}
</script>

<style scoped>
.content {
  margin-top: 28rpx;
}
.padding {
  padding: 0 28rpx;
}
</style>
