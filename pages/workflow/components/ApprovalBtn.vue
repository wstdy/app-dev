<template>
	<view>
		<view class="next-btn">
			<view class="btn left submit" @tap="preSubmit"><text>提交</text></view>
			<view class="btn right"  @tap="rejectSubmit"><text>退回</text></view>
			<view class="more" @tap="showMore"><view><uni-icons type="more-filled" size="22"></uni-icons></view><text>更多</text></view>
		</view>
		<!-- 流程审批 更多弹窗 -->
		<custom-dialog ref="moreRef" title="流程信息" :hasCloseIcon="true" :scrollY="false" dialogHeight="1000rpx" max-height="480px">
			<ProcessInformation
			:content="workflowChat"
			:data="data"
			></ProcessInformation>
		</custom-dialog>
		<uni-user-popup-v2  ref="relationRef" :selectedIds="transferUser" @change="doTransfer"/>

		<!-- 加签和减签-->
		<countersign ref="addOrSubSignRef" @confirmApproveUserData="confirmApproveUserData"></countersign>
		<uni-popup ref="finishRef" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="base" title="提示" content="确定终止流程吗？"
				placeholder="请输入内容" @confirm="flowFinishConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		toRaw
	} from "vue";
  	import uniUserPopupV2 from './uni-user/components/uni-user-popup/uni-user-popup.vue'
	import SelectApproveUser from "./nextNode/SelectApproveUser.vue"; // 加签减签
	import ProcessInformation from "./ProcessInformation.vue"; //流程记录
	import countersign from './countersign.vue' // 会签
	import {
		ApproveType,
		ApproveCode
	} from "@/common/enums/workflow.ts";
	import {
		cloneDeep
	} from "@/utils/helper/utils.js";
	import {
		postSetSignV2,
		postTransfer
	} from "@/common/api/workflow/index";
	import Empty from "@/components/layout/Empty.vue";
	import { setFormModel, setCurrentFlowData } from '../flowData'
	const props = defineProps({
		buttonConfigs: Array,
		isAddOrSubSign: Boolean,
		processId: String,
		taskId: String,
		schemaId: String,
		hasStamp: Boolean,
		hasStampPassword: Boolean,
		getFlowRef: Function,
		backUrl: String,
		workflowChat: String,
		hasBtnCountersign: Boolean,
		data: Object,
	});
	const emits = defineEmits(["submit", "refresh"]);
	const moreRef = ref();
	const relationRef = ref();
	const finishRef = ref();
	const transferUser = ref('')
	const addOrSubSignRef = ref(); // 加签减签

	const signUsers = reactive({
		approvedUsers: [],
	});
	const stampInfo = reactive({
		stampId: "",
		password: "",
	});
	let approvalData = reactive({
		isCountersign: false, //是否会签节点
		isAddOrSubSign: false, //是否加签减签
		buttonConfigs: [],
		approvedType: ApproveType.AGREE,
		approvedResult: ApproveCode.AGREE,
		approvedContent: "",
		rejectNodeActivityId: "",
		circulateConfigs: [],
	});
	onMounted(() => {
		if (props.buttonConfigs) {
			approvalData.buttonConfigs = cloneDeep(props.buttonConfigs);
		}
		if (props.isAddOrSubSign) {
			approvalData.isAddOrSubSign = props.isAddOrSubSign;
		}
		approvalData.approvedType = ApproveType.AGREE;
		approvalData.approvedContent = "";
		approvalData.rejectNodeActivityId = "";
		approvalData.circulateConfigs = [];
		setCurrentFlowData({
			approvalData: approvalData
		})
		
		uni.$on('handleApprove',function(type, node){
			if(type == 'approve') {
				submit(node)
			} else {
				rejectRefSubmit(node)
			}
			
			// TODO 下面执行刷新的方法
		})
		
	});

	function showMore() {
		let buttonList = ['转办', '终止', '流程信息']
		if (props.hasBtnCountersign) {
			buttonList = buttonList.concat(['会签'])
		}
		uni.showActionSheet({
			itemList: buttonList,
			success: function (res) {
				console.log('选中了第' + (res.tapIndex + 1) + '个按钮', res );
				switch (res.tapIndex) {
					case 0:
						onTransfer();
						break;
					case 1:
						onClickFinish();
						break;
					case 2:
						moreRef.value.open();
						break;
					case 3:
						addOrSubSignRef.value.open();
						break
						
				}
			},
			fail: function (res) {
				console.log(res.errMsg);
			}
		});
	}
	function onClickFinish(){
		finishRef.value.open()
	}
	function flowFinishConfirm () {
		approvalData.approvedType = ApproveType.FINISH;
        approvalData.approvedResult = ApproveCode.FINISH;
		submit()
	}
	function onTransfer () {
		relationRef.value.open()
	}
	function doTransfer(val) {
		let params = {
			taskId: props.taskId,
			userId: val[0].id
		}
		postTransfer(params).then(() => {
			uni.showToast({
				icon: "none",
				title: "转发成功",
			});
			setTimeout(() => {
				if (props.backUrl == '') {
					uni.navigateBack({
						delta: 1,
					});
				} else {
					uni.navigateTo({
						url: "/pages/workflow/index?type=todo"
					})
				}
				cancel()
			}, 1000);
		})
	}

	async function preSubmit() {
		const formModel = await props.getFlowRef().value.getFormModels();
		// setFormModel(formModel)
		setCurrentFlowData({
			approvalData: toRaw(approvalData),
			formModel: formModel
		})
		uni.navigateTo({
			url: `/pages/workflow/nextTask?approveType=approve`
		});
	}

	async function rejectSubmit() {
		uni.navigateTo({
			url: `/pages/workflow/nextTask?approveType=reject`
		});
		return;
    }


	function rejectRefSubmit(node = {}) {
		if(node?.activityId){
			approvalData.approvedResult = ApproveCode.REJECT;
			approvalData.approvedType = ApproveType.REJECT;
			approvalData.rejectNodeActivityId = node.activityId; // 退回节点的activityId
			submit(node)
		}
	}
	async function next() {
		dialogRef.value.open();
	}

	function cancel() {
		moreRef.value.close()
	}

	function submit(node = {}) {
		const submitData = {
			approvalData: approvalData,
			stamp: {
				stampId: stampInfo.stampId,
				stampPassword: stampInfo.password,
			},
			nextTaskUser: {}
		};
		const nAssignee = node.isEnd ? '' : node.assignees;
		submitData.nextTaskUser[node.activityId] = Array.isArray(nAssignee) ? nAssignee.join(',') : nAssignee;
		emits("submit", submitData);
    	return true;
	}
	
	// 加签加签 确认
	async function confirmApproveUserData(val) {
		try {
			if(!val.addMemberIdList.length && !val.reduceMemberList.length) {
				uni.showToast({
					icon: "none",
					title: "会签无改动",
				});
				// addOrSubSignRef.value.close();
				return;
			}
			let data = {
				schemaId: props.schemaId,
				taskId: props.taskId,
				addUserIds: val.addMemberIdList,
				subUserIds: val.reduceMemberList
			};
			let res = await postSetSignV2(data);
			if (res && res.success) {
				uni.showToast({
					icon: "none",
					title: "操作成功",
				});
				emits("refresh");
				addOrSubSignRef.value.close();
			} else {
				uni.showToast({
					icon: "none",
					title: "加签或者减签失败",
				});
			}
		} catch (_error) {
			uni.showToast({
				icon: "none",
				title: "加签或者减签失败",
			});
		}
	}
</script>

<style lang="scss" scoped>
.next-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	height: 135rpx;
	background: #ffffff;
	padding: 0 48rpx;

	.submit-btn {
		flex: 1;
		height: 96rpx;
		background: #5e95ff;
		border-radius: 48rpx 48rpx 48rpx 48rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		text {
			font-size: 31rpx;
			font-weight: 500;
			color: #ffffff;
			line-height: 36rpx;
		}
	}
	.btn {
		flex: 1;
		height: 72rpx;
		border: 1px solid #5e95ff;
		justify-content: center;
		align-items: center;
		display: flex;

		&.left {
			border-radius: 12rpx 0  0 12rpx;
			margin-left: 36rpx
		}

		&.right {
			border-radius: 0 12rpx 12rpx 0;
			margin-right: 36rpx
		}

		&.submit {
			background: #5e95ff;

			text {
				color: #fff;
			}
		}

		text {
			font-size: 31rpx;
			font-weight: 500;
			color: #5e95ff;
			line-height: 36rpx;
		}
	}
	.more {
		margin-left: 16rpx;
		font-size: 24rpx;
	}
}

</style>
