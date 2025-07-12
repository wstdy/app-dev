/**
 * @version 3.0.5
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-3.0.4 alpha-3.0.4
 */

import Request from '@/utils/luch-request/index.js'
import config from '@/common/config/index.js'
import {
	useUserStore
} from '../store/user';


const options = {
	// 显示操作成功消息 默认不显示
	showSuccess: false,
	// 成功提醒 默认使用后端返回值
	successMsg: '',
	// 显示失败消息 默认显示
	showError: true,
	// 失败提醒 默认使用后端返回信息
	errorMsg: '',
	// 显示请求时loading模态框 默认显示
	showLoading: true,
	// loading提醒文字
	loadingMsg: '加载中',
	// 需要授权才能请求 默认放开
	auth: false,
	// ...
};

// Loading全局实例
let LoadingInstance = {
	target: null,
	count: 0,
};

/**
 * 关闭loading
 */
function closeLoading() {
	if (LoadingInstance.count > 0) LoadingInstance.count--;
	if (LoadingInstance.count === 0) uni.hideLoading();
}


export const getTokenStorage = () => {
	let token = ''
	try {
		const userStore = useUserStore();
		token = 'Bearer ' + userStore.getToken;
	} catch (e) {}
	return token
}

/**
 * @description 请求基础配置 可直接使用访问自定义请求
 */
const http = new Request({
	baseURL: config.baseUrl,
	timeout: 20000,
	// method: 'GET',
	// header: {
	// 	Accept: 'text/json',
	// 	'Content-Type': 'application/json;charset=UTF-8',
	// },
	// #ifdef APP-PLUS
	sslVerify: false,
	// #endif
	// #ifdef H5
	// 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
	withCredentials: false,
	// #endif
	custom: options,
});

http.interceptors.request.use((config) => {
	/* 请求之前拦截器。可以使用async await 做异步操作 */
	const token = getTokenStorage();
	uni.showLoading();
	if (token) config.header['Authorization'] = token;
	return config;
}, (config) => {
	return Promise.reject(config)
})


http.interceptors.response.use(async (response) => {


	response.config.custom.showLoading && closeLoading();
	if(response.config.url.includes('svg')){
		return Promise.resolve(response.data);
	}
	if (response.data.code === 10401) {
		uni.navigateTo({
			url: "/pages/login/login"
		})
	}
	if (response.data.code !== 0) {
		
		if (response.config.custom.showError)
			uni.showToast({
				title: response.data.msg || '服务器开小差啦,请稍后再试~',
				icon: 'none',
				mask: true,
			});
		return Promise.resolve(response.data);
	}
	if (
		response.data.error === 0 &&
		response.data.msg !== '' &&
		response.config.custom.showSuccess
	) {
		uni.showToast({
			title: response.config.custom.successMsg || response.data.msg,
			icon: 'none',
		});
	}
	return Promise.resolve(response.data);
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	console.log(response)
	return Promise.reject(response)
})

export {
	http
}