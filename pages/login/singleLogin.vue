<template>
	<view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useUserStore } from "@/common/store/user";
	const userStore = useUserStore();
	onMounted(async() => {
		const pages = getCurrentPages();
		const list = pages[0].$page.fullPath.split('targetURL=')
		const targetURL = list[1]
		let params = {...pages[0].options, targetURL: targetURL}
		await userStore.singleLogin(params);
	}) 
</script>

<style>

</style>
