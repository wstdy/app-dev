<template>
	<view :class="getClass">
		<view class="divider-inner-text">{{ text }}</view>
	</view>
</template>

<script setup>
import { computed } from 'vue';

const alignType = {
	left: 'divider-horizontal left',
	right: 'divider-horizontal right',
	center: 'divider-horizontal'
};

const props = defineProps(['text', 'align']);

const getClass = computed(() => alignType[props.align]);
</script>
<style lang="scss">
.divider-horizontal {
	display: flex;
	margin: 16px 0;
	color: #000000d9;
	font-weight: 500;
	font-size: 16px;
	white-space: nowrap;
	text-align: center;
	border-top: 0;
	border-top-color: #0000000f;
	clear: both;
	width: 100%;
	min-width: 100%;
	padding: 0;

	&::before,
	&::after {
		position: relative;
		top: 50%;
		width: 50%;
		border-top: 1px solid transparent;
		border-top-color: inherit;
		border-bottom: 0;
		transform: translateY(50%);
		content: '';
	}
	&.left::before {
		width: 5%;
	}
	&.left::after {
		width: 95%;
	}

	&.right::before {
		width: 95%;
	}
	&.right::after {
		width: 5%;
	}

	.divider-inner-text {
		display: inline-block;
		padding: 0 1em;
	}
}
</style>
