import {
	http
} from '@/common/request/index.js'; // 局部引入

const api = {
	Page: '/system/demo/demo-detail',
	List: '/system/dictionary-detail/page',
	Info: '/system/demo/info',
	Demo: '/system/demo'
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const getDemoList = (params) => {
	return http.get(api.List, {
		params
	})
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const getDemoPage = (params) => {
	return http.get(api.Page, {
		params
	})
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const getDemo = (id) => {
	return http.get(api.Info, {
		params: {
			id
		}
	})
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const addDemo = (demo) => {
	return http.post(api.Demo, {
		data: demo
	})
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const updateDemo = (demo) => {
	return http.put(api.Demo, {
		data: demo
	})
}

/**
 * 根据参数 获取数据字典详情列表
 * @param {Object} params - 查询参数  
 */
export const deleteDemo = (ids) => {
	return http.delete(api.Demo,ids)
}