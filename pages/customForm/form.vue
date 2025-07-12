<template>
	<view class="form-fixed" v-if="loading">
		<SimpleForm ref="formRef" :formProps="formProps" :isCustomForm="true" :disabled="isView" :control="control"></SimpleForm>
		<view v-if="!isView" class="form-btn-box">
			<button class="button" type="default" @click="reset">重置</button>
			<button class="button" type="primary" @click="submit">确定</button>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		computed,
		provide,
	} from 'vue';
	import SimpleForm from '@/components/simple-form/SimpleForm.vue';

	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		addFormExecute,
		updateFormExecute,
		getFormDataById,
		getFormRelease
	} from '@/common/api/system/dictionary/index.js';
	import {
		buildAppFormProps,
		setFormPropsAuth
	} from '@/utils/simpleForm/changeJson.js'
	const props = defineProps({

	});
	const loading = ref(false)

	const formRef = ref(); //表单ref
	const isUpdate = ref(false); //是否编辑
	const isView = ref(false); //是否查看
	const dataId = ref()
	const funcId = ref()
	const formProps = ref()
	const control = ref()
	const formEvent=ref()
	provide('isCustomForm',true)

	function back(isRefrash = false) {
		uni.navigateBack()
	}
	/**
	 * 提交
	 */
	async function submit() {
		try {
			await formRef.value.validate();
			const formData = await formRef.value.getFormData();

			if (isUpdate.value) {
				formData.id=dataId.value
				await updateFormExecute({
					formData: formData,
					funcId: funcId.value
				});

				uni.showToast({
					title: '修改成功'
				});
			} else {
				await addFormExecute({
					formData: formData,
					funcId: funcId.value
				});

				uni.showToast({
					title: '新增成功'
				});
			}
			//提交表单事件
			if(formEvent.value[3]) formRef.value.executeFormEvent(formEvent.value[3],true);
			back(true)
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
		uni.showLoading()
		funcId.value = option.funcId;
		control.value = option.control;
		let res = await getFormRelease(option.funcId)
		if (!res.code) {
			uni.setNavigationBarTitle({
				title:res.data.menuConfigs.name+ (control.value == 'add' ? '新增' : control.value == 'edit' ? '编辑' : '查看')
			})
			let auth=uni.getStorageSync('MenuAuth' )
			let formAuth=auth.formAuthCode||[];
			let json = JSON.parse(res.data.jsonContent);
			formEvent.value=json.formEventConfig;
			formProps.value = buildAppFormProps(json.formJson)
			setFormPropsAuth(formProps.value.schemas,formAuth)
			loading.value = true;

			setTimeout(()=>{
				//初始化表单
				if(formEvent.value[0]) formRef.value.executeFormEvent(formEvent.value[0],true);
				//加载表单
				if(formEvent.value[2]) formRef.value.executeFormEvent(formEvent.value[2],true);
			},500)

			uni.hideLoading()
		}
		if(control.value=='add'){

		}
		// 	//如果是编辑
		if (control.value == 'edit' || control.value == 'view') {

			if (control.value == 'edit') isUpdate.value = true;
			if (control.value == 'view') isView.value = true;
			dataId.value=option.id
			getFormDataById({
				funcId: funcId.value,
				id: option.id
			}).then(res => {
				formRef.value.setFormData(res.data)
				setTimeout(()=>{
					//获取表单数据
					if(formEvent.value[1]) formRef.value.executeFormEvent(formEvent.value[1],true);
				},500)
			})
		}
	});



</script>

<style>

	.form-fixed {
		background: #fff;
	}
</style>
