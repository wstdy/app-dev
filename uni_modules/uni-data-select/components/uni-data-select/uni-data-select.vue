<template>
	<view class="uni-stat__select">
		<span v-if="label" class="uni-label-text hide-on-phone">{{label + '：'}}</span>
		<view class="uni-stat-box" :class="{'uni-stat__actived': current}">
			<view class="uni-select" :class="{'uni-select--disabled':disabled}">
				<view class="uni-select__input-box" @click="toggleSelector">
					<view v-if="current" class="uni-select__input-text">{{current}}</view>
					<view v-else class="uni-select__input-text uni-select__input-placeholder">{{placeholder}}</view>
					<!-- <uni-icons v-if="current && clear" type="clear" color="#c0c4cc" size="24" @click="clearVal" />	
					<uni-icons v-else :type="showSelector? 'top' : 'bottom'" size="14" color="#999" /> -->
					<uni-icons v-if="current && clear" type="right" color="#8d97a3" size="20" />
				</view>
				<view class="uni-select--mask" v-if="showSelector" @click="toggleSelector" />
				<view class="uni-select__selector" v-if="showSelector">
					<view class="uni-popper__arrow"></view>
					<scroll-view scroll-y="true" class="uni-select__selector-scroll">
						<view class="uni-select__selector-empty" v-if="mixinDatacomResData.length === 0">
							<text>{{emptyTips}}</text>
						</view>
						<view v-else class="uni-select__selector-item" v-for="(item,index) in mixinDatacomResData" :key="index" @click="change(item)">
							<text :class="{'uni-select__selector__disabled': item.disable}">{{item.text}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		inject,
		watch,
		watchEffect,
		ref,
		onMounted
	} from 'vue';
	import {
		getDicDetailList
	} from '@/common/api/system/dictionary/index.js';
	import {
		changeApiOptions,
		isValidJSON,
		camelCaseString
	} from '@/common/api/magic-api/useApiRequest.js';
	/**
	 * DataChecklist 数据选择器
	 * @description 通过数据渲染的下拉框组件
	 * @tutorial https://uniapp.dcloud.io/component/uniui/uni-data-select
	 * @property {String} value 默认值
	 * @property {Array} localdata 本地数据 ，格式 [{text:'',value:''}]
	 * @property {Boolean} clear 是否可以清空已选项
	 * @property {Boolean} emptyText 没有数据时显示的文字 ，本地数据无效
	 * @property {String} label 左侧标题
	 * @property {String} placeholder 输入框的提示文字
	 * @property {Boolean} disabled 是否禁用
	 * @event {Function} change  选中发生变化触发
	 * @property {Object} map 字段映射， 默认 map={text:'text',value:'value'}
	 * @property {Object} apiConfig API请求时的配置 
	 * @property {String} itemId 数据字典id
	 */

	const props = defineProps({
		localdata: {
			type: Array,
			default: []
		},
		modelValue: {
			type: String,
			default: null
		},
		label: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		emptyTips: {
			type: String,
			default: '无选项'
		},
		clear: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		map: {
			type: Object,
			default: () => {
				return {
					text: 'text',
					value: 'value'
				}
			}
		},
		apiConfig: {
			type: Object,
			default: () => {
				return {}
			}
		},
		itemId: {
			type: String,
			default: ''
		},
		index: {
			type: Number
		},
		sepTextField: {
			type: String,
			default: ''
		},
		row: {
			type: Object,
			default: null
		}
	})
	const emit = defineEmits(['change', 'update:modelValue']);
	const formModel = inject('formModel');
	const isCustomForm = inject('isCustomForm', false);

	const showSelector = ref(false);
	const current = ref('');
	const dataValue = ref('');
	const mixinDatacomResData = ref([]);
	const apps = ref([]);
	const channels = ref([]);
	const valChanged = ref(false);

	onMounted(() => {
		if (!props.sepTextField) {
			fetch()
		}
	})

	watchEffect(() => {
		if (props.apiConfig?.path) {
			if (props.apiConfig?.requestParamsConfigs) apiconfigs(props.apiConfig.requestParamsConfigs)
			if (props.apiConfig?.requestHeaderConfigs) apiconfigs(props.apiConfig.requestHeaderConfigs)
			if (!props.sepTextField) {
				fetch();
			}
		}
	});
	watch(
		() => props.modelValue,
		(val) => {
			initDefVal()
		}, {
			immediate: true,
		},
	);
	watch(
		() => props.localdata,
		(newVal) => {
			channels.value = newVal
			mixinDatacomResData.value = getDataList()
		}, {
			deep: true,
			immediate: true
		},
	);

	async function fetch() {
		if (props.localdata && props.localdata.length !== 0) {
			channels.value = props.localdata
			mixinDatacomResData.value = getDataList()
		} else if (props.itemId) {
			let res = await getDicDetailList({
				itemId: props.itemId
			})
			if (res.success) {
				channels.value = Array.isArray(res.data) ? res.data : []
				mixinDatacomResData.value = getDataList()
			}
		} else if (props.apiConfig?.path) {
			let res = await changeApiOptions(props.apiConfig, formModel.value, isCustomForm, props.index);
			if (res.data) {
				channels.value = Array.isArray(res.data) ? res.data : [];
				mixinDatacomResData.value = getDataList()
			}
		}
		initDefVal()
	}

	function apiconfigs(Configs) {
		Configs.forEach((o) => {
			if (o.assignmentType == 'data') {
				let val = isValidJSON(o.value);
				let field = '';
				if (val && val.bindTable) {
					let table = isCustomForm ?
						val.bindTable + 'List' :
						camelCaseString(val.bindTable + '_List');
					field = isCustomForm ? val.bindField : camelCaseString(val.bindField);

					formModel.value &&
						formModel.value[table][props.index || 0] &&
						formModel.value[table][props.index || 0][field];
				} else if (val && val.bindField) {
					field = isCustomForm ? val.bindField : camelCaseString(val.bindField);
					formModel.value && formModel.value[field];
				}
			}
		});
	}

	function initDefVal() {
		if(props.sepTextField && props.row && !valChanged.value){
			current.value = props.row[camelCaseString(props.sepTextField)];
			return;
		}
		let defValue = ''
		if ((props.modelValue || props.modelValue === 0) && !isDisabled(props.modelValue)) {
			defValue = props.modelValue
		}
		dataValue.value = defValue

		const def = mixinDatacomResData.value.find(item => item.value === defValue)
		current.value = def ? def.text : defValue
	}
	/**
	 * 获取渲染的新数组
	 * @param {Object} value 选中内容
	 */
	function getDataList() {
		// 解除引用关系，破坏原引用关系，避免污染源数据
		let dataList = JSON.parse(JSON.stringify(channels.value))
		let list = []
		dataList.forEach((item, index) => {
			item.value = item[props.map.value];
			item.text = item[props.map.text]
			item.disabled = item.disable || item.disabled || false
			item.selected = dataValue.value === item[props.map.value]
			list.push(item)
		})
		return list
	}
	/**
	 * @param {[String, Number]} value
	 * 判断用户给的 value 是否同时为禁用状态
	 */
	function isDisabled(value) {
		let isDisabled = false;

		mixinDatacomResData.value.forEach(item => {
			if (item.value === value) {
				isDisabled = item.disable
			}
		})

		return isDisabled;
	}

	function clearVal() {
		cusomemit('')
	}

	function change(item) {
		if (!item.disable) {
			showSelector.value = false
			current.value = item.text
			cusomemit(item.value, item)
		}
	}

	function cusomemit(val, option) {
		updateSepTextField(current.value)
		emit('change', val, option)
		emit('update:modelValue', val)
	}

	function toggleSelector() {
		if (props.disabled) {
			return
		}
		if (props.sepTextField && !valChanged.value) {
			valChanged.value = true;
			fetch();
		}		
		showSelector.value = !showSelector.value
	}

	function updateSepTextField(v) {
      if (!props.sepTextField || !props.row) {
          return;
      }
      props.row[camelCaseString(props.sepTextField)] = v;
  }
