<template>
  <!-- 表单信息 -->
  <view class="wrap" v-if="state.visible">
    <view v-for="(item, index) in forms.configs" :key="index">
      <view class="tab-form-box" v-show="state.currentTabIndex == index">
        <view class="form-content">
          <SystemForm v-if="item.formType==FormType.SYSTEM" :ref="state.platform=='wx'?'itemRefs':setItemRef" :disabled="props.disabled" :functionalModule="item.functionalModule" :functionName="item.functionName" :formModel="item.formModel"  :formConfigChildren="item.formConfigChildren" :formConfigKey="item.formKey" :otherParams="item.otherParams"></SystemForm>
          <SimpleForm v-if="item.formType==FormType.CUSTOM" :ref="state.platform=='wx'?'itemRefs':setItemRef" :isCustomForm="true" :formProps="item.formProps" :disabled="props.disabled"></SimpleForm>
        </view>
      </view>
    </view>
    <uni-title title="流程记录" :fontSize="18" :stat="true" color="" v-if="props.taskApproveOpinions.length"/>
    <FlowOpinions
      :processId="props.processId"
      :content="props.taskApproveOpinions"
    ></FlowOpinions>
  </view>
</template>

<script setup>
import { getCurrentInstance,provide,ref,reactive,onMounted,nextTick } from "vue";
import SimpleForm from '@/components/simple-form/SimpleForm.vue';
import SystemForm from '@/components/system-form/Index.vue';
import userFormInfo from "./hooks/userFormInfo";
import { FormType } from "@/common/enums/form.ts";
import FlowOpinions from "./FlowOpinions.vue"; //流程记录


const props = defineProps({
  content: String,
  formInfos:Array,
  formAssignmentData:Object,
  opinionsComponents:Array,
  opinions:Array,
  disabled:Boolean,
  workflowData:{
    type:Object,
    default:()=>{
      return {}
    }
  },
  processId: String,
  taskApproveOpinions: Array,
});

let itemRefs = ref([]);
  const setItemRef = (el) => {
    if( itemRefs.value.length<forms.configs.length){
      itemRefs.value.push(el);
    }
  };
const state = reactive({
  visible:false,
  currentTabIndex: 0,
  platform:'mp'
});
const { proxy }  = getCurrentInstance();
const { forms, uploadComponent,initFormInfo,executeFormEvent } = userFormInfo();
  onMounted(async () => {
    // #ifdef MP-WEIXIN
    state.platform = 'wx';
    // #endif
    initFormInfo(props.formInfos,props.formAssignmentData,{
      opinionsComponents:props.opinionsComponents?props.opinionsComponents:null,
      opinions:props.opinions?props.opinions:null,
      workflowData:props.workflowData
    });
    state.visible = true;
    await nextTick();
    setFormModel();
  });

