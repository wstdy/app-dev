<template>
	<view>
		<SimpleForm ref="formRef" :formProps="defaultFormProps"></SimpleForm>

		<button type="primary" @click="setProps">修改props</button>
	</view>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { defaultFormProps  } from '@/components/simple-form/types/form.js';
// import { componentType } from '@/components/simple-form/types/form';
import SimpleForm from '@/components/simple-form/SimpleForm.vue';
const formRef = ref();
// const formModel = reactive({
// 	name: 'xx',
// 	age: 22
// });

onMounted(() => {
	console.log("setFormData")
	formRef.value.setFormData({
		name: 'xx',
		age: 22,
		range: ['2023-06-15 17:47:51', '2023-06-19 17:47:56'],
		startTime: '2023-06-15 17:47:51',
		endTime: '2023-06-25 17:47:51'
	})
});

function setProps() {
	//------------修改props 测试---------------
	// formRef.value.setProps({
	// 	border: true,
	// 	labelAlign: 'center',
	// 	labelWidth: 120,
	// 	// labelPosition: 'top'
	// });
}
</script>

<style></style>
