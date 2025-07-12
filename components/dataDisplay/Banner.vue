<template>
	<swiper autoplay circular :indicator-dots="true" indicator-active-color="#ffffff"
		:style="{height:config.height+'px'}">
		<swiper-item v-for="(item, index) in config.imgs" :key="index">
			<view class="swiper-item">
				<image :src="item" :style="{height:config.height+'px'}"></image>
			</view>
		</swiper-item>
	</swiper>
</template>

<script setup>
	const props = defineProps({
		config: {
			type: Object,
			default: () => {
				return {
					imgs: [],
					height: 400,
				};
			}
		}
	});
</script>

<style lang="scss">
	.swiper-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #fff;
	}

	uni-image {
		width: 100%;
	}
</style>