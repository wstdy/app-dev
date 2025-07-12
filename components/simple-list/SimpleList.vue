<template>
	<view class="container">
		<view class="search-box">
			<view class="search-btn" @tap="handleSearch">筛选<uni-icons type="ant-design:filter-filled" :size="12"
					color="#253954" custom-prefix="antfont"></uni-icons></view>
			<view style="position: relative;">
				<view class="search-btn" :class="showTree?'active':''" v-if="categoryConfigs" @tap="handleTreeClick">
					{{categoryConfigs.menuName}}<uni-icons :type="showTree?'ant-design:caret-up':'ant-design:caret-down'"
						:size="12" :color="showTree?'#5E95FF':'#253954'" custom-prefix="antfont"></uni-icons>
				</view>
				<uni-node-tree width="150" :showSelector="showTree" :localdata="categoryConfigs.staticData"
					:childIcon="categoryConfigs.childIcon" :parentIcon="categoryConfigs.parentIcon"
					:itemId="categoryConfigs.dictionaryItemId" :apiConfig="categoryConfigs.apiConfig"
					@change="handleTreeChange"></uni-node-tree>
			</view>
		</view>
		<template v-for="(data, i) in datasourceRef">
			<uni-card @tap="onClick(data)" :isShadow="false" :border="false" margin="0 20px 10px" padding="10px"
				style="overflow: unset;">
				<template v-for="(config, index) in newColumnConfigs">
					<view class="column-line">
						<text class="label-title" v-if="config.showLabel&&!config.mainField">{{ config.title }}：</text>
						<text :class="{'label-weight':config.mainField}">
							<template v-if="config.componentType === componentType.switch">
								{{ data?.[config.field]?'开':'关' }}
							</template>
							<template v-else>{{ data?.[config.field] }}</template>
						</text>
					</view>
				</template>

				<view slot="actions" class="card-actions" v-if="buttonConfigs.length>0 && !data.workflowData.processId" :class="{'act-workflow':data.workflowData.processId}" >
					<template v-for="(config, index) in buttonConfigs">
						<template v-if="!data.workflowData.processId">
							<view class="card-actions-item" style="position: relative;" @tap.stop="config.action(data, listApi)">
								<view class="card-actions-icon" :style="{background:config.color}">
									<uni-icons :type="config.icon" custom-prefix="antfont" size="14" color="#fff"></uni-icons>
								</view>
								<text class="card-actions-item-text" :style="{color:config.color}">{{ config.text }}</text>

								<view class="uni-select__selector" style="width:max-content"
									v-if="buttonSelector==data[listProps.rowKey]&&config.buttons">
									<view class="uni-popper__arrow"></view>
									<scroll-view scroll-y="true" class="uni-select__selector-scroll">
										<view class="uni-select__selector-item" v-for="(item,index) in config.buttons" :key="index"
											@click.stop="handleButtonClick(item,data)">
											<view class="item-text" :class="{'uni-select__selector__disabled': item.disable}">
												
											</view>
										</view>
									</scroll-view>
								</view>
							</view>
							<view v-if="index<buttonConfigs.length-1" style="color:#F3F4F8">|</view>
						</template>
						<template v-else-if="config.code=='startwork'">
							<view class="startwork-button" :style="{color:config.color}" @click.stop="onClick(data)">
								<uni-icons :type="changeButtonIcon(config,data)" size="14" :color="config.color"
									custom-prefix="antfont"></uni-icons>
								<view class="startwork-button-name">{{changeButtonName(config,data)}}</view>
							</view>
						</template>
					</template>
				</view>
			</uni-card>
		</template>
		<uni-load-more v-if="datasourceRef.length > 10" iconType="auto" :status="loadMoreState" />

		<uni-drawer ref="drawerRef" mode="right" width="80%" :mask-click="true" @change="handleChange">
			<view class="filter-title">
				<view class="before"></view>筛选
			</view>
			<scroll-view style="height: calc(100% - 88px);" scroll-y="true">
				<view class="form-fixed">
					<SimpleForm v-if="drawerShow" ref="formRef" :formProps="formProps" :isFilter="true" control='add'>
					</SimpleForm>
				</view>
			</scroll-view>
			<view class="filter-btn">
				<button class="btn" @tap="resetClick" type="primary" style="background: #E7EBF2;color:#253954">重置</button>
				<button class="btn" @tap="closeDrawer" type="primary" style="background: #F3F4F8;color:#B7BACA">取消</button>
				<button class="btn" @tap="searchClick" type="primary" style="background: #5E95FF;">确定</button>
			</view>
		</uni-drawer>
		<uni-fab ref="fab" :pattern="pattern" v-if="isSearch&&hasAddBtn" horizontal="right" vertical="bottom" direction="horizontal"
			@tap="trigger" />
		<!-- <uni-fab ref="fab" :pattern="pattern" v-if="!isSearch" horizontal="right" vertical="bottom" direction="horizontal"
			@fabClick="fabClick" /> -->
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		unref
	} from 'vue';
	import {
		onReady,
		onReachBottom,
		onPullDownRefresh
	} from '@dcloudio/uni-app'; //不支持onLoad
	import {
		isFunction
	} from '../../utils/helper/utils.js';
	import {
		defaultListProps
	} from './types/list.js';
	import SimpleForm from '@/components/simple-form/SimpleForm.vue';
	import {
		PAGE_PARAM
	} from '../../common/const/cache.js';
	import {
		componentType
	} from '../simple-form/types/form.js';
	import {
		handleWorkflow
	} from '@/utils/simpleForm/analysis'; 
	const emit = defineEmits(['add', 'edit', 'view', 'delete']);
	const total = ref(0); //总条数
	const props = defineProps({
		// 列表配置规则
		listProps: {
			type: Object,
			default: () => {
				return defaultListProps;
			}
		},
		isCustomForm: {
			type: Boolean,
			default: () => {
				return false;
			}
		},
		schemaId: {
			type: String,
			default: () => {
				return '';
			}
		}
	});
	const buttonSelector = ref()
	const drawerRef = ref();
	const fabRef = ref();
	const formRef = ref();
	const showTree = ref(false)
	const loadMoreType = {
		MORE: 'more',
		LOADING: 'loading',
		NOMORE: 'no-more'
	};

	const pattern = {
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#007AFF',
		buttonColor: '#007AFF',
		iconColor: '#fff'
	};

	const content = [
		// {
		// 	iconPath: '/static/img/tabbar/add.png',
		// 	selectedIconPath: '/static/img/tabbar/addactive.png',
		// 	text: '新增',
		// 	active: true
		// },
		// {
		// 	iconPath: '/static/img/tabbar/home.png',
		// 	selectedIconPath: '/static/img/tabbar/homeactive.png',
		// 	text: '搜索',
		// 	active: false
		// }
	];

	const {
		api,
		datasource,
		beforeFetch,
		afterFetch,
		buildHeader,
		formUrl,
		categoryConfigs,
		columnConfigs,
		searchConfigs,
		isSearch,
		isPage,
		rowKey,
		otherButtons,
		workflowConfig
	} = props.listProps;
	
	const buttonConfigs = ref([])
	const formProps = {
		rules: {}, //校验规则
		validateTrigger: 'submit', //表单校验时机,blur仅在 uni-easyinput 中生效
		labelPosition: 'left', //label 位置 top/left
		labelWidth: 75, //label 宽度，单位 px 75
		labelAlign: 'left', //label 居中方式  left/center/right
		errShowType: 'undertext', //表单错误信息提示方式 undertext/toast/modal
		border: false, //是否显示分格线
		showButton: false, //是否显示表单自带按钮
		schemas: searchConfigs
	};

	//加载更多初始状态
	const loadMoreState = ref(loadMoreType.MORE);
	const datasourceRef = ref([]);
	const drawerShow = ref(false)
	const formData = ref({})
	const treeData = ref()
	const hasAddBtn=ref(false)
	const newColumnConfigs=ref()
	const newButtonConfigs=ref(props.listProps.buttonConfigs)
	onMounted(() => { 
		let auth=uni.getStorageSync('MenuAuth' )
		let buttonAuthCode=auth.buttonAuthCode||[];
		let columAuth=auth.columnAuthCode||[]; 
		newColumnConfigs.value=columnConfigs.filter((item) => columAuth.includes(item.field))
		newButtonConfigs.value = newButtonConfigs.value.filter((item) => buttonAuthCode.includes(item.code)) 
		if (props.isCustomForm) {
			buttonConfigs.value = getButtonConfigs()
		} else {
			buttonConfigs.value = newButtonConfigs.value
		}
		if(buttonAuthCode.includes('add')){hasAddBtn.value=true}
		reload()
	})

	async function fetch(isRefresh) {
		if (api && isFunction(api)) {
			let header;
			if (buildHeader && isFunction(buildHeader)) {
				header = buildHeader(workflowConfig);
			}

			let params = {
				...PAGE_PARAM,
				...formData.value
			};

			if (beforeFetch && isFunction(beforeFetch)) {
				params = beforeFetch(params);
			}
			params.limit = PAGE_PARAM.limit;
			params.size = PAGE_PARAM.size;
			if (categoryConfigs.listFieldName) params.params[categoryConfigs.listFieldName] = treeData.value
			const result = await api(params, header);
			total.value = result.data.total;

			if (!isPage) {
				if (afterFetch && isFunction(afterFetch)) {
					datasourceRef.value = afterFetch(result.data);
				} else {
					datasourceRef.value = result.data;
				}
			} else {
				//如果返回为空  不再显示上拉显示更多
				// if (result.data.list.length === 0) {
				// 	datasourceRef.value = [];
				// 	loadMoreState.value = loadMoreType.NOMORE;
				// }

				if (afterFetch && isFunction(afterFetch)) {
					//是否是上拉刷新
					if (isRefresh) {
						datasourceRef.value = afterFetch(result.data.list);
						loadMoreState.value = loadMoreType.MORE;
					} else {
						datasourceRef.value = datasourceRef.value.concat(afterFetch(result.data.list));
					}
				} else {
					//是否是上拉刷新
					if (isRefresh) {
						datasourceRef.value = result.data.list;
						loadMoreState.value = loadMoreType.MORE;
					} else {
						datasourceRef.value = datasourceRef.value.concat(result.data.list);
					}
				}
			}

		}
	}

	function handleTreeClick() {
		showTree.value = !showTree.value
	}
	const onClick = (record) => {
		let btn = otherButtons.find(o => {
			return o.code == 'view'
		})
		if (btn?.isUse) {
			if (record?.workflowData.taskIds && record.workflowData.taskIds.length) {
				uni.navigateTo({
					url:'/pages/workflow/approval?taskId=' + record.workflowData.taskIds[0] +'&processId=' + record.workflowData.processId + '&type=todo',
				});
			} else if (record?.workflowData.processId) {
				uni.navigateTo({
					url:'/pages/workflow/look?processId=' + record?.workflowData.processId,
				});
			} else if (props.isCustomForm) {
				emit('view', record[rowKey])
			} else {
				uni.navigateTo({
					url: formUrl + '?type=view&id=' + record[rowKey],
				});
			}
		}
	};

	const trigger = async (e) => { 
		if (props.schemaId || props.listProps.workflowConfig.schemaId) {
			uni.navigateTo({
				url: '/pages/workflow/launch?id=' + (props.schemaId || props.listProps.workflowConfig.schemaId)
			});
			
		} else if (props.isCustomForm) {
			emit('add')
		} else {
			uni.navigateTo({
				url: formUrl + '?type=add'
			});
		}
	};

	function handleSearch() {
		drawerRef.value.open();
	};

	const fabClick = (e) => {
		uni.navigateTo({
			url: formUrl
		});
	};

	onPullDownRefresh(() => {
		PAGE_PARAM.limit = 1;
		PAGE_PARAM.size = 10;

		setTimeout(() => {
			fetch(true);
			uni.stopPullDownRefresh();
		}, 500);
		console.log('onPullDownRefresh');
	});

	onReachBottom(() => {
		if (loadMoreState.value === loadMoreType.NOMORE) {
			return;
		}
		if(datasourceRef.value.length == total.value) {
			return
		}
		PAGE_PARAM.limit++;

		loadMoreState.value = loadMoreType.LOADING;

		setTimeout(() => {
			fetch();
			loadMoreState.value = loadMoreType.MORE;
		}, 500);

		console.log('onReachBottom');
	});

	function handleChange(e) {
		drawerShow.value = e
		if (!e) formRef.value = null
	}
	const searchClick = async (e) => {
		PAGE_PARAM.limit = 1;
		PAGE_PARAM.size = 10;
		total.value = 0;
		formData.value = await formRef.value.getFormData();
		fetch(true);
	};

	function handleTreeChange(v) {
		PAGE_PARAM.limit = 1;
		PAGE_PARAM.size = 10;
		total.value = 0;

		treeData.value = v;
		fetch(true);
		showTree.value = false
	}
	const resetClick = async () => {
		await formRef.value.reset();
		formData.value = await formRef.value.getFormData();
		total.value = 0;
		fetch(true);
	};

	const closeDrawer = (e) => {
		drawerRef.value.close();
		formData.value = {}
	};

	//重新加载
	async function reload() {
		PAGE_PARAM.limit = 1;
		PAGE_PARAM.size = 10;
		total.value = 0;
		//如果传入api  并且api 不为空
		if (datasource && datasource.length > 0) {
			datasourceRef.value = datasource;
		} else {
			if (isSearch && searchConfigs && searchConfigs.length > 0) formProps.schemas = searchConfigs;
			await fetch(true);
		}
	}

	async function setProps() {}

	//获取列表数据
	async function getData() {
		return unref(datasourceRef);
	}

	async function getColumns() {
		return newColumnConfigs.value;
	}

	async function getPage() {
		return PAGE_PARAM;
	}

	function handleButtonClick(item, data) {
		//console.log('按钮点击事件', item, data)
		if (item.code === 'startwork' && data.workflowData) {
			handleWorkflow(data, props.listProps.workflowConfig.Formid,rowKey);
		}
	}

	function changeButtonIcon(item, data) {
		//console.log('修改按钮图标', item, data)
		if (item.code === 'startwork' && data.workflowData) {
			//与工作流有关联的表单
			if (data.workflowData.status) {
				if (data.workflowData.taskIds) {
					return item.icon
				} else {
					return "ant-design:eye-outlined"
				}
			} else {
				return item.icon
			}
		}
		return item.icon
	}

	function changeButtonName(item, data) {
		//console.log('修改按钮名称', item, data)
		if (item.code === 'startwork' && data.workflowData) {
			//与工作流有关联的表单
			if (data.workflowData.status) {
				if (data.workflowData.taskIds) {
					return "审批流程"
				} else {
					if (data.workflowData.status === 'ACTIVE') {
						return "审批中";
					} else {
						return "审批已完成";
					}
				}
			} else {
				return "发起审批"
			}
		}
		return item.name
	}

	function showMoreButton(id) {
		if (buttonSelector.value == id) {
			buttonSelector.value = null
			return;
		}
		buttonSelector.value = id
	}

	function getButtonConfigs() {
		let codes = ["refresh", "view", "add", "edit", "delete"]
		let buttons = newButtonConfigs.value.filter((item) => item.isUse)
		let others = buttons.filter((item) => !codes.includes(item.code))
		let temp = []
		
		buttons.forEach(item => {
			if (item.code === 'edit') {
				temp.push({
					code: item.code,
					icon: 'ant-design:edit-square',
					color: '#5E95FF',
					text: item.name,
					action: (record) => {
						emit('edit', record[rowKey])
					}
				})
			}
			if (item.code === 'delete') {
				temp.push({
					code: item.code,
					icon: 'ant-design:delete-outlined',
					color: '#EF6969',
					text: item.name,
					action: async (record) => {
						emit('delete', record[rowKey])
					}
				})
			}

		})
		if (others.length > 0) {
			temp.push({
				code: 'more',
				icon: 'ant-design:lipsis-outlined',
				color: '#5E95FF',
				text: '更多',
				buttons: others,
				action: async (record, {
					showMoreButton
				}) => {
					showMoreButton(record[rowKey])
				}
			})
		}
		return temp;
	}
	const listApi = {
		getData,
		getColumns,
		getPage,
		reload,
		showMoreButton
	};

	//将表单方法  导出 给父组件使用。
	defineExpose(listApi);
