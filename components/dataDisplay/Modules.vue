<template>
	<view class="box">
		<view class="item-title">
			<view class="title-style">{{ config.title }}</view>
		</view>
		<view class="scrollbar ">
			<view class="scrollbar__wrap">
				<view class="scrollbar__view">
					<view v-if="functions.length > 0" class="menu-box">
						<view class="menu-item" v-for="(item, index) in functions" :key="index">
							<view class="menu-link" @tap="clickItem(item.url)">
								<view class="menu-icon">
									<view class="bg" :style="'background-color:' + item.color + ''"></view>
									<uni-icons custom-prefix="antfont" :color="item.color" :type="item.icon" size="26" class="icon"></uni-icons>
								</view>
								<view class="menu-title">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	const props = defineProps({
		config: {
			type: Object,
			default: () => {
				return {
					title: '常用功能',
					functions: null,
				};
			}
		}
	});
	let functions = ref([{
			name: '多租户',
			url: '',
			color: '#5e95ff',
			icon: 'ant-design:users',
		},
		{
			name: '云存储',
			url: '',
			color: '#5e95ff',
			icon: 'ant-design:cloud-fill'
		},
		{
			name: '微服务',
			url: '',
			color: '#5e95ff',
			icon: 'ant-design:microservices'
		},
		{
			name: '销售汇报',
			url: '',
			color: '#5e95ff',
			icon: 'ant-design:bar-chart-outlined'
		},
	])
	onMounted(() => { 
		if (props.config.functions) {
			functions.value = props.config.functions
		}
	});

	function clickItem(url) {
		if (url) {
			uni.navigateTo({
				url
			});
		}
	}

 
</script>

<style lang="less" scoped>
	.box {
		padding-top: 40px;
		background: transparent;
		box-shadow: none;

		.scrollbar {
			width: 100%;
			height: 100%;
			position: relative;
			overflow: hidden;

			.scrollbar__wrap {
				height: 100%;
				box-sizing: border-box;
				overflow: auto;

				.scrollbar__view {
					box-sizing: border-box;
				}
			}
		}

		.item-title {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 40px;
			line-height: 40px;
			color: #666;
			font-size: 14px;
			padding-left: 10px;
			font-weight: 700;

			.title-style {
				margin: 12px 0 0;
				line-height: 18px;
				padding-left: 6px;
				border-left: 6px solid #5e95ff;
			}
		}

		.menu-box {
			display: flex;
			align-items: center;
			padding: 10px;

			.menu-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin: 0 2px;

				.menu-link {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.menu-icon {
					position: relative;
					height: 50px;
					display: flex;
					justify-content: center;
					align-items: center;

					.bg {
						border-radius: 50%;
						opacity: 0.1;
						height: 50px;
						width: 50px;
						position: relative;
						background: #5e95ff;
					}

					.icon {
						position: absolute;
						top: 0;
						left: 0;
						height: 50px;
						width: 50px;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}

				.menu-title {
					color: #666;
					font-size: 12px;
					font-weight: 700;
					margin: 2px 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 76px;
					text-align: center;
				}
			}
		}
	}
</style>