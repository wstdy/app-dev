import {
	componentType
} from '@/components/simple-form/types/form.js';
import {getObjType} from '@/utils/helper/utils';
/**
 * 将web端设计json 转换为 手机端所需要form
 */
export function buildAppFormProps(json) {
	const {
		list,
		config
	} = json;

	const formSchema = buildAppFormScheme(list);
	const formProp = {
		validateTrigger: 'submit',
		labelPosition: config.layout === 'vertical' || config.layout === 'inline' ? 'top' : 'left',
		labelWidth: 75,
		labelAlign: config.labelAlign ? 'center' : config.labelAlign,
		errShowType: 'undertext',
		border: false,
		schemas: formSchema,
		rules: [],
	};

	return formProp;
}

export function buildAppFormScheme(
	list
) {
	let schemas = [];
	for (const item of list) {
		if (item.type === 'divider') {
			const dividerSchema = {
				key: item.key,
				field: item.bindField,
				name: item.label,
				component: componentType.divider,
				componentProps: {
					text: item.options.defaultValue,
					align: item.options.orientation,
					isShow:item.options?.isShow
				},
			};
			schemas.push(dividerSchema);

			continue;
		}

		//如果是表格布局组件组件 手机端没有  必须要扁平化
		if (item.type === 'table-layout') {
			let tableLayoutChildren = [];
			item.layout?.forEach(el1 => {
				el1.list?.forEach(el2 => {
					el2.children?.forEach(el3 => {
						tableLayoutChildren.push(buildAppSchema(el3));
					});
				});
			});

			const cardChildrenSchema = {
				key: item.key,
				name: item.options.title||item.label,
				component: componentType.tableLayout,
				componentProps: {
					isShow: item.options?.isShow||false,
				},
				layout: [
					{
						key: item.key,
						name: item.options.title||item.label,
						component: componentType.tableLayout,
						children: tableLayoutChildren,
					}
				],
				componentProps:{
					isShow:item.options?.isShow
				},
			};
			schemas.push(cardChildrenSchema);
			continue;
		}
		//如果是栅格布局组件 手机端没有  必须要扁平化
		if (item.type === 'grid') {
			item.layout?.map((el) => {
				schemas = schemas.concat(buildAppFormScheme(el.list));
			});
			continue;
		}
		//如果是tab组件 转换为手机端配置
		if (item.type === 'tab') {
			const tabSchema = {
				key: item.key,
				name: item.label,
				component: componentType.segmented,
				layout: [],
				componentProps:{
					isShow:item.options?.isShow
				},
			};

			item.layout?.map((el, index) => {
				const child = {
					name: el.name,
					value: index,
					children: [],
				};
				child.children = buildAppFormScheme(el.list);
				tabSchema.layout?.push(child);
			});
			schemas.push(tabSchema);
			continue;
		}

		//如果是tab组件 转换为手机端配置
		if (item.type === 'card') {
			const cardSchema = {
				key: item.key,
				name: item.options.title||item.label,
				component: componentType.collapse,
				layout: [],
				componentProps:{
					isShow:item.options?.isShow
				},
			};

			item.layout?.map((el, index) => {
				const child = {
					name: el.name,
					value: index,
					children: [],
				};
				child.children = buildAppFormScheme(el.list);
				cardSchema.layout?.push(child);
			});
			schemas.push(cardSchema);
			continue;
		}

		//如果是子表单组件
		if (item.type === 'form' || item.type === 'one-for-one') {
			let formSchema = {
				field: item.bindTable + 'List', //字段
				key: item.key,
				name: item.label,
				component: item.type === 'form' ? componentType.subForm : componentType.singleForm,
				columns: [],
				componentProps:{
					isShow:item.options?.isShow
				},
			};
			if(item.options?.useSelectButton!==undefined){
				formSchema.useSelectButton=item.options.useSelectButton
				formSchema.buttonName=item.options.buttonName
			}
			if(item.options?.preloadType){
				formSchema.preloadType=item.options.preloadType;
				if(formSchema.preloadType=='dic'){
					if(item.options.itemId) formSchema.itemId=item.options.itemId;
					if(item.options.dicOptions){
						formSchema.associateOptions = item.options.dicOptions;
					}
				}else if(formSchema.preloadType=='api'){
					if(item.options.apiConfig?.path) formSchema.apiConfig=setApiConfig(item.options.apiConfig)
					if (item.options.apiConfig?.outputParams) {
						formSchema.associateOptions = item.options.apiConfig.outputParams;
					}
				}
			}

			formSchema.columns = buildAppFormScheme(item.children);
			schemas.push(formSchema);
			continue;
		}
		//如果是子表单组件
		if (item.type === 'form-view') {
			let formSchema = {
				field: '', //字段
				key: item.key,
				name: item.label,
				component: componentType.formView,
				columns: [],
				componentProps:{
					isShow:item.options?.isShow
				},
			};
			schemas.push(formSchema);
			continue;
		}
		//如果是子表单组件
		if (item.type === 'iframe') {
			let formSchema = {
				field: '', //字段
				label:item.label,
				key: item.key,
				name: item.label,
				component: componentType.iframe,
				url: item.options.url,
				componentProps:{
					isShow:item.options?.isShow
				},
			};
			schemas.push(formSchema);
			continue;
		}
		schemas.push(buildAppSchema(item));

	}

	return schemas;
}

