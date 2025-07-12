<template>
  <view>
    <button
      type="primary"
      :style="{
				height: height ? height + 'px' : '32px',
        display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        width: width ? width + 'px' : '100%',
				fontSize:'14px',
				marginBottom:'15px'
      }"
       size="default"
      :disabled="disabled"
      @click="showDialog"
    > 
			<uni-icons custom-prefix="antfont" :type="prefixIcon" size="26" class="icon"></uni-icons>
      {{ name }} 
			<uni-icons custom-prefix="antfont" :type="suffixIcon" size="26" class="icon"></uni-icons>
    </button>
		<uni-sub-table ref="tableRef" :associateOptions="associateOptions" :apiConfig="apiConfig" :itemId="itemId" @submit="handleSubmit" />
    <uni-associate-table ref="associateRef" :associateOptions="associateOptions" :map="map"
      :apiConfig="apiConfig" :isMultiple="false" :itemId="itemId" :index="index" @submit="handleAssociate" />
		
  </view>
</template>
<script setup>
  import { ref, watch, nextTick, inject, watchEffect } from 'vue';
  import { getUuid } from '@/utils/helper/tools.js';
	import { 
		isValidJSON,
		camelCaseString
	} from '@/common/api/magic-api/useApiRequest.js';  
	const props = defineProps({
    value: { type: String },
    labelField: { type: String, default: 'label' },
    valueField: { type: String, default: 'value' },   
    name: String, 
    width: String,
    height: String,
    prefixIcon: String,
    suffixIcon: String,
    disabled: Boolean, 
    buttonType: [String, Number],
    params: { type: [Array, Object, String, Number] }, 
    associateOptions: { type: Array },
    tableColumns: { type: Array },
    apiConfig: { type: Object },
		itemId: String,
    mainKey: String,
    index: Number,
		map: {
		  type: Object,
		  default: () => {
		    return {
		      text: 'text',
		      value: 'value'
		    }
		  }
		},
  });

  const formModel = inject('formModel', null);
  const isCustomForm = inject('isCustomForm', false);
  const multipleDialog = ref(false);
  const popupValue = ref('');
  const defaultVal = ref('');
  const selectedDataSourceVal = ref([]);
  const MultipleSelectRef = ref();
  const dataSourceList = ref([]);
  const popType = ref('');
  const emit = defineEmits(['change']);
	const tableRef = ref();
	const associateRef=ref()
  watch(
    () => props.value,
    () => {
      popupValue.value = '';

      nextTick(async () => {
        await getSubDatasourceList();
      });
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.apiConfig,
    () => {
      nextTick(() => {
        getSubDatasourceList();
      });
    },
  );

  const getList = (list) => {
    dataSourceList.value = list;
  };

  const showDialog = () => {
    if (props.buttonType==1) {
      associateRef.value.open();
    }else if(props.buttonType==2){
			tableRef.value.open();
		}
  };

  function handleSubmit(selectedList) {  
		let table = '';
		selectedList.forEach((x) => {
			const dataObj = {
				$_index: getUuid()
			};
			props.tableColumns?.map((item ) => {
				if (!item?.bindField) return;
				if (item.bindTable && !table)
					table = isCustomForm
						? item.bindTable + 'List'
						: camelCaseString(item.bindTable + '_List');
				let bindField = isCustomForm ? item.bindField : camelCaseString(item.bindField);
				dataObj[bindField ] = item.prestrainField ? x[item.prestrainField] : null;
			});

			if (formModel.value[table]) formModel.value[table].push(dataObj);
		});
  }
	function handleAssociate(selectedList){
		if (props.associateOptions ) {
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
		      if (props.mainKey) {
		        formModel.value[props.mainKey][props.index][camelCaseString(option.bindField)] = value;
		      } else {
		        formModel.value[camelCaseString(option.bindField)] = value;
		      }
		    }
		  }
		} 
	}
  const getSubDatasourceList = async () => {
    let showValueArr  = [];
    await MultipleSelectRef.value?.getDatasourceList();

    selectedDataSourceVal.value = [];
    defaultVal.value = props.value;
    const selectedArr = props.value?.split(',');
    dataSourceList.value?.map((item) => {
      selectedArr?.map((selected) => {
        if (item[props.valueField] === selected) {
          selectedDataSourceVal.value?.push(item);
        }
      });
    });

    showValueArr = selectedDataSourceVal.value?.map((item ) => {
      return item[props.labelField];
    });

    popupValue.value = showValueArr.length ? showValueArr.join(',') : props.value;
  };

  watchEffect(() => {
    if ( props.apiConfig?.apiParams) {
      props.apiConfig.apiParams.forEach((params) => {
        params.tableInfo?.forEach((o) => {
          if (o.bindType == 'data') {
            let val = isValidJSON(o.value);
            let field = '';
            if (val && val.bindTable) {
              let table = isCustomForm
                ? val.bindTable + 'List'
                : camelCaseString(val.bindTable + '_List');
              field = isCustomForm ? val.bindField : camelCaseString(val.bindField);
              formModel &&
                formModel[table][props.index || 0] &&
                formModel[table][props.index || 0][field];
            } else if (val && val.bindField) {
              field = isCustomForm ? val.bindField : camelCaseString(val.bindField);
              formModel && formModel[field];
            }
          }
        });
      });
      getSubDatasourceList();
    }
  });
</script>
