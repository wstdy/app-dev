<template>
	<input-box type="text" :localMsg="localMsg" :prefixIcon="prefixIcon" :suffixIcon="suffixIcon" >
		<template #content>
			<view class="uni-autocode__content-input" :style="inputStyle" @tap="handleClick">
				<text v-if="val" style="white-space: nowrap;">{{val}}</text>
				<text v-else :style="placeholderStyle" class="uni-autocode__placeholder-class">{{placeholder}}</text>
			</view>
		</template>
 
	</input-box>
</template>

<script > 
import {
		camelCaseString 
	} from '@/utils/helper/utils.js';
 
	/**
	 * uni-select-map 地图组件 
	 * @property {String}	value	输入内容    
	 * @property {String }	placeholder	提示文字
	 * @property {String }	placeholderStyle	placeholder的样式(内联样式，字符串)，如"color: #ddd"   
	 * @property {String }  address  纬度
	 * @property {String}	prefixIcon	头部图标
	 * @property {String}	suffixIcon	尾部图标
	 * @property {String}	latiAndLong 	经度  
	 * @property {Boolean}	inputBorder	是否显示input输入框的边框（默认true） 
	 * @property {Object}	styles	自定义颜色     
	 * @slot prefixIcon 头部插槽
	 * @slot suffixIcon 尾部插槽
	 * @example <uni-select-map v-model="code"></uni-select-map>
	 */
	function obj2strClass(obj) {
		let classess = "";
		for (let key in obj) {
			const val = obj[key];
			if (val) {
				classess += `${key} `;
			}
		}
		return classess;
	}

	function obj2strStyle(obj) {
		let style = "";
		for (let key in obj) {
			const val = obj[key];
			style += `${key}:${val};`;
		}
		return style;
	}
	export default {
		name: "uni-auto-code",
		emits: [
			"update:modelValue", "input","change","click"
		],
		model: {
			prop: "modelValue",
			event: "update:modelValue",
		},
		options: {
			virtualHost: true,
		},
		inject: {
			form: {
				from: "uniForm",
				default: null,
			},
			formItem: {
				from: "uniFormItem",
				default: null,
			},
			formModel:{
				from: "formModel",
				default: {},
			},
			isCustomForm:{
				from: "isCustomForm",
				default: false,
			}
		},
 
		props: {
			name: String,
			value: [Number, String],
			modelValue: [Number, String], 
			placeholder: {
				type: String,
				default: " ",
			},
			placeholderStyle: String,
			inputBorder: {
				type: Boolean,
				default: true,
			},
			prefixIcon: {
				type: String,
				default: "",
			},
			suffixIcon: {
				type: String,
				default: "",
			},
			index: {
				type: Number,
				default: null,
			},
			bindTable: {
				type: String,
				default: "",
			},
			latiAndLong: {
				type: String,
				default: "",
			},
			address: {
				type: String,
				default: "",
			}, 
			styles: {
				type: Object,
				default () {
					return {
						color: "#333",
						disableColor: "#F7F6F6",
						borderColor: "#e5e5e5",
					};
				},
			},
			errorMessage: {
				type: [String, Boolean],
				default: "",
			},
		},
		data() {
			return {
				val: "",
				showMsg: "",
				border: false,
				localMsg: "",
				visible:false
			};
		}, 
		computed: {

			msg() {
				// TODO 处理头条 formItem 中 errMsg 不更新的问题
				return this.localMsg || this.errorMessage;
			},

			// 处理外层样式的style
			boxStyle() {
				return `color:${
				this.inputBorder && this.msg ? "#e43d33" : this.styles.color
			};`;
			},
			// input 内容的类和样式处理
			inputContentClass() {
				return obj2strClass({
					"is-input-border": this.inputBorder,
					"is-input-error-border": this.inputBorder && this.msg,
					"is-left-radius": this.addonBefore,
					"is-right-radius": this.addonAfter
				});
			},
			inputContentStyle() {
				const focusColor = this.styles.borderColor;
				const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
				return obj2strStyle({
					"border-color": borderColor || "#e5e5e5",
					"background-color": this.styles.backgroundColor,
				});
			},
			// input右侧样式
			inputStyle() {
				const paddingRight =
					this.prefixIcon ?
					"" :
					"10px";
				return obj2strStyle({
					"padding-right": paddingRight,
					"padding-left": this.prefixIcon ? "" : "10px",
				});
			},
		},
		watch: {
			value(newVal) {
				this.val = newVal;
			},
			modelValue(newVal) {
				this.val = newVal;
			},
		},
 
		async created() {
			await this.init();
			// TODO 处理头条vue3 computed 不监听 inject 更改的问题（formItem.errMsg）
			if (this.form && this.formItem) {
				this.$watch("formItem.errMsg", (newVal) => {
					this.localMsg = newVal;
				});
			} 
		},
		mounted() {
			
		},
		methods: {
			/**
			 * 初始化变量值
			 */
			async init() {
				if (this.value) {
					this.val = this.value;
				} else if (this.modelValue) {
					this.val = this.modelValue;
				}   else {
					this.val = null;
				}
			},
			handleClick(){
				 let that=this;
				 that.$emit('click',that.val)
				uni.chooseLocation({
					success: function (res) {
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
						let lnglat=res.latitude+','+res.longitude
						that.val=res.address;
						that.changeFieldData(res.address,lnglat)
						that.$emit("input", that.val);
						that.$emit('update:modelValue',that.val)
						that.$emit('change',that.val)
					}
				});
			},
			handleClose(){
				this.visible=false
			},
			handleConfirm(){
				this.visible=false
			},
			  changeFieldData(address,lnglat) {
			    if (!this.formModel) return;
			    if (this.address) {
			      const addressField  = this.isCustomForm ? this.address : camelCaseString(this.address);
			      if (this.bindTable && this.index !== undefined && this.index !== null) {
							
			        this.formModel.value[this.bindTable][this.index][addressField] = address;
			      } else {
			        this.formModel.value[addressField] =  address;
			      }
			    }
			    if (this.latiAndLong) {
			      const latiAndLong  = this.isCustomForm
			        ? this.latiAndLong
			        : camelCaseString(this.latiAndLong);
			      if (this.bindTable && this.index != undefined && this.index !== null) {
			        this.formModel.value[this.bindTable][this.index][latiAndLong] =  lnglat ;
			      } else {
			        this.formModel.value[latiAndLong] =  lnglat ;
			      }
			    }
			  }
		},
	};
