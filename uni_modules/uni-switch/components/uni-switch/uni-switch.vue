<template>
	<switch style="transform:scale(0.7)" @change="change" :checked="props.checked" :disabled="props.disabled" :color="props.color" />
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps(['checked', 'disabled', 'color']);

function change(e) {
	emit('change', e);
	emit('update:modelValue', e.detail.value);
}
</script>

<style></style>
