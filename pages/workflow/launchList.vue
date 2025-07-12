<template>
  <view class="wrap">
    <PageHead :title="pageTitle" :backUrl="state.backUrl"/>
    <view class="list">
      <Search @search="search" /><!-- 搜索 -->
      <scroll-view class="category-box" scroll-x scroll-left="120">
        <block v-for="(item, index) in state.categoryList" :key="index">
          <view class="item" @tap="changeCategory(index)">
            <view class="title" :class="index == state.categoryCurrentIndex ? 'cur' : ''">
              {{ item.name }}</view
            >
            <view
              class="icon-item"
              :class="index == state.categoryCurrentIndex ? 'cur-item' : ''"
            ></view>
          </view>
        </block>
      </scroll-view>
      <view class="card-list" v-if="state.list.length>0">
        <view
          v-for="(item, index) in state.list"
          :key="index"
          class="card-item"
          @tap="clickItem(item)"
        >
          <view class="item">
            <image :src="LiuChengImg" class="item-icon"></image>
            <text class="item-text">{{ item.name }}</text>
            <view class="iconfont icon-liucheng1"></view>
          </view>
        </view>
      </view>
      <Empty v-else title="暂无数据" />
    </view>
  </view>
</template>

<script setup>
import PageHead from "@/components/layout/PageHead.vue";
import Search from "@/components/layout/Search.vue";
import { getCategoryList, getLaunchList } from "@/common/api/workflow/index";
import { onLoad,onReachBottom, onShow } from "@dcloudio/uni-app";
import { reactive } from "vue";
import ossConfig from "@/common/config/oss.js";
import Empty from "@/components/layout/Empty.vue";
const LiuChengImg = ossConfig.staticImgUrl + "/img/liucheng.png";
const pageSize = 20;
const state = reactive({
  searchKeyword: "",
  searchCategory: "",
  list: [],
  categoryCurrentIndex: "",
  categoryList: [],
  pageSize: pageSize,
  current: 1,
  total: 0,
  list: [],
  backUrl:'func'
});
const pageTitle = "发起流程列表";

onLoad((options) => {
  if (options && options.backUrl) {
    state.backUrl = options.backUrl;
  }
});
onReachBottom(async () => {
  if (state.list.length < state.total) {
    state.current += 1;
    await getList();
  }
});
onShow(async () => {
  resetParams();
  await initList();
});
async function initList() {
  getCategoryData();
  await getList();
}
function changeCategory(index) {
  resetParams();
  state.categoryCurrentIndex = index;
  state.searchCategory = state.categoryList[index].id;
  getList();
}
async function getCategoryData() {
  const res = await getCategoryList();
  if (res.success && res.data.length > 0) {
    state.categoryList = res.data;
    state.searchCategory = state.categoryList[0].id;
  }
}
function search(val) {
  resetParams();
  state.searchKeyword = val;
  getList();
}

function resetParams() {
  state.total = 0;
  state.current = 1;
  state.size = pageSize;
  state.list = [];
  state.searchCategory = "";
  state.searchKeyword = "";
}
async function getList() {
  try {
    let params = {
      limit: state.current,
      size: state.pageSize,
      category: state.searchCategory,
      keyword: state.searchKeyword,
      enabledMark: 1, // 流程发起list 需要隐藏 禁用的模板[enabledMark=1]
    };
    let res = await getLaunchList(params);
    state.total = res.data && res.data.total ? res.data.total : 0;
    if (res.data && res.data.list && res.data.list.length > 0) {
      state.list = [...state.list, ...res.data.list];
    }
  } catch (error) {}
}
function clickItem(content) {
  uni.navigateTo({
    url: "/pages/workflow/launch?id=" + content.id,
  });
}
</script>

<style lang="scss">
page {
  background-color: #f5f6fa;
}
.list {
  padding: 0 28rpx;
}
.category-box {
  font-size: 26rpx;
  white-space: nowrap;
  margin: 20rpx 0;
  margin-left: 40rpx;
  .item {
    margin-right: 88rpx;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 27rpx;
    font-weight: bold;
    color: #253954;
    line-height: 32rpx;
  }
  .cur {
    color: #5e95ff;
  }
  .cur-item {
    background: #5e95ff;
  }
  .icon-item {
    width: 38rpx;
    height: 8rpx;
    border-radius: 4rpx 4rpx 4rpx 4rpx;
    margin-top: 12rpx;
  }
}

.card-list {
  .card-item {
    background: #ffffff;
    border-radius: 19rpx 19rpx 19rpx 19rpx;
    margin: 20rpx 0;
    position: relative;
    .item {
      display: flex;
      height: 96rpx;
      align-items: center;
      .item-icon {
        width: 57rpx;
        height: 57rpx;
        margin: 20rpx;
      }
      .item-text {
        font-size: 27rpx;
        font-weight: 500;
        color: #253954;
        line-height: 32rpx;
      }
      .iconfont {
        position: absolute;
        top: -30rpx;
        right: -4rpx;
        font-size: 88rpx;
        transform: rotate(30deg);
        color: #f3f7ff;
      }
    }
  }
}
</style>
