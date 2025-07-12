import {
	http
} from '@/common/request/index.js'; // 局部引入

const api = {
	DetailList: '/system/dictionary-detail',
	DetailPage: '/system/dictionary-detail/page',
	Child: '/system/area/child',
	AppMenu: '/app/menu/list',
	UpFile: '/system/oss/multi-upload?folderId=',
	FileList: '/system/file',
	Add: '/form/execute/app/add',
	Update: '/form/execute/app/update',
	Delete: '/form/execute/app/delete',
	Info: '/app/func-design/info',
	Page: '/form/execute/app/page',
	DeleteFile: '/system/file/delete-single',
	FormData:'/form/execute/app/info',
	FormExecuteWorkflow:'/form/execute/workflow/info',
	AppMenu:'/app/menu/app-simple-tree',
	AppAuth:'/app/app-authorize/app-menu-permissions'
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const getDicDetailList = (params) => {
	return http.get(api.DetailList, {
		params
	})
}

/**
 * 根据参数 获取数据字典详情分页列表
 * @param {Object} params - 查询参数  
 */
export const getDicDetailPage = (params) => {
	return http.get(api.DetailPage, {
		params
	})
}

/**
 * @description: 查询所有省份列表
 */
export function getAreaList(params) {
	return http.get(api.Child, {
		params
	});
}

/**
 * 查询所有功能菜单
 */
export function getAppFuncList(params) {
	return http.get(api.AppMenu, {
		params
	});
}

export function uploadMutipleFile(id, params) {
	return http.upload(api.UpFile + id, params)
}
/**
 * 查询文件列表
 */
export function getFileList(params) {
	return http.get(api.FileList + '?folderId=' + params);
}


/**
 * 表单执行新增
 */
export function addFormExecute(params) {
	return http.post(api.Add,
		params
	);
}

/**
 * 表单执行修改
 */
export function updateFormExecute(params) {
	return http.post(api.Update,
		params
	);
}

/**
 * 获取模板详情信息
 */
export function getFormRelease(id) {
	return http.get(api.Info + '?id=' + id);
}

/**
 * 根据id获取自定义表单数据
 */
export function getFormDataById(data) {
	return http.post(api.FormData ,data);
}

/**
 * 查询自定义表单列表数据 （分页）
 */
export function getFormExecutePage(data, config) { 
	return http.post(api.Page, data,{header:config});
}

/**
 * 删除自定义表单数据（批量删除）
 */
export function deleteFormExecute(data) {
	return http.post(api.Delete,
		data
	);
}

/**
 * 删除单个文件
 */
export function deleteSingleFile(id) {
	return http.delete(api.DeleteFile, id);
}

/**
 * 工作流表单 获取详情
 */
export function getFormExecuteWorkflow(formId,id) {
	return http.post(api.FormExecuteWorkflow,
		{
			formId: formId,
			id: id,
		}
	);
}
/**
 * @description: 获取APP功能(已根据权限过滤)
 */
export function getAppMenu() {
  return http.get(api.AppMenu);
}
/**
 * @description: 获取APP按钮，列表字段，表单字段权限 
 */
export function getAppAuth(menuId) {
  return http.get(api.AppAuth+'?menuId='+menuId);
}
