<template>
  <!-- 流程信息 -->
  <view class="wrap">
    <view class="task-info" v-if="data.currentTaskAssignees">
        节点审批人：
        <view v-for="(assignees,taskKey) in data.currentTaskAssignees" :key="taskKey">
            <span>{{assignees[0].taskName}}{{data.taskInfo?.taskDefinitionKey==taskKey?'（当前审批节点）':''}}：</span>
            <span :class="canClick ? 'custom-cursor' : ''" v-for="(assignee,index) in assignees" :key="index">
                {{assignee.assigneeNameStr?(assignee.assigneeNameStr?.replaceAll(",","/") + (index<assignees.length-1?'、':'')):('')}}
            </span>
        </view>
    </view>
    <view class="task-info">
        当前流程审批人：{{data.currentTaskAssigneeNames.replaceAll(",","、")}}
    </view>
    <image class="bpmn" :src="svgBase64 ?? props.content" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import {
  http
} from '@/common/request/index.js'; // 局部引入

const props = defineProps({
  content: "",
  data: Object,
});

const imgUrl = (url) =>{
	return 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(url)))
}


const svgBase64 = ref('');
if(props.content.indexOf('svg') > -1){
	
	http.get(props.content).then((res)=>{
		
		svgBase64.value = imgUrl(res)
	})
	
}

</script>

<style lang="scss" scoped>
.wrap {
  height: 70vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  align-items: center;
  overflow-y: auto;
  .task-info {
    width: 100%;
    padding: 8rpx;
    box-sizing: border-box;
  }
}
</style>