export function buildAppSchema(model) {
	const compType = buildAppComponentType(model.type);

	const params = {};
	let field = '';
	if (model.type == 'date-range' || model.type == 'time-range') {
		const start = model.bindStartTime;
		const end = model.bindEndTime;
		params.startTimeField = start;
		params.endTimeField = end;
		field = start + ',' + end;
	}
	if(model.options?.prestrainField){
		params.prestrainField=model.options.prestrainField
	}
	let rules = [];
	if (model.options?.required) {
		rules.push({
			'required': model.options.required,
			errorMessage: model.label + '项必填'
		})
	}
	if (model.options?.rules && Array.isArray(model.options.rules)) {
		model.options.rules.forEach(o => {
			rules.push({
				pattern: o.pattern,
				errorMessage: o.message
			})
		})
	}

	const schema = {
		key: model.key,
		field: field ?
			field : model.bindField,
		label:model.options?.showLabel? model.label:'',
		component: compType,
		defaultValue: model.type == 'hiddenComponent'
        ? model.value
        : model.type == 'number'
        ? model.options?.defaultValue > 0
          ? model.options?.defaultValue
          : 0
        : model.type == 'upload'
        ? Array.isArray(model.options?.defaultValue)
          ? ''
          : model.options?.defaultValue
        : model.options?.defaultValue || model.options?.defaultSelect,
		componentProps: buildAppComponentProps(model.type, model.options, model.key, model.bindTable),
		name: model.label,
		required: model.options?.required,
		rules: rules,
		ifShow: false,
		dynamicDisabled: model.options?.disabled,
		events:model.options?.events,
		...params,
	};
	return schema;
}

