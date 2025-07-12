<template>
  <view class="container">
    <view v-for="task in props.listData" :key="task.id" class="task-card">
      <!-- 标题和状态 -->
      <view class="card-header">
        <view>
        <text class="task-name">{{ task.taskName }}</text>
               <text :class="['status-text', getStatusClass(task.status)]">{{ task.status }}</text>
        </view>

     <!-- <text class="progress-text">{{ task.progress }}</text> -->
      <text :class="['progress-text', getProgressClass(task.progress)]">{{ task.progress }}</text>
      </view>
      
      <!-- 任务详情 -->
      <view class="card-body">
        <view class="info-row">
          <text class="info-label">点检路线：</text>
          <text class="info-value">{{ task.route }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">点检部门：</text>
          <text class="info-value">{{ task.department }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">专业名称：</text>
          <text class="info-value">{{ task.specialty }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">执行岗位：</text>
          <text class="info-value">{{ task.position }}</text>
        </view>
        <view v-if="task.handler" class="info-row">
          <text class="info-label">处理人：</text>
          <text class="info-value">{{ task.handler }}</text>
        </view>
        <view v-if="task.planStartTime" class="info-row">
          <text class="info-label">计划开始时间：</text>
          <text class="info-value">{{ task.planStartTime }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">计划结束时间：</text>
          <text class="info-value">{{ task.planEndTime }}</text>
        </view>
        <view class="info-row last-label">
          <text class="info-label">点检进度：</text>
          <text class="info-value">{{ task.progressRate }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view v-if="task.progress === '未开始' && props.buttonShow" class="card-footer">
        <button class="action-btn primary" @click="startInspection(task)">开始点检</button>
        <button class="action-btn" @click="delayTask(task)">任务延期</button>
        <button class="action-btn danger" @click="cancelTask(task)">任务作废</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, defineProps } from "vue";

const props = defineProps({
	buttonShow: {
		 type: Boolean,
	},
  listData: {
    type: Array,
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

const startInspection = (task) => {
  console.log('开始点检:', task);
  // 实现开始点检逻辑
  		uni.navigateTo({
			url: `/pages/spotCheck/taskStart/index?taskId=${task.id}`
		})
};

const delayTask = (task) => {
  console.log('任务延期:', task);
  // 实现任务延期逻辑
};

const cancelTask = (task) => {
  console.log('任务作废:', task);
  // 实现任务作废逻辑
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
    color:  #887c0c;
}

.progress4 {
    color:  #d2131d;
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