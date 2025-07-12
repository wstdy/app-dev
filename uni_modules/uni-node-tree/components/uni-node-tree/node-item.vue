<template>
	<view class="uni-select__selector-item" :class="{'first-level':level==1,'isLeaf':!item.children||item.children?.length<=0,'isChild':level>1}" v-for="(item,index) in mixinDatacomResData"
		:key="index" @click.stop="change(item)">
		<view class="item-text" :class="{'uni-select__selector__disabled': item.disable}">
			<uni-icons v-if="item.children?.length>0"
				:type="collpse?'ant-design:caret-up':'ant-design:caret-down'" :size="12" color="#BBBEC9"
				custom-prefix="antfont"></uni-icons>
				{{item.title}}
				</view>
		<node-item v-if="item.children?.length>0" :mixinDatacomResData="item.children" :level="level+1" @change="handlechange"></node-item>
	</view>
</template>

<script>
	export default {
		name: "node-item",
		emits: [ 
			"change",
		],
		data() {
			return {
				collpse: false
			};
		},
		props: {
			level: {
				type: Number,
				default: 1
			},
			mixinDatacomResData: {
				type: Array,
				default () {
					return []
				}
			},
			childIcon: {
				type: String,
				default: ''
			},
			parentIcon: {
				type: String,
				default: ''
			}
		},
		async created() {

		},
		computed: {

		},
		watch: {

		},
		methods: {
			change(item) { 
				 this.$emit('change', item.key) 
			},
			handlechange(v) { 
				 this.$emit('change', v) 
			},
		}
	}
</script>

<style>
	.uni-select__selector-item {
		cursor: pointer;
		margin: 0px 10px 10px;
		padding: 0px 10px 10px;
		color: #253954;
		line-height: 34px; 
		font-size: 12px;
		word-break: break-all;
	}

	.uni-select__selector-item.first-level {
		line-height: 24px;
		background: #FAFAFA;
		border-radius: 5px; 
	}
	.isLeaf{
		border-left:1px dashed #D1D2D7;
		margin-left: 16px;
	}
	.isChild{
		line-height: 24px;
		padding-bottom: 0;
		margin-bottom: 0;
		margin-right: 0;
		    padding-right: 0;
	}
	.first-level.isLeaf{
		border-left: 0;
		margin-left: 10px;
		padding-bottom: 0;
		line-height: 34px;
	}
	.uni-select__selector-item:hover {
		background-color: #f9f9f9;
	}

	.uni-select__selector-item:last-child {
		/* #ifndef APP-NVUE */
		border-bottom: none;
		/* #endif */
	}

	.uni-select__selector__disabled {
		opacity: 0.4;
		cursor: default;
	}
</style>