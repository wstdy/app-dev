<template>
  <view class="content">
  <view class="bg">
  <view class="title-box">
  </view>
    <menuList/>
  </view>
   
    <view class="tab-box">
      <scroll-view scroll-x>
        <view class="tab-header">
          <view
            class="tab-item"
            v-for="(item, index) in state.tabList"
            :key="index"
            :class="state.currentTabIndex == index ? 'cur' : ''"
            @tap="changeCurrentTabIndex(index)"
          >
            <text>{{ item.title }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="tab-content">
      <todoList v-show="state.currentTabIndex === 0" :pageSize="10" :type="WorkflowListType.TODO"/>
      <dashboard v-if="state.currentTabIndex === 1" />
      <information v-if="state.currentTabIndex === 2" />
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";
import menuList from "./components/menuList.vue";
import todoList from "@/components/workflow/PageList.vue";
import dashboard from "./components/dashboard/index.vue";
import information from "./components/information/index.vue";
import ossConfig from '@/common/config/oss.js'
import { WorkflowListType } from "@/common/enums/workflow.ts";
const state = reactive({
  currentTabIndex: 0,
  tabList: [{ title: "待办任务" }, { title: "数据看板" }, { title: "行业信息" }],
});
onReachBottom(()=>{});
function changeCurrentTabIndex(index){
  state.currentTabIndex = index;
}
</script>

<style lang="scss">
.content{
  background: #F6F9FF;
}
.bg{
  background-size: 100% 100%;
  padding: 40rpx 28rpx 0 28rpx;
  .title-box{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      width: 258rpx;
      height: 38rpx;
      image{
        width: 100%;
        height: 100%;
      }
    }
    .icon{
      font-weight: 700;
      font-size: 48rpx;
    }
  }
}
.tab-box {
  background: #E7EBF2;
  border-radius: 38rpx 38rpx 38rpx 38rpx;
  margin: 25rpx 28rpx;
  padding: 6rpx;
}
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tab-item {
  font-size: 28rpx;
  font-weight: bold;
  color: #253954;
  line-height: 32rpx;
  padding: 12rpx 30rpx;
}
.tab-header .cur {
  background: #FDFDFD;
border-radius: 30rpx 30rpx 30rpx 30rpx;
color: #5E95FF;
}
.tab-content {
  padding: 0 30rpx;
  padding-bottom: 120rpx;
}
</style>
