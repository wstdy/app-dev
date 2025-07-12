<template>
	<view>
		<SimpleForm ref="formRef" :formProps="formProps" :disabled="isView"></SimpleForm>
		<view v-if="!isView">
			<button type="primary" @click="submit">提交</button>
			<button type="primary" @click="reset">重置</button>
		</view>
	</view>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import SimpleForm from '@/components/simple-form/SimpleForm.vue';
import { formProps } from './config/index.js';
import { addDemo, updateDemo, getDemo } from '@/common/api/demo/demo1/index.js';
import { onLoad } from '@dcloudio/uni-app'; 

const formRef = ref(); //表单ref
const isUpdate = ref(false); //是否编辑
const isView = ref(false); //是否查看

/**
 * 提交
 */
async function submit() {
	try {
		const formData = await formRef.value.validate();

		if(isUpdate.value){
			await updateDemo(formData);
			
			uni.showToast({
				title: `修改成功`
			});
		}
		else{
			await addDemo(formData);
			
			uni.showToast({
				title: `新增成功`
			});
		}


		uni.navigateBack();
	} catch (err) {
		console.log(err);
	}
}

/**
 * 重置
 */
async function reset() {
	await formRef.value.reset();
}

onLoad(async (option) => {
	//如果是编辑
	if (option.type === 'edit') {
		isUpdate.value = true;
		
		const { data } = await getDemo(option.id);
		if(data){
			await formRef.value.setFormData(data);
		}
	}
	//如果是新增
	else if (option.type === 'add') {
		isUpdate.value = false;
	}
	//查看  需要设置为disabled
	else {
		isView.value = true;
	}
});
</script>

<style></style>
