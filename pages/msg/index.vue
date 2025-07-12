<template>
    <view class="wrap">
    <PageHead :title="pageTitle" />
    <view class="list">
      <Search @search="search" /><!-- 搜索 -->
      <view class="card-list" v-if="state.list.length>0">
        <ListItem
        v-for="(item, index) in state.list"
        :key="index"
        :content="item"
        :type="state.type"
      ></ListItem>
      </view>
      <Empty v-else title="暂无数据" />
    </view>
  </view>
  
</template>

<script setup>
import PageHead from "@/components/layout/PageHead.vue";
import Search from "@/components/layout/Search.vue";
import ListItem from "./components/ListItem.vue";
import { getOAList, getOASchedule } from "@/common/api/msg/index";
import { onReachBottom,onLoad } from "@dcloudio/uni-app";
import { OAType } from "@/common/enums/msg.ts";
import Empty from "@/components/layout/Empty.vue";
import { reactive,computed } from "vue";
const pageSize = 10;
const state = reactive({
  limit: 1,
  size: pageSize,
  total: 0,
  searchKeyword: "",
  list: [],
  type: OAType.NEWS,
});
onLoad(async (options) => {
  state.searchKeyword = "";
  if (options && options.type) {
    state.type = options.type;
    resetParams();
    await getList();
  }
});

onReachBottom(async () => {
  if (state.list.length < state.total) {
    state.limit += 1;
    await getList();
  }
});
const pageTitle = computed(() => {
  if(state.type==OAType.NEWS){
    return '新闻中心'
  }else if(state.type==OAType.NOTIFICATIONS){
    return '通知公告'
  }else if(state.type==OAType.SCHEDULE){
    return '日程管理'
  }else{
    return '';
  }
})
function search(val) {
  resetParams();
  state.searchKeyword = val;
  getList();
}
function resetParams() {
  state.total = 0;
  state.limit = 1;
  state.list = [];
  state.size = pageSize;
}
async function getList() {
  try {
    let params = {
      keyword: state.searchKeyword,
      limit: state.limit,
      size: state.size,
    };
    let res = null;
    if(state.type==OAType.SCHEDULE){
      const schedules = await getOASchedule(params)
      state.list = [...state.list, ...schedules.data.list];
    }else{
      let listParams = {
        ...params,
        type: state.type,
        enabledMark:1
      };
      res = await getOAList(listParams);
      state.total = res.data && res.data.total ? res.data.total : 0;
      if (res.data && res.data.list && res.data.list.length > 0) {
        state.list = [...state.list, ...res.data.list];
      }
    }
    
  } catch (error) {}
}

</script>

<style scoped>

.list {
  padding: 0 28rpx;
}
.card-list{
  padding-top: 28rpx;
}
</style>
