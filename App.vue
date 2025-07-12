<script>
import { CUSTOM_BAR_HEIGHT } from "@/common/const/cache.js";
	export default {
		onLaunch: function() {
			console.log('App Launch');
			uni.getSystemInfo({
				success: function(e) {
					let customBarHeight  = 0;
					// #ifndef MP
					customBarHeight = e.statusBarHeight + 44+ e.safeAreaInsets.top;
					// #endif
					
					// #ifdef APP-VUE
					customBarHeight = 0;
					// #endif
					
					// #ifdef MP-WEIXIN
					
					let custom = wx.getMenuButtonBoundingClientRect();
					customBarHeight  = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		
			
					// #ifdef MP-ALIPAY
					customBarHeight = e.statusBarHeight + e.titleBarHeight;
					// #endif					
					uni.setStorageSync(CUSTOM_BAR_HEIGHT, customBarHeight);
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "common/antfont/antfont.css"; 
	@import "static/iconfont/iconfont.css";
	@import "common/dataDisplay.css";
	@import "common/main.css";
	/*每个页面公共css */
	body{
		--UI-BG-0:#f5f6fa;
		font-family: PingFang SC-Heavy, PingFang SC,Microsoft YaHei,Helvetica Neue,Helvetica,sans-serif;
	}
	page {
		background: #f6f9ff;
	}
</style>
