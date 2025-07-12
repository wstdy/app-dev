import { reactive } from 'vue';
import { separator } from '@/utils/simpleForm/analysis';
import {buildAppFormProps} from '@/utils/simpleForm/changeJson';
import { cloneDeep } from '@/utils/helper/utils.js';
import { apiConfigFunc } from '@/utils/helper/api.js';
import { postExecute } from "@/common/api/liteflow/index";
import { FormType } from "@/common/enums/form.ts";
export default function () {
  let forms = reactive({
    formModels: [],
    configs: [],
    formEventConfigs: [],
  });
  let uploadComponent= reactive({ ids: [] });

  function initFormInfo(formInfos,formAssignmentData,otherParams){
    formInfos.forEach(async (element) => {
      let formModels = {};
      if (element.formData) {
        formModels = cloneDeep(element.formData);
      }
      // 表单发起流程
      if(element.formConfig&&element.formConfig.formId==otherParams.workflowData.formId&&otherParams.workflowData){
        formModels = otherParams.workflowData.data;
      } 
      // 参数赋值[赋值权限最大]
      if (formAssignmentData) {
        if (formAssignmentData[element.formConfig.formId]) {
          formModels = { ...formModels, ...formAssignmentData[element.formConfig.formId] };
        }
      }
      forms.formModels.push(formModels);

      let formKey = element.formConfig.key;

      let config = {
        formName: element.formConfig.formName,
        formProps: {},
        formModel: formModels,
        formKey,
        validate: true,
        formType: element.formType,
        functionFormName: element.functionFormName,
        functionName: element.functionName,
        functionalModule: element.functionalModule,
        formConfigChildren:element.formConfig.children,
        otherParams:cloneDeep(otherParams)
      };
      if(element.formType==FormType.SYSTEM){
        // 
      }else if(element.formType==FormType.CUSTOM){
        const model = JSON.parse(element.formJson);
        const { formJson, formEventConfig } = model;
        if (formEventConfig) {
          forms.formEventConfigs.push(formEventConfig);
  
          //初始化表单
          executeFormEvent(formEventConfig[0], formModels);
          //加载表单
          executeFormEvent(formEventConfig[2], formModels);
  
          //TODO 暂不放开 工作流没有获取表单数据这个步骤 获取表单数据
          // executeFormEvent(formEventConfig[1], formModels);
        }
        let options = buildAppFormProps(formJson);
        let buildOptionJson = handlerFormPermission(
          options,
          element.formConfig.children,
          element.formConfig.key,
          otherParams
          );
        if (buildOptionJson.schemas) {
          config.formProps = buildOptionJson;
        }
      }

      forms.configs.push(config);
    });
  }
  function handlerFormPermission(buildOptionJson, children, formKey,otherParams) {
    let permissionConfigMap = getPermissionConfigMap(children);
    const formShow = 0; //表单是否有显示的组件，有则大于0
    buildOptionJson.schemas = schemeList(
      buildOptionJson.schemas,
      permissionConfigMap,
      formKey,
      formShow,
      otherParams
    );
  
    return buildOptionJson;
  }
  
  function schemeList(schemas, permissionConfigMap, formKey, formShow,otherParams) {
    if(schemas){
  
      schemas = schemas.map((schema) => {
        if (['Collapse','Segmented'].includes(schema.component)) {
          formShow += 1;
          if (schema.layout && schema.layout.length > 0) {
            schema.layout.forEach((ele2) => {
              if (ele2.children && ele2.children.length > 0) {
                ele2.children = schemeList(ele2.children, permissionConfigMap, formKey, formShow);
              }else{
                let permissionConfig = permissionConfigMap.has(ele2.key)
                ? permissionConfigMap.get(ele2.key)
                : null;
      
              ele2 = getSchemePermissionItem(ele2, permissionConfig, formKey,otherParams);
              if (permissionConfig?.view) {
                formShow += 1;
              }
              }
            });
          }
        } 
        else if (schema.component == 'SubForm'|| schema.component == 'SingleForm') {
          if (
            schema.columns &&
            schema.columns.length > 0
          ) {
            let permissionConfig = permissionConfigMap.has(schema.key)
              ? permissionConfigMap.get(schema.key)
              : null;

            if (!permissionConfig?.view) {
              schema.ifShow = false;
            } else {
              formShow += 1;
            }
            schema.columns = schema.columns.map((ele3) => {
              const tableItemPermissionConfig = [];
              if(permissionConfig&&permissionConfig.children){
                permissionConfig.children.forEach(x => {
                   if (x.key&&x.key === ele3.key) {
                    tableItemPermissionConfig.push(x);
                  }
                  else if (x.fieldId&& x.fieldId === ele3.field) {
                    tableItemPermissionConfig.push(x);
                  }
               });
              }
              let config = Array.isArray(tableItemPermissionConfig)?tableItemPermissionConfig[0]:{view:false,edit:false,required:false};
              return getSchemePermissionItem(ele3, config, formKey,otherParams);
            });
          }
        } else {
          let permissionConfig = permissionConfigMap.has(schema.key)
            ? permissionConfigMap.get(schema.key)
            : null;
  
          schema = getSchemePermissionItem(schema, permissionConfig, formKey,otherParams);
          if (permissionConfig?.view) {
            formShow += 1;
          }
        }
  
        return schema;
      });
    }
  
    return formShow > 0 ? schemas : null;
  }
  
  function getSchemePermissionItem(schema, permissionConfig, formKey,otherParams) {
    if (permissionConfig) {
      //查看
      schema.ifShow = permissionConfig.view;
      schema.required = false;
      // 必填
      if (permissionConfig.required) {
        schema.required = true;
      }
      //编辑
      schema.dynamicDisabled = !permissionConfig.edit;
  
      // rules
      if(schema.required){
        schema.rules = [{'required': true,errorMessage: schema.label + '项必填'}].concat(schema.rules)
      }else{
        schema.rules  = [];
      }
    } else {
      schema.ifShow = false;
      schema.dynamicDisabled = true;
    }
    // 修改意见簿
    if (schema.component == 'Opinion') {
      let key = formKey + separator + schema.key;
      if (key&&otherParams&&otherParams.opinionsComponents&&otherParams.opinionsComponents.includes(key)) {
        schema.defaultValue = otherParams.opinions;
      }
    }
    // 上传组件集合
    if (schema.component == 'FileUpload') {
      let key = formKey + separator + schema.field;
      uploadComponent.ids.push(key);
    }
    if (permissionConfig?.isSubTable) {
      // 子表单上传组件集合
      if (schema.componentType == 'FileUpload') {
        let key =
          formKey + separator + permissionConfig.tableName + separator + permissionConfig.fieldId;
  
        uploadComponent.ids.push(key);
      }
    }
    return schema;
  }
  function getPermissionConfigMap(children) {
    let map = new Map();
    if(children&&children.length>0){
      children.forEach((element) => {
      map.set(element.key, element);
    });
    }
    return map;
  }
  function executeFormEvent(formEventConfig, formModel) {
    if (!formEventConfig.length) return;
    try {
      formEventConfig.map((x) => {
        x.nodeInfo?.processEvent?.map(async (config) => {
          if (config.operateType === 'api') {
            await apiConfigFunc(config.operateConfig, true, formModel);
          } else if (config.operateType === 'liteflow') {
            await postExecute(config.operateConfig, formModel);
          }
        });
      });
    } catch (error) {
      
    }
  }
  return {
    forms,
    uploadComponent,
    initFormInfo,
    executeFormEvent,
    handlerFormPermission
  };
}
