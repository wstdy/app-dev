<template>
	<uni-easyinput v-model="val" :type="props.isMoney?'computation':'digit'" @input="handleInput"
	 :focus="focused" @focus="handleFocus" @blur="handleBlur"/>
</template>

<script setup>
	import {
		ref,
		toRaw,
		inject,
		watch,
	} from 'vue'
	import {
		compEval
	} from '@/common/config/compulate.js';
	import {
		camelCaseString, 
		sum,
		mean,
		max,
		min
	} from '@/utils/helper/utils.js';
	const formModel = inject('formModel', null); // 注入表单数据
	const isCustomForm = inject('isCustomForm', false);
	const emit = defineEmits(['update:modelValue', 'change','click','blur','focus']);

	const props = defineProps({
		value: [Number,String],
		modelValue: [Number,String],
		computationalConfig: Array,
		index: Number,
		isMoney: {
			type: Boolean,
			default: false
		}
	});
	const focused=ref(false)
	const val = ref();
  watch(
  	() => props.modelValue,
	(newVal) => {
		val.value=newVal
	},
	{
		immediate:true
	}
  );
	watch(
		() => props.value,
		(newVal) => {
			val.value=newVal
		}
	);
	watch(
		() => formModel.value,
		() => {
			computate()
		}, {
			deep: true,
			immediate: true
		},
	);
	function handleBlur(){
		focused.value=false
		emit('blur',val.value );
	}
	function handleFocus(){
		focused.value=true
		emit('focus',val.value );
		emit('click',val.value );
	}
	function computate(){
			if (!toRaw(props)?.computationalConfig) return;
			let expressionStr = '';

			for (let config of toRaw(props).computationalConfig) {
				const bindTable = isCustomForm ?
					`${config.bindTable}List` :
					`${camelCaseString(config.bindTable)}List`;
				const bindField = isCustomForm ? config.bindField : camelCaseString(config.bindField);

				if (config.type === 'computational' || config.type === 'money-chinese') {
					if (config.isMainForm) {
						//如果是主表字段 直接从formModel 取
						expressionStr += formModel.value[bindField] || 0; 
					} else {
						//如果是附表 从formModel 取出来 需要进行处理
						if (!formModel.value[bindTable]) return;
						if (config.computationalMethod) {
							const fieldArray = formModel.value[bindTable].map(
								(x) => x[bindField] || 0,
							);
							switch (config.computationalMethod) {
								case 'sum':
									expressionStr += `${sum(fieldArray)}`;
									break;
								case 'mean':
									expressionStr += `${mean(fieldArray)}`;
									break;
								case 'min':
									expressionStr += `${min(fieldArray)}`;
									break;
								case 'max':
									expressionStr += `${max(fieldArray)}`;
									break;
							}
						} else {
							expressionStr +=
								(formModel.value[bindTable][props.index] &&
									formModel.value[bindTable][props.index][bindField]) ||
								0;
						}
					}
				} else {
					expressionStr += `${config.label}`;
				}
			}
 
			if (props.computationalConfig.length > 0) {
				try {
					val.value = compEval(expressionStr); 
					emit('change', val.value);
					emit('update:modelValue', val.value);
				} catch {
					console.error('计算式配置错误', expressionStr);
				}
			}
		}
	const handleInput = (v) => {  
		emit('change', v);
		emit('update:modelValue', v);
	};
 
</script>