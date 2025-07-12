<template>
	<view v-if="loading">
		<SimpleList ref="listRef" :listProps="listProps" :isCustomForm="true" @add="handleAdd" @edit="handleEdit"
			@view="handleView" @delete="handleDelete"></SimpleList>

	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow,
		onLoad,
		onReady,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app';
	import SimpleList from '@/components/simple-list/SimpleList.vue';

	import {
		buildAppFormProps,
		getColumnConfigs,
		getSearchConfigs,
		getCategoryConfigs
	} from '@/utils/simpleForm/changeJson.js'

	import {
		getFormRelease,
		getFormExecutePage,
		deleteFormExecute
	} from '@/common/api/system/dictionary/index.js';
	const loading = ref(false)
	const listProps = ref({
		rowKey: 'id',
		//列表请求接口
		api: getFormExecutePage,
		// 请求之前处理参数 (params) => {}
		beforeFetch: (params) => {
			return {
				params: {
					...params
				},
				funcId: funcId.value
			}
		},
		// 自定义处理接口返回参数
		afterFetch: (data) => {
			return data
		},
		// 自定义请求配置
		buildHeader:(header)=> {
			return header
		},
		//数据源  静态
		datasource: [],
		//列配置
		columnConfigs: [],
		//是否启用搜索
		isSearch: true,
		//是否分页
		isPage: true,
		//分类筛选配置
		categoryConfigs: '',
		//搜索配置
		searchConfigs: [],
		//按钮配置
		otherButtons: [],
		buttonConfigs: [],
		workflowConfig:{
			Pk:'id',
			Formid:''
		},
		formUrl: '/pages/customForm/form'
	})

	const formProps = ref()
	onReachBottom(() => {
		// 必须要这个事件 可以不写逻辑 
	});
	const listRef = ref();

	const firstLoad = ref(true);
	const formShow = ref(false);
	const control = ref()
	const dataId = ref()
	const funcId = ref()

	onLoad(async (option) => {
		uni.showLoading()
		funcId.value = option.id
		let res = await getFormRelease(option.id)
		
		if (!res.code) {
			uni.setNavigationBarTitle({
				title: res.data.menuConfigs.name
			}) 
			listProps.value.workflowConfig.Formid=res.data.codeSchemaId;
			let json = JSON.parse(res.data.jsonContent);
			json.tableConfigs.forEach(o=>{
				if(o.isMain){
					listProps.value.workflowConfig.Pk=o.pkField;
					listProps.value.rowKey=o.pkField;
				} 
			})
			formProps.value = buildAppFormProps(json.formJson)

			loading.value = true;
			if (json.listConfig.isLeftMenu) {
				listProps.value.categoryConfigs = getCategoryConfigs(json.listConfig.leftMenuConfig);
			}

			listProps.value.columnConfigs = getColumnConfigs(json.listConfig.columnConfigs);
			listProps.value.searchConfigs = getSearchConfigs(json.listConfig.queryConfigs, formProps.value, json.formJson
				.list);
			listProps.value.buttonConfigs = json.listConfig.buttonConfigs
			listProps.value.otherButtons = json.listConfig.buttonConfigs
				.filter((item) => item.code !== 'edit' && item.code !== 'delete')
				.map((item) => {
					return {
						text: item.name,
						isUse: item.isUse,
						code: item.code
					};
				})
			uni.hideLoading()
		}
	});
	onShow((e) => {
		if (firstLoad.value) {
			firstLoad.value = !firstLoad.value;
			return;
		}
		listRef.value.reload();
	});

	function back() {
		uni.navigateBack({
			delta: 1
		})
	}

	function handleAdd() {

		uni.navigateTo({
			url: listProps.value.formUrl + '?control=add&funcId=' + funcId.value
		})
	}

	function handleEdit(item) {
		uni.navigateTo({
			url: listProps.value.formUrl + '?control=edit&funcId=' + funcId.value + '&id=' + item
		})
	}

	function handleView(item) {
		uni.navigateTo({
			url: listProps.value.formUrl + '?control=view&funcId=' + funcId.value + '&id=' + item
		})
	}
	async function handleDelete(item) {
		await deleteFormExecute({
			ids: [item],
			funcId: funcId.value
		});
		//请求删除接口
		uni.showToast({
			title: "删除成功"
		})
		listRef.value.reload();
	}
</script>

<style>
	.statusbar {
		height: var(--status-bar-height)
	}
</style>