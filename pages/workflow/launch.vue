<template>
    <!-- 发起流程 -->
    <FlowInfo v-if="state.visible" ref="flowInfoRef" :backUrl="state.backUrl" :data="data" :title="state.pageTitle" :workflowData="state.workflowData">
        <block #action>

        </block>
        <block #footer>
            <view class="next-btn">
                <view class="btn submit all" @tap="saveLaunch">
                    <text>发起流程</text>
                </view>
                <view class="more" @tap="showMore">
                    <view>
                        <uni-icons size="22" type="more-filled"></uni-icons>
                    </view>
                    <text>更多</text>
                </view>
            </view>
            <!-- 流程审批 更多弹窗 -->
            <custom-dialog ref="moreRef" :hasCloseIcon="true" :scrollY="false" dialogHeight="1000rpx" max-height="480px" title="流程信息">
                <ProcessInformation :content="data.workflowChat"></ProcessInformation>
            </custom-dialog>
        </block>
    </FlowInfo>
</template>

<script setup>
    import { reactive, ref } from "vue";
    import { onLoad } from "@dcloudio/uni-app";
    import FlowInfo from "./components/FlowInfo.vue"; //流程详情
    import { getStartProcessInfo, postLaunch, getPreApproveInfo, postApproval } from "@/common/api/workflow/index";
    import userTaskItem from "./hooks/userTaskItem";
    import { separator } from '@/utils/simpleForm/analysis';
    import { getFormExecuteWorkflow } from '@/common/api/system/dictionary/index.js';
    import ProcessInformation from "./components/ProcessInformation.vue"; //流程记录
    import {
        ApproveType,
        ApproveCode
    } from "@/common/enums/workflow.ts";
	import { setCurrentFlowData } from './flowData'

    const state = reactive({
        visible: false,
        pageTitle: "发起流程",
        approvalContent: "",
        renderKey: 0,
        schemaId: "",
        // backUrl: '/pages/workflow/launchList',
        backUrl: '',
        workflowData: {formId: '', data: {}}
    });
    const props = defineProps({
        id: String,
        rowId: String,
        formId: String,
    });
    const flowInfoRef = ref();
    const {data, initProcessData} = userTaskItem();
    const approvalData = reactive({
        isCountersign: false, //是否会签节点
        isAddOrSubSign: false, //是否加签减签
        buttonConfigs: [],
        approvedType: ApproveType.AGREE,
        approvedResult: ApproveCode.AGREE,
        approvedContent: '',
        rejectNodeActivityId: '',
        rejectNodeActivityIds: [],
        circulateConfigs: [],
        nextTaskUser: {} // 格式为taskKey: 用户id（逗号分隔）
    });
    const taskId = ref();
    const delta = ref()
    const mainFormModels = ref();

    onLoad(async (options) => {
        if (options && options.id) {
            state.schemaId = options.id;
            try {
                if (options.formId && options.rowId) {
                    state.workflowData.formId = options.formId;
                    let formExecuteRes = await getFormExecuteWorkflow(options.formId, options.rowId);
                    let formExecuteData = formExecuteRes.data;
                    state.workflowData.data = formExecuteData;
                    state.backUrl = '';
                }
                let res = await getStartProcessInfo(options.id);
                initProcessData(res.data);
                state.visible = true;
            } catch (error) {

            }
        }
        uni.$on('handleApprove',function(type, node){
            doApprove(node)
		})

        // 点击左上角的返回，返回到上一页，而不是/pages/workflow/launchList
        if (options?.delta) {
            state.backUrl = '';
            delta.value = options.delta;
        } else if (options?.backUrl) {
            state.backUrl = options.backUrl;
        }
    });

    async function saveLaunch() {
        try {
            uni.showLoading();
            let validateForms = await flowInfoRef.value.validateForm();
            if (validateForms.length > 0) {
                let successValidate = validateForms.filter((ele) => {
                    return ele.validate;
                });
                if (successValidate.length == validateForms.length) {
                    mainFormModels.value = await flowInfoRef.value.getFormModels();
                    let relationTasks = [];
                    if (data.predecessorTasks && data.predecessorTasks.length > 0) {
                        relationTasks = data.predecessorTasks.map((ele) => {
                            return {taskId: ele.taskId, schemaId: ele.schemaId};
                        });
                    }
                    let fileFolderIds = getUploadFileFolderIds(mainFormModels.value);
                    if (taskId.value) {
                        // 如果在草稿节点取消，重新从草稿开始走
                        return save(true);
                    }
                    let formModels = mainFormModels.value;
                    const system = Object.keys(formModels)[0];
                    const isOldSystem = {}
                    isOldSystem[system] = false;
                    //如果传入了processId  代表是重新发起流程
                    let postLaunchRes = await postLaunch(
                        state.schemaId,
                        mainFormModels.value,
                        relationTasks,
                        fileFolderIds,
                        isOldSystem
                    );
                    if (postLaunchRes.success) {
                        let res = postLaunchRes.data;
                        taskId.value = res[0].taskId;
                        // 下一节点审批人
                        let taskList = [];
                        if (res && res.length > 0) {
                            taskList = res
                                .filter((ele) => {
                                    return ele.isMultiInstance == false && ele.isAppoint == true;
                                })
                                .map((ele) => {
                                    return {
                                        taskId: ele.taskId,
                                        taskName: ele.taskName,
                                        provisionalApprover: ele.provisionalApprover,
                                        selectIds: [],
                                    };
                                });
                            save(taskList);
                        } else {
                            save();
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            icon: "none",
                            title: postLaunchRes.msg,
                        });
                    }
                } else {
                    uni.showToast({
                        icon: "none",
                        title: "流程发起失败",
                    });
                }
            }
        } catch (error) {
            uni.hideLoading();
            uni.showToast({
                icon: "none",
                title: "流程发起失败",
            });
        }
    }

    function save(taskList) {
        if (taskList) {
            approvalCreate();
        } else {
            uni.showToast({
                icon: "success",
                title: "流程发起成功",
            });
            sett

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
    }

    async function approvalCreate() {
        try {
            setCurrentFlowData({approvalData: approvalData, processId: data.processId, taskId: taskId.value, formModel: mainFormModels.value});
            uni.navigateTo({
                url: `/pages/workflow/nextTask?approveType=approve`
            });
        } catch (error) {
            uni.hideLoading();
        }
    }

    async function doApprove(node = {}) {
        try {
            uni.showLoading();
            const params = await getApproveParams();
            const nextTaskUser = {};
            if (node.assignees && node.assignees.length > 0) {
                nextTaskUser[node.activityId] = typeof(node.assignees) == 'string' ? node.assignees : node.assignees.join(',');
            }
            params.nextTaskUser = nextTaskUser;
            await postApproval(params);
            uni.hideLoading();
            uni.showToast({
                icon: "success",
                title: "流程发起成功",
            });

            setTimeout(() => {
                if (state.backUrl == '') {
                    uni.navigateBack({
                        delta: delta.value || 1
                    });
                } else if (state.backUrl) {
                    uni.navigateTo({
                        url: state.backUrl
                    })
                } else {
                    uni.navigateTo({
                        url: "/pages/workflow/launchList"
                    })
                }
            }, 1000)
        } catch (error) {
            console.error('doApprove', error)
            uni.hideLoading();
            uni.showToast({
                icon: "error",
                title: "提交失败",
            });
        }
    }

    async function getApproveParams() {
        let formModels = mainFormModels.value;
        const system = Object.keys(formModels)[0];
        const isOldSystem = {}
        isOldSystem[system] = false;
        let fileFolderIds = getUploadFileFolderIds(formModels);
        return {
            approvedType: approvalData.approvedType,
            approvedResult: approvalData.approvedResult, // approvalData.approvedType 审批结果 如果为 4 就需要传buttonCode
            approvedContent: approvalData.approvedContent,
            formData: formModels,
            rejectNodeActivityId: approvalData.rejectNodeActivityId,
            taskId: taskId.value,
            fileFolderIds,
            circulateConfigs: approvalData.circulateConfigs,
            isOldSystem: isOldSystem,
            nextTaskUser: approvalData.nextTaskUser,
        };
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

    const moreRef = ref();

    function showMore() {
        uni.showActionSheet({
            itemList: ['流程信息'],
            success: function (res) {
                moreRef.value.open()
            }
        });
    }
</script>

<style lang="scss" scoped>
.next-btn, .btn-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    height: 135rpx;
    background: #ffffff;
    padding: 0 38rpx;

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
        // border-radius: 12rpx;
        justify-content: center;
        align-items: center;
        display: flex;

        &.all {
            border-radius: 12rpx;
            margin: 0 36rpx
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
