<template>
	<view class="uni-data-tree">
		<view class="uni-data-tree-input" :class="{'is-disabled':disabled}" @click="handleInput">
			<slot :data="inputSelected" :error="errorMessage">
				<view class="input-value" :class="{'input-value-border': border}">
					<text v-if="errorMessage" class="selected-area error-text">{{errorMessage}}</text>
					<view v-else-if="loading && !isOpened" class="selected-area">
						<uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
					</view>
					<scroll-view v-else-if="inputSelected.length" class="selected-area" scroll-x="true">
						<view class="selected-list" v-if="showFormat=='all'">
							<view class="selected-item" v-for="(item,index) in inputSelected" :key="index">
								<text class="text-color" :class="item.value ? '' : 'placeholder'">{{item.text}}</text><text v-if="index<inputSelected.length-1"
									class="input-split-line">{{split}}</text>
							</view>
						</view>
						<view class="selected-list" v-else>
							<view class="selected-item">
								<text class="text-color">{{inputSelected[inputSelected.length-1].text}}</text>
							</view>
						</view>
					</scroll-view>
					<text v-else class="selected-area placeholder">{{placeholder}}</text>
					<view v-if="clearIcon && !readonly && inputSelected.length" class="icon-clear" @click.stop="clear">
						<uni-icons type="clear" color="#8d97a3" size="24"></uni-icons>
					</view>
					<view class="arrow-area" v-if="(!clearIcon || !inputSelected.length) && !readonly ">
              <uni-icons type="right" color="#8d97a3" size="20"></uni-icons>
					</view>
				</view>
			</slot>
		</view>
		<view class="uni-data-tree-cover" v-if="isOpened" @click="handleClose"></view>
		<view class="uni-data-tree-dialog" v-if="isOpened">
			<view class="uni-popper__arrow"></view>
			<view class="dialog-caption">
				<view class="title-area">
					<text class="dialog-title">{{popupTitle}}</text>
				</view>
				<view class="dialog-close" @click="handleClose">
					<view class="dialog-close-plus" data-id="close"></view>
					<view class="dialog-close-plus dialog-close-rotate" data-id="close"></view>
				</view>
			</view>
			<data-picker-view class="picker-view" ref="pickerView" v-model="dataValue" :localdata="localdata"
				:inputSelected="inputSelected" :type="type" :preload="preload" :managed-mode="true" :apiConfig="apiConfig"
				:selectedConfig="selectedConfig" :ellipsis="ellipsis" @change="onchange" @datachange="ondatachange"
				@nodeclick="onnodeclick">
			</data-picker-view>
		</view>
	</view>
</template>

