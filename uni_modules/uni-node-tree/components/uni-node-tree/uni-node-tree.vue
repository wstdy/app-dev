<template>
	<view class="uni-select__selector" :style="{width:width+'px'}" v-if="showSelector&&loadding">
		<view class="uni-popper__arrow"></view>
		<scroll-view scroll-y="true" class="uni-select__selector-scroll">
			<view class="uni-select__selector-empty" v-if="mixinDatacomResData.length === 0">
				<text class="empty-text">{{emptyTips}}</text>
			</view>
			<node-item v-else :mixinDatacomResData="mixinDatacomResData" :level="1" @change="change"></node-item>
		</scroll-view>
	</view>
</template>

<script>
	import {getDicDetailList} from '@/common/api/system/dictionary/index.js';
	import {
		changeApiOptions
	} from '@/common/api/magic-api/useApiRequest.js';
	import NodeItem from './node-item.vue'
	export default {
			name: "uni-node-tree", 
			data() {
				return { 
					emptyTips: '无数据',
					dataValue:'',
					mixinDatacomResData: [],
					apps: [],
					channels: [],
					loadding:true
				};
			},
			components:{
				NodeItem
			},
			props: {
				localdata: {
					type: Array,
					default () {
						return []
					}
				},
				value: {
					type: [String, Number],
					default: ''
				},
				modelValue: {
					type: [String, Number],
					default: ''
				},
				showSelector:  {
					type: Boolean,
					default: true
				},  
				childIcon: {
					type: String,
					default: ''
				},
	      disabled: {
					type: Boolean,
					default: false
				},
				parentIcon:{
					type: String,
					default: ''
				},
				apiConfig:{
					type: Object,
					default(){
						return {}
					}
				},
				itemId: {
					type: String,
					default: ''
				},
				width: {
					type: [String, Number],
					default: ''
				},
			},
			async created() {
				this.loadding=false;
				if (this.localdata && this.localdata.length !== 0) { 
					this.mixinDatacomResData = this.localdata 
				} else if(this.itemId) { 
					let res=await getDicDetailList({itemId:this.itemId})
					if(res.success){ 
						 this.getDataList(res.data) 
					}
				}else if(this.apiConfig?.path){ 
					let res = await changeApiOptions(this.apiConfig);  
					if(res.data){ 
						if(Array.isArray(res.data)||Array.isArray(res.data.list)){
							this.getDataList(res.data||res.data.list) 
						}
						 
					}
				}
				this.loadding=true;
			},
			computed: { 
			 
			},
			watch: { 
				 
			},
			methods: {
				 
	/**
				 * 获取渲染的新数组
				 * @param {Object} value 选中内容
				 */
				getDataList(data) {
			 
					this.mixinDatacomResData  = []
					data.forEach((item, index) => {
						item.key=item.value ;
						item.title=item.name ||item.label
						this.mixinDatacomResData.push(item)
					})  
				},
				 
	 
				change(item) {
					this.$emit('change', item)
				},
				 
			 
			}
		}
</script>

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
		padding: 10px 0 0;
	}
	
	.uni-select__selector-scroll {
		/* #ifndef APP-NVUE */
		max-height: 300px;
		box-sizing: border-box;
		/* #endif */
	}
	
	.uni-select__selector-empty {
		/* #ifndef APP-NVUE */ 
		cursor: pointer;
		/* #endif */
		line-height: 35px;
		font-size: 14px; 
		/* border-bottom: solid 1px $uni-border-3; */
		padding: 0px 10px;
		margin-top: -10px;
	}
	 
	.uni-select__selector-empty:last-child {
		/* #ifndef APP-NVUE */
		border-bottom: none;
		/* #endif */
	}
	.empty-text{
		color: #999;
		font-size: 12px;
		
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
</style>