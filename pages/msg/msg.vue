<template>
  <PageLayout title="消息记录">
    <view class="card-list" v-if="list && list.length > 0">
    <view
      v-for="(item, index) in list"
      :key="index"
      class="card-item"
      @tap="clickItem(item.url)"
    >
      <view class="item">
        <view class="title">{{ item.name }}</view>
        <view class="desc">{{ item.desc }}</view>
        <view class="content">
          <image :src="item.img" class="item-img" />
          <view class="icon"></view>
        </view>
      </view>
    </view>
  </view>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/layout/Page.vue";
import { OAType } from "@/common/enums/msg.ts";
import ossConfig from "@/common/config/oss.js";
const list = [
  {
    unread: 0,
    name: "新闻",
    url: "/pages/msg/index?type=" + OAType.NEWS,
    img: ossConfig.staticImgUrl+"/img/msg/news.png",
    desc: "及时掌握相关动态",
  },
  {
    unread: 2,
    name: "通知公告",
    url: "/pages/msg/index?type=" + OAType.NOTIFICATIONS,
    img: ossConfig.staticImgUrl+"/img/msg/notifications.png",
    desc: "您有2条未读消息",
  },
  {
    unread: 0,
    name: "日程管理",
    url: "/pages/msg/index?type=" + OAType.SCHEDULE,
    img: ossConfig.staticImgUrl+"/img/msg/schedule.png",
    desc: "管理日程工作安排",
  },
  {
    unread: 0,
    name: "工作流审批",
    url: "/pages/workflow/index?type=todo",
    img: ossConfig.staticImgUrl+"/img/msg/todo.png",
    desc: "查看待办审批",
  },
  {
    unread: 0,
    name: "工作流传阅",
    url: "/pages/workflow/index?type=circulated",
    img: ossConfig.staticImgUrl+"/img/msg/circulation.png",
    desc: "高效传递、便捷审批",
  },
];
function clickItem(url) {
  if (url) {
    uni.navigateTo({ url });
  }
}
</script>

<style lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .card-item {
    flex-basis: 50%;
    .item {
      margin-right: 28rpx;
      margin-bottom: 28rpx;
      background: #ffffff;
      border-radius: 19rpx 19rpx 19rpx 19rpx;
      padding: 34rpx 38rpx;
    }
  }
  .title {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 36rpx;
  }
  .desc {
    font-size: 23rpx;
    font-weight: bold;
    color: #bdc3d6;
    line-height: 27rpx;
    margin: 12rpx 0 28rpx 0;
  }
  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon {
    width: 0;
    height: 0;
    border-color: transparent transparent transparent #253954;
    border-width: 12rpx 0 12rpx 10rpx;
    border-style: solid;
    border-radius: 2rpx 2rpx 2rpx 2rpx;
  }
  .item-img {
    width: 76rpx;
    height: 76rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