</script>

<style lang="scss">
	$uni-error: #e43d33;
	$uni-border-1: #dcdfe6 !default;

	$bg: #f5f5f5;
	$br: 2px;
	$color: #333;

	.uni-autocode {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
		position: relative;
		text-align: left;
		color: #333;
		font-size: 14px;
		display: flex;
	}

	.uni-autocode__content {
		flex: 1;
		/* #ifndef APP-NVUE */
		width: 100%;
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		// 处理border动画刚开始显示黑色的问题
		border-color: #fff;
		transition-property: border-color;
		transition-duration: 0.3s;
	}

	.uni-autocode__content-input {
		/* #ifndef APP-NVUE */
		width: auto;
		/* #endif */
		position: relative;
		overflow: hidden;
		flex: 1;
		line-height: 1;
		font-size: 14px;
		height: 35px;
		display: flex;
		align-items: center;
	}

	.uni-autocode__placeholder-class {
		color: #999;
		font-size: 12px;
	}

	.input-padding {
		padding-left: 10px;
	}

	.label-icon {
		margin-right: 5px;
		margin-top: -1px;
	}

	// 显示边框
	.is-input-border {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		align-items: center;
		border: 1px solid $uni-border-1;
		border-radius: 4px;
		/* #ifdef MP-ALIPAY */
		overflow: hidden;
		/* #endif */
	}

	.is-left-radius {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.is-right-radius {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.uni-error-message {
		position: absolute;
		bottom: -17px;
		left: 0;
		line-height: 12px;
		color: $uni-error;
		font-size: 12px;
		text-align: left;
	}

	.uni-error-msg--boeder {
		position: relative;
		bottom: 0;
		line-height: 22px;
	}

	.is-input-error-border {
		border-color: $uni-error;

		.uni-autocode__placeholder-class {
			color: mix(#fff, $uni-error, 50%);
		}
	}

	.uni-autocode--border {
		margin-bottom: 0;
		padding: 10px 15px;
		// padding-bottom: 0;
		border-top: 1px #eee solid;
	}

	.uni-autocode-error {
		padding-bottom: 0;
	}

	.is-first-border {
		/* #ifndef APP-NVUE */
		border: none;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-width: 0;
		/* #endif */
	}

	.uni-numbox-btns {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 8px;
		background-color: $bg;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-numbox__minus {
		border-top-left-radius: $br;
		border-bottom-left-radius: $br;
	}

	.uni-numbox__plus {
		border-top-right-radius: $br;
		border-bottom-right-radius: $br;
	}

	.uni-numbox--text {
		// fix nvue
		line-height: 20px;

		font-size: 12px;
		font-weight: 300;
		color: $color;
	}
</style>