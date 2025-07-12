import {
	getDemoList,deleteDemo
} from '@/common/api/demo/demo1/index.js';
import {
	componentType,
	datasourceTypeEnum
} from '@/components/simple-form/types/form.js'



export const listProps = {
	rowKey:'id',
	//列表请求接口
	api: getDemoList,
	// 请求之前处理参数 (params) => {}
	beforeFetch: (params) => {
		return params
	},
	// 自定义处理接口返回参数
	afterFetch: (data) => {
		return data
	},
	//数据源  静态
	datasource: [],
	//列配置
	columnConfigs: [{
			title: '名称',
			field: 'name'
		},
		{
			title: '编码',
			field: 'code'
		}
	],
	//是否启用搜索
	isSearch: true,
	//是否分页
	isPage: true,
	//搜索配置
	searchConfigs: [{
		key: '1', //唯一标识  用于处理某些无字段组件
		name: '姓名', //表单域的属性名，在使用校验规则时必填
		field: 'name',
		label: '姓名', //输入框左边的文字提示
		component: componentType.input, //组件类型
		labelWidth: 70, //label 宽度，单位 px  可不填
		labelAlign: '', //label 居中方式  可不填
		componentProps: {
			placeholder: '请输入姓名'
		}, //组件的所有配置信息
	}, {
		key: '2', //唯一标识  用于处理某些无字段组件
		name: '年龄', //表单域的属性名，在使用校验规则时必填
		field: 'age', //字段
		label: '年龄', //输入框左边的文字提示
		component: componentType.inputNumber, //组件类型
		labelWidth: 70, //label 宽度，单位 px
		labelAlign: '', //label 居中方式
		defaultValue: 0,
		componentProps: {}, //组件的所有配置信息
	}],
	//表单页面地址
	formUrl: '/pages/demo/demo1/form',
	//按钮配置
	buttonConfigs: [{
		icon: 'heart',
		text: '查看',
		action: () => {
			uni.navigateTo({
				url: listProps.formUrl + '?type=view',
			});
		}
	}, {
		icon: 'heart',
		text: '编辑',
		action: (record) => {
			uni.navigateTo({
				url: listProps.formUrl + '?type=edit&id=' + record[listProps.rowKey],
			});
		}
	}, {
		icon: 'heart',
		text: '删除',
		action: async (record) => {
			await deleteDemo([record[listProps.rowKey]]);
			//请求删除接口
			uni.showToast({
				title: "删除成功"
			})
		}
	}, ]
}


