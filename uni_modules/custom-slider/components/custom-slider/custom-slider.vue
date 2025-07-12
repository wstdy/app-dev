<template>
	<view>
		<slider :value="val" @change="sliderChange" :min="min" :max="max" :step="step" show-value :disabled="disabled"/>
	</view>
</template>

<script>
	/**
	 * custom-slider 滑块组件  
	 * @property {String}	value	值
	 * @property {Boolean}	disabled	是否禁用（默认false）  
	 * @property {Number} min 最小值
	 * @property {Number} max 最大值
	 * @property {Number} step 步长
	 * @example <custom-slider v-model="mobile"></custom-slider>
	 */
	export default {
		name: "custom-slider",
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
			max: {
				type: [Number, String],
				default: 100,
			},
			min: {
				type: [Number, String],
				default: 0,
			},
			step: {
				type: [Number, String],
				default: 1,
			}, 
		},
		data() {
			return { 
				val:''
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
					this.val = null;
				}
			},
			sliderChange(e) {
				let value=e.detail.value 
				// TODO 兼容 vue2
				this.$emit("input", value);
				this.$emit("change", value);
				// TODO　兼容　vue3
				this.$emit("update:modelValue", value);
			}
		}
	}
</script>

<style>
</style>