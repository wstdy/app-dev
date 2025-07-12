import {
	http
} from '@/common/request/index.js'; // 局部引入

const api = {
	Tree: '/interface/tree',
}

/**
 * 请求magicApi
 * @param {Object} options - 所有配置信息  
 */
export const requestMagicApi = ({
	header,
	query,
	body,
	method,
	url
}) => {
	return http.get('/magic-api/' + url, {
		header,
		params: query,
		data: body,
		method
	})
}