<template>
	<view class="ant-switch-box">
		<button type="button" :disabled="disabled" class="ant-switch" :class="[val===1?'ant-switch-checked':'']"
			 :style="{background:val===1?checkedColor:unCheckedColor}" @click="switchChange">
			<view class="ant-switch-handle"> </view>
			<view class="ant-switch-inner">{{val===1?checkedText:unCheckedText}}</view>
		</button>
	</view>
</template>

<script>
	/**
	 * custom-switch 开关组件
	 * @property {String}	value	值
	 * @property {Boolean}	disabled	是否禁用（默认false）
	 * @property {String}   checkedText  值是true时文本
	 * @property {String}   unCheckedText 值是false时文本
	 * @property {String}   checkedColor 值是true时颜色
	 * @property {String}   unCheckedColor 值是false时颜色
	 * @example <custom-switch v-model="mobile"></custom-switch>
	 */
	export default {
		name: "custom-switch",
		emits: [
			"update:modelValue",
			"input",
			"change"
		],
		model: {
			prop: "modelValue",
			event: "update:modelValue",
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
			value: [Number, String],
			modelValue: [Number, String],
			disabled: {
				type: Boolean,
				default: false,
			},
			checkedText: {
				type: String,
				default: '',
			},
			unCheckedText: {
				type: String,
				default: '',
			},
			checkedColor: {
				type: String,
				default: '#5e95ff',
			},
			unCheckedColor: {
				type: String,
				default: '#bbbdbf',
			},
		},
		data() {
			return {
				val: 0
			};
		},
		watch: {
			value(newVal) {
				this.val = newVal;
			},
			modelValue(newVal) {
				this.val = newVal;
			},
		},
		created() {
			this.init();
		},
		methods: {
			/**
			 * 初始化变量值
			 */
			init() {
				if (this.value || this.value === 0) {
					this.val = this.value;
				} else if (this.modelValue || this.modelValue === 0) {
					this.val = this.modelValue;
				} else {
					this.val = 0;
				}
			},
			switchChange() {
				if (this.val === 1) this.val = 0;
				else if (this.val === 0) this.val = 1
				// TODO 兼容 vue2
				this.$emit("input", this.val);
				this.$emit("change", this.val);
				// TODO　兼容　vue3
				this.$emit("update:modelValue", this.val);
			}
		}
	}
</script>

<style>
	.ant-switch-box {
		display: flex;
		align-items: center;
		height: 100%;
		float: right;
	}

	.ant-switch {
		margin: 0;
		padding: 0;
		color: rgba(0, 0, 0, 0.85);
		font-size: 14px;
		font-variant: tabular-nums;
		line-height: 1.5715;
		list-style: none;
		font-feature-settings: tnum;
		position: relative;
		display: inline-block;
		box-sizing: border-box;
		min-width: 44px;
		height: 22px;
		line-height: 22px;
		vertical-align: middle;
		background-color: rgba(0, 0, 0, 0.25);
		border: 0;
		border-radius: 100px;
		cursor: pointer;
		transition: all 0.2s;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}
.ant-switch[disabled] {
    color: rgba(255, 255, 255, 0.6);
    cursor: not-allowed;
		opacity: 0.5;
}
	.ant-switch-handle {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		transition: all 0.2s ease-in-out;
	}

	.ant-switch-checked .ant-switch-handle {
		left: calc(100% - 18px - 2px);
	}

	.ant-switch-inner {
		display: block;
		margin: 0 7px 0 25px;
		color: #fff;
		font-size: 12px;
		transition: margin 0.2s;
	}

	.ant-switch-checked .ant-switch-inner {
		margin: 0 25px 0 7px;
	}

	.ant-switch-handle::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-radius: 9px;
		box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
		transition: all 0.2s ease-in-out;
		content: '';
	}
</style>
