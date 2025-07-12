<template>
  <view>
		<SystemDemo  ref="systemRef" v-if="componentName=='sys-system-demo'" :disabled="props.disabled" :isWorkFlow="true"  :workFlowParams="formConfig.workFlowParams" :formModel="props.formModel"></SystemDemo>
  <!--html-->
		<view v-else >请检查表单文件是否存在</view>
		
  </view>
</template>
<script setup>
import { ref,onMounted,reactive,computed } from "vue";
import SystemDemo from '@/components/system-form/Demo.vue';
import { FromPageType } from "@/common/enums/form.ts";
import { FormType } from "@/common/enums/form.ts";
const props = defineProps({
	disabled: {
    type:Boolean,
    default:false
  },
  functionalModule: {
    type:String,
    default:""
  },
  functionName: {
    type:String,
    default:''
  },
	formModel: {
    type:Object,
    default:()=>{
			return {}
		}
  },
	otherParams: {
    type:Object,
    default:()=>{
			return {}
		}
  },
	formConfigChildren: {
    type:Array,
    default:()=>{
			return []
		}
  },
	formConfigKey: {
    type:String,
    default:''
  },
});
const formConfig = reactive({
	workFlowParams:{
		formConfigChildren:[],
		formConfigKey:'',
		otherParams:{},
		type:''
	}
});
const componentName =  computed(() => {
	return 'sys-'+props.functionalModule+'-'+props.functionName;
})
const systemRef = ref();
onMounted(async () => {
	formConfig.workFlowParams.type = FromPageType.ADD;
	if(props.disabled){
		formConfig.workFlowParams.type = FromPageType.VIEW;
	}
	formConfig.workFlowParams.formConfigChildren = props.formConfigChildren;
	formConfig.workFlowParams.formConfigKey = props.formConfigKey;
	formConfig.workFlowParams.otherParams = props.otherParams;
	try {
		await systemRef.value.setWorkflowForm();
	} catch (error) {
		
	}
});
function init(){
	return systemRef.value.init();
}
async function setFormData(formModel){
	await systemRef.value.setFormData(formModel);
}
async function loadForm(formModel) {
	await systemRef.value.loadForm(formModel)
}
function validate(){
	return systemRef.value.validate();
}
function getFormData(){
	return systemRef.value.getFormData();
}
function submit(){
	return systemRef.value.submit();
}
defineExpose({
	init,
	submit,
	setFormData,
	validate,
	getFormData,
	loadForm,
	formType:FormType.SYSTEM
});
</script>