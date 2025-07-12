<template>
	<view>
		<template v-if="getSchema.component === componentType.collapse">
			<uni-section :title="getSchema.name" type="line" :borderBottom="true">
				<uni-card v-if="cardShow" :is-shadow="false" is-full :border="false">

					<view v-for="(child, index) in getSchema.layout" :key="getSchema.key+index">
						<template v-for="(schema, idx) in child.children" :key="schema.key">
							<SimpleFormItem
								:schema="schema"
								:refreshFieldObj="refreshFieldObj"
								v-if="getIfShow(schema, formModel[schema.field])"
								v-model ="formModel[schema.field]"
							/>
						</template>
					</view>

				</uni-card>
				<template v-slot:right>
					<view class="card-title-box iconfont" :class="cardShow?'icon-shouqi':'icon-zhankai'" @click="()=>{cardShow=!cardShow}"></view>
				</template>
			</uni-section>
		</template>
		<template v-if="getSchema.component === componentType.tableLayout">
			<uni-section :title="getSchema.name" type="line" :borderBottom="true" v-show="getIsShow(getSchema,'')">
				<view v-for="(child, index) in getSchema.layout" :key="getSchema.key+index">
				<template v-for="(schema, idx) in child.children" :key="schema.key">
							<SimpleFormItem
								:schema="schema"
								:refreshFieldObj="refreshFieldObj"
								v-if="getIfShow(schema, formModel[schema.field])"
								v-model ="formModel[schema.field]"
							/>
						</template>
					</view>
			</uni-section>
		</template>
		<template v-if="getSchema.component === componentType.tab">
			<uni-tab :data="getSchema.layout" v-model="activeRef" v-bind="getComponentsProps" />
			<!-- <component :is="componentMap.get(getSchema.component)" :data="getSchema.layout" v-model="activeRef" v-bind="getComponentsProps"></component> -->
			<view v-for="(child, index) in getSchema.layout"  :key="getSchema.key+index">
				<view v-show="activeRef === index">
					<template v-for="(schema, idx) in child.children" :key="schema.key">
						<SimpleFormItem
							:schema="schema"
							:refreshFieldObj="refreshFieldObj"
							v-if="getIfShow(schema, formModel[schema.field])"
							v-model ="formModel[schema.field]"
						/>
					</template>
				</view>
			</view>
		</template>
		<template v-else-if="getSchema.component === componentType.segmented">
			<uni-segmented-control style-type="text"
				:current="activeRef"
				:values="getSchema.layout.map((x) => x.name)"
				@clickItem="(e) => (activeRef = e.currentIndex)"
				v-bind="getComponentsProps"
			/>
			<view v-for="(child, index) in getSchema.layout" :key="getSchema.key+index">
				<view v-show="activeRef === index">
					<template v-for="(schema, idx) in child.children" :key="schema.key">
						<SimpleFormItem
							:schema="schema"
							:refreshFieldObj="refreshFieldObj"
							v-if="getIfShow(schema, formModel[schema.field])"
							v-model ="formModel[schema.field]"
						/>
					</template>
				</view>
			</view>
		</template>
		<template v-else-if="getSchema.component === componentType.subForm|| getSchema.component === componentType.singleForm">
			<uni-sub-form :schema="getSchema" v-model="formModel[getSchema.field]" />
			<!-- <component :is="componentMap.get(getSchema.component)" :schema="getSchema" v-model="formModel[getSchema.field]"></component> -->
		</template>
		<template v-else-if="getSchema.component === componentType.formView">
		<!-- 暂时不支持 -->
		 </template>
		<template v-else-if="getSchema.component.includes('Date')">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-datetime-picker
					:disabled="getDisabled"
					v-bind="getComponentsProps"
					v-model="formModel[getSchema.field]"
					v-model:startTime="formModel[getSchema.startTimeField]"
					v-model:endTime="formModel[getSchema.endTimeField]"
				/>
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.timeRange">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-time-picker :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps"
				v-model="formModel[getSchema.field]"
				v-model:sTime="formModel[getSchema.startTimeField]"
				v-model:eTime="formModel[getSchema.endTimeField]"/>
			</uni-forms-item>
		</template>

		<template v-else-if="getSchema.component === componentType.input">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<view v-if='getSchema.componentProps.scan'>
				<uni-easyinput :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"  :inputBorder="false" suffixIcon="ant-design:scan-outlined" @iconClick="scanClick(getSchema.field)" /></view>
				<view v-else><uni-easyinput :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"  :inputBorder="false" /></view>
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.checkbox || getSchema.component === componentType.radio">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-data-checkbox :schema="getSchema" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>

		<template v-else-if="getSchema.component === componentType.inputNumber">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-number-box :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>

		<template v-else-if="getSchema.component === componentType.associatePicker">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-associate-picker :mainKey="tableName" :index="index" :schema="getSchema" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>

		<template v-else-if="getSchema.component === componentType.select">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-data-select :schema="getSchema" :row="formModel" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>

		<template v-else-if="getSchema.component === componentType.cascader">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-data-cascader :schema="getSchema" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.slider">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				 <custom-slider :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.divider">
			<uni-divider :schema="getSchema" v-bind="getComponentsProps" />
		</template>

		<template v-else-if="getSchema.component === componentType.switch">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<custom-switch :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
				<!-- <uni-switch :schema="getSchema" :disabled="disabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" /> -->
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.Opinion">
			<uni-forms-item :label="getSchema.label" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<OpinionVue :value="getSchema.defaultValue" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.autoCode">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-auto-code :schema="getSchema" :key="tableName?null:refreshFieldObj[getSchema.field]" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.editor">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-editorbox :schema="getSchema" :disabled="getDisabled" :editorkey="getSchema.key" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>
    <template v-else-if="getSchema.component === componentType.rate">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-rate :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.image">
    	<uni-forms-item class="form-item-file-picker" :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-file-picker :schema="getSchema" :readonly="getDisabled" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"/>
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.organization">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-organization-v2 :title="getSchema.label" :row="formModel" :schema="getSchema" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"  />
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.user">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-user-select :schema="getSchema" :row="formModel" :key="tableName?null:refreshFieldObj[getSchema.field]" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"  />
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.computation || getSchema.component === componentType.moneyChinese">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-computation :isMoney="getSchema.component === componentType.moneyChinese" :index="index" :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
    	</uni-forms-item>
    </template>
		<template v-else-if="getSchema.component === componentType.color">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-color-picker :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.qrcode" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
			<uni-forms-item :label="getSchema.label" >
				<uni-qrcode  :schema="getSchema"  v-bind="getComponentsProps" />
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.title">
			<uni-title  :schema="getSchema" v-bind="getComponentsProps" />
		</template>
		<template v-else-if="getSchema.component === componentType.map">
			<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-select-map :index="index" :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"/>
			</uni-forms-item>
		</template>
		<template v-else-if="getSchema.component === componentType.upload">
			<uni-forms-item class="form-item-file-picker" :label="getSchema.label" :required="getSchema.required"
			:rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<uni-file-picker :schema="getSchema" :readonly="getDisabled" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"/>
			</uni-forms-item>
		</template>
    <template v-else-if="getSchema.component === componentType.associatePopup || getSchema.component === componentType.multiplePopup">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-associate-popup :row="formModel" :key="tableName?null:refreshFieldObj[getSchema.field]" :mainKey="tableName" :index="index" :isMultiple="getSchema.component === componentType.multiplePopup" :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"/>
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.info">
    	<uni-forms-item :label="getSchema.label" :required="getSchema.required"
			 :rules="getSchema.rules" :name="tableName?tableName+'['+index+']'+'['+getSchema.field+']':getSchema.field" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<uni-info :schema="getSchema" :disabled="true" v-bind="getComponentsProps" v-model="formModel[getSchema.field]"/>
    	</uni-forms-item>
    </template>
    <template v-else-if="getSchema.component === componentType.button">
    	<uni-forms-item :label="getSchema.label" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
    		<custom-button :mainKey="tableName" :index="index" :schema="getSchema" :disabled="getDisabled" v-bind="getComponentsProps" />
    	</uni-forms-item>
    </template>
		<template v-else-if="getSchema.component === componentType.text">
			<view :style="{
						margin:'10px 0',
			      fontFamily: getComponentsProps.fontFamily,
			      fontSize: getComponentsProps.fontSize + 'px',
			      fontWeight: getComponentsProps.fontWeight,
			      color: getComponentsProps.color,
			      fontStyle: getComponentsProps.fontStyle,
						align:getComponentsProps.align
			    }"
			  >
			    {{ getSchema.defaultValue }}</view
			  >
		</template>

		 <template v-else-if="getSchema.component === componentType.iframe">
		 <uni-forms-item :label="getSchema.label" :formItemType="getSchema.componentProps.type" :componentType="getSchema.component">
				<web-view :src="getSchema.url" style="height:200px;position: relative;"></web-view>
    	</uni-forms-item>
    </template>
	<!-- 	<template v-else>
			<uni-forms-item :label="getSchema.label" :required="getSchema.required" :rules="getSchema.rules" :name="getSchema.field">
				<component :is="componentMap.get(getSchema.component)" :schema="getSchema" :disabled="disabled" v-bind="getComponentsProps" v-model="formModel[getSchema.field]" />
			</uni-forms-item>
		</template> -->
	</view>
