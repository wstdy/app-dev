<template>
	<view>
		<uni-easyinput :placeholder="placeholder" :disabled="disabled" v-model="inputValue" @focus="open" @clear="handleClear" />
		<uni-associate-table ref="tableRef" :modelValue="modelValue" :associateOptions="associateOptions" :map="map"
			:apiConfig="apiConfig" :isMultiple="isMultiple" :itemId="itemId" :index="index" @submit="handleSubmit" @getInputValue="getInputValue"/>
	</view>
</template>

<script setup>
  import {
    inject,
    watch,
    ref,
    nextTick
  } from 'vue';
  import {
    camelCaseString,
  } from '@/utils/helper/utils.js';
  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    isMultiple: {
      type: Boolean,
      default: false
    }, //多选弹层为true,联想弹层为false
    modelValue: {
      type: String,
      default: ''
    },
    associateOptions: {
      type: Array,
      default: []
    },
    map: {
      type: Object,
      default: () => {
        return {
          text: 'text',
          value: 'value'
        }
      }
    },
    apiConfig: {
      type: Object,
      default: {}
    },
    itemId: {
      type: String,
      default: ''
    },
    mainKey: {
      type: String,
      default:''
    },
    index: {
      type: Number,
      default: -1
    },
    sepTextField: { // 将文字描述存在独立字段，增加首次渲染速度
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
  const emit = defineEmits(['change', 'update:modelValue','click']);

  const formModel = inject('formModel');
  const isCustomForm = inject('isCustomForm', false);

  const tableRef = ref();
  const inputValue = ref('');
  const valChanged = ref(false);

  watch(
    () => props.modelValue,
    (val) => {
      if (!val) {
        inputValue.value = ''
      } else {
        if(props.sepTextField && !valChanged.value) {
          inputValue.value = props.row[camelCaseString(props.sepTextField)];
        } else {
          nextTick(() => {
            if (tableRef.value) {
              //编辑回显
              tableRef.value.getData();
            }
          })
        }
      }
    }, {
      immediate:true
    })

  function open() {
    tableRef.value.open();
    valChanged.value = true;
		emit('click');
  }

  function handleClear() {
    handleSubmit([])
  }
  
  function getInputValue(val){
    inputValue.value = val
  }

  function handleSubmit(selectedList) {
    //如果有配置过联想组件
    if (props.associateOptions && !props.isMultiple) {
      for (const option of props.associateOptions) {
        let value = ''
        if (selectedList.length) {
          value = selectedList[0][option.name]
        }
        if (isCustomForm) {
          if (props.mainKey) {
            formModel.value[props.mainKey][props.index][option.bindField] = value;
          } else {
            formModel.value[option.bindField] = value;
          }
        } else {
          if (props.mainKey && camelCaseString(option.bindField)) {
            formModel.value[props.mainKey][props.index][camelCaseString(option.bindField)] = value;
          } else {
            if(camelCaseString(option.bindField)) {
              formModel.value[camelCaseString(option.bindField)] = value;
            }
          }
        }
      }
    }
    let emitValue = ''
    if (selectedList.length) {
      inputValue.value = props.isMultiple ?
        selectedList.map(x => x[props.map.text]).toString() :
        selectedList[0][props.map.text]
      emitValue = props.isMultiple ?
        selectedList.map(x => x[props.map.value]).toString() :
        selectedList[0][props.map.value]
    } else {
      inputValue.value = ''
    }
    updateSepTextField(inputValue.value);
    emit('change', emitValue);
    emit('update:modelValue', emitValue);
  }

  function updateSepTextField(v) {
      if (!props.sepTextField || !props.row) {
          return;
      }
      props.row[camelCaseString(props.sepTextField)] = v;
  }
</script>

<style></style>