export function buildAppComponentType(type) {
	switch (type) {
		case 'input':
			return componentType.input;

		case 'password':
			return componentType.input;

		case 'textarea':
			return componentType.input;

		case 'number':
			return componentType.inputNumber;

		case 'radio':
			return componentType.radio;

		case 'checkbox':
			return componentType.checkbox;

		case 'select':
			return componentType.select;

		case 'area':
		case 'cascader':
			return componentType.cascader;

		case 'time':
			return componentType.timeRange;

		case 'date':
			return componentType.dateTime;

		case 'time-range':
			return componentType.timeRange;

		case 'date-range':
			return componentType.dateTimeRange;
		case 'rate':
			return componentType.rate;

		case 'switch':
			return componentType.switch;

		case 'slider':
			return componentType.slider;

		case 'divider':
			return componentType.divider;

		case 'upload':
			return componentType.upload;

		case 'richtext-editor':
			return componentType.editor;

		case 'form':
			return componentType.subForm;

		case 'one-for-one':
			return componentType.subForm;
		case 'auto-code':
			return componentType.autoCode;
		case 'image':
		  return componentType.image;
		case 'picker-color':
			return componentType.color;
		case 'qrcode':
			return componentType.qrcode;
		case 'title':
			return componentType.title;
		case 'map':
			return componentType.map;
		case 'organization':
			return componentType.organization;

		case 'user':
			return componentType.user;

		case 'computational':
			return componentType.computation;

		case 'money-chinese':
			return componentType.moneyChinese;
		case 'associate-select':
			return componentType.associatePicker;

		case 'associate-popup':
			return componentType.associatePopup;

		case 'multiple-popup':
			return componentType.multiplePopup;

		case 'info':
			return componentType.info;

		case 'opinion':
			return componentType.Opinion;
		case 'button':
		  return componentType.button;
		case 'text':
		  return componentType.text;
		default:
			return componentType.input;
	}
}