<script>
	import dataCascader from "../uni-cascader-view/uni-data-cascader.js"
	import DataPickerView from "../uni-cascader-view/uni-cascader-view.vue"
	import {
		getAreaList
	} from '@/common/api/system/dictionary/index.js';
	import {
		camelCaseString,
	} from '@/utils/helper/utils.js';
	/**
	 * DataPicker 级联选择
	 * @description 支持单列、和多列级联选择。列数没有限制，如果屏幕显示不全，顶部tab区域会左右滚动。
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=3796
	 * @property {String} popup-title 弹出窗口标题
	 * @property {Array} localdata 本地数据，参考
	 * @property {Boolean} border = [true|false] 是否有边框
	 * @property {Boolean} readonly = [true|false] 是否仅读
	 * @property {Boolean} preload = [true|false] 是否预加载数据
	 * @value true 开启预加载数据，点击弹出窗口后显示已加载数据
	 * @value false 关闭预加载数据，点击弹出窗口后开始加载数据
	 * @property {Boolean} step-searh = [true|false] 是否分布查询
	 * @value true 启用分布查询，仅查询当前选中节点
	 * @value false 关闭分布查询，一次查询出所有数据
	 * @property {String|DBFieldString} parent-field 分布查询父字段名称
	 * @property {String} showFormat  显示格式
	 * @value all  	显示全部结果
	 * @value showMostChildLevel		显示最子级
	 * @property {String} type  级联类型
	 * @value area  	行政区域
	 * @value cascader		普通级联
	 * @event {Function} popupshow 弹出的选择窗口打开时触发此事件
	 * @event {Function} popuphide 弹出的选择窗口关闭时触发此事件
	 */
	export default {
		name: 'UniDataCascader',
		emits: ['popupopened', 'popupclosed', 'nodeclick', 'input', 'change', 'update:modelValue'],
		mixins: [dataCascader],
		components: {
			DataPickerView
		},
		props: {
			options: {
				type: [Object, Array],
				default () {
					return {}
				}
			},
			popupTitle: {
				type: String,
				default: '请选择'
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			heightMobile: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			readonly: {
				type: Boolean,
				default: false
			},
			clearIcon: {
				type: Boolean,
				default: true
			},
			border: {
				type: Boolean,
				default: true
			},
			split: {
				type: String,
				default: '/'
			},
			ellipsis: {
				type: Boolean,
				default: true
			},
			showFormat: {
				type: String,
				default: 'all'
			},
			sepTextField: {
				type: String,
				default: ''
			},
			row: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				isOpened: false,
				inputSelected: [],
				valChanged: false
			}
		},
		watch: {
			value(newVal) {
				this.initData(newVal)
			},
			modelValue(newVal) {
				 this.initData(newVal)
			}
		},
		created() {
			this.$nextTick(() => {
				this.load();
			})
		},
		methods: {
			async initData() {

				let val = ''
				if (this.modelValue) {
					val =  this.modelValue
				} else if (this.value) {
					val = this.value
				}

				if (Object.prototype.toString.call(val) === '[object String]') this.dataValue = val.split(',')
				if (Array.isArray(val) && !val.length) this.dataValue = []

				this.inputSelected = [];

				if (this.type == 'area') {
					for (let i = 0; i < this.dataValue.length; i++) {
						let o = this.dataValue[i];
						let obj = this._treeData.find(k => {
							return k.id == o
						})
						if (obj) {
							this.inputSelected.push({
								text: obj[this.map.text],
								value: obj[this.map.value]
							})
							let chil = this.dataValue[i+1];
							let chilobj = this._treeData.find(k => {
								return k.id == chil
							})
							if(!chilobj){
								let res = await getAreaList({
									id: obj[this.map.value]
								})
								this._treeData.push(...res.data)
							}
						}
					}
				} else if (this.type === 'organization') {
					for (let i = 0; i < this.dataValue.length; i++) {
						let o = this.dataValue[i];
						let obj = this._treeData.find(k => {
							return k.id == o
						})
						if(obj) this.findParent(obj)
					}
				} else {
					for (let i = 0; i < this.dataValue.length; i++) {
						let o = this.dataValue[i];
						let obj = this._treeData.find(k => {
							return k.value == o
						})
						if (obj) {
							this.inputSelected.push({
								text: obj[this.map.text],
								value: obj[this.map.value]
							})
						}
					}
				}
				if(this.inputSelected.length<=0&&this.dataValue.length>0){
					this.inputSelected.push({
						text: this.dataValue[0]
					})
				}
			},
			findParent(obj) {
				this.inputSelected.unshift({
					text: obj[this.map.text],
					value: obj[this.map.value]
				})
				if (obj.parentId) {
					const info = this._treeData.find(k => {
						return k.id == obj.parentId
					})
					if (info) this.findParent(info)
				}
			},
			async clear() {
				this.inputSelected = [];
				this.selected = [];
				 this.selectedIndex=0;
				 this._treeData=[];
				 await this.loadData();
				this._dispatchEvent([]);
			},
			async load() {

				if (this.readonly) {
					return;
				}

				if (!this.hasValue) {
					return;
				}

				if(this.sepTextField && !this.valChanged) {
					this.inputSelected = [
						{
							text: this.row[camelCaseString(this.sepTextField)] || '请选择',
							value: this.modelValue || null
						}
					];
				} else {
					await this.loadData();
					// 回显本地数据
					if (this.isLocalData) {
						this.inputSelected = this.selected.slice(0);
					} else {
						this.initData()
					}
				}
			},
			show() {
				this.isOpened = true;
				if (this.inputSelected.length <= 0) {
					this.selected=[{
						value: null,
						text: "请选择"
					}]
				} else {
					if(this.inputSelected.length==1&&!this.inputSelected[0].value){
						this.selected=[{
							value: null,
							text: "请选择"
						}]
					}else{
						this.selected = this.inputSelected.slice(0);
					}
					this.selectedIndex = this.selected.length - 1
				}
				setTimeout(() => {
					this.$refs.pickerView.updateData({
						treeData: this._treeData,
						selected: this.selected,
						selectedIndex: this.selectedIndex
					})
				}, 200)
				this.$emit('popupopened')
			},
			hide() {
				this.isOpened = false
				this.$emit('popupclosed')
			},
			async handleInput() {
				if (this.readonly||this.disabled) {
					return
				}
				this.valChanged = true;
				await this.loadData();
				this.show()
			},
			handleClose(e) {
				this.hide()
			},
			onnodeclick(e) {
				this.$emit('nodeclick', e)
			},
			ondatachange(e) {
				this._treeData = this.$refs.pickerView._treeData
			},
			onchange(e) {
				this.hide()
				this.$nextTick(() => {
					this.inputSelected = e;
					this.updateSepTextField();
				})
				this._dispatchEvent(e)
			},
			updateSepTextField() {
				if (!this.sepTextField || !this.row) {
					return;
				}
				if(!this.inputSelected.length) return;
				const v = this.inputSelected.map((item) => {
					return item.text
				}).join(',');
				this.row[camelCaseString(this.sepTextField)] = v;
			},
			// _processReadonly(dataList, value) {
			// 	var isTree = dataList.findIndex((item) => {
			// 		return item.children
			// 	})
			// 	if (isTree > -1) {
			// 		let inputValue
			// 		if (Array.isArray(value)) {
			// 			inputValue = value[value.length - 1]
			// 			if (typeof inputValue === 'object' && inputValue.value) {
			// 				inputValue = inputValue.value
			// 			}
			// 		} else {
			// 			inputValue = value
			// 		}
			// 		this.inputSelected = this._findNodePath(inputValue, this.localdata)
			// 		return
			// 	}

			// 	if (!this.hasValue) {
			// 		this.inputSelected = []
			// 		return
			// 	}

			// 	let result = []
			// 	for (let i = 0; i < value.length; i++) {
			// 		var val = value[i]
			// 		var item = dataList.find((v) => {
			// 			return v.value == val
			// 		})
			// 		if (item) {
			// 			result.push(item)
			// 		}
			// 	}
			// 	if (result.length) {
			// 		this.inputSelected = result
			// 	}
			// },
			// _filterForArray(data, valueArray) {
			// 	var result = []
			// 	for (let i = 0; i < valueArray.length; i++) {
			// 		var value = valueArray[i]
			// 		var found = data.find((item) => {
			// 			return item.value == value
			// 		})
			// 		if (found) {
			// 			result.push(found)
			// 		}
			// 	}
			// 	return result
			// },
			_dispatchEvent(selected) {
				//let item = {}
				if (selected.length) {
					var value = new Array(selected.length)
					for (var i = 0; i < selected.length; i++) {
						value[i] = selected[i].value
					}
					this.$emit('input', value.join(','))
					this.$emit('update:modelValue', value.join(','))
					this.$emit('change', value.join(','))

					//item = selected[selected.length - 1]
				} else {
					this.$emit('input', '')
					this.$emit('update:modelValue', '')
					this.$emit('change', '')
				}



			}
		}
	}
