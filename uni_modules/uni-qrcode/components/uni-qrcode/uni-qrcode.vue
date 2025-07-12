<template>
	<view>
		<qrcode :ref="codekey" :codekey="codekey"></qrcode>
	</view>
</template>

<script>
	import qrcode from "./qrcode.vue";
	import {
		changeApiOptions
	} from '@/common/api/magic-api/useApiRequest.js';
	export default {
		name: "UniQRcode",
		props: {
			value: {
				type: String,
				default: ''
			},
			codekey: {
				type: String,
				default: ''
			},
			text: {
				type: String,
				default: ''
			},
			codeType: {
				type: String,
				default: 'fixed'
			},
			apiConfig: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		components: {
			qrcode
		},
		data() {
			return {
				val: 'code'
			};
		},
		methods: {

		},
		async mounted() { 
			if (this.codeType == 'fixed') {
				this.val = this.text
			} else if (this.apiConfig?.path) {
				let res = await changeApiOptions(this.apiConfig);
				if (res.data) {
					this.val = res.data
				}
			}  
			if(this.$refs[this.codekey]){
				this.$refs[this.codekey].createCode(this.val);
			} 
		},
	};
</script>

<style scoped lang='scss'>
</style>