<template>
	<view class="approve-container">
		<!-- 节点切换 -->
		<view class="form-section">
			<text class="section-title">{{ pageType == 'approve' ? '下一节点：' : '退回节点'}}</text>
			<view
				class="node-item"
				:class="{ 'select-node': nodes.length > 1 }"
				@click="chooseNode"
			>
				<span style="padding-right: 10px;">{{ selectedNode.activityName }}</span>
				<uni-icons v-if="nodes.length > 1" type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>
		<!-- 审批人选择 -->
		<view v-if="!isEnd" class="form-section">
			<text class="section-title">审批人</text>
			<view class="uni-list-cell-db" >
				<user-select v-model:modelValue="selectedNode.assignees" :localdata="selectedNode.nextAssignees"></user-select>
				<uni-icons v-if="nodes.length > 1" type="right" size="16" color="#333"></uni-icons>
			</view>
		</view>

		<!-- 审批意见 -->
		<view class="form-section-noflex">
			<text class="section-title">审批意见</text>
			<uni-easyinput
			type="textarea"
			class="textarea-input"
			v-model="approvalData.approvedContent"
			placeholder="请输入审批意见"
			/>
		</view>

		<view class="next-btn">
			<view class="btn left submit" @tap="handleSubmit"><text>提交</text></view>
			<view class="btn right"  @tap="handleCancel"><text>取消</text></view>
		</view>

		<custom-dialog
			ref="selectNodeRef"
			:title="title"
			:hasFooterIcon="true"
			dialogHeight="600rpx"
			:hasCloseIcon="false">
			<view class="check-box">
				<view v-for="(item,index) in nodes" :key="index" class="check-item" @tap="changeNodeValue(item.activityId)">
					<view class="title">{{ item.activityName }}</view>
					<view class="checked" v-if="temNodeId==item.activityId">
						<view class="icon"></view>
					</view>
					<view class="kong" v-else></view>
				</view>
			</view>
			
			<template #footer>
				<custom-dialog-submit @tap="submitSelectNode"></custom-dialog-submit>
			</template>
		</custom-dialog>
	</view>
</template>
  
<script setup>
	import { ref, computed, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getCurrentFlowData } from './flowData';
	import userSelect from './components/userSelect.vue';
	import {
		getRejectNode,
		getPreApproveInfo,
	} from "@/common/api/workflow/index";
	import {
		ApproveType,
		ApproveCode
	} from "@/common/enums/workflow.ts";
	const approvalData = ref({})
	const pageType = ref('')
	const tabIndex = ref(0)
	const nodes = ref([])
	const isEnd = ref(false)
	const temNodeId = ref('')
	const selectNodeRef = ref(null)
	const formData = ref({
		approvedContent: '',
		approvedType: '', // 审批类型
		approvedResult: '' // 审批结果
	})
	const selectedMemberIndex = ref()
	
	const selectedNode = ref({
		assignees: []
	})
	let taskId = '';
	let processId = '';
	function handleCurrentNode() {
		let nNode = nodes.value[tabIndex.value]
		temNodeId.value = nNode.activityId;
		if (!nNode?.userList?.length) {
			return nNode;
		}
		const selected = [];
		nNode.nextAssignees = nNode.userList.map((item) => {
			if (item.checked || nNode.userList.length === 1) {
				// 只有一个人的时候必须选他
				selected.push(item['F_UserId']);
			}
			return {
				value: item['F_UserId'],
				text: item['F_RealName'] + (item.remarks?"("+item.remarks+")":""),
				item:item
			};
		});
		nNode.assignees = selected;
		if (!nNode.chooseAssign) {
			// 不需要选审批人的时候 所有备选人都要放到下个节点
			nNode.assignees = nNode.userList.map((item) => item['F_UserId']);
		}
		nNode.chooseAssign = nNode.chooseAssign;
		return nNode;
	}
	// 初始化加载
	onLoad(async (options) => {
		const approveType = options.approveType || 'approve'
		approvalData.value = getCurrentFlowData().approvalData;
		taskId = getCurrentFlowData().taskId;
		processId = getCurrentFlowData()?.processId || '';
		await initPageData(approveType)
	})

	async function initPageData(type) {
		pageType.value = type;
		if(type === 'approve') {
			await getApproveNodes()
		} else {
			await getRejectNodes()
		}
		selectedNode.value = handleCurrentNode()
	}

	async function getApproveNodes() {
		approvalData.value.formData = getCurrentFlowData().formModel;
		const ret = await getPreApproveInfo(taskId, approvalData.value);
		if (!ret || !ret.success) {
			return;
		}
		const _nextNodes = ret.data;
		if (_nextNodes && _nextNodes.length) {
			// 下一个节点唯一时（可能有并行节点）
			const _nNode = _nextNodes[0];
			isEnd.value = _nNode.isEnd;
			_nextNodes.forEach((nNode) => {
				if (!nNode.userList?.length) {
					return;
				}
				const selected = [];
				nNode.nextAssignees = nNode.userList.map((item) => {
					if (item.checked || nNode.userList.length === 1) {
						// 只有一个人的时候必须选他
						selected.push(item['F_UserId']);
					}
					return {
						value: item['F_UserId'],
						text: item['F_RealName']
					};
				});
				nNode.assignees = selected;
				if (!nNode.chooseAssign) {
					// 不需要选审批人的时候 所有备选人都要放到下个节点
					nNode.assignees = nNode.userList.map((item) => item['F_UserId']);
				}
				nNode.chooseAssign = nNode.chooseAssign;
			});
			nodes.value = _nextNodes;
		}
	}

	async function getRejectNodes() {
		const ret = await getRejectNode(processId, taskId);
		if (!ret || !ret.success) {
			return;
		}
		if (ret.data?.length) {
			ret.data.forEach((nNode) => {
				if (!nNode.userList?.length) {
					return;
				}
				const selected = [];
				nNode.nextAssignees = nNode.userList.map((item) => {
					if (item.checked || nNode.userList.length === 1) {
						// 只有一个人的时候必须选他
						selected.push(item['F_UserId']);
					}
					return {
						value: item['F_UserId'],
						text: item['F_RealName']+(item.remarks?"("+item.remarks+")":""),
						item:item
					};
				});
				nNode.assignees = selected;
				if (!nNode.chooseAssign) {
					// 不需要选审批人的时候 所有备选人都要放到下个节点
					nNode.assignees = nNode.userList.map((item) => item['F_UserId']);
				}
				nNode.chooseAssign = nNode.chooseAssign;
			});
		}

		nodes.value = ret.data;
	}

	function changeNodeValue(val, iex) {
		temNodeId.value = val;
		if(pageType.value === 'reject') {
			approvalData.value.rejectNodeActivityId = val;
		}
	}

	function chooseNode() {
		if(nodes.value.length <= 1) return;
		selectNodeRef.value.open()
	}

	function submitSelectNode() {
		tabIndex.value = nodes.value.findIndex((item) => item.activityId == temNodeId.value);
		selectedNode.value = handleCurrentNode()
		selectNodeRef.value.close()
	}

	// 提交处理
	async function handleSubmit() {
		if(selectedNode.value.activityType !== 'EndEventImpl' && !selectedNode.value.assignees.length) {
			uni.showToast({
				icon: 'none',
				title: '请选择审批人'
			})
			return;
		}
		if(!approvalData.value.approvedContent) {
			uni.showToast({
				icon: 'none',
				title: '请填写审批意见'
			})
			return;
		}
		approvalData.approvedType = pageType.value == '' ? ApproveType.AGREE : ApproveType.REJECT;
		approvalData.approvedResult = pageType.value == '' ? ApproveCode.AGREE : ApproveCode.REJECT;
		uni.$emit('handleApprove', pageType.value, selectedNode.value)
		uni.navigateBack({
			delta: 1
		})

	}

	function handleCancel() {
		uni.navigateBack()
	}
