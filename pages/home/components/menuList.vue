<template>
	<view class="grid-box">
		<menuList :list="systemList"></menuList>
	</view>
</template>

<script setup>
import menuList from '@/components/menu/List.vue';

const systemList = [
  {
    title: "我的待办",
    iconType: "icon-daiban",
    url: "/pages/workflow/index?type=todo&backUrl=home",
  },
	{
    title: "我的传阅",
    iconType: "icon-yuedu",
    url: "/pages/workflow/index?type=circulated&backUrl=home",
  },
	{
    title: "发起流程",
    iconType: "icon-liucheng",
    url: "/pages/workflow/launchList?backUrl=home",
  },
	{
		title: '扫一扫',
		type: 'scan',
		iconType: 'icon-saoyisao',
		url: ''
	},
  {
    title: "点检",
    type: 'spotCheck',
    iconType: "icon-yiban10",
    url: "/pages/spotCheck/index?type=spotCheck",
  },
];
</script>

<style lang="scss">
.grid-box{
	padding: 25rpx 0;
}
</style>