</template>

<script setup>
import { inject, computed, onMounted, watch, ref } from 'vue';
import { upperFirst } from '../../utils/helper/index.js';
import { isFunction } from '../../utils/helper/utils.js';
import { componentMap } from './componentMap.js';
import { componentType, datasourceTypeEnum, fetchComponents } from './types/form.js';
import { getIsShow, getIfShow } from './utils/utils.js';
import { getDicDetailList } from '@/common/api/system/dictionary/index.js';
import { requestMagicApi } from '@/common/api/magic-api/index.js';
import { useUserStore } from '../../common/store/user';
import Switch from '../../uni_modules/uni-switch/components/uni-switch/uni-switch'
import OpinionVue from './components/Opinion.vue';
import SimpleFormItem from './SimpleFormItem.vue';
const userStore = useUserStore();

const props = defineProps(['schema', 'modelValue', 'formApi','tableName','index','refreshFieldObj']);
const emit = defineEmits(['update:modelValue']);

const formModel =props.tableName?props.modelValue: inject('formModel');
const formProps = inject('formProps');
const disabled = inject('disabled');
const isFilter=inject('isFilter'); //来自筛选
const isCustomForm = inject('isCustomForm', false);

const activeRef = ref(0);
const cardShow = ref(true);
const getSchema = computed(() => {
	return props.schema;
});