</script>

<style lang="scss">
	.label-weight {
		font-weight: bold;
	}

	.container {
		box-sizing: border-box;
		min-height: 100vh;
		background: #F6F9FF;
	}

	.search-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 20px;
	}

	.search-btn {
		background: #E7EBF2;
		padding: 5px 10px;
		font-size: 12px;
		line-height: 18px;
		height: 18px;
		border-radius: 14px;
		color: #253954
	}

	.search-btn.active {
		background: #fff;
		color: #5E95FF;
		box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.08);
	}

	.column-line {
		line-height: 20px;
		padding: 3px 0;
		color: #253954
	}

	.label-title {
		color: #BBBEC9
	}

	.custom-cover {
		flex: 1;
		flex-direction: row;
		position: relative;
	}

	.cover-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background-color: rgba($color: #000000, $alpha: 0.4);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 15px;
		font-size: 14px;
		color: #fff;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 30px;
		border-top: 1px #F3F4F8 solid;
		margin-top: 5px;
		padding-top: 5px;
	}
	.startwork-button {
		display: flex;
		.startwork-button-name {
			margin-left: 4px;
		}
	}

	.act-workflow {
		justify-content: center;
		margin-right: 12px;
	}

	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.card-actions-icon {
		border-radius: 50%;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
	}

	.card-actions-item-text {
		font-size: 14px;
		color: #666;
		margin-left: 5px;
	}

	.cover-image {
		flex: 1;
		height: 150px;
	}

	.no-border {
		border-width: 0;
	}

	.filter-title {
		display: flex;
		align-items: center;
		color: #253954;
		font-size: 16px;
		padding: 10px;
		border-bottom: 1px solid #F3F4F8;
	}

	.filter-title .before {
		width: 5px;
		height: 20px;
		background: linear-gradient(180deg, #5E95FF 0%, rgba(94, 149, 255, 0.16) 100%);
		border-radius: 2px 2px 2px 2px;
		margin-right: 6px;
	}

	.filter-btn {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.filter-btn .btn {
		width: 72px;
		height: 36px;
		line-height: 36px;
		border-radius: 20px;
		font-size: 14px;
	}
</style>
<style>
	.uni-select__selector {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		position: absolute;
		top: calc(100% + 12px);
		right: 0;
		width: 100%;
		background-color: #FFFFFF;
		border: 1px solid #EBEEF5;
		border-radius: 6px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		z-index: 3;
		padding: 10px 0;
	}

	.uni-select__selector-scroll {
		/* #ifndef APP-NVUE */
		max-height: 300px;
		box-sizing: border-box;
		/* #endif */
	}

	/* picker 弹出层通用的指示小三角 */
	.uni-popper__arrow,
	.uni-popper__arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 6px;
	}

	.uni-popper__arrow {
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
		top: -6px;
		right: 10%;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: #EBEEF5;
	}

	.uni-popper__arrow::after {
		content: " ";
		top: 1px;
		margin-left: -6px;
		border-top-width: 0;
		border-bottom-color: #fff;
	}

	.uni-select__selector-item {
		cursor: pointer;
		margin: 0px 10px;
		padding: 0px 10px;
		color: #253954;
		line-height: 34px;
		font-size: 12px;
		word-break: break-all;
	}

	.uni-select__selector-item {
		background-color: #f9f9f9;
	}

	.uni-select__selector__disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>