export function buildAppComponentProps(type, options, key, bindTable) {
	const params = {isShow: options.isShow};
	switch (type) {
		case 'input':
			return {
				placeholder: options.placeholder,
					prefixIcon: options.prefix,
					suffixIcon: options.suffix,
					addonBefore: options.addonBefore,
					addonAfter: options.addonAfter,
					clearable: options.allowClear,
					maxlength: options.maxlength || -1,
					scan:options.scan,
					...params,
			};

		case 'password':
			return {
				type: 'password',
					placeholder: options.placeholder,
					prefixIcon: options.prefix,
					addonBefore: options.addonBefore,
					addonAfter: options.addonAfter,
					clearable: options.allowClear,
					maxlength: options.maxlength || -1,
					...params,
			};

		case 'textarea':
			return {
				type: 'textarea',
					placeholder: options.placeholder,
					maxlength: options.maxlength || -1,
					showCount: options.showCount,
					autoHeight: options.autoSize,
					clearable: options.allowClear,
					...params,
			};
		case 'number':
			return {
				min: options.min,
					placeholder: options.placeholder,
					max: options.max,
					step: options.step,
					maxlength: options.maxlength || -1,
					...params,
			};
		case 'auto-code':
			return {
				autoCodeRule: options.autoCodeRule,
					placeholder: options.placeholder,
					prefixIcon: options.prefix,
					suffixIcon: options.suffix,
					addonBefore: options.addonBefore,
					addonAfter: options.addonAfter,
					...params,
			};
		case 'radio':
		case 'checkbox':
		case 'select':
		case 'associate-select':
		case 'multiple-popup':
		case 'associate-popup':
			const remoteComponents = ['associate-select', 'multiple-popup', 'associate-popup'];
			if (options.datasourceType == 'staticData') {
				params.localdata = options.staticOptions;
				params.map = {
					text: options.labelField,
					value: options.valueField,
				};
			} else if (options.datasourceType == 'dic') {
				params.itemId = options.itemId;
				params.map = {
					text: options.labelField,
					value: options.valueField,
				};
				if (remoteComponents.includes(type)) {
					params.associateOptions = [...options.dicOptions];
				}
			} else if (options.datasourceType == 'api') {
				params.apiConfig = setApiConfig(options.apiConfig);
				params.map = {
					text: options.labelField,
					value: options.valueField,
				};
				if (remoteComponents.includes(type) && options.apiConfig?.outputParams) {
					params.associateOptions = [...options.apiConfig.outputParams];
				}
			}
			if (type == 'checkbox') {
				params.multiple = true;
			}
			if (type == 'radio') {
				params.mode = options.optionType;
			}
			return {
				placeholder: options.placeholder,
					...params,
			};

		case 'area':
		case 'cascader':
			if (type == 'area') {
				params.showFormat = 'all';
				params.split = '/';
				params.selectedConfig = 'any';
				params.type = 'area';
			} else {
				params.apiConfig = setApiConfig(options.apiConfig);
				params.showFormat = options.showFormat;
				params.split = options.separator;
				params.selectedConfig = options.selectedConfig;
			}
			return {
				placeholder: options.placeholder,
					clearIcon: options.allowClear,
					...params,
			};
		case 'slider':
			return {
				step: options.step,
					min: options.min,
					max: options.max,
					...params,
			};
		case 'switch':
			return {
				checkedText: options.checkedChildren,
					unCheckedText: options.unCheckedChildren,
					checkedColor: options.checkedColor,
					unCheckedColor: options.unCheckedColor,
					...params,
			};
		case 'date':
			return {
				clearIcon:options.allowClear,
				placeholder: options.placeholder,
					type:
					options.format == 'YYYY-MM-DD HH:mm:ss' ?
					'datetime' :
					options.format == 'YYYY-MM-DD' ?
					'date' :
					'date',
					formatType: options.format == 'YYYY-MM' ? 'month' : options.format == 'YYYY' ? 'year' :
					options.format == 'YYYY-MM-DD HH:mm:ss' ? 'datetime' : 'date',
					...params,
			};
		case 'date-range':
			return {
				type: 'daterange',
					startPlaceholder: options.startTimePlaceholder,
					endPlaceholder: options.endTimePlaceholder,
					...params,
			};
		case 'time':
			return {
				placeholder: options.placeholder,
					clearable: options.allowClear,
					...params,
			};
		case 'time-range':
			return {
				startPlaceholder: options.startTimePlaceholder,
					endPlaceholder: options.endTimePlaceholder,
					isRange: true,
					clearable: options.allowClear,
					...params,
			};
		case 'rate':
			return {
				max: options.count,
					allowHalf: options.allowHalf,
					...params,
			};
		case 'qrcode':
			if (options.codeType == 'api') {
				params.apiConfig = setApiConfig(options.apiConfig);
			} else {
				params.text = options.defaultValue;
			}
			return {
				codeType: options.codeType,
					codekey: key,
					...params,
			};
		case 'title':
			return {
				color: options.color,
					fontSize: options.fontSize,
					align: options.align,
					title: options.defaultValue,
					...params,
			};
		case 'map':
			return {
				address: options.address,
					prefixIcon: options.prefix,
					suffixIcon: options.suffix,
					latiAndLong: options.latiAndLong,
					placeholder: options.placeholder,
					bindTable: bindTable + 'List',
					...params,
			};
		case 'upload':
			return {
				showType: options.listType,
					fileExtname: options.accept ? options.accept.split(',') : [],
					limit: options.maxNumber,
					multiple: options.multiple,
					maxSize: options.maxSize,
					...params,
			};
		case 'image':
			return {
				showType: 'image',
					fileExtname: ['.png','.jpg','.bmp','.jpeg','.gif','.svg'],
					limit: 1,
					multiple: false,
					maxSize: 10,
					isUpload:options.isUpload,
					...params,
			};

		case 'organization':
			return {
				placeholder: options.placeholder,
				...params,
			};

		case 'user':
			return {
				placeholder: options.placeholder,
					prefixIcon: options.prefix,
					suffixIcon: options.suffix,
					...params,
			};

		case 'computational':
			return {
				placeholder: options.placeholder,
					prefixIcon: options.prefix,
					addonBefore: options.addonBefore,
					addonAfter: options.addonAfter,
					computationalConfig: options.computationalConfig,
					...params,
			};

		case 'money-chinese':
			return {
				placeholder: options.placeholder,
					prefixIcon: options.prefix,
					suffixIcon: options.suffix,
					addonBefore: options.addonBefore,
					addonAfter: options.addonAfter,
					computationalConfig: options.computationalConfig,
					...params,
			};
		case 'info':
			return {
				infoType: options.infoType,
					loadAgain: options.loadAgain,
					...params,
			};
		case 'button':
			if (options.buttonType === 2) {
				params.tableColumns = options.tableColumns;
			}
			if (options.buttonType === 1 || options.buttonType === 2) {
				params.buttonType = options.buttonType;
				if (options.datasourceType == 'dic') {
					params.itemId = options.itemId;
					params.map = {
						text: options.labelField,
						value: options.valueField,
					};
					params.associateOptions = [...options.dicOptions];
				} else if (options.datasourceType == 'api') {
					params.apiConfig = setApiConfig(options.apiConfig);
					params.map = {
						text: options.labelField,
						value: options.valueField,
					};
					if (options.apiConfig?.outputParams) {
						params.associateOptions = [...options.apiConfig.outputParams];
					}
				}
			}
			return {
				width: options.buttonWidth,
				height: options.buttonHeight,
				prefixIcon: options.prefix,
				suffixIcon: options.suffix,
				name:options.name,
				...params,
			};
		case 'text':
			return {
				fontFamily: options.fontFamily,
				fontSize: options.fontSize + 'px',
				fontWeight: options.fontWeight,
				color: options.color,
				fontStyle: options.fontStyle,
				align: options.align,
				...params,
			};
		default:
			return {	...params};
	}
}

