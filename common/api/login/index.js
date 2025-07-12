import {
	http
} from '@/common/request/index.js'; // 局部引入

const api = {
	Login: '/system/login',
	Logout: '/system/logout',
	LoginCaptcha:'/system/captcha',
	GetUserInfo: '/organization/user/current/info',
	GetPermCode: '/system/authorize/permissions',
	GetUserMenuTree: '/system/menu/tree',
	TestRetry: '/testRetry',
	updatePassword:'/organization/user/update/password',
	Logout:'/system/logout'
}

/**
 * 账号登录接口
 * @param {Object} params - 查询参数  
 */
export const loginApi = (params) => {
	return http.post(api.Login, params)
}
/**
 * 账号登录接口
 * @param {Object} params - 查询参数  
 */
export const singleLoginApi = (params) => {
	return http.post(api.Login + '/' +  params.ltpasToken, {})
}
/**
 * 手机号码登录
 * @param {Object} params - 查询参数  
 */
export const loginPhoneApi = (params) => {
	return http.post(api.LoginCaptcha, params)
}
/**
 * 短信验证码
 * @param {Object} tel - 手机号码
 */
export const sendSmsApi = (mobile) => {
	return http.get(api.LoginCaptcha+'?mobile='+mobile)
}
/**
 * 获取权限code
 */
export const getPermCode = () => {
	return http.get(api.GetPermCode)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return http.get(api.GetUserInfo)
}


/**
 * 更新密码
 */
export const putUpdatePassword = (data) => {
	return http.put(api.updatePassword,{
	...data
	})
}
/**
 * 退出登录
 */
export const doLogout = () => {
	return http.post(api.Logout)
}
