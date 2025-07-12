<template>
	<SimpleList ref="listRef"></SimpleList>
</template>

<script setup>
import { ref } from 'vue';
import { onShow, onReady, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'; //不支持onLoad
import SimpleList from '@/components/simple-list/SimpleList.vue';



onReachBottom(() => {
	// 必须要这个事件 可以不写逻辑 
});
const listRef = ref();
</script>

<style></style>
