import {
	http
} from '@/common/request/index.js'; // 局部引入
import { FlowCategory } from "@/common/enums/workflow.ts";
const api = {
	PendingTasks: '/workflow/execute/pending',// 待办
	FinishedTasks: '/workflow/execute/finished/page',// 已办
	CirculatedTasks:'/workflow/execute/circulated/page',// 传阅
	MyProcess:'/workflow/execute/my-process/page',// 我的任务
	CategoryList:'/system/dictionary-detail',//分类列表
	LaunchList:'/workflow/schema/page',//发起流程列表
	StartProcessInfo: '/workflow/execute/start-process-info',//发起流程获取信息
	ApprovalProcessInfo:  '/workflow/execute/approve-process-info',//审批流程信息
  	ViewProcessInfo:  '/workflow/execute/view-process-info',// 查看流程信息
	SelfRecord : '/workflow/execute/process/all-record',//获取仅查看本人的流转记录
	SummaryOfAttachmentList:'/system/file',//查询文件列表
	RelationTasks : '/workflow/execute/relation-task/page',// 关联任务列表
	Launch :'/workflow/execute/new-launch',//发起流程
	RejectNode:'/workflow/execute/reject-node',//驳回节点
	Approval:'/workflow/execute/new-approve',//审批流程
	ApproverUsers:'/workflow/execute/set-approve-multi',//指定下一节点审批人
	ApproveUserList:'/workflow/execute/approve-user',//下一节点审批任务 人员列表
	SetSign:'/workflow/execute/set-sign',//加签减签
	StampListAll:'/system/stamp/page-one',//签章列表
	MyTaskCount:'/workflow/execute/count',//查询待办，委托，已办，数量
	PreApprove: '/workflow/execute/getNextTaskMaybeArrival',//预审，用于提前获取下一节点审批人
	Transfer: '/workflow/execute/transfer', // 转发
}
/**
 * 获取待办任务
 */
export const getTodoTasks = (params) => {
	return http.get(api.PendingTasks,{
		params
	})
}
/**
 * 获取已办任务
 */
export const getFinishedTasks = (params) => {
	return http.get(api.FinishedTasks,{
		params
	})
}
/**
 * 获取传阅任务
 */
export const getCirculatedTasks = (params) => {
	return http.get(api.CirculatedTasks,{
		params
	})
}
/**
 * 获取我的任务
 */
export const getMyProcess = (params) => {
	return http.get(api.MyProcess,{
		params
	})
}

/**
 * 获取流程分类
 */
export const getCategoryList = () => {
	return http.get(api.CategoryList,{
		params:{
      itemId: FlowCategory.ID,
    }
	})
}
/**
 * 获取发起流程列表
 */
export const getLaunchList = (params) => {
	return http.get(api.LaunchList,{
		params
	})
}

/**
 * 发起流程获取信息
 */
export const getStartProcessInfo = (schemaId) => {
	return http.get(api.StartProcessInfo,{
		params:{ schemaId }
	})
}
/**
 * 流程获取信息 (审批)
 */
export const getProcessInfo = (taskId,processId) => {
	let url =  taskId ? api.ApprovalProcessInfo : api.ViewProcessInfo;
	return http.get(url,{
		params:{ taskId, processId }
	})
}
/**
 * 流程获取信息 (查看)
 */
export const getViewInfo = (processId) => {
	let url = api.ViewProcessInfo;
	return http.get(url,{
		params:{ processId }
	})
}
/**
 * 获取仅查看本人的流转记录
 */
export const getSelfRecordList = (params) => {
	return http.get(api.SelfRecord,{
		params
	})

}
/**
 * 获取流程附件记录
 */
export const getSummaryOfAttachmentList = (params) => {
	return http.get(api.SummaryOfAttachmentList,{
		params
	})

}

/**
 * 获取前置任务 关联任务列表
 */
export const getRelationTasks = (params) => {
	return http.get(api.RelationTasks,{
		params
	})

}


/**
 * 发起流程
 */
export async function postLaunch(
  schemaId,
  formData,
  relationTasks= [],
  fileFolderIds=[],
  isOldSystem
) {
	return http.post(api.Launch,{ formData, schemaId, relationTasks, fileFolderIds, isOldSystem })
}

/**
 * 获取审批中，驳回节点信息
 */
export const getRejectNode = (processId,taskId) => {
	return http.get(api.RejectNode,{
		params:{ processId, taskId }
	})
}


/**
 * 审批流程
 */
export async function postApproval(params) {
	return http.post(api.Approval,params)
}
/**
 * 转办
 */
export async function postTransfer(params) {
	return http.post(api.Transfer,params)
}
/**
 * 提交下一节点审批人
 */
export async function batchApproverUsers( schemaId,approveUserList) {
	return http.post(api.ApproverUsers,{schemaId, approveUserList})
}

/**
 * 获取节点审批人
 */
export async function getApproveUserList( schemaId,taskId) {
	return http.get(api.ApproveUserList,{
		params:{ schemaId, taskId }
	})
}


/**
 * 提交加签减签
 */
export async function postSetSign( schemaId,taskId,userIds) {
	return http.post(api.SetSign,{schemaId,taskId, userIds})
}
/**
 * 提交加签减签
 */
export async function postSetSignV2(data) {
	return http.post(api.SetSign,{
		...data
	})
}

/**
 * 获取签章列表
 */
export const getStampList = (params) => {
	return http.get(api.StampListAll,{
		params
	})
}

/**
 *  我的任务合计
 */
export function getMyTaskCount() {
  return http.get(api.MyTaskCount);
}

export function getPreApproveInfo(taskId, data) {
	return http.post(api.PreApprove + '/' + taskId, data);
}