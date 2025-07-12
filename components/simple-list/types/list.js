import {
	getDicDetailPage
} from '@/common/api/system/dictionary/index.js';
import {
	componentType
} from '@/components/simple-form/types/form.js'

export const defaultListProps = {
	rowKey:'id',
	//列表请求接口
	api: getDicDetailPage,
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
		labelWidth: 70, //label 宽度，单位 px
		labelAlign: '', //label 居中方式
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
	formUrl: '/pages/home/form/form',
	//按钮配置
	buttonConfigs: [{
		icon: 'heart',
		text: '新增',
		action: () => {
			uni.navigateTo({
				url: defaultListProps.formUrl,
			});
		}
	}, {
		icon: 'heart',
		text: '编辑',
		action: () => {
			uni.navigateTo({
				url: defaultListProps.formUrl,
			});
		}
	}, {
		icon: 'heart',
		text: '删除',
		action: () => {
			//请求删除接口
			uni.showToast({
				title: "删除"
			})
		}
	}, ]
}