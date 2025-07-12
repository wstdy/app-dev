<template>
	<view class="example">
		<!-- 自定义表单校验 -->
		<uni-forms v-if="showForm" ref="formRef" v-bind="formPropsRef" :modelValue="formModelRef">
			<template v-for="schema in getSchemas" :key="schema.key">
				<simple-form-item
					:schema="schema"
					:formApi="formActionType"
					:class="schema.componentProps.type === 'textarea' ? 'textarea-box' : ''"
					:refreshFieldObj="refreshFieldObj"
					v-if="getIfShow(schema, formModelRef[schema.field])"
					v-model="formModelRef[schema.field]"
				></simple-form-item>
			</template>
</uni-forms>
<uni-load-more v-if="!showForm" iconType="auto" status="loading" />
<view v-if="formPropsRef.showButton">
	<button type="primary" @click="submit">提交</button>
	<button type="primary" @click="reset">重置</button>
	<button type="primary" @click="disabled">{{ disabledRef ? '取消禁用' : '禁用' }}</button>
</view>
</view>
</template>

<script>
import { reactive, ref, provide, computed, watch, onMounted, unref } from 'vue';
import { layoutComponents } from './types/form.js';
import { getIsShow, getIfShow } from './utils/utils.js';
import { deepMerge, isArray, isBoolean, isFunction, isObject, isString, uniqBy, cloneDeep } from '@/utils/helper/utils.js';
import { getUuid } from '@/utils/helper/tools.js';
import {setApiConfig} from '@/utils/simpleForm/changeJson.js';
import SimpleFormItem from './SimpleFormItem';
import { getDicDetailList } from '@/common/api/system/dictionary/index.js';
import { changeApiOptions } from '@/common/api/magic-api/useApiRequest.js';
import { http } from '@/common/request/index.js'; // 局部引入
import {postExecute} from '@/common/api/liteflow/index.js';
export default {
	components: { SimpleFormItem },
	props: {
        // 表单配置规则
		formProps: {
			type: Object,
			default: () => {
				return {};
			}
		},

		//是否全局禁用
		disabled: false,
		isFilter: false,
		control: 'add',
		isCustomForm:false
    },
	emits: ['submit'],
	setup(props, { attrs, slots, emit, expose }) {
		// Get the basic configuration of the form
	const getProps = computed(() => {
		return formPropsRef.value;
	});

	const getSchemas = computed(() => {
		return schemaRef.value;
	});

	const formModelRef = ref({});
	const formPropsRef = ref(props.formProps);
	const disabledRef = ref(props.disabled);
	const filterRef = ref(props.isFilter);
	const schemaRef = ref(props.formProps.schemas);
	const cacheFirstLoader = ref({});
	const customForm=ref(props.isCustomForm)
	provide('formModel', formModelRef);
	provide('formProps', formPropsRef);
	provide('disabled', disabledRef);
	provide('isFilter', filterRef);
	provide('isCustomForm',customForm.value);
	watch(
		() => formModelRef,
		() => {
			showForm.value = true;
		},
		{
			deep: true
		}
	);

	const formRef = ref();
	const showForm = ref(false);
	const refreshFieldObj = ref({});
	onMounted(() => {
		if (props.control == 'add') init();
	});

	/**
	 * 提交
	 */
	function submit() {
		formRef.value
			.validate()
			.then((res) => {
				console.log('success', res);
				uni.showToast({
					title: `校验通过`
				});
			})
			.catch((err) => {
				console.log('err', err);
			});
	}
	/**
	 * 重置
	 */
	async function reset() {
		formRef.value.clearValidate();
		Object.keys(formModelRef.value).forEach((key) => {
			//没有绑定字段的组件不处理
			if (!key) return;
			//所有值清空
			if (Array.isArray(formModelRef.value[key])) {
				if (key.includes(',')) {
					let arr = key.split(',');
					formModelRef.value[key] = [cacheFirstLoader.value[arr[0]], cacheFirstLoader.value[arr[1]]];
				} else {
					if (cacheFirstLoader.value[key]?.length > 0) {
						if (formModelRef.value[key].length < cacheFirstLoader.value[key].length) {
							formModelRef.value[key] = [];
							cacheFirstLoader.value[key].forEach((item, i) => {
								let obj = {};
								Object.keys(item).forEach((k) => {
									if (!k) return;
									if (k.includes(',')) {
										let arr = k.split(',');
										obj[k] = [item[arr[0]], item[arr[1]]];
									} else {
										obj[k] = item[k];
									}
								});
								formModelRef.value[key].push(obj);
							});
						} else {
							formModelRef.value[key].forEach((item, i) => {
								if (i < cacheFirstLoader.value[key].length) {
									Object.keys(item).forEach((k) => {
										if (!k) return;
										if (k.includes(',')) {
											let arr = k.split(',');
											formModelRef.value[key][i][k] = [cacheFirstLoader.value[key][i][arr[0]], cacheFirstLoader.value[key][i][arr[1]]];
										} else {
											formModelRef.value[key][i][k] = cacheFirstLoader.value[key][i][k];
										}
									});
								} else {
									formModelRef.value[key].splice(i, 1);
								}
							});
						}
					} else {
						formModelRef.value[key] = [];
					}
				}
			} else {
				formModelRef.value[key] = cacheFirstLoader.value[key];
			}
		});
	}

	/**
	 * 全局禁用
	 */
	function disabled() {
		disabledRef.value = !disabledRef.value;
	}

	/**
	 * 初始化
	 */
	function init() {
		//加载完成 使用formModel 方式设置默认值  为了方便  关联组件
		for (const schema of getSchemas.value) {
			// 如果是属于布局组件
			if (layoutComponents.includes(schema.component)) {
				for (const childSchema of schema.layout) {
					eachSchemas(childSchema.children);
				}
			} else {
				setDefaultValue(schema);
			}
		}
		cacheFirstLoader.value = cloneDeep(formModelRef.value);
	}

	//递归 遍历
	function eachSchemas(schemas) {
		//加载完成 使用formModel 方式设置默认值  为了方便  关联组件
		for (const schema of schemas) {
			// 如果是属于布局组件
			if (layoutComponents.includes(schema.component)) {
				for (const childSchema of schema.layout) {
					eachSchemas(childSchema.children);
				}
			} else {
				setDefaultValue(schema);
			}
		}
	}

	function setDefaultValue(schema) {
		if (schema.component == 'TableLayout') {
			for (const childSchema of schema.layout) {
				for (const childItem of childSchema.children) {
					setDefaultValue(childItem, childItem.field, 0);
				}
			}
			return;
		}
		if (!schema.field) return;
		//如果外部传入了值  不再使用默认值覆盖

		//如果是时间区间
		if (schema.component.includes('Range')) {
			if (cacheFirstLoader.value[schema.startTimeField] && cacheFirstLoader.value[schema.endTimeField]) {
				// 赋默认值
				cacheFirstLoader.value[schema.startTimeField + ',' + schema.endTimeField] = formModelRef.value[schema.startTimeField + ',' + schema.endTimeField] = [
					cacheFirstLoader.value[schema.startTimeField],
					cacheFirstLoader.value[schema.endTimeField]
				];
				formModelRef.value[schema.startTimeField] = cacheFirstLoader.value[schema.startTimeField];
				formModelRef.value[schema.endTimeField] = cacheFirstLoader.value[schema.endTimeField];
				return;
			} else if (schema.startTimeField && schema.endTimeField) {
				formModelRef.value[schema.startTimeField + ',' + schema.endTimeField] = [];
				formModelRef.value[schema.startTimeField] = null;
				formModelRef.value[schema.endTimeField] = null;
				return;
			}
		} else if (schema.component.includes('Range') && schema.startTimeField && schema.endTimeField) {
			formModelRef.value[schema.startTimeField + ',' + schema.endTimeField] = [];
			formModelRef.value[schema.startTimeField] = null;
			formModelRef.value[schema.endTimeField] = null;
			return;
		}

		//if (isDefault) {
		//如果是范围组件  默认使用异步 赋值
		//如果直接赋值。。组件不显示值  具体问题没找到

		if (schema.component == 'SingleForm') {
			formModelRef.value[schema.field] = cacheFirstLoader.value[schema.field] || [{}];
			for (const childSchema of schema.columns) {
				setSubFormDefaultValue(childSchema, schema.field, 0);
			}

			return;
		}
		if (schema.component == 'SubForm') {
			formModelRef.value[schema.field] = cacheFirstLoader.value[schema.field] || [];
			if (cacheFirstLoader.value[schema.field]?.length > 0) {
				cacheFirstLoader.value[schema.field].forEach((o, i) => {
					for (const childSchema of schema.columns) {
						setSubFormDefaultValue(childSchema, schema.field, i);
					}
				});
			} else if (schema.preloadType && !schema.useSelectButton) {
				if (schema.preloadType == 'dic') {
					getDicDetailList({
						itemId: schema.itemId
					}).then((res) => {
						if (res.success) {
							setSubPreloadData(res.data, schema.columns, schema.field);
						}
					});
				} else if (schema.preloadType == 'api') {
					if (schema.apiConfig?.path) {
						changeApiOptions(schema.apiConfig).then((res) => {
							if (res.data) {
								setSubPreloadData(res.data, schema.columns, schema.field);
							}
						});
					}
				}
			}
			return;
		}

		if (schema.component == 'formView') {
			formModelRef.value[schema.field] = cacheFirstLoader.value[schema.field] || [];
			// 暂时不做处理
			return;
		}
		//赋默认值

		if (schema.component == 'DateTime') {
			formModelRef.value[schema.field] = cacheFirstLoader.value[schema.field] || schema.defaultValue;
		} else {
			if (cacheFirstLoader.value[schema.field] || cacheFirstLoader.value[schema.field] === 0) {
				formModelRef.value[schema.field] = cacheFirstLoader.value[schema.field];
			} else {
				formModelRef.value[schema.field] = schema.defaultValue;
			}
		}
	}
	function setSubPreloadData(data, columns, field) {
		if (Array.isArray(data)) {
			data.forEach((o, i) => {
				let rowData = {
					$_index: getUuid()
				};
				for (const childSchema of columns) {
					rowData[childSchema.field] = setSubPreloadDataItem(childSchema, o);
				}
				formModelRef.value[field].push(rowData);
			});
		}
	}

	function setSubPreloadDataItem(schema, data) {
		if (!schema.field) return;
		if (schema.prestrainField && data[schema.prestrainField]) {
			return data[schema.prestrainField];
		} else {
			return schema.defaultValue;
		}
	}
	//递归 遍历
	function eachSubSchemas(schemas, field, idx) {
		//加载完成 使用formModel 方式设置默认值  为了方便  关联组件
		for (const schema of schemas) {
			// 如果是属于布局组件
			if (layoutComponents.includes(schema.component)) {
				for (const childSchema of schema.layout) {
					eachSchemas(childSchema.children, field, idx);
				}
			} else {
				setSubFormDefaultValue(schema, field, idx);
			}
		}
	}
	function setSubFormDefaultValue(schema, field, idx) {
		if (!schema.field) {
			if (layoutComponents.includes(schema.component)) {
				for (const childSchema of schema.layout) {
					eachSubSchemas(childSchema.children, field, idx);
				}
			}
			return;
		}

		formModelRef.value[field][idx]['$_index'] = getUuid();
		if (schema.component.includes('Range') && cacheFirstLoader.value[field] && cacheFirstLoader.value[field][idx]) {
			if (cacheFirstLoader.value[field][idx][schema.startTimeField] && cacheFirstLoader.value[field][idx][schema.endTimeField]) {
				//setTimeout(() => {
				// 赋默认值
				cacheFirstLoader.value[field][idx][schema.startTimeField + ',' + schema.endTimeField] = formModelRef.value[field][idx][
					schema.startTimeField + ',' + schema.endTimeField
				] = [cacheFirstLoader.value[field][idx][schema.startTimeField], cacheFirstLoader.value[field][idx][schema.endTimeField]];
				//}, 20);
				return;
			} else if (schema.startTimeField && schema.endTimeField) {
				formModelRef.value[field][idx][schema.startTimeField + ',' + schema.endTimeField] = [];
				return;
			}
		} else if (schema.component.includes('Range') && schema.startTimeField && schema.endTimeField) {
			formModelRef.value[field][idx][schema.startTimeField + ',' + schema.endTimeField] = [];
			return;
		}
		//赋默认值

		if (cacheFirstLoader.value[field] && cacheFirstLoader.value[field][idx]) {
			if (cacheFirstLoader.value[field][idx][schema.field] || cacheFirstLoader.value[field][idx][schema.field] === 0) {
				formModelRef.value[field][idx][schema.field] = cacheFirstLoader.value[field][idx][schema.field];
			} else {
				formModelRef.value[field][idx][schema.field] = schema.defaultValue;
			}
		} else {
			formModelRef.value[field][idx][schema.field] = schema.defaultValue;
		}
	}
	/**
	 * 更新props
	 * @param {Object} options
	 */
	async function setProps(options) {
		formPropsRef.value = deepMerge(unref(formPropsRef) || {}, options);
		schemaRef.value = formPropsRef.value.schemas;
	}
	/**
	 * 更新schema
	 * @param {Object} data
	 */
	async function updateSchema(data) {
		let updateData = [];
		if (isObject(data)) {
			updateData.push(data);
		}
		if (isArray(data)) {
			updateData = [...data];
		}
		const schema = [];

		updateData.forEach((item) => {
			unref(getSchemas).forEach((val) => {
				if (val.key && item.key && val.key === item.key) {
					const newSchema = deepMerge(val, item);
					schema.push(newSchema);
				} else if (val.field === item.field) {
					const newSchema = deepMerge(val, item);
					schema.push(newSchema);
				} else {
					schema.push(val);
				}
			});
		});

		schemaRef.value = uniqBy(schema, 'field');
	}
	/**
	 * 重置schema
	 * @param {Object} data
	 */
	async function resetSchema(data) {
		let updateData = [];
		if (isObject(data)) {
			updateData.push(data);
		}
		if (isArray(data)) {
			updateData = [...data];
		}

		schemaRef.value = updateData;
	}

	//移除schema
	async function removeSchemaByFiled(fields) {
		const schemaList = cloneDeep(unref(getSchemas));
		if (!fields) {
			return;
		}

		let fieldList = isString(fields) ? [fields] : fields;
		if (isString(fields)) {
			fieldList = [fields];
		}
		for (const field of fieldList) {
			if (isString(field)) {
				const index = schemaList.findIndex((schema) => schema.field === field);
				if (index !== -1) {
					delete formModelRef.value[field];
					schemaList.splice(index, 1);
				}
			}
		}
		schemaRef.value = schemaList;
	}

	//追加schema
	async function appendSchemaByField(schema, prefixField, first) {
		const schemaList = cloneDeep(unref(getSchemas));

		const index = schemaList.findIndex((schema) => schema.field === prefixField);
		if (!prefixField || index === -1 || first) {
			first ? schemaList.unshift(schema) : schemaList.push(schema);
			schemaRef.value = schemaList;
			return;
		}
		if (index !== -1) {
			schemaList.splice(index + 1, 0, schema);
		}

		schemaRef.value = schemaList;
	}

	// 表单验证
	async function validate() {
		return await formRef.value.validate();
	}

	// 部分表单进行校验，接受一个参数，类型为 String 或 Array ，只校验传入 name 表单域的值
	async function validateField(nameList) {
		formRef.value.validateField(nameList);
	}

	//移除表单校验，接受一个参数，类型为 String 或 Array ，只移除传入 name 表单域的值，如果不传入参数，则移除所有
	async function clearValidate(nameList) {
		formRef.value.clearValidate(nameList);
	}

	//设置formData
	async function setFormData(formData) {
		//缓存一份所设置的formData 用于重置
		cacheFirstLoader.value = cloneDeep(formData);
		formModelRef.value=cloneDeep(formData);
		init();
	}

	//获取formData
	async function getFormData() {
		return formModelRef.value;
	}

	const httpRequest = async (request ) => {
		if (request.requestType.toLowerCase() === 'get') {
			return http[request.requestType]( request.requestUrl, {params:request.params});
		} else {
			return http[request.requestType]( request.requestUrl, request.params);
		}
	};
	const changeStyle = (schema, style, field) => {
		if (field) {
			const changeSchema = unref(getSchemas).filter((item) => {
				return item.field === field;
			});
			schema = changeSchema[0];
		}
		schema.componentProps.style = { ...schema.componentProps.style, ...style };
	};
	const showModal = async (modal ) => {
		uni.showModal({
			title: modal.title,
			content: modal.content,
			success: function (res) {
				if (res.confirm) {
					modal.onOk()
				} else if (res.cancel) {
					modal.onCancel()
				}
			}
		});
	};
	const regTest = async (regular ) => {
		const regExpression = regular.regExpression;
		const testRes = regExpression.test(regular.testValue);
		uni.showToast({
				title:testRes ? regular.successMessage:  regular.errorMessage ,
				icon:testRes ?'success': 'error',
				duration: 2000
			}) ;
	};
		const refreshAPI = (field ) => {
			if (!field) return;
			if (!Object.keys(unref(refreshFieldObj)).includes(field)) {
				unref(refreshFieldObj)[field] = 0;
			}
			unref(refreshFieldObj)[field]++;
		};

		//执行表单事件
		function executeFormEvent(formEventConfig,isCustomForm) {
			if (!formEventConfig.length) return;
			formEventConfig.map((x) => {
				x.nodeInfo?.processEvent?.map(async (config) => {
					if (config.operateType === 'api') {
						let operateConfig=setApiConfig(config.operateConfig)
						await changeApiOptions(operateConfig, formModelRef.value,isCustomForm);
					} else if (config.operateType === 'liteflow') {
						await postExecute(config.operateConfig, formModelRef.value);
					} else if (config.operateType === 'js') {
						const event = new Function('schema', 'formModel', 'formActionType', config.operateConfig);
						console.log(formModelRef.value,'formModelRef.value')
						event(schemaRef.value, formModelRef.value, formActionType);
					}
				});
			});
		}
		const formActionType = {
			setProps,
			updateSchema,
			removeSchemaByFiled,
			appendSchemaByField,
			resetSchema,
			reset,
			validate,
			validateField,
			clearValidate,
			setFormData,
			getFormData,
			formModelRef,
			init,
			httpRequest,
			changeStyle,
			showModal,
			regTest,
			refreshAPI,
			executeFormEvent
		};

		//将表单方法  导出 给父组件使用。
		expose(formActionType);
		return {
            getProps,
            getSchemas,
            getIfShow,
            getIsShow,
            refreshFieldObj,
            submit,
            formRef,
            formModelRef,
			formActionType,
			formPropsRef,
			showForm
        };
	}
}

</script>
<style lang="scss">
.example {
	// padding:15px 15px 82px;
	background-color: #fff;
	padding-bottom: 40rpx;
}

.segmented-control {
	margin-bottom: 15px;
}

.button-group {
	margin-top: 15px;
	display: flex;
	justify-content: space-around;
}

.form-item {
	display: flex;
	align-items: center;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 35px;
}
::v-deep .textarea-box {
	.uni-forms-item {
		padding: 0;
	}
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	margin-bottom: 10rpx;
}
::v-deep .textarea-box {
	.uni-forms-item {
		padding: 0;
	}
}
</style>
