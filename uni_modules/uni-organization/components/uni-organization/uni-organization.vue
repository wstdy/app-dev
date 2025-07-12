<template>
  <uni-data-cascader
    :placeholder="placeholder"
    :popup-title="title"
    type="organization"
    selectedConfig="any"
    :readonly="disabled"
    :sepTextField="sepTextField"
    :row="row"
    v-model="departmentId"
    @input="handleChange"
  />
</template>

<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({
    placeholder: {
      type: String,
      default: '请选择组织架构'
    },
    title: {
      type: String,
      default: '组织架构'
    },
    modelValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    sepTextField: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  })
  const emit = defineEmits(['update:modelValue','change']);
  const departmentId = ref('')
  
  
  watch(
    () => props.modelValue,
    (val) => {
      departmentId.value = val
    },
    {
      immediate:true
    }
  )  
  function handleChange (value) {
    const arr = value.split(',')
    const id = arr[arr.length - 1]
    emit('update:modelValue', id)
    emit('change', id)
  }
</script>