function changeCurrentTabIndex(index) {
  state.currentTabIndex = index;
}
function setFormModel() {
  try {
    if(state.platform=='wx'){
     if(proxy.$refs.itemRefs.length>0){
       for (let index = 0; index < proxy.$refs.itemRefs.length; index++) {
         if (proxy.$refs.itemRefs[index]) {
           if(JSON.stringify(forms.formModels[index])!="{}"){
             proxy.$refs.itemRefs[index].setFormData(forms.formModels[index]);
           }else{
             proxy.$refs.itemRefs[index].init();
           }
         }
       }
     }
    }else{
      for (let index = 0; index < itemRefs.value.length; index++) {
        if (itemRefs.value[index]) {
          if(JSON.stringify(forms.formModels[index])!="{}"){
            itemRefs.value[index].loadForm(forms.formModels[index]);
          }else{
            itemRefs.value[index].init();
          }
        }
      }
    }
  } catch (error) {

  }
}
async function validateForm() {
    let validateForms = [];
    if(state.platform=='wx'){
    for (let index = 0; index < proxy.$refs.itemRefs.length; index++) {
      if (proxy.$refs.itemRefs[index]) {
        try {
          await proxy.$refs.itemRefs[index]?.validate();
          validateForms.push({
            validate: true,
            msgs: [],
          });
          forms.configs[index].validate = true;
        } catch (error) {
          validateForms.push({
            validate: false,
            msgs: error?.errorFields,
          });
          forms.configs[index].validate = false;
        }
      }
    }

  }else{
    for (let index = 0; index < itemRefs.value.length; index++) {
      if (itemRefs.value[index]) {
        try {
          await itemRefs.value[index]?.validate();
          validateForms.push({
            validate: true,
            msgs: [],
          });
          forms.configs[index].validate = true;
        } catch (error) {
          validateForms.push({
            validate: false,
            msgs: error?.errorFields
          });
          forms.configs[index].validate = false;
        }
      }
    }
  }


    return validateForms;
  }
  async function getFormModels() {
    let formModes = {};
    if(state.platform=='wx'){
      for (let index = 0; index < forms.configs.length; index++) {
      if (proxy.$refs.itemRefs[index]) {
        try {
         let formModel =  await proxy.$refs.itemRefs[index]?.getFormData();
         if(proxy.$refs.itemRefs[index].formType==FormType.SYSTEM){
          let formModelIdVal = await proxy.$refs.itemRefs[index]?.submit();
          formModel = {...formModel,...formModelIdVal};
         }
         formModes[forms.configs[index].formKey] = formModel;
        } catch (error) {
        }
      }
    }

  }else{
    for (let index = 0; index < forms.configs.length; index++) {
      if (itemRefs.value[index]) {
        try {
         let formModel =  await itemRefs.value[index]?.getFormData();
         if(itemRefs.value[index].formType==FormType.SYSTEM){
          let formModelIdVal = await itemRefs.value[index]?.submit();
          formModel = {...formModel,...formModelIdVal};
         }
         formModes[forms.configs[index].formKey] = formModel;
        } catch (error) {
        }
      }
    }
  }


    forms.formEventConfigs.forEach((ele, i) => {
      //此组件 获取数据 就是为了提交表单 所以 表单提交数据 事件 就此处执行
      executeFormEvent(ele[3], forms.configs[i]?.formModel);
    });
    return formModes;
  }
    // 获取上传组件的字段值集合
    function getUploadComponentIds() {
      // 系统表单 getUploadComponentIds
      if(state.platform=='wx'){
      for (let index = 0; index < forms.configs.length; index++) {
      if (proxy.$refs.itemRefs[index]&&proxy.$refs.itemRefs[index].formType==FormType.SYSTEM) {
        try {
         let ids =  proxy.$refs.itemRefs[index]?.getUploadComponentIds()
         uploadComponent.ids = [...uploadComponent.ids,...ids]
        } catch (error) {
        }
      }
    }

  }else{
    for (let index = 0; index < forms.configs.length; index++) {
      if (itemRefs.value[index]&&itemRefs.value[index].formType==FormType.SYSTEM) {
        try {
         let ids =  itemRefs.value[index]?.getUploadComponentIds()
         uploadComponent.ids = [...uploadComponent.ids,...ids]
        } catch (error) {
        }
      }
    }
  }

    return uploadComponent?.ids || '';
  }
  defineExpose({validateForm,getFormModels,getUploadComponentIds});
</script>

<style lang="scss" scoped>
::v-deep .uni-title__box {
		background-color: #f0eff4;
		border-radius: 0px;
		padding-left: 20rpx;
		.uni-title__base {
			font-weight: bold;
			font-family: PingFang SC-Heavy, PingFang SC,Microsoft YaHei,Helvetica Neue,Helvetica,sans-serif;
		}
	}
.wrap {
  min-height: 900rpx;
  padding: 0rpx 0rpx 28rpx 0rpx;
  // background-color: #fff;
  // .tag-box{
  //   height: 15rpx;
  //   background: linear-gradient(90deg, rgba(94,149,255,0) 0%, rgba(94,149,255,0.9) 51%, rgba(94,149,255,0) 100%);
  // }
  .hr{
    width: 100%;
    border: 2rpx solid #F3F4F8;
    margin-top: 28rpx;
  }
  .tab-item {
    // display: inline-block;
    text-align: center;
    // height: 42rpx;
    font-size: 27rpx;
    font-weight: bold;
    color: #BBBEC9;
    line-height: 32rpx;
    // margin-right: 60rpx;
  }
  .cur {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 36rpx;
  }
  .tab-form-box{
    // margin-bottom: 300rpx;
  }
  .tab-title {
    margin: 16rpx 36rpx;
  }
  .tab-box {
    background-color: #fff;
  }
  .tab-blank {
    background-color: #f0eff4;
    height: 24px;
    width: 100%;
  }

}
</style>