const getDisabled = computed(() => {
	//如果是查看默认使用 全局disabled
	//ruguo 不是查看  组件覆盖全局
	return (isFilter.value?false: disabled.value) || (isFilter.value?false:props.schema.dynamicDisabled);
});

onMounted(() => {
	const { component } = props.schema;

	//判断组件是否为 远程组件
	if (fetchComponents.includes(component)) {
		//fetch();
	}
});

watch(
	() => props.schema.params,
	() => {
		fetch();
	},
	{ deep: true }
);

const getComponentsProps = computed(() => {
	let { componentProps = {}, events } = props.schema;
	//如果是函数
	if (isFunction(componentProps)) {
		componentProps = componentProps({ schema: props.schema, formModel, formApi: props.formApi }) || {};
		return componentProps;
	}

	//如果有配置事件
	if (events) {
		for (const eventKey in events) {

			try {
				const fun = events[eventKey];
				let event;
				if (typeof fun === 'string') {
					event = new Function('schema', 'formModel', 'formActionType', 'extParams', `${fun}`);
				} else if (typeof fun === 'function') {
					event = fun;
				}
				componentProps['on' + upperFirst(eventKey)] = function (value, selectedOptions) {
					//console.log(eventKey,componentProps)
					event(props.schema, formModel.value, props.formApi, {  value, selectedOptions });
				};
			} catch (error) {
				console.log('error', error);
			}
		}
	}
	return componentProps;
});
// 移动端扫描
function scanClick(field){
	// #ifdef H5
  uni.showModal({
    title: "提示",
    content: "抱歉H5界面暂不支持扫码功能",
    showCancel: false,
    confirmText: "确定",
  });
  // #endif
  // #ifdef MP-WEIXIN
  uni.scanCode({
    success: (res) => {
      let result = res.result;
			formModel.value[field] = result;
    },
  });
  // #endif
  // #ifdef APP-PLUS
  uni.scanCode({
    success: (res) => {
      let result = res.result;
      formModel.value[field] = result;
    },
  });
  // #endif
}
async function fetch() {
	const { componentProps = {}, component } = props.schema;
	const { datasourceType, params } = componentProps;

	//如果是远程组件 根据配置 请求后端 获取数据  插入到 localdata 属性
	//uni-ui 组件 都是使用 localdata 作为数据集
	//如果是数据字典
	if (datasourceType === datasourceTypeEnum.Dic) {
		const { data } = await getDicDetailList(params);
		componentProps.localdata = data.map((item) => {
			return {
				text: item.name,
				value: item.id
			};
		});
	}
	if (datasourceType === datasourceTypeEnum.Api) {
		const { apiConfig } = componentProps;

		const queryParam = {};
		const headerParam = {};
		const bodyParams = {};
		for (const param of apiConfig.apiParams) {
			//queryString
			if (param.key === `1` && param.tableInfo) {
				for (const query of param.tableInfo) {
					queryParam[query.name] = getParamsValue(query);
				}
			}
			//header
			if (param.key === `2` && param.tableInfo) {
				for (const head of param.tableInfo) {
					headerParam[head.name] = getParamsValue(head, true);
				}
			}
			//body
			if (param.key === `3` && param.tableInfo) {
				for (const body of param.tableInfo) {
					bodyParams[body.name] = getParamsValue(body);
				}
			}
		}

		const { data } = await requestMagicApi({
			url: apiConfig.path,
			method: apiConfig.method,
			query: queryParam,
			header: headerParam,
			body: bodyParams
		});

		componentProps.localdata = data;
		console.log(data, 'requestMagicApi');
	}
}