export function setApiConfig(config) {
	const data = {};
	data.method = config.method;
	data.path = config.path;
	data.requestParamsConfigs = [];
	data.requestHeaderConfigs = [];
	data.requestBodyConfigs = [];

	if (config.apiParams) {
		config.apiParams.forEach((o) => {
			if (o.key == 1 && o.tableInfo?.length) {
				o.tableInfo.forEach((element) => {
					data.requestParamsConfigs.push({
						name: element.name, //API入参名称
						dataType: element.dataType, //API入参类型
						assignmentType: element.bindType, //赋值类型
						value: element.value, //值
						config: '', //赋值配置
					});
				});
			} else if (o.key == 2 && o.tableInfo?.length) {
				o.tableInfo.forEach((element) => {
					data.requestHeaderConfigs.push({
						name: element.name, //API入参名称
						dataType: element.dataType, //API入参类型
						assignmentType: element.bindType, //赋值类型
						value: element.value, //值
						config: '', //赋值配置
					});
				});
			} else if (o.key == 3 && o.tableInfo?.length) {
				o.tableInfo.forEach((element) => {
					data.requestBodyConfigs.push({
						name: element.name, //API入参名称
						dataType: element.dataType, //API入参类型
						assignmentType: element.bindType, //赋值类型
						value: element.value, //值
						config: '', //赋值配置
					});
				});
			}
		});
	}

	return data;
}

export function getColumnConfigs(columnConfigs) {
	return columnConfigs.map((item) => {
		return {
			title: item.label,
			mainField: item.mainField,
			showLabel: item.showLabel,
			componentType: buildAppComponentType(item.componentType),
			field: item.columnName,
		};
	})
}

export function getSearchConfigs(queryConfigs, formProps, list) {
	return queryConfigs.map((item) => {
		const schema = findSchema(formProps.schemas, item.fieldName);
		try {
			const [isNeedTrans, option] = whetherNeedToTransform(item, list);
			return handleAppSearchForm(option, schema, item, isNeedTrans);
		} catch (error) {

		}
	})
}

