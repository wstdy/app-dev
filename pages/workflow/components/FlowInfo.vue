<template>
  <!-- 流程 -->
  <view>
    <PageHead v-if="!isInApp()" :title="props.title"  :backUrl="props.backUrl"><slot name="action"></slot></PageHead>
    <view class="content">
      <view class="tab-content">
        <FormInformation
          ref="formInfoRef"
          :formInfos="props.data.formInfos"
          :opinionsComponents="data.opinionsComponents"
          :opinions="data.opinions"
          :formAssignmentData="data.formAssignmentData"
          :disabled="props.disabled"
          :workflowData="props.workflowData"
          :processId="props.data.processId"
          :taskApproveOpinions="props.data.taskApproveOpinions"
        ></FormInformation>
        <view class="blank"></view>
      </view>
    </view>
  </view>
  <slot name="footer"><!-- 审批意见 --></slot>
</template>

<script setup>
import { ref } from "vue";
import PageHead from "@/components/layout/PageHead.vue";
import FormInformation from "./FormInformation.vue"; //表单信息
const props = defineProps({
  title: String,
  data: Object,
  backUrl:{
    type:String,
    default:''
  },
  disabled:{
    type:Boolean,
    default:false
  },
  workflowData:{
    type:Object,
    default:()=>{
      return {}
    }
  }
});
let formInfoRef = ref();
const tabHeadList = [
  {
    title: "表单信息",
  },
  {
    title: "流程信息",
  },
  {
    title: "流程记录",
  },
  {
    title: "附件汇总",
  },
];
function validateForm() {
  return formInfoRef.value.validateForm();
}
function getFormModels() {
  return formInfoRef.value.getFormModels();
}
function getUploadComponentIds() {
  return formInfoRef.value.getUploadComponentIds();
}
function isInApp() {
	return window?.webkit?.messageHandlers?.cordova_iab;
}
defineExpose({ validateForm, getFormModels, getUploadComponentIds });
</script>

<style lang="scss" scoped>
.blank {
  height: 150rpx;
}
.tab-box {
  white-space: nowrap;
  padding-top: 14rpx;
  padding-bottom: 14rpx;
  padding-left: 50rpx;
  box-sizing: border-box;
  background-color: #fff;
  ::v-deep.uni-scroll-view{
    overflow: hidden!important;
  }
}
.tab-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-right: 67rpx;
  .title {
    font-size: 27rpx;
    font-weight: bold;
    color: #253954;
    line-height: 32rpx;
  }
  .cur {
    color: #5e95ff;
  }
  .hr {
    width: 50rpx;
    height: 4rpx;
    background: #5e95ff;
    margin-top: 10rpx;
  }
}

.content {
  padding: 0;
}
</style>
<style>
body {
  overflow: hidden;
}
</style>
