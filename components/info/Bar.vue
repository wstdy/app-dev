
<template>
 <progress :percent="props.percent" activeColor="#5E95FF" stroke-width="8" backgroundColor="#E4E4E4" border-radius="8"/>
</template>

<script setup>
const props = defineProps({
  percent: 40
});
</script>
