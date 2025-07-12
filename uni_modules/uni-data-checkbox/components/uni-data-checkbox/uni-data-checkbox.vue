<template>
	<view class="uni-data-checklist" :style="{'margin-top':isTop+'px'}">
		<template v-if="!isLocal">
			<view class="uni-data-loading">
				<uni-load-more v-if="!emptyText" status="loading" iconType="snow" :iconSize="18"
					:content-text="contentText"></uni-load-more>
				<text v-else>{{emptyText}}</text>
			</view>
		</template>
		<template v-else>
			<checkbox-group v-if="multiple" class="checklist-group" :class="{'is-list':mode==='list' || wrap}"
				@change="handleChagne">
				<label class="checklist-box"
					:class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']"
					:style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<checkbox class="hidden" hidden :disabled="disabled || !!item.disabled" :value="item[map.value]+''"
						:checked="item.selected" />
					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')"
						class="checkbox__inner" :style="item.styleIcon">
						<view class="checkbox__inner-icon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<text class="checklist-text" :style="item.styleIconText">{{item[map.text]}}</text>
						<view v-if="mode === 'list' && icon === 'right'" class="checkobx__list" :style="item.styleBackgroud"></view>
					</view>
				</label>
			</checkbox-group>
			<radio-group v-else class="checklist-group"
				:class="{'is-list':mode==='list','is-button':mode==='button','is-wrap':wrap}" @change="handleChagne">
				<!-- -->
				<label class="checklist-box"
					:class="['is--'+mode,item.selected?'is-checked':'',(disabled || !!item.disabled)?'is-disable':'',index!==0&&mode==='list'?'is-list-border':'']"
					:style="item.styleBackgroud" v-for="(item,index) in dataList" :key="index">
					<radio class="hidden" hidden :disabled="disabled || item.disabled" :value="item[map.value]+''"
						:checked="item.selected" />
					<view v-if="(mode !=='tag' && mode !== 'list') || ( mode === 'list' && icon === 'left')" class="radio__inner"
						:style="item.styleBackgroud">
						<view class="radio__inner-icon" :style="item.styleIcon"></view>
					</view>
					<view class="checklist-content" :class="{'list-content':mode === 'list' && icon ==='left'}">
						<text class="checklist-text" :style="item.styleIconText">{{item[map.text]}}</text>
						<view v-if="mode === 'list' && icon === 'right'" :style="item.styleRightIcon" class="checkobx__list"></view>
					</view>
				</label>
			</radio-group>
		</template>
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
	 * @description 通过数据渲染 checkbox 和 radio
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=xxx
	 * @property {String} mode = [default| list | button | tag] 显示模式
	 * @value default  	默认横排模式
	 * @value list		列表模式
	 * @value button	按钮模式
	 * @value tag 		标签模式
	 * @property {Boolean} multiple = [true|false] 是否多选
	 * @property {Array|String|Number} value 默认值
	 * @property {Array} localdata 本地数据 ，格式 [{text:'',value:''}]
	 * @property {Number|String} min 最小选择个数 ，multiple为true时生效
	 * @property {Number|String} max 最大选择个数 ，multiple为true时生效
	 * @property {Boolean} wrap 是否换行显示
	 * @property {String} icon = [left|right]  list 列表模式下icon显示位置
	 * @property {Boolean} selectedColor 选中颜色
	 * @property {String} itemId 数据字典id
	 * @property {Boolean} emptyText 没有数据时显示的文字 ，本地数据无效
	 * @property {Boolean} selectedTextColor 选中文本颜色，如不填写则自动显示
	 * @property {Object} map 字段映射， 默认 map={text:'text',value:'value'}
	 * @property {Object} apiConfig API请求时的配置
	 * @value left 左侧显示
	 * @value right 右侧显示
	 * @event {Function} change  选中发生变化触发
	 */

	const props = defineProps({
		mode: {
			type: String,
			default: 'default'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		modelValue: {
			type: [Array, String, Number],
			default () {
				return '';
			}
		},
		localdata: {
			type: Array,
			default () {
				return []
			}
		},
		itemId: {
			type: String,
			default: ''
		},
		min: {
			type: [Number, String],
			default: ''
		},
		max: {
			type: [Number, String],
			default: ''
		},
		wrap: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			default: 'left'
		},
		selectedColor: {
			type: String,
			default: ''
		},
		selectedTextColor: {
			type: String,
			default: ''
		},
		emptyText: {
			type: String,
			default: '暂无数据'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		map: {
			type: Object,
			default () {
				return {
					text: 'text',
					value: 'value'
				}
			}
		},
		apiConfig: {
			type: Object,
			default () {
				return {}
			}
		},
		index: {
			type: Number
		}
	})
	const emit = defineEmits(['change', 'update:modelValue']);
	const formModel = inject('formModel');
	const isCustomForm = inject('isCustomForm', false);

	const isLocal = ref(true);
	const isTop = ref(0);
	const defualtColor = ref('#2979ff');
	const contentText = {
		contentdown: '查看更多',
		contentrefresh: '加载中',
		contentnomore: '没有更多'
	}
	let range = ref([]);
	let dataList = ref([]);

	watch(
		() => props.modelValue,
		(val) => {
			initData(val)
		}, {
			immediate: true,
		},
	);
	watchEffect(async () => {
		if (props.apiConfig?.path) {
			if (props.apiConfig?.requestParamsConfigs) apiconfigs(props.apiConfig.requestParamsConfigs)
			if (props.apiConfig?.requestHeaderConfigs) apiconfigs(props.apiConfig.requestHeaderConfigs)
			isLocal.value = false
			let res = await changeApiOptions(props.apiConfig, formModel.value, isCustomForm, props.index);
			if (res.data) {
				range.value = Array.isArray(res.data) ? res.data : [];
				let val = null
				if (Array.isArray(props.modelValue)) {
					val = props.modelValue
				} else if (Object.prototype.toString.call(props.modelValue) === '[object String]') {
					val = props.multiple ? props.modelValue.split(',') : props.modelValue
				} else {
					val = props.modelValue
				}
				dataList.value = getDataList(val)
			}

			if(props.modelValue) isLocal.value = true
		}
	});
	onMounted(async () => {

		await initData(props.modelValue)
	})
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
	async function initData(value ) {

			isLocal.value = false
			let val = null
			if (Array.isArray(value)) {
				val = value
			} else if (Object.prototype.toString.call(value) === '[object String]') {
				val = props.multiple ? value.split(',') : value
			} else {
				val = value
			}

			if (range.value.length > 0 ) {
				dataList.value = getDataList(val)
				isLocal.value = true
				return;
			}
			if (props.localdata && props.localdata.length !== 0) {
				isLocal.value = true
				range.value = props.localdata
				dataList.value = getDataList(val)
			} else if (props.itemId) {
				let res = await getDicDetailList({
					itemId: props.itemId
				})
				if (res.success) {
					range.value = Array.isArray(res.data) ? res.data : []
					dataList.value = getDataList(val)
				}
			} else if (props.apiConfig?.path) {
				let res = await changeApiOptions(props.apiConfig, formModel.value, isCustomForm, props.index);
				if (res.data) {
					range.value = Array.isArray(res.data) ? res.data : [];
					dataList.value = getDataList(val)
				}

			}
			isLocal.value = true
		}

		function handleChagne(e) {
			const values = e.detail.value

			let detail = {
				value: [],
				data: []
			}

			if (props.multiple) {
				range.value.forEach(item => {

					if (values.includes(item[props.map.value] + '')) {
						detail.value.push(item[props.map.value])
						detail.data.push(item)
					}
				})
			} else {

				const temp = range.value.find(item => (item[props.map.value] + '') === values)
				if (temp) {
					detail = {
						value: temp[props.map.value],
						data: temp
					}
				}
			}
			if (props.multiple) {

				emit('update:modelValue', detail.value.join(','));
			} else {

				emit('update:modelValue', detail.value);
			}

			emit('change', {
				detail
			})
			if (props.multiple) {

				dataList.value = getDataList(detail.value, true)

			} else {
				dataList.value = getDataList(detail.value)
			}
		}

		/**
		 * 获取渲染的新数组
		 * @param {Object} value 选中内容
		 */
		function getDataList(value) {
			// 解除引用关系，破坏原引用关系，避免污染源数据
			let dataList = JSON.parse(JSON.stringify(range.value))
			let list = []
			if (props.multiple) {
				if (!Array.isArray(value)) {
					value = []
				}
			}
			dataList.forEach((item, index) => {
				item.disabled = item.disable || item.disabled || false
				if (props.multiple) {
					if (value.length > 0) {
						let have = value.find(val => val === item[props.map.value])
						item.selected = have !== undefined
					} else {
						item.selected = false
					}
				} else {
					item.selected = value === item[props.map.value]
				}

				list.push(item)
			})
			return setRange(list)
		}
		/**
		 * 处理最大最小值
		 * @param {Object} list
		 */
		function setRange(list) {
			let selectList = list.filter(item => item.selected)
			let min = Number(props.min) || 0
			let max = Number(props.max) || ''
			list.forEach((item, index) => {
				if (props.multiple) {
					if (selectList.length <= min) {
						let have = selectList.find(val => val[props.map.value] === item[props.map.value])
						if (have !== undefined) {
							item.disabled = true
						}
					}

					if (selectList.length >= max && max !== '') {
						let have = selectList.find(val => val[props.map.value] === item[props.map.value])
						if (have === undefined) {
							item.disabled = true
						}
					}
				}
				setStyles(item, index)
				list[index] = item
			})
			return list
		}
		/**
		 * 设置 class
		 * @param {Object} item
		 * @param {Object} index
		 */
		function setStyles(item, index) {
			//  设置自定义样式
			item.styleBackgroud = setStyleBackgroud(item)
			item.styleIcon = setStyleIcon(item)
			item.styleIconText = setStyleIconText(item)
			item.styleRightIcon = setStyleRightIcon(item)
		}

		/**
		 * 获取选中值
		 * @param {Object} range
		 */
		function getSelectedValue(range) {
			if (!props.multiple) return props.modelValue
			let selectedArr = []
			range.forEach((item) => {
				if (item.selected) {
					selectedArr.push(item[props.map.value])
				}
			})
			return props.modelValue.length > 0 ? props.modelValue : selectedArr
		}

		/**
		 * 设置背景样式
		 */
		function setStyleBackgroud(item) {
			let styles = {}
			let selectedColor = props.selectedColor ? props.selectedColor : '#2979ff'
			if (props.selectedColor) {
				if (props.mode !== 'list') {
					styles['border-color'] = item.selected ? selectedColor : '#DCDFE6'
				}
				if (props.mode === 'tag') {
					styles['background-color'] = item.selected ? selectedColor : '#f5f5f5'
				}
			}
			let classles = ''
			for (let i in styles) {
				classles += `${i}:${styles[i]};`
			}
			return classles
		}
		function setStyleIcon(item) {
			let styles = {}
			let classles = ''
			if (props.selectedColor) {
				let selectedColor = props.selectedColor ? props.selectedColor : '#2979ff'
				styles['background-color'] = item.selected ? selectedColor : '#fff'
				styles['border-color'] = item.selected ? selectedColor : '#DCDFE6'

				if (!item.selected && item.disabled) {
					styles['background-color'] = '#F2F6FC'
					styles['border-color'] = item.selected ? selectedColor : '#DCDFE6'
				}
			}
			for (let i in styles) {
				classles += `${i}:${styles[i]};`
			}
			return classles
		}
		function setStyleIconText(item) {
			let styles = {}
			let classles = ''
			if (props.selectedColor) {
				let selectedColor = props.selectedColor ? props.selectedColor : '#2979ff'
				if (props.mode === 'tag') {
					styles.color = item.selected ? (props.selectedTextColor ? props.selectedTextColor : '#fff') : '#666'
				} else {
					styles.color = item.selected ? (props.selectedTextColor ? props.selectedTextColor : selectedColor) : '#666'
				}
				if (!item.selected && item.disabled) {
					styles.color = '#999'
				}
			}
			for (let i in styles) {
				classles += `${i}:${styles[i]};`
			}
			return classles
		}
		function setStyleRightIcon(item) {
			let styles = {}
			let classles = ''
			if (props.mode === 'list') {
				styles['border-color'] = item.selected ? defualtColor.value : '#DCDFE6'
			}
			for (let i in styles) {
				classles += `${i}:${styles[i]};`
			}

			return classles
		}
</script>

<style lang="scss">
	$uni-primary: #2979ff !default;
	$border-color: #DCDFE6;
	$disable: 0.4;

	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
	}

	.uni-data-loading {
		@include flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 36px;
		padding-left: 10px;
		color: #999;
	}

	.uni-data-checklist {
		position: relative;
		z-index: 0;
		flex: 1;

		// 多选样式
		.checklist-group {
			padding: 6px 0 6px 12px;
			float: right;


			&.is-button {
				padding-left: 0;
				display: flex;
				flex-wrap: wrap;
			}

			&.is-list {
				flex-direction: column;
			}

			.checklist-box {
				@include flex;
				flex-direction: row;
				align-items: center;
				position: relative;
				padding: 6px 4px 6px 12px;

				.hidden {
					position: absolute;
					opacity: 0;
				}

				// 文字样式
				.checklist-content {
					@include flex;
					flex: 1;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.checklist-text {
						font-size: 14px;
						color: #666;
						margin-left: 5px;
						line-height: 14px;
					}

					.checkobx__list {
						border-right-width: 1px;
						border-right-color: #007aff;
						border-right-style: solid;
						border-bottom-width: 1px;
						border-bottom-color: #007aff;
						border-bottom-style: solid;
						height: 12px;
						width: 6px;
						left: -5px;
						transform-origin: center;
						transform: rotate(45deg);
						opacity: 0;
					}
				}

				// 多选样式
				.checkbox__inner {
					/* #ifndef APP-NVUE */
					flex-shrink: 0;
					box-sizing: border-box;
					/* #endif */
					position: relative;
					width: 16px;
					height: 16px;
					border: 1px solid $border-color;
					border-radius: 4px;
					background-color: #fff;
					z-index: 1;

					.checkbox__inner-icon {
						position: absolute;
						/* #ifdef APP-NVUE */
						top: 2px;
						/* #endif */
						/* #ifndef APP-NVUE */
						top: 1px;
						/* #endif */
						left: 5px;
						height: 8px;
						width: 4px;
						border-right-width: 1px;
						border-right-color: #fff;
						border-right-style: solid;
						border-bottom-width: 1px;
						border-bottom-color: #fff;
						border-bottom-style: solid;
						opacity: 0;
						transform-origin: center;
						transform: rotate(40deg);
					}
				}

				// 单选样式
				.radio__inner {
					@include flex;
					/* #ifndef APP-NVUE */
					flex-shrink: 0;
					box-sizing: border-box;
					/* #endif */
					justify-content: center;
					align-items: center;
					position: relative;
					width: 16px;
					height: 16px;
					border: 1px solid $border-color;
					border-radius: 16px;
					background-color: #fff;
					z-index: 1;

					.radio__inner-icon {
						width: 8px;
						height: 8px;
						border-radius: 10px;
						opacity: 0;
					}
				}

				// 默认样式
				&.is--default {

					// 禁用
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;

						/* #endif */
						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}

						.radio__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
						}

						.checklist-text {
							color: #999;
						}
					}

					// 选中
					&.is-checked {
						.checkbox__inner {
							border-color: $uni-primary;
							background-color: $uni-primary;

							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}

						.radio__inner {
							border-color: $uni-primary;

							.radio__inner-icon {
								opacity: 1;
								background-color: $uni-primary;
							}
						}

						.checklist-text {
							color: $uni-primary;
						}

						// 选中禁用
						&.is-disable {
							.checkbox__inner {
								opacity: $disable;
							}

							.checklist-text {
								opacity: $disable;
							}

							.radio__inner {
								opacity: $disable;
							}
						}
					}
				}

				// 按钮样式
				&.is--button {
					margin-right: 10px;
					padding: 5px 10px;
					border: 1px $border-color solid;
					border-radius: 3px;
					transition: border-color 0.2s;

					// 禁用
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						border: 1px #eee solid;
						opacity: $disable;

						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}

						.radio__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}

						.checklist-text {
							color: #999;
						}
					}

					&.is-checked {
						border-color: $uni-primary;

						.checkbox__inner {
							border-color: $uni-primary;
							background-color: $uni-primary;

							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}

						.radio__inner {
							border-color: $uni-primary;

							.radio__inner-icon {
								opacity: 1;
								background-color: $uni-primary;
							}
						}

						.checklist-text {
							color: $uni-primary;
						}

						// 选中禁用
						&.is-disable {
							opacity: $disable;
						}
					}
				}

				// 标签样式
				&.is--tag {
					margin-right: 10px;
					padding: 5px 10px;
					border: 1px $border-color solid;
					border-radius: 3px;
					background-color: #f5f5f5;

					.checklist-text {
						margin: 0;
						color: #666;
					}

					// 禁用
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;
						/* #endif */
						opacity: $disable;
					}

					&.is-checked {
						background-color: $uni-primary;
						border-color: $uni-primary;

						.checklist-text {
							color: #fff;
						}
					}
				}

				// 列表样式
				&.is--list {
					/* #ifndef APP-NVUE */
					display: flex;
					/* #endif */
					padding: 10px 15px;
					padding-left: 0;
					margin: 0;

					&.is-list-border {
						border-top: 1px #eee solid;
					}

					// 禁用
					&.is-disable {
						/* #ifdef H5 */
						cursor: not-allowed;

						/* #endif */
						.checkbox__inner {
							background-color: #F2F6FC;
							border-color: $border-color;
							/* #ifdef H5 */
							cursor: not-allowed;
							/* #endif */
						}

						.checklist-text {
							color: #999;
						}
					}

					&.is-checked {
						.checkbox__inner {
							border-color: $uni-primary;
							background-color: $uni-primary;

							.checkbox__inner-icon {
								opacity: 1;
								transform: rotate(45deg);
							}
						}

						.radio__inner {
							.radio__inner-icon {
								opacity: 1;
							}
						}

						.checklist-text {
							color: $uni-primary;
						}

						.checklist-content {
							.checkobx__list {
								opacity: 1;
								border-color: $uni-primary;
							}
						}

						// 选中禁用
						&.is-disable {
							.checkbox__inner {
								opacity: $disable;
							}

							.checklist-text {
								opacity: $disable;
							}
						}
					}
				}
			}
		}
	}
</style>
