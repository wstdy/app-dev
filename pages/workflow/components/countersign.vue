<template>
    <custom-dialog ref="addOrSubSignRef" title="加签和减签" :hasCloseIcon="true" :hasFooterIcon="true">
        <view class="countersign">
            <uni-tab :data="tabList" v-model="activeTab" @click-tab="changeTab" lineColor="#5e95ff"/>
            <view v-show="activeTab == 'add'" class="add">
                <view class="tooltip">请点击选择加签人员</view>
                <!-- 预留加签选人组件 -->
                <uni-user-select ref="selectUserRef" selectedDisabled multiple v-model="addSelected" @change="selectUserChange" :clearable="false"></uni-user-select>
            </view>
            <view v-show="activeTab == 'reduce'" class="reduce">
                <view class="tooltip">当会签人选只有一个的时候无法减签</view>
                    <!-- <uni-data-checkbox v-model="reduceSelected" :localdata="reduceMemberShowList" wrap multiple></uni-data-checkbox> -->
                <view class="tree-list">
                    <view class="list-item" v-for="(item, index) in reduceMemberShowList" :key="index" @click="handleCheck(item)">
                        <view class="title">{{ item.text }}</view>
                        <view class="checked" :class="{'check-disabled': item.disabled}" v-if="showCheck(item)">
                            <view class="icon"></view>
                        </view>
                        <view class="kong" v-else></view>
                    </view>
                </view>
                
            </view>
        </view>
        <template #footer>
            <custom-dialog-submit @tap="confirmApproveUserData"></custom-dialog-submit>
        </template>
    </custom-dialog>
</template>
  
<script setup>
import { ref, computed } from "vue";
import userTaskItem from "../hooks/userTaskItem";
import { onLoad } from "@dcloudio/uni-app";
import { getCurrentFlowData } from '../flowData';
const {
    data,
    initProcessData
} = userTaskItem();
const addOrSubSignRef = ref();
const tabList = [
    { name: '加签', value: 'add' },
    { name: '减签', value: 'reduce' },
]
const emits = defineEmits(["confirmApproveUserData"]);
const addMemberIdList = ref([]);
const reduceMemberList = ref([]);
const reduceSelected = ref('');
const reduceSelectedList = ref([]);
const addSelected = ref('');
const activeTab = ref('add');
const memberList = ref([]);
const reduceMemberShowList = computed(() => {
    let list = memberList.value.map(item => {
    		if(reduceSelectedList.value.length == 1) {
                if(item.value == reduceSelected.value) {
                    return { ...item, disabled: true }
                } else {
                    return {...item, disabled: false }
                }
    		} else {
                return {...item, disabled: false }
            }
    })
    return list;
})
function showCheck(item) {
    return reduceSelectedList.value.includes(item.value);
}
const checkDisabled = computed(() => {
    return reduceSelectedList.value.length <= 1;
})
function handleCheck(item) {
    if(reduceSelectedList.value.length == 1) {
        if(item.value == reduceSelected.value) {
            return;
        } else {
            reduceSelectedList.value.push(item.value);
            reduceSelected.value = reduceSelectedList.value.join(',');
        }
    } else {
        if(reduceSelectedList.value.includes(item.value)) {
            reduceSelectedList.value = reduceSelectedList.value.filter(i => i != item.value);
            reduceSelected.value = reduceSelectedList.value.join(',');
        } else {
            reduceSelectedList.value.push(item.value);
            reduceSelected.value = reduceSelectedList.value.join(',');
        }
    }
}
function confirmApproveUserData(){
    reduceSelected.value.split(',').forEach((item) => {
        reduceMemberList.value.splice(reduceMemberList.value.findIndex(m => m.value == item), 1)
    })
    addSelected.value.split(',').forEach((item) => {
        if(memberList.value.find(m => m.value == item)) return;
        addMemberIdList.value.push(item)
    })
    let data = {
        addMemberIdList: addMemberIdList.value,
        reduceMemberList: reduceMemberList.value.map(item => item.value),
    }
    emits("confirmApproveUserData", data);
}

function open(){
    const flowData = getCurrentFlowData()
    let ids = []
    memberList.value = [];
    flowData.currentTaskAssignees[flowData.taskInfo.taskDefinitionKey].forEach((item) => {
		memberList.value.push({
			text: item.assigneeNameStr,
			value: item.assigneeIdStr
		});
        ids.push(item.assigneeIdStr)
		// selectedAddIds.value += selectedAddIds.value ? `,${item.assigneeIdStr}` : item.assigneeIdStr;
	});
    reduceSelected.value = ids.join(',')
    addSelected.value = ids.join(',')
    reduceSelectedList.value = ids;
    addMemberIdList.value = [];
    reduceMemberList.value = [...memberList.value];
    addOrSubSignRef.value.open();
}
function close(){
    addOrSubSignRef.value.close();
}
defineExpose({
    open,
    close
})
</script>
  
<style lang="scss">
.countersign {
    display: flex;
    flex-direction: column;
    :deep(.checklist-group) {
		float: none!important;
		.checklist-box {
			margin-bottom: 8px;
			.checklist-text {
				font-size: 16px!important;
			}
		}
	}
    .add{
        flex: 1;
		.tooltip {
            padding: 20rpx 0 0 0;
            text-align: center;
			font-size: 12px;
			color: #999;
			margin-bottom: 10px;
		}
    }
    .reduce {
        flex: 1;
		.tooltip {
            padding: 20rpx 0 0 0;
            text-align: center;
			font-size: 12px;
			color: #999;
			margin-bottom: 10px;
		}
        .check-box {

        }
        .tree-list {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            .list-item {
                
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
                .button {
                    color: #5E95FF;
                }
                .button-disabled {
                    color: #999999;
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
                .check-disabled {
                    border: 2rpx solid #999;
                    .icon {
                        width: 15rpx;
                        height: 15rpx;
                        background: #999;
                        border-radius: 50%;
                    }
                }
            }
        }
	}
}
</style>
  