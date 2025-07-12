<template>
  <view class="container">
    <view class="task-card">
      <!-- 标题和状态 -->
      <view class="card-header">
        <view>
          <text class="task-name">{{ cardData.taskName }}</text>
          <text :class="['status-text', getStatusClass(cardData.status)]">{{ cardData.status }}</text>
        </view>
        <text :class="['progress-text', getProgressClass(cardData.progress)]">{{ cardData.progress }}</text>
      </view>

      <!-- 任务详情 -->
      <view class="card-body">
        <view class="info-row">
          <text class="info-label">点检路线：</text>
          <text class="info-value">{{ cardData.route }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">点检部门：</text>
          <text class="info-value">{{ cardData.department }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">专业名称：</text>
          <text class="info-value">{{ cardData.specialty }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">执行岗位：</text>
          <text class="info-value">{{ cardData.position }}</text>
        </view>
        <view v-if="cardData.handler" class="info-row">
          <text class="info-label">处理人：</text>
          <text class="info-value">{{ cardData.handler }}</text>
        </view>
        <view v-if="cardData.planStartTime" class="info-row">
          <text class="info-label">计划开始时间：</text>
          <text class="info-value">{{ cardData.planStartTime }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">计划结束时间：</text>
          <text class="info-value">{{ cardData.planEndTime }}</text>
        </view>
        <view class="info-row last-label">
          <text class="info-label">点检进度：</text>
          <text class="info-value">{{ cardData.progressRate }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineProps } from "vue";

const props = defineProps({
  cardData: {
    type: Object,
    required: true,
  }
})

const getStatusClass = (status) => {
  return {
    '待认领': 'status-waiting',
    '已认领': 'status-claimed'
  }[status] || '';
};

const getProgressClass = (progress) => {
  return {
    '点检中': 'progress1',
    '未开始': 'progress2',
    '已完成': 'progress3',
    '已延期': 'progress4',
  }[progress] || '';
};

</script>

<style scoped>
.container {
  /* padding: 20rpx; */
}

.task-card {
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 24rpx;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #d5d5d5;
}

.task-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-right: 24rpx;
}

.status-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status-text {
  font-size: 26rpx;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.status-waiting {
  background-color: #8464d5;
  color: #ffffff;
}

.status-claimed {
  background-color: #4caf50;
  color: #ffffff;
}

.progress1 {
  color: #887c0c;
}

.progress4 {
  color: #d2131d;
}

.progress-text {
  font-size: 24rpx;
  /* color: #666; */
  margin-top: 8rpx;
}

.card-body {
  padding: 24rpx;
}

.info-row {
  display: flex;
  margin-bottom: 16rpx;
  font-size: 28rpx;
}

.last-label {
  border-top: 1rpx solid #d5d5d5;
  padding-top: 16rpx;
}

.info-label {
  color: #666;
  width: 200rpx;
}

.info-value {
  color: #333;
  flex: 1;
}

.card-footer {
  display: flex;
  padding: 16rpx 24rpx;
  border-top: 1rpx solid #f5f5f5;
}

.action-btn {
  flex: 1;
  margin: 0 10rpx;
  font-size: 26rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  color: #666;
}

.primary {
  background-color: #1890ff;
  color: #fff;
}

.danger {
  background-color: #ff4d4f;
  color: #fff;
}
</style>