export function getCategoryConfigs(leftMenuConfig) {
	const {
		datasourceType,
		listFieldName,
		childIcon,
		parentIcon,
		menuName
	} = leftMenuConfig;
	let categoryConfigs = {
		datasourceType: datasourceType,
		listFieldName: listFieldName,
		childIcon: childIcon,
		parentIcon: parentIcon,
		menuName: menuName,
	};
	if (datasourceType == 'dic') {
		categoryConfigs.dictionaryItemId = leftMenuConfig.dictionaryItemId;
	} else if (datasourceType == 'static') {
		categoryConfigs.staticData = leftMenuConfig.staticData;
	} else if (datasourceType == 'api') {
		categoryConfigs.apiConfig = setApiConfig(leftMenuConfig.apiConfig);
	}
	return categoryConfigs
}
export function findSchema(schemaArr, fieldName) {
	let schema;
	const formListComponent = ['Tab','Segmented','Collapse'];
	schemaArr?.some((info) => {
		if (formListComponent.includes(info.component)) {
			const hasComponent = info.layout.some((childInfo) => {
				schema = childInfo.children.find((com) => com.field === fieldName);
				if (!!schema) return true;
				schema = findSchema(childInfo.children, fieldName);
				return !!schema;
			});
			return !!hasComponent;
		} else {
			schema = info.field === fieldName ? info : null;
			return !!schema;
		}
	});
	return schema;
}
//需要转换为非输入框的组件
const transformComponent = [
	'number',
	'radio',
	'checkbox',
	'select',
	'cascader',
	'associate-select',
	'associate-popup',
	'multiple-popup',
	'area',
	'switch',
	'time',
	'date',
	'slider',
	'rate',
	'computational',
	'money-chinese',
	'info',
	'organization',
	'picker-color',
	'user',
];
export function whetherNeedToTransform(
	queryConfig,
	components
) {
	const layoutComponents = ['tab', 'grid', 'card'];
	let returnTransform;
	components?.some((info) => {
		if (layoutComponents.includes(info.type)) {
			const hasComponent = info?.layout?.some((childInfo) => {
				const layoutChildOption = childInfo.list.find(
					(com) => com.bindField === queryConfig.fieldName,
				);
				if (!!layoutChildOption) {
					returnTransform = transformComponent.includes(layoutChildOption.type) ? [true, layoutChildOption
						.options
					] : [false, undefined];
					return true;
				}
				if (!childInfo.list.length) return false;
				const transformCom = whetherNeedToTransform(queryConfig, childInfo.list);
				if (!!transformCom&&transformCom[0]) {
					returnTransform = transformCom;
					return true;
				}
				return false;
			});
			return hasComponent;
		}else if (info.type === 'table-layout') {
      let hasComponent = false;
      info?.layout?.map((childInfo) => {
        childInfo.list.map((child) => {
          const layoutChildOption = child.children?.find(
            (com) => com.bindField === queryConfig.fieldName,
          );
          if (!!layoutChildOption) {
            returnTransform = transformComponent.includes(layoutChildOption.type)
              ? [true, layoutChildOption.options]
              : [false, undefined];
            hasComponent = true;
          }
          if (!child.children?.length) hasComponent = false;
          const transformCom = whetherNeedToTransform(queryConfig, child.children);
          if (!!transformCom&&transformCom[0]) {
            returnTransform = transformCom;
            hasComponent = true;
          }
          hasComponent = false;
        });
      });
      return hasComponent;
    } else {
			const option = components.find((item) => item?.bindField === queryConfig.fieldName);
			if (!!option) {
				returnTransform = transformComponent.includes(option.type) ? [true, option?.options] : [false, undefined];
			}
			return !!option;
		}
	});
	return returnTransform;
}

