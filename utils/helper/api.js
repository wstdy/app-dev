import { requestMagicApi } from '@/common/api/magic-api';
import { useUserStore } from '@/common/store/user';

export async function apiConfigFunc(apiConfig, isCustomForm = false, formModel) {
  if (!apiConfig?.path) return [];
  const queryParam = {};
  const headerParam = {};
  const bodyParam = {};
  for (const param of apiConfig?.apiParams) {
    //queryString
    if (param.key === '1' && param.tableInfo && param.tableInfo.length) {
      for (const query of param.tableInfo) {
        queryParam[query.name] = getParamsValue(query, formModel, isCustomForm);
      }
    }
    //header
    if (param.key === '2' && param.tableInfo && param.tableInfo.length) {
      for (const head of param.tableInfo) {
        headerParam[head.name] = getParamsValue(head, formModel, isCustomForm, true);
      }
    }
    //body
    if (param.key === '3' && param.tableInfo && param.tableInfo.length) {
      for (const body of param.tableInfo) {
        bodyParam[body.name] = getParamsValue(body, formModel, isCustomForm);
      }
    }
  }
  const res = await requestMagicApi({
    method: apiConfig?.method,
    url: apiConfig.path,
    headers: headerParam,
    body: bodyParam,
    query: queryParam,
  });
  if (res && Array.isArray(res)) return res; //不分页接口
  if (res && Array.isArray(res.list)) return res.list; //分页接口
  return res;
}

function getParamsValue(params, formModel, isCustomForm, isHeaders = false) {
  const userStore = useUserStore();
  let value;
  if (params.bindType === 'value') {
    value = params.value;
  } else if (params.bindType === 'data') {
    const paramsArr = params.value.split('-');
    if (paramsArr[0] === '3') {
      //当前信息
      value = isHeaders
        ? encodeURIComponent(userStore.getUserInfo[paramsArr[1]])
        : userStore.getUserInfo[paramsArr[1]];
    } else {
      if (!formModel) return;
      const headerValue = isCustomForm
        ? formModel[paramsArr[0]]
        : formModel[camelCaseString(paramsArr[0])];
      value = isHeaders ? encodeURIComponent(headerValue) : headerValue;
    }
  }
  return value;
}

export function camelCaseString(string) {
  if (!string) return;
  let camelCaseArr = string.split('_');
  if (camelCaseArr.length > 1) {
    camelCaseArr = camelCaseArr.map((item, index) => {
      const first = item.charAt(0);
      const exceptFirst = item.substring(1);
      return item
        .replace(exceptFirst, exceptFirst.toLowerCase())
        .replace(first, index ? first.toUpperCase() : first.toLowerCase());
    });
    return camelCaseArr.join('').replaceAll('_', '');
  } else {
    return string;
  }
}
