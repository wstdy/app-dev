<template>
	<input-box type="text" :disabled="true" :localMsg="localMsg" :prefixIcon="prefixIcon" :suffixIcon="suffixIcon" :addonBefore="addonBefore" :addonAfter="addonAfter">
		<template #content>
			<input type="text" class="uni-autocode__content-input" :style="inputStyle" :name="name" :value="val"
				:placeholder="placeholder" :placeholderStyle="placeholderStyle"
				placeholder-class="uni-autocode__placeholder-class" :disabled="true" />
		</template>
	</input-box>
</template>

<script>
	import {
		getCodeRule
	} from './common.js'
	/**
	 * autocode 编码组件 
	 * @property {String}	value	输入内容    
	 * @property {String }	placeholder	提示文字
	 * @property {String }	placeholderStyle	placeholder的样式(内联样式，字符串)，如"color: #ddd"   
	 * @property {String }  autoCodeRule  编码规则
	 * @property {String}	prefixIcon	头部图标
	 * @property {String}	suffixIcon	尾部图标
	 * @property {String}	addonBefore 	前置标签
	 * @property {String}	addonAfter	后置标签
	 * @property {String}	primaryColor	设置主题色（默认#2979ff） 
	 * @property {Boolean}	inputBorder	是否显示input输入框的边框（默认true） 
	 * @property {Object}	styles	自定义颜色     
	 * @slot prefixIcon 头部插槽
	 * @slot suffixIcon 尾部插槽
	 * @example <uni-auto-code v-model="code"></uni-auto-code>
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
			"update:modelValue", "input"
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
		},
		props: {
			name: String,
			value: [Number, String],
			modelValue: [Number, String],
			autoCodeRule: {
				type: String,
				default: " ",
			},
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
			addonBefore: {
				type: String,
				default: "",
			},
			addonAfter: {
				type: String,
				default: "",
			},
			primaryColor: {
				type: String,
				default: "#2979ff",
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
		mounted() {},
		methods: {
			/**
			 * 初始化变量值
			 */
			async init() {
				if (this.value) {
					this.val = this.value;
				} else if (this.modelValue) {
					this.val = this.modelValue;
				} else if (this.autoCodeRule) {
					let res = await getCodeRule({
						encode: this.autoCodeRule
					})
					this.val = res.data;
					// TODO 兼容 vue2
					this.$emit("input", this.val);
					// TODO　兼容　vue3
					this.$emit("update:modelValue", this.val);
				} else {
					this.val = null;
				}
			},

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