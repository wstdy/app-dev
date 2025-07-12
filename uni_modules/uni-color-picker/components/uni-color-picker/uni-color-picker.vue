<template>
	<view style="display: flex;align-items: center;height: 100%;" > 
		<view class="color-box" @click="handleClick">
			<view class="color-box-color" :style="colorStyle"></view>
		</view>
		<t-color-picker ref="colorPicker" :color="color" @confirmData="confirm"></t-color-picker>
	</view>
</template>

<script>
	import tColorPicker from '@/uni_modules/t-color-picker/t-color-picker.vue'
	export default {
		name: "UniColorPicker",
		emits: [
			"update:modelValue", "input","change"
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
		components: {
			tColorPicker
		},
		props: {
			name: String,
			value: [Number, String],
			modelValue: [Number, String], 
			disabled: {
				type: Boolean,
				default: false,
			},
			errorMessage: {
				type: [String, Boolean],
				default: "",
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
		computed:{
			colorStyle(){
				if(this.val){
					return 'background:'+this.val
				}else{
					return ''
				}
			}
		},
		data() {
			return {
				val: "", 
				color:''
			};
		},
		created() {
			if (this.value) {
				this.val = this.value;
			} else if (this.modelValue) {
				this.val = this.modelValue;
			} else {
				this.val = '#fff';
			}
		},
		methods:{
			handleClick(){
				if(this.disabled) return;
				this.$refs.colorPicker.open();
			},
			confirm(e){
				this.val = e;
				this.$emit("input", this.val);
				// TODO　兼容　vue3
				this.$emit("update:modelValue", this.val);
				this.$emit("change", this.val);
			}
		}
	}
</script>

<style>
	.color-box{
		width: 60px;
		height: 22px;
		border:1px solid #ccc;
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee), linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee);
		background-size: 1rem 1rem;
		background-position: 0 0, 0.5rem 0.5rem;
	}
	.color-box-color{
		width: 100%;
		height: 100%;
	}
</style>