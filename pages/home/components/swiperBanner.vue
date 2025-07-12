<template>
	<view>
		<uni-swiper-dot
			class="uni-swiper-dot-box"
			@clickItem="clickItem"
			:info="ossConfig.slideList"
			:current="state.current"
			:mode="state.mode"
			:dots-styles="state.dotsStyles"
			field="content"
		>
			<swiper class="swiper-box" @change="change" :current="state.swiperDotIndex">
				<swiper-item v-for="(item, index) in ossConfig.slideList" :key="index">
					<view class="swiper-item" :class="'swiper-item' + index">
						<image class="login-bg" :src="item"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
	</view>

</template>

<script setup>
import { reactive } from 'vue';
import ossConfig from '@/common/config/oss.js'

const state = reactive({
	current: 0,
	mode: 'default',
	dotsStyles: {
			backgroundColor: '#7bc5de',
			border: '1px #7bc5de solid',
			color: '#fff',
			selectedBackgroundColor: '#ffffff',
			selectedBorder: '1px #ffffff solid'
		},
	swiperDotIndex: 0
});
function change(e) {
	state.current = e.detail.current
}
function clickItem(e) {
	state.swiperDotIndex = e;
}
</script>

<style lang="scss">
.swiper-box {
	height: 294rpx;
	margin-top: 40rpx;
	}
	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 294rpx;
		color: #fff;
	}
	image {
		width: 690rpx;
	}


</style>