function getParamsValue(params, isHeaders = false) {
	let value;
	if (params.bindType === 'value') {
		value = params.value;
	} else if (params.bindType === 'data') {
		const paramsArr = params.value?.split('-');
		if (paramsArr[0] === '3') {
			//当前信息
			value = isHeaders ? userStore.getUserInfo[paramsArr[1]] : userStore.getUserInfo[paramsArr[1]];
		} else {
			if (!formModel) return;
			const headerValue = isCustomForm ? formModel[paramsArr[0]] : formModel[camelCaseString(paramsArr[0])];
			value = isHeaders ? headerValue : headerValue;
		}
	}

	return value;
}

/**
 * 范围组件change 事件
 */
// function rangeComponentsChange(e) {
// 	const { componentProps = {} } = props.schema;
// 	if()

// }
</script>

<style lang="scss" scoped>
	.card-title-box.iconfont{
		font-size: 12px;
		    background: #E7EBF2;
		    border-radius: 50%;
		    padding: 5px;
		    color: #253954;
	}
	::v-deep .uni-easyinput__content-input {
		text-align: right;
		border: none;
		padding: 0!important;
	}
	::v-deep .uni-easyinput__content {
		border: none;
	}
	::v-deep .uni-easyinput__content {
		border-color: #fff;
		background-color: #fff!important;
	}
	::v-deep .mb-10 {
		.uni-section-header {
			background-color: #f0eff4;
			padding: 12px 27rpx;
		}
	}
	::v-deep .input-value-border {
		border: none;
		.selected-area {
			justify-content: end;
		}

	}
	::v-deep .uni-forms-item {
		// padding: 0 20rpx;
		border-bottom: 1px solid #eee;
		background-color: #fff;
		padding: 2px 12px 2px 14px;
	}
	::v-deep .uni-title__box {
		background-color: #f0eff4;
		border-radius: 0px;
		padding-left: 20rpx;
		.uni-title__base {
			font-weight: bold;
			font-family: PingFang SC-Heavy, PingFang SC,Microsoft YaHei,Helvetica Neue,Helvetica,sans-serif;
		}
	}
	::v-deep .uni-select--disabled {
		background-color: #fff;
		padding-right: 10px;
		padding: 0;
		.uniui-right {
			// visibility: hidden;
			display: none;
		}
	}
	::v-deep .uni-card {
		padding: 0!important;
		.uni-forms-item {
			padding: 0;
		}
	}
	::v-deep .uni-input-input {
		text-align: right;
		color: #333!important;
	}
	::v-deep .uni-autocode__content-input {
		padding: 0!important;
	}

	::v-deep .form-item-file-picker {
		.uni-forms-item__inner {
			display: flex;
			flex-direction: column;

			.uni-file-picker__lists {
				margin-left: 0.5rem;
			}
		}
	}
</style>