</script>

<style>
	.uni-data-tree {
		flex: 1;
		position: relative;
		font-size: 14px;
	}

	.error-text {
		color: #DD524D;
	}

	.input-value {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		font-size: 14px;
		/* line-height: 35px; */
		padding: 0 0 0 10px;
		overflow: hidden;
		height: 35px;
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
	}

	.input-value-border {
		/* border: 1px solid #e5e5e5; */
		border-radius: 5px;
	}

	.selected-area {
		flex: 1;
		overflow: hidden;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.load-more {
		/* #ifndef APP-NVUE */
		margin-right: auto;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 40px;
		/* #endif */
	}

	.selected-list {
		overflow: hidden;
		height: 35px;
		white-space: nowrap;
		line-height: 35px;
		float: right;
	}

	.selected-item {
		display: inline-block;
	}

	.text-color {
		color: #333;
	}

	.placeholder {
		color: #999;
		font-size: 14px;
	}

	.input-split-line {
		opacity: .5;
	}

	.arrow-area {
		position: relative;
		width: 20px;
		/* #ifndef APP-NVUE */
		margin-bottom: 5px;
		margin-left: auto;
		display: flex;
		/* #endif */
		justify-content: center;
	}

	.input-arrow {
		width: 7px;
		height: 7px;
		border-left: 1px solid #999;
		border-bottom: 1px solid #999;
	}

	.uni-data-tree-cover {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .4);
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		z-index: 100;
	}

	.uni-data-tree-dialog {
		position: fixed;
		left: 0;
		/* #ifndef APP-NVUE */
		top: 20%;
		/* #endif */
		/* #ifdef APP-NVUE */
		top: 200px;
		/* #endif */
		right: 0;
		bottom: 0;
		background-color: #FFFFFF;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		z-index: 102;
		overflow: hidden;
		/* #ifdef APP-NVUE */
		width: 750rpx;
		/* #endif */
	}

	.dialog-caption {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		/* border-bottom: 1px solid #f0f0f0; */
	}

	.title-area {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
		padding: 0 10px;
	}

	.dialog-title {
		/* font-weight: bold; */
		line-height: 44px;
	}

	.dialog-close {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		padding: 0 15px;
	}

	.dialog-close-plus {
		width: 16px;
		height: 2px;
		background-color: #666;
		border-radius: 2px;
		transform: rotate(45deg);
	}

	.dialog-close-rotate {
		position: absolute;
		transform: rotate(-45deg);
	}

	.picker-view {
		flex: 1;
		overflow: hidden;
	}

	.icon-clear {
		display: flex;
		align-items: center;
	}

	/* #ifdef H5 */
	@media all and (min-width: 768px) {
		.uni-data-tree-cover {
			background-color: transparent;
		}

		.uni-data-tree-dialog {
			position: absolute;
			top: 55px;
			height: auto;
			min-height: 400px;
			max-height: 50vh;
			background-color: #fff;
			border: 1px solid #EBEEF5;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			border-radius: 4px;
			overflow: unset;
		}

		.dialog-caption {
			display: none;
		}

		.icon-clear {
			/* margin-right: 5px; */
		}
	}

	/* #endif */

	/* picker 弹出层通用的指示小三角, todo：扩展至上下左右方向定位 */
	/* #ifndef APP-NVUE */
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

	/* #endif */

	.is-disabled{
		color: #d5d5d5;
	}
</style>
