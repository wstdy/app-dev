import {
	deepMerge,
	isArray,
	isBoolean,
	isFunction,
	isObject,
	isString,
	uniqBy,
	cloneDeep
} from '@/utils/helper/utils.js';

/**
 * 根据配置判断是否isShow
 * @param {Object} schema
 * @param {Object} itemValue
 */
export function getIsShow(schema, itemValue) {
	const {
		show
	} = schema;

	let returnVal = true;

	if (isBoolean(show)) {
		returnVal = show;
	}
	if (schema.componentProps&&isBoolean(schema.componentProps.isShow)) {
		returnVal = schema.componentProps.isShow;
	}
	if (isFunction(show)) {
		returnVal = show({
			values: itemValue,
			model: formModel,
			schema: schema,
			field: schema.field
		});
	}
	return returnVal;
}
/**
 * 根据配置 判断是否ifshow
 * @param {Object} schema
 * @param {Object} itemValue
 */
export function getIfShow(schema, itemValue) {
	const {
		ifShow
	} = schema;

	let isIfShow = true;
	if (isBoolean(ifShow)) {
		isIfShow = ifShow;
	}
	// if (schema.componentProps&&isBoolean(schema.componentProps.isShow)) {
	// 	isIfShow = schema.componentProps.isShow;
	// }
	if (isFunction(ifShow)) {
		isIfShow = ifShow({
			values: itemValue,
			model: formModel,
			schema: schema,
			field: schema.field
		});
	}
	return isIfShow;
}

