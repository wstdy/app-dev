import {
	http
} from '@/common/request/index.js'; // 局部引入
const api = {
	Execute: '/liteflow/chain/execute',// 执行
}

/**
 * 发送
 */
export async function postExecute(id, param) {
	return http.post(api.Execute,{
    id,
    param,
  })
}
