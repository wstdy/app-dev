import {
  http
} from '@/common/request/index.js'; // 局部引入

const api = { 
  Info : '/system/code-rule/generate' 
}

/**
 * 根据参数  查询编码规则
 * @param {Object} params - 查询参数  
 */
export const getCodeRule = (params) => {
  return http.get(api.Info, {
    params
  })
}