export const formProps = {
	rules: {}, //校验规则
	validateTrigger: 'submit', //表单校验时机,blur仅在 uni-easyinput 中生效
	labelPosition: 'left', //label 位置 top/left
	labelWidth: 75, //label 宽度，单位 px 75
	labelAlign: 'left', //label 居中方式  left/center/right
	errShowType: 'undertext', //表单错误信息提示方式 undertext/toast/modal
	border: false, //是否显示分格线
	showButton: false, //是否显示表单自带按钮
	schemas: [{
			key: '1', //唯一标识  用于处理某些无字段组件
			name: '姓名', //表单域的属性名，在使用校验规则时必填
			field: 'name',
			label: '姓名', //输入框左边的文字提示
			component: componentType.input, //组件类型
			validateTrigger: 'submit',
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [{
				required: true,
				errorMessage: '姓名必填'
			}], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			defaultValue: '蔡徐坤1111111',
			events: {
				'input': "console.log(\"执行配置input事件\")",
				'clear': "console.log(\"执行配置clear事件\")"
			},
			componentProps: {
				placeholder: '请输入姓名'
			}, //组件的所有配置信息
		}, {
			key: '2', //唯一标识  用于处理某些无字段组件
			name: '年龄', //表单域的属性名，在使用校验规则时必填
			field: 'age', //字段
			label: '年龄', //输入框左边的文字提示
			component: componentType.inputNumber, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [{
				required: true,
				errorMessage: '年龄必填'
			}], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {
				value: 18,
			}, //组件的所有配置信息
		},
		{
			key: '3', //唯一标识  用于处理某些无字段组件
			name: '爱好', //表单域的属性名，在使用校验规则时必填
			field: 'hobbys', //字段
			label: '爱好', //输入框左边的文字提示
			component: componentType.checkbox, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [{
				required: true,
				errorMessage: '爱好必填'
			}], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {
				multiple: true,
				mode: "button",
				localdata: [{
					"value": 0,
					"text": "唱"
				}, {
					"value": 1,
					"text": "跳"
				}, {
					"value": 2,
					"text": "rap"
				}, {
					"value": 3,
					"text": "篮球"
				}]
			}, //组件的所有配置信息
		},
		{
			key: '4', //唯一标识  用于处理某些无字段组件
			name: '性别', //表单域的属性名，在使用校验规则时必填
			field: 'sex', //字段
			label: '性别', //输入框左边的文字提示
			component: componentType.radio, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [{
				required: true,
				errorMessage: '性别必填'
			}], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {
				mode: "button",
				localdata: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '未知',
					value: -1
				}]
			}, //组件的所有配置信息
		},
		{
			key: '5', //唯一标识  用于处理某些无字段组件
			name: '生日', //表单域的属性名，在使用校验规则时必填
			field: 'birthday', //字段
			label: '生日', //输入框左边的文字提示
			component: componentType.date, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {

			}, //组件的所有配置信息
		},
		{
			key: '5-1', //唯一标识  用于处理某些无字段组件
			name: '有效日期', //表单域的属性名，在使用校验规则时必填
			field: 'range', //字段
			label: '有效日期', //输入框左边的文字提示
			component: componentType.dateRange, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			// defaultValue: ['2023-05-15 17:47:51', '2023-05-19 17:47:56'],
			startTimeField: "startTime", //范围选择器特有属性
			endTimeField: "endTime", //范围选择器特有属性
			componentProps: {
				type: "datetimerange", //日期时间范围选择器
				// type: "daterange"  // 日期范围选择器
			}, //组件的所有配置信息
		},
		{
			key: '5-33', //唯一标识  用于处理某些无字段组件
			name: '分割线', //表单域的属性名，在使用校验规则时必填
			component: componentType.divider, //组件类型
			componentProps: {
				text: "分割线", //日期时间范围选择器
				align: "center", //日期时间范围选择器
			}, //组件的所有配置信息
		},
		{
			key: '14', //唯一标识  用于处理某些无字段组件
			name: '职位', //表单域的属性名，在使用校验规则时必填
			field: 'title', //字段
			label: '职位', //输入框左边的文字提示
			component: componentType.select, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {
				datasourceType: datasourceTypeEnum.Dic,
				params: {
					itemId: '1419276800524424444'
				},
				labelField: 'name',
				valueField: 'value'
			}, //组件的所有配置信息
		},
		{
			key: '144', //唯一标识  用于处理某些无字段组件
			name: '联想选择', //表单域的属性名，在使用校验规则时必填
			field: 'associatePick', //字段
			label: '联想选择', //输入框左边的文字提示
			component: componentType.associatePicker, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			componentProps: {
				datasourceType: datasourceTypeEnum.Dic,
				params: {
					itemId: '1419276800524424444'
				},
				labelField: 'name',
				valueField: 'value',
				associateOptions: [{
						"name": "value",
						"bindField": "experience"
					},
					{
						"name": "text",
						"bindField": "school"
					}
				], //联想配置
			}, //组件的所有配置信息
		},
		{
			key: '15', //唯一标识  用于处理某些无字段组件
			name: '自定义接口', //表单域的属性名，在使用校验规则时必填
			field: 'api', //字段
			label: '自定义接口', //输入框左边的文字提示
			component: componentType.picker, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: true, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			defaultValue: '',
			componentProps: {
				placeholder: "请选择111111",
				datasourceType: datasourceTypeEnum.Api,
				"apiConfig": {
					"path": "/test/uni",
					"method": "GET",
					"apiId": "dc403020983d4c46ac338ba7b86f71b1",
					"apiParams": [{
							"key": "1",
							"title": "Query Params",
							"tableInfo": [{
									"name": "name",
									"value": "xx",
									"description": null,
									"required": false,
									"dataType": null,
									"type": null,
									"defaultValue": null,
									"validateType": null,
									"error": null,
									"expression": null,
									"children": null,
									"bindType": "value"
								},
								{
									"name": "age",
									"value": "age",
									"description": null,
									"required": false,
									"dataType": null,
									"type": null,
									"defaultValue": null,
									"validateType": null,
									"error": null,
									"expression": null,
									"children": null,
									"bindType": "value"
								}
							]
						},
						{
							"key": "2",
							"title": "Header",
							"tableInfo": [{
								"name": "headParam",
								"value": "1",
								"description": null,
								"required": false,
								"dataType": null,
								"type": null,
								"defaultValue": "1",
								"validateType": null,
								"error": null,
								"expression": null,
								"children": null,
								"bindType": "value"
							}]
						},
						{
							"key": "3",
							"title": "Body"
						}
					],
					"script": "\r\nreturn [{\r\n    text: '姓名',\r\n    value: name\r\n}, {\r\n    text: '年龄',\r\n    value: age\r\n},{\r\n    text:'header',\r\n    value: header.headParam\r\n}]"
				},
			}, //组件的所有配置信息
		},
		{
			key: '6', //唯一标识  用于处理某些无字段组件
			name: '状态', //表单域的属性名，在使用校验规则时必填
			field: 'enabled', //字段
			label: '状态', //输入框左边的文字提示
			component: componentType.switch, //组件类型
			labelWidth: 70, //label 宽度，单位 px
			labelAlign: '', //label 居中方式
			rules: [], //表单校验规则
			required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
			// show: false, //控制是否显示此组件 v-show 方式
			// ifShow: true, //控制是否显示此组件 v-if 方式
			componentProps: {
				onChange: (e) => {
					console.log('switch 发生 change 事件，携带值为', e.detail.value)
				}
			}, //组件的所有配置信息
		},
		{
			key: '7', //唯一标识  用于处理某些无字段组件
			name: '', //表单域的属性名，在使用校验规则时必填
			field: 'tab', //字段
			label: '', //输入框左边的文字提示
			component: componentType.tab, //组件类型
			// show: false, //控制是否显示此组件 v-show 方式
			// ifShow: true, //控制是否显示此组件 v-if 方式
			layout: [{
				name: 'tab1',
				value: 0,
				children: [{
					key: '001', //唯一标识  用于处理某些无字段组件
					name: '工作经验', //表单域的属性名，在使用校验规则时必填
					field: 'experience', //字段
					label: '工作经验', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [{
						required: true,
						errorMessage: '工作经验必填'
					}], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {

					}
				}] //组件的所有配置信息
			}, {
				name: 'tab2',
				value: 1,
				children: [{
					key: '002', //唯一标识  用于处理某些无字段组件
					name: '毕业院校', //表单域的属性名，在使用校验规则时必填
					field: 'school', //字段
					label: '毕业院校', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {
						disabled: true
					}
				}] //组件的所有配置信息
			}, {
				name: 'tab3',
				value: 2,
				children: [{
					key: '003', //唯一标识  用于处理某些无字段组件
					name: '特长', //表单域的属性名，在使用校验规则时必填
					field: 'speciality', //字段
					label: '特长', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {

					}
				}] //组件的所有配置信息
			}],
			componentProps: {
				onChange: (e) => {
					console.log(' 发生 change 事件，携带值为', e.value)
				}
			}, //组件的所有配置信息
		},
		{
			key: '7-1', //唯一标识  用于处理某些无字段组件
			name: '', //表单域的属性名，在使用校验规则时必填
			field: 'segmented', //字段
			label: '', //输入框左边的文字提示
			component: componentType.segmented, //组件类型
			// show: false, //控制是否显示此组件 v-show 方式
			// ifShow: true, //控制是否显示此组件 v-if 方式
			layout: [{
				name: '选项卡1',
				value: 0,
				children: [{
					key: '001', //唯一标识  用于处理某些无字段组件
					name: '工作经验', //表单域的属性名，在使用校验规则时必填
					field: 'experience', //字段
					label: '工作经验', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [{
						required: true,
						errorMessage: '工作经验必填'
					}], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {

					}
				}] //组件的所有配置信息
			}, {
				name: '选项卡2',
				value: 2,
				children: [{
					key: '002', //唯一标识  用于处理某些无字段组件
					name: '毕业院校', //表单域的属性名，在使用校验规则时必填
					field: 'school', //字段
					label: '毕业院校', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {
						disabled: true
					}
				}] //组件的所有配置信息
			}, {
				name: '选项卡3',
				value: 2,
				children: [{
					key: '003', //唯一标识  用于处理某些无字段组件
					name: '特长', //表单域的属性名，在使用校验规则时必填
					field: 'speciality', //字段
					label: '特长', //输入框左边的文字提示
					component: componentType.input, //组件类型
					labelWidth: 70, //label 宽度，单位 px
					labelAlign: '', //label 居中方式
					rules: [], //表单校验规则
					required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
					componentProps: {

					}
				}] //组件的所有配置信息
			}],
			componentProps: {
				onChange: (e) => {
					console.log(' 发生 change 事件，携带值为', e.value)
				}
			}, //组件的所有配置信息
		},
		{
			key: '8', //唯一标识  用于处理某些无字段组件
			name: '子表单', //表单域的属性名，在使用校验规则时必填
			field: 'subForm', //字段
			label: '子表单', //输入框左边的文字提示
			component: componentType.subForm, //组件类型
			columns: [{
				key: '0011', //唯一标识  用于处理某些无字段组件
				name: '住址', //表单域的属性名，在使用校验规则时必填
				field: 'address', //字段
				label: '住址', //输入框左边的文字提示
				component: componentType.input, //组件类型
				labelWidth: 70, //label 宽度，单位 px
				labelAlign: '', //label 居中方式
				rules: [{
					required: true,
					errorMessage: '住址必填'
				}], //表单校验规则
				required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
				componentProps: {

				}
			}, {
				key: '0012', //唯一标识  用于处理某些无字段组件
				name: '楼层', //表单域的属性名，在使用校验规则时必填
				field: 'floor', //字段
				label: '楼层', //输入框左边的文字提示
				component: componentType.input, //组件类型
				labelWidth: 70, //label 宽度，单位 px
				labelAlign: '', //label 居中方式
				rules: [{
					required: true,
					errorMessage: '楼层必填'
				}], //表单校验规则
				required: false, //label 右边显示红色"*"号，样式显示不会对校验规则产生效果
				componentProps: {

				}
			}],
			componentProps: {
				onChange: (e) => {
					console.log(' 发生 change 事件，携带值为', e.value)
				}
			}, //组件的所有配置信息
		}
	] // 表单组件配置
}