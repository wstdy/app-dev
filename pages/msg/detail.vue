<template>
  <view class="wrap">
    <PageHead :title="state.pageTitle" />
  </view>
  <view class="card">
    <view class="card-box" v-if="state.type == OAType.SCHEDULE">
      <view class="card-content">开始时间：{{ state.startDate }}</view>
      <view class="card-content">结束时间：{{ state.endDate }}</view>
      <view>日程内容：{{ state.content }}</view>
    </view>
    <view class="card-box" v-else>
      <view class="title">{{ state.title }}</view>
      <view class="box">
        <view class="category"
          ><text>{{ state.category || "" }}</text></view
        >
        <view class="author desc">{{ state.authorName || "" }}</view>
        <view class="hr"></view>
        <view class="desc">{{ state.releaseTime || "" }}</view>
      </view>
      <view class="content">
        {{ state.content }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";
import PageHead from "@/components/layout/PageHead.vue";
import { getOADetail, getScheduleInfo } from "@/common/api/msg/index";
import { onLoad } from "@dcloudio/uni-app";
import { OAType } from "@/common/enums/msg.ts";
const state = reactive({
  title: "",
  category: "",
  authorName: "",
  releaseTime: "",
  content: "",
  pageTitle: "新闻中心",
  type: '',
  startDate: '',
  endDate: '',
});
onLoad(async (options) => {
  if (options.id) {
    if (options.type) {
      state.type = options.type
      if (options.type == OAType.NEWS) {
        state.pageTitle = "新闻中心";
      } else if (options.type == OAType.NOTIFICATIONS) {
        state.pageTitle = "通知公告";
      } else if (options.type == OAType.SCHEDULE) {
        state.pageTitle = "日程管理";
      }
    }
    try {
      if (options.type == OAType.SCHEDULE) {
        let res = await getScheduleInfo(options.id); 
        if (res.data) {
          state.startDate = res.data.startDate
          state.endDate = res.data.endDate
          state.content = res.data.scheduleContent
        }
      } else {
        let res = await getOADetail(options.id);
        console.log("res: ", res);
        if (res.data) {
          state.title = res.data.fullHead;
          state.category = res.data.category;
          state.authorName = res.data.authorName;
          state.releaseTime = res.data.releaseTime;
          state.content = res.data.newsContent;
        }
      }
    } catch (error) {}
  }
});
function backPage() {
  uni.navigateBack({
    delta: 1,
  });
}
</script>

<style lang="scss" scoped>
.card {
  background: #f6f9ff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  padding: 32rpx 36rpx;
}
.card-box {
  background: #ffffff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  margin-bottom: 19rpx;
  padding: 32rpx 38rpx;
  .title {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 36rpx;
  }
  .card-content{
    margin-bottom: 10px;
  }
  .box {
    display: flex;
    align-items: center;
    margin-top: 19rpx;
    .category {
      background: #e9eefd;
      border-radius: 38rpx 38rpx 38rpx 38rpx;
      margin-right: 19rpx;
      text {
        text-align: center;
        font-size: 19rpx;
        font-weight: 500;
        color: #5e95ff;
        line-height: 23rpx;
        display: inline-block;
        padding: 9rpx 19rpx;
      }
    }
    .hr {
      height: 23rpx;
      border-left: 1px solid #bbbec9;
      margin: 0 19rpx;
    }
    .desc {
      font-size: 23rpx;
      font-weight: 500;
      color: #bbbec9;
      line-height: 27rpx;
    }
  }
}
.content {
  min-height: 60vh;
  margin-top: 20rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  text-align: left;
  background-color: #fff;
}
</style>