</script>

<style lang="scss">
	$uni-base-color: #6a6a6a !default;
	$uni-main-color: #333 !default;
	$uni-secondary-color: #909399 !default;
	$uni-border-3: #e5e5e5;


	/* #ifndef APP-NVUE */
	@media screen and (max-width: 500px) {
		.hide-on-phone {
			display: none;
		}
	}

	/* #endif */
	.uni-stat__select {
		display: flex;
		align-items: center;
		// padding: 15px;
		cursor: pointer;
		width: 100%;
		flex: 1;
		box-sizing: border-box;
	}

	.uni-stat-box {
		width: 100%;
		flex: 1;
	}

	.uni-stat__actived {
		width: 100%;
		flex: 1;
		// outline: 1px solid #2979ff;
	}

	.uni-label-text {
		font-size: 14px;
		font-weight: bold;
		color: $uni-base-color;
		margin: auto 0;
		margin-right: 5px;
	}

	.uni-select {
		font-size: 14px;
		// border: 1px solid $uni-border-3;
		box-sizing: border-box;
		border-radius: 4px;
		// padding: 0 5px;
		padding-left: 10px;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		user-select: none;
		/* #endif */
		flex-direction: row;
		align-items: center;
		// border-bottom: solid 1px $uni-border-3;
		width: 100%;
		flex: 1;
		height: 35px;

		&--disabled {
			background-color: #f5f7fa;
			cursor: not-allowed;
		}
	}

	.uni-select__label {
		font-size: 16px;
		// line-height: 22px;
		height: 35px;
		padding-right: 10px;
		color: $uni-secondary-color;
	}

	.uni-select__input-box {
		height: 35px;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
	}

	.uni-select__input {
		flex: 1;
		font-size: 14px;
		height: 22px;
		line-height: 22px;
	}

	.uni-select__input-plac {
		font-size: 14px;
		color: $uni-secondary-color;
	}

	.uni-select__selector {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		position: absolute;
		top: calc(100% + 12px);
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		border: 1px solid #EBEEF5;
		border-radius: 6px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		z-index: 3;
		padding: 4px 0;
	}

	.uni-select__selector-scroll {
		/* #ifndef APP-NVUE */
		max-height: 200px;
		box-sizing: border-box;
		/* #endif */
	}

	.uni-select__selector-empty,
	.uni-select__selector-item {
		/* #ifndef APP-NVUE */
		display: flex;
		cursor: pointer;
		/* #endif */
		line-height: 35px;
		font-size: 14px;
		text-align: center;
		/* border-bottom: solid 1px $uni-border-3; */
		padding: 0px 10px;
	}

	.uni-select__selector-item:hover {
		background-color: #f9f9f9;
	}

	.uni-select__selector-empty:last-child,
	.uni-select__selector-item:last-child {
		/* #ifndef APP-NVUE */
		border-bottom: none;
		/* #endif */
	}

	.uni-select__selector__disabled {
		opacity: 0.4;
		cursor: default;
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
		left: 10%;
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

	.uni-select__input-text {
		// width: 280px;
		width: 100%;
		color: $uni-main-color;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		overflow: hidden;
		text-align: right;
	}

	.uni-select__input-placeholder {
		color: $uni-base-color;
		font-size: 12px;
	}

	.uni-select--mask {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}
</style>