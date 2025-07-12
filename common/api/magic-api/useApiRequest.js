import {
	http,
	getTokenStorage
} from '@/common/request/index.js';
import {
	requestMagicApi
} from '@/common/api/magic-api/index.js';
import {
	useUserStore
} from '@/common/store/user';

export async function changeApiOptions(val, formModel, isCustomForm, index) {

	if (val.path) {
		try {
			const token = getTokenStorage();

			const headers = {
				Authorization: `Bearer ${token}`
			};
			if (val.requestHeaderConfigs.length > 0) {
				val.requestHeaderConfigs.forEach((element) => {
					if (element.name) headers[element.name] = getParamsValue(element, formModel, isCustomForm, index, true);
				});
			}
			let path = val.path;
			const query = {}
			if (val.requestParamsConfigs.length > 0) {
				//path += '?';
				val.requestParamsConfigs.forEach((element) => {
					if (element.name) query[element.name] = getParamsValue(element, formModel, isCustomForm, index);
				});
			}

			const apiData = {};
			if (val.requestBodyConfigs.length > 0) {
				val.requestBodyConfigs.forEach((element) => {
					if (element.name) apiData[element.name] = getParamsValue(element, formModel, isCustomForm, index);
				});
			}
			const res = await requestMagicApi({
				header: headers,
				body: apiData,
				method: val.method,
				url: path,
				query: query
			})
			return res;
		} catch (error) {}
	}
}

function getParamsValue(params, formModel, isCustomForm, index, isHeaders) {
	const userStore = useUserStore();
	let value;
	if (params.assignmentType === 'value') {
		value = params.value;
	} else if (params.assignmentType === 'data') {
		const paramsArr = params.value.split('-');
		if (paramsArr[0] === '3') {
			//当前信息
			value = isHeaders ?
				encodeURIComponent(userStore.getUserInfo[paramsArr[1]]) :
				userStore.getUserInfo[paramsArr[1]];
		} else {
			if (!formModel) return;
			let headerValue = '';
			if (params.value) {
				const value = isValidJSON(params.value);
				if (value && value.bindTable) {
					const table = isCustomForm ?
						value.bindTable + 'List' :
						camelCaseString(value.bindTable + '_List');
					const field = isCustomForm ? value.bindField : camelCaseString(value.bindField);

					if (formModel[table] && formModel[table][index || 0]) {
						headerValue = formModel[table][index || 0][field];
					}
				} else {
					headerValue = isCustomForm ?
						formModel[value.bindField] :
						formModel[camelCaseString(value.bindField)];
				}
			}

			value = isHeaders ? encodeURIComponent(headerValue) : headerValue;
			 
		}
	}

	return value;
}

/* 如果没有下划线，不需要处理
如果有下划线，用下划线切割，第一个下划线左边的全部小写，后面的首字母大写，首字母后面的全部小写 */
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

export function isValidJSON(str) {
	try {
		const val = JSON.parse(str);
		return val;
	} catch (err) {
		return false;
	}
}