</script>

<style lang="scss">
.approve-container {
	padding: 30rpx;
	min-height: 90vh;
	background: #f5f6fa;
	display: flex;
	flex-direction: column;
	.flow-tab-item {

		&.curr {
			color: #5e95ff;
		} 
	}

	.form-section {
		margin-bottom: 30rpx;
		background: white;
		padding: 0 24rpx;
		border-radius: 12rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 100rpx;
		
		.section-title {
			font-size: 28rpx;
			color: #333;
			// margin-bottom: 20rpx;
			display: block;
		}
		.node-item {
			font-size: 28rpx;
			color: #333;
			flex: 1; 
			text-align: right;
			// padding-right: 10px;
		}
		.select-node {
			color: #5e95ff;
			cursor: pointer;
		}
		.uni-list-cell-db {
			display: flex;
			align-items: center;
		}
	}
	.form-section-noflex {
		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;
		background: white;
		padding: 24rpx;
		border-radius: 12rpx;
		min-height: 500rpx;
		.section-title {
			font-size: 28rpx;
			min-height: 56rpx;
			line-height: 56rpx;
			color: #333;
			margin-bottom: 20rpx;
			display: block;
		}
	}
	.check-box {
		.check-item {
			background: #FFFFFF;
			border-radius: 10rpx 10rpx 10rpx 10rpx;
			margin: 19rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 36rpx 23rpx;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #253954;
				line-height: 32rpx;
			}

			.kong {
				width: 27rpx;
				height: 27rpx;
				background: #FFFFFF;
				border-radius: 0rpx 0rpx 0rpx 0rpx;
				opacity: 1;
				border: 2rpx solid #E7EBF2;
				border-radius: 50%;
			}

			.checked {
				width: 27rpx;
				height: 27rpx;
				background: #FFFFFF;
				opacity: 1;
				border: 2rpx solid #5E95FF;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;

				.icon {
					width: 15rpx;
					height: 15rpx;
					background: #5E95FF;
					border-radius: 50%;
				}
			}
		}
	}

}
:deep(.input-padding) {
	padding-left: 0 !important;
}
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
	.btn {
		flex: 1;
		height: 72rpx;
		border: 1px solid #5e95ff;
		// border-radius: 12rpx;
		justify-content: center;
		align-items: center;
		display: flex;

		&.left {
			border-radius: 12rpx 0  0 12rpx;
			margin-left: 36rpx
		// 	margin-right: 16rpx;
		}

		&.right {
			border-radius: 0 12rpx 12rpx 0;
			margin-right: 36rpx
		// 	margin-left: 16rpx;
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
}
</style>