<template>
    <view>
		<uni-easyinput ref="easyInput" v-model="name" style="text-align: right;" placeholder="请选择"  :inputBorder="false" @focus="focusInput" :clearable="false"/>
		<custom-dialog
		ref="moreRef"
		:title="title"
		:hasFooterIcon="true"
		dialogHeight="600rpx"
		:hasCloseIcon="false">
			<view class="next-member-check">
				<uni-data-checkbox v-model="selected" :localdata="localdata" wrap multiple></uni-data-checkbox>
			</view>
			<template #footer>
				<view class="next-btn">
					<view class="btn left submit" @tap="confirmApproveUserData"><text>确定</text></view>
					<view class="btn right"  @tap="handleCancel"><text>取消</text></view>
				</view>
			</template>
			
		</custom-dialog>
    </view>
    
</template>
  
<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
const props = defineProps({
title: {
	type: String,
	default: "请选择审批人",
}, 
modelValue: {
	type: Array,
	default: [],
},
localdata: {
	type: Array,
	default: () => [],
}
});
const emits = defineEmits(["change", "update:modelValue"]);
const moreRef = ref(null);
const selected = ref('');
onMounted(() => {
});
watch(() => props.modelValue, (val) => {
	selected.value = val.join(",");
});
const name = computed(() => {
	let selectedList = props.localdata.filter(item => {
		return props.modelValue.includes(item.value);
	});
	return selectedList.map(item => item.text).join(",");
})
function confirmApproveUserData() {
	emits("update:modelValue", selected.value.split(","));
	moreRef.value.close();
}
function focusInput() {
	selected.value = props.modelValue.join(",")
	moreRef.value.open();
}
function handleCancel() {
	moreRef.value.close();
}

</script>

<style lang="scss">
.next-member-check {
	min-height: 400rpx;
	overflow-y: auto;
	:deep(.checklist-group) {
		float: none!important;
		.checklist-box {
			margin-bottom: 8px;
			.checklist-text {
				font-size: 16px!important;
			}
		}
	}
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
  