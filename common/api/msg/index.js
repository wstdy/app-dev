import {
	http
} from '@/common/request/index.js'; // 局部引入
const api = {
  OAList :'/oa/news/box',//列表
	Detail:'/oa/news/info',//详情
  OASchedule: '/oa/schedule/box',//日程管理
  ScheduleInfo:'/oa/schedule/info'//日程管理详情
}
/**
 * 获取新闻或者公告列表
 */
export const getOAList = (params) => {
	return http.get(api.OAList,{
		params
	})
}

/**
 * 获取新闻或者公告详情
 */
export const getOADetail = (id) => {
	return http.get(api.Detail,{
		params:{id}
	})
}

/**
 * 获取日程列表
 */
export const getOASchedule = (params) => {
	return http.get(api.OASchedule, { params })
}

/**
 * 获取日程列表详情
 */
export const getScheduleInfo = (id) => {
	return http.get(api.ScheduleInfo,{
		params:{id}
	})
}