<template>
	<view class="uni-data-pickerview">
		<scroll-view class="selected-area" scroll-x="true">
			<view class="selected-list">
				<template v-for="(item,index) in selected">
					<view class="selected-item" :class="{'selected-item-active':index==selectedIndex,'selected-item-text-overflow':ellipsis}" v-if="item.text"
						@click="handleSelect(index)">
						<text>{{item.text}}</text>
					</view>
				</template>
			</view>
		</scroll-view>
		<view class="tab-c">
			<template v-for="(child, i) in dataList">
				<scroll-view class="list" :key="i" v-if="i==selectedIndex" :scroll-y="true">
					<view v-if="selectedConfig=='any'">
						<radio-group class="checklist-group">
							<label class="item" :class="{'is-disabled': !!item.disable}" v-for="(item, j) in child">
								<text class="item-text" @click.stop="handleNodeClick(item, i, j)">{{item[map.text]}}</text>
								<radio class="hidden" :disabled="item.disable" :value="item[map.value]"
									:checked="item[map.value] == selected[selected.length-1].value" @click="handleChange(item, i, j)" />
							</label>
						</radio-group>
					</view>
					<view v-else>
						<view class="item" :class="{'is-disabled': !!item.disable}" v-for="(item, j) in child">
							<text class="item-text" @click="handleNodeClick(item, i, j)">{{item[map.text]}}</text>
							<view class="check" v-if="selected.length > i && item[map.value] == selected[i].value"></view>
						</view>
					</view>
				</scroll-view>
			</template>
			<view class="loading-cover" v-if="loading">
				<uni-load-more class="load-more" :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view class="error-message" v-if="errorMessage">
				<text class="error-text">{{errorMessage}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import dataPicker from "./uni-data-cascader.js"
import {getAreaList} from '@/common/api/system/dictionary/index.js';
	/**
	 * DataPickerview
	 * @description uni-cascader-view
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=3796
	 * @property {Array} localdata 本地数据，参考
	 * @property {Boolean} step-searh = [true|false] 是否分布查询
	 * @value true 启用分布查询，仅查询当前选中节点
	 * @value false 关闭分布查询，一次查询出所有数据 
	 * @property {String|DBFieldString} parent-field 分布查询父字段名称 
	 * @property {String} selectedConfig 选择设置
	 * @value 'selectMostChildLevel' 必须选到最子级
	 * @value 'any' 可以选到任意一级
	 */
	export default {
		name: 'UniDataPickerView',
		emits: ['nodeclick', 'change', 'datachange', 'update:modelValue'],
		mixins: [dataPicker],
		props: {
			managedMode: {
				type: Boolean,
				default: false
			},
			ellipsis: {
				type: Boolean,
				default: true
			},
			inputSelected: {
				type: [Array, Object],
				default () {
					return []
				}
			},
		},
		created() {
			if (!this.managedMode) {
				this.$nextTick(() => {
					this.loadData();
				})
			}
		},
		methods: { 
			handleSelect(index) {
				this.selectedIndex = index;
			},
			handleNodeClick(item, i, j) { 
				if (item.disable) {
					return;
				}
				const node = this.dataList[i][j];
				
				const text = node[this.map.text];
				const value = node[this.map.value];

				if (i < this.selected.length - 1) {
					this.selected.splice(i, this.selected.length - i)
					this.selected.push({
						text,
						value
					})
				} else if (i === this.selected.length - 1) {
					this.selected.splice(i, 1, {
						text,
						value
					})
				} 
				const {
					isleaf,
					hasNodes
				} = this._updateBindData() 
				if (!isleaf && this.selected.length < this.dataList.length) {
					this.selected.push({
						value: null,
						text: "请选择"
					})
					this.selectedIndex += 1
				} 
				// 本地数据
				if (this.type == 'area') {
					if (isleaf) {
					  this.onSelectedChange(node, isleaf)
					} else if (hasNodes) { // 请求一次服务器以确定是否为叶子节点
					  getAreaList({id:node.id}).then((res) => {
					    if (!res.data.length) {
					      node.isleaf = true
					    } else {
								res.data.forEach(o=>{
									let obj=this._treeData.find(e=>{return e.id==o.id})
									if(!obj){
										this._treeData.push(o)
									}
								})
					      
					      this._updateBindData(node)
								if ( this.selected.length < this.dataList.length) {
									this.selected.push({
										value: null,
										text: "请选择"
									})
									this.selectedIndex += 1
								}
					    }
					    this.onSelectedChange(node, node.isleaf)
					  })
					} 
				} else {  
				  this.onSelectedChange(node, (!hasNodes || isleaf))
				}  
			},
			updateData(data) {
				this._treeData = data.treeData
				this.selected = data.selected.slice(0);
				this.selectedIndex = data.selectedIndex
				if (!this._treeData.length) {
					this.loadData()
				} else { 
					this._updateBindData()
				}
			},
			onDataChange() {
				this.$emit('datachange');
			},
			onSelectedChange(node, isleaf) {
				if (isleaf) {
					this._dispatchEvent()
				}

				if (node) {
					this.$emit('nodeclick', node)
				}
			},
			_dispatchEvent() { 
				this.$emit('change', this.selected.slice(0))
			},
			handleChange(item, i, j) { 
				const text = item[this.map.text];
				const value = item[this.map.value];

				if (i < this.selected.length - 1) {
					this.selected.splice(i, this.selected.length - i)
					this.selected.push({
						text,
						value
					})
				} else if (i === this.selected.length - 1) {
					this.selected.splice(i, 1, {
						text,
						value
					})
				}
			 
				this._dispatchEvent()
	 
			}
		}
	}
</script>

<style lang="scss">
	$uni-primary: #007aff !default;

	.uni-data-pickerview {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.error-text {
		color: #DD524D;
	}

	.loading-cover {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, .5);
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		z-index: 1001;
	}

	.load-more {
		/* #ifndef APP-NVUE */
		margin: auto;
		/* #endif */
	}

	.error-message {
		background-color: #fff;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 15px;
		opacity: .9;
		z-index: 102;
	}

	/* #ifdef APP-NVUE */
	.selected-area {
		width: 750rpx;
	}

	/* #endif */

	.selected-list {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-wrap: nowrap;
		/* #endif */
		flex-direction: row;
		padding: 0 5px;
		border-bottom: 1px solid #f8f8f8;
	}

	.selected-item {
		margin-left: 10px;
		margin-right: 10px;
		padding: 12px 0;
		text-align: center;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
	}

	.selected-item-text-overflow {
		width: auto; 
		overflow: hidden; 
		max-width: 6em;
		white-space: nowrap;
		text-overflow: ellipsis; 
		height: 10px; 
	}

	.selected-item-active {
		border-bottom: 2px solid $uni-primary;
	}

	.selected-item-text {
		color: $uni-primary;
	}

	.tab-c {
		position: relative;
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		overflow: hidden;
	}

	.list {
		flex: 1;
	}

	.item {
		padding: 12px 15px;
		/* border-bottom: 1px solid #f0f0f0; */
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: space-between;
	}

	.is-disabled {
		opacity: .5;
	}

	.item-text {
		flex: 1;
		color: #333333;
	}

	.item-text-overflow {
		width: 280px;
		/* fix nvue */
		overflow: hidden;
		/* #ifndef APP-NVUE */
		width: 20em;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		/* #endif */
	}

	.check {
		margin-right: 5px;
		border: 2px solid $uni-primary;
		border-left: 0;
		border-top: 0;
		height: 12px;
		width: 6px;
		transform-origin: center;
		/* #ifndef APP-NVUE */
		transition: all 0.3s;
		/* #endif */
		transform: rotate(45deg);
	}
</style>