export const handleAppSearchForm = (option, schema, item, isNeedTrans, convertCamel = true) => {
	if (!schema) return;
	const fieldName = item.fieldName;
	let params = {
		key: schema.key,
		name: schema.label,
		label: schema.label
	}
	if (isNeedTrans) {
		if (schema.component == 'TimeRange') {
			return {
				...params,
				field: fieldName + 'Start,'+ fieldName + 'End',
				component: componentType.timeRange, //组件类型
				startTimeField: item.fieldName + 'Start',
				endTimeField: item.fieldName + 'End',
				componentProps: {
					startTimePlaceholder: '开始时间',
					endTimePlaceholder: '结束时间',
					isRange: true,
				}
			};
		} else if (schema.component == 'DateTime') {
			return {
				...params,
				field:fieldName + 'Start,'+ fieldName + 'End',
				component: componentType.dateRange, //组件类型
				startTimeField: item.fieldName + 'Start',
				endTimeField: item.fieldName + 'End',
				componentProps: {
					formatType: option.format == 'YYYY-MM' ? 'month' : option.format == 'YYYY' ? 'year' : option.format ==
						'YYYY-MM-DD HH:mm:ss' ? 'datetime' : 'date',
					type: "datetimerange", //日期时间范围选择器
					startPlaceholder: '开始日期',
					endPlaceholder: '结束日期',
				}
			};
		} else if (schema.component == 'Switch') {
			return {
				...params,
				field: fieldName,
				component: componentType.select, //组件类型
				componentProps: {
					localdata: [{
						text: '开',
						value: 1
					}, {
						text: '关',
						value: 0
					}],
				},
			};
		}else if(schema.component == 'Checkbox'||schema.component == 'Radio'||schema.component=='Select'){
			return {
				...params,
				field: fieldName,
				component: componentType.select, //组件类型
				componentProps: schema.componentProps,
			};
		} else if (schema.component == 'colorPicker') {
			return {
				...params,
				field: fieldName,
				component: componentType.color, //组件类型
				defaultValue: null,
				componentProps: {},
			};
		}else if (schema.component == 'InputNumber') {
			return {
				...params,
				field: fieldName,
				component: componentType.input, //组件类型
				componentProps: {
					type:'number'
				},
			};
		}else if(schema.component =='Info'){
			if(schema.componentProps.infoType===0){
				return {
					...params,
					field: fieldName,
					component: componentType.user, //组件类型
					componentProps: {
						placeholder:"请选择人员"
					},
				};
			}else if(schema.componentProps.infoType===1){
				return {
					...params,
					field: fieldName,
					component: componentType.organization, //组件类型
					componentProps: {
						placeholder:"请选择组织架构",
					},
				};
			}else if(schema.componentProps.infoType===2){
				return {
					...params,
					field:fieldName + 'Start,'+ fieldName + 'End',
					component: componentType.dateRange, //组件类型
					startTimeField: item.fieldName + 'Start',
					endTimeField: item.fieldName + 'End',
					componentProps: {
						formatType:'datetime',
						type: "datetimerange", //日期时间范围选择器
						startPlaceholder: '开始日期',
						endPlaceholder: '结束日期',
					}
				};
			}
		} else {
			return schema;
		}
	} else {
		return {
			...params,
			field: fieldName,
			component: componentType.input, //组件类型
			componentProps: {
				placeholder: '请输入' + schema.label,
			}
		};
	}
};

export function setFormPropsAuth(schemas, auth) {
	if(schemas){
		schemas.forEach((schema) => {
			if (['Collapse','Segmented','TableLayout'].includes(schema.component)) {
				if (schema.layout && schema.layout.length > 0) {
					schema.layout.forEach((ele2) => {
						if (ele2.children && ele2.children.length > 0) {
							setFormPropsAuth(ele2.children, auth);
						}else{
							let isShow=ele2.componentProps.isShow;
							 ele2.ifShow=auth.includes(ele2.field||ele2.key)?isShow:false;
						}
					});
				}
			} else if (schema.component == 'SubForm'|| schema.component == 'SingleForm') {
				try {
					if(schema.field){
						let table=schema.field.split('List')[0];
						let idx=auth.findIndex(o=>{
							let type = getObjType(o);
							if(type === 'object'){
								for(let i in o){
									if(i==table) return true
								}
							}
						})
						if(idx>=0){
							schema.ifShow=schema.componentProps.isShow
							setFormPropsAuth(schema.columns, auth[idx][table])
						}else{
							schema.ifShow=false
						}
					}
				} catch (error) {

				}
			} else {
				let isShow=schema.componentProps.isShow;
				schema.ifShow=auth.includes(schema.field||schema.key)?isShow:false;
			}
		});
	}
}
