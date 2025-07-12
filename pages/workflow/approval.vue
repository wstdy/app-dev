<template>
	<!-- 审批流程 -->
	<FlowInfo ref="flowInfoRef" :backUrl="state.backUrl" :title="state.pageTitle" :data="data" v-if="state.visible">
		<block #footer>
			<ApprovalBtn :processId="data.processId" :taskId="data.taskId" :schemaId="data.item.id" :buttonConfigs="approvalData.buttonConfigs" :isAddOrSubSign="approvalData.isAddOrSubSign" :hasStamp="data.hasStamp"
			:hasStampPassword="data.hasStampPassword" @refresh="refresh" @submit="submit" :getFlowRef="getFlowRef" :backUrl="backUrl" :workflowChat="data.workflowChat" :data="flowData" :hasBtnCountersign="hasBtnCountersign"/>
		</block>
	</FlowInfo>
</template>

<script setup>
	import {
		ref,
		reactive
	} from "vue";
	import FlowInfo from "./components/FlowInfo.vue"; //流程详情
	import ApprovalBtn from "./components/ApprovalBtn.vue"; //审批按钮
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import {
		getProcessInfo,
		postApproval
	} from "@/common/api/workflow/index";
	import userTaskItem from "./hooks/userTaskItem";
	import {
		separator
	} from '@/utils/simpleForm/analysis';
	import { setCurrentFlowData } from './flowData'
	const title = "审批流程";
	const state = reactive({
		visible: false,
		pageTitle: "",
		approvalContent: "",
		renderKey: 0,
		schemaId: "",
		stampList: [],
		// backUrl: '/pages/workflow/index?type=todo',
		backUrl: '',
	});

	const flowData = ref({})

	const props = defineProps({
		processId: String,
		taskId: String,
		type: String,
		backUrl: String,
	});
	const flowInfoRef = ref();
	const {
		data,
		initProcessData
	} = userTaskItem();
	let approvalData = reactive({
		isCountersign: false, //是否会签节点
		isAddOrSubSign: false, //是否加签减签
		buttonConfigs: [],
	});
	const hasBtnCountersign = ref(false); //是否有会签按钮
	onLoad(async (options) => {
		state.searchKeyword = '';
		if (options && options.taskId && options.processId) {
			try {
				let res = await getProcessInfo(options.taskId, options.processId);
				hasBtnCountersign.value = res.data.isAddOrSubSign;
				initProcessData(res.data);
				flowData.value = res.data;
				if (res.data.buttonConfigs) {
					approvalData.buttonConfigs = res.data.buttonConfigs;
				}
				if (res.data.relationTasks) {
					data.predecessorTasks = res.data.relationTasks;
				}
				if (res.data.isAddOrSubSign) {
					approvalData.isAddOrSubSign = res.data.isAddOrSubSign;
				}
				data.processId = options.processId;
				data.taskId = options.taskId;
				// state.pageTitle = title + data.item.name;
				state.pageTitle = title;
				if (options.backUrl != undefined) {
					state.backUrl = "";
				}
				state.visible = true;
				setCurrentFlowData({...res.data, taskId: options.taskId, processId: options.processId})
			} catch (error) {
				console.log('error: ', error);
			}

		}
	});
	async function refresh() {
		let res = await getProcessInfo(data.taskId, data.processId);
		initProcessData(res.data);
		setCurrentFlowData({...res.data, taskId: data.taskId, processId: data.processId})
	}
	async function submit(approvalBtnData) {
		uni.showLoading();
		let {
			approvalData: approvalData,
			stamp,
			nextTaskUser
		} = approvalBtnData;
		try {
			let validateForms = await flowInfoRef.value.validateForm();
			if (validateForms.length > 0) {
				let successValidate = validateForms.filter((ele) => {
					return ele.validate;
				});
				if (successValidate.length == validateForms.length) {
					let formModels = await flowInfoRef.value.getFormModels();
					let fileFolderIds = getUploadFileFolderIds(formModels);
					let params = {
						approvedType: approvalData.approvedType,
						approvedResult: approvalData.approvedResult, // approvalData.approvedType 审批结果 如果为 4 就需要传buttonCode
						approvedContent: approvalData.approvedContent,
						formData: formModels,
						rejectNodeActivityId: approvalData.rejectNodeActivityId,
						taskId: data.taskId,
						fileFolderIds,
						circulateConfigs: approvalData.circulateConfigs,
						stampId: stamp.stampId,
						stampPassword: stamp.stampPassword,
						nextTaskUser
					};
					await postApproval(params);
					save();
				} else {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: "审批失败",
					});
				}
			}
		} catch (error) {
            uni.hideLoading();
			uni.showToast({
				icon: "none",
				title: "审批失败",
			});
		}
	}

	function save() {
		uni.showToast({
			icon: "none",
			title: "审批成功",
		});
		setTimeout(() => {
			if (state.backUrl == '') {
				if(getCurrentPages().length == 1) {
					window.close();
				} else {
					uni.navigateBack({
						delta: 1,
					});
				}
				
			} else {
				uni.navigateTo({
					url: state.backUrl
				})
			}	
		}, 1000);
	}

	function getFlowRef() {
		return flowInfoRef;
	}

	function getUploadFileFolderIds(formModels) {
		let fileFolderIds = [];
		let uploadComponentIds = flowInfoRef.value.getUploadComponentIds();
		uploadComponentIds.forEach((ids) => {
			if (ids.includes(separator)) {
				let arr = ids.split(separator);
				if (arr.length == 2 && formModels[arr[0]][arr[1]]) {
					fileFolderIds.push(formModels[arr[0]][arr[1]]);
				} else if (
					arr.length == 3 &&
					formModels[arr[0]][arr[1]] &&
					Array.isArray(formModels[arr[0]][arr[1]])
				) {
					formModels[arr[0]][arr[1]].forEach((o) => {
						fileFolderIds.push(o[arr[2]]);
					});
				}
			}
		});
		return fileFolderIds;
	}
</script>

<style lang="scss" scoped>
	.approval-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		font-weight: 400;
		font-style: normal;
		font-size: 12px;
		color: #02071a;
		line-height: 20px;
		z-index: 2;
		background-color: #fff;
		box-shadow: 5px -5px 8px hsla(0, 0%, 89.8%, 0.3);
	}

	.approval-content-box {
		padding: 14px;
		background-color: #fff;
	}

	.approval-content {
		background-color: #f5f6fa;
	}
</style>