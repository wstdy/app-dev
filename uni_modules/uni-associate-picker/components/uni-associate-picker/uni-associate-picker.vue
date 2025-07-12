<template>
  <uni-data-select  @change="change" />
</template>

<script setup>
  import {
    inject,
  } from 'vue';
  import {
    camelCaseString,
  } from '@/utils/helper/utils.js';
  const props = defineProps(['schema','index','mainKey']);
  const emit = defineEmits(['change']);

  const formModel = inject('formModel');
  const isCustomForm = inject('isCustomForm', false);

function change(val, optionInfo) {
	
    let {
      componentProps = {}
    } = props.schema; 
    //如果有配置过联想组件
    if (componentProps.associateOptions) {

      for (const info of componentProps.associateOptions) {
				if(!info.bindField) return;
        let value = ''
        if (optionInfo) {
          //如果是多选
          value = Array.isArray(val) && val.length > 0 ? optionInfo[0][info.name] : optionInfo[info.name]
        }
        if (isCustomForm) {
					
          if (props.mainKey) {
            formModel.value[props.mainKey][props.index][info.bindField] = value
          } else {
            formModel.value[info.bindField] = value
          }
        } else {
          if (props.mainKey) {
            formModel.value[props.mainKey][props.index][camelCaseString(info.bindField)] = value
          } else {
            formModel.value[camelCaseString(info.bindField)] = value
          }
        }
      }
    }

    emit('change', val);
  }
</script>

<style></style>