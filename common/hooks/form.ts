import { FromPageType } from "../enums/form";
import { separator } from '@/utils/simpleForm/analysis';
export function getFormTitle(type) {
  switch (type) {
    case FromPageType.ADD:
      return '新增';
    case FromPageType.EDIT:
      return '编辑';
    case FromPageType.VIEW:
      return '查看';
    default:
      break;
  }
}

export function handlerFormPermission(buildOptionJson, children, formKey,otherParams){
  let permissionConfigMap = getPermissionConfigMap(children);
  const formShow = 0; //表单是否有显示的组件，有则大于0
  otherParams.uploadComponentIds = [];
  buildOptionJson.schemas = schemeList(
    buildOptionJson.schemas,
    permissionConfigMap,
    formKey,
    formShow,
    otherParams
    );
  return {buildOptionJson,otherParams};
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
function schemeList(schemas, permissionConfigMap, formKey, formShow,otherParams) {
  if(schemas){

    schemas = schemas.map((schema) => {
      if (['Collapse','Segmented'].includes(schema.component)) {
        formShow += 1;
        if (schema.layout && schema.layout.length > 0) {
          schema.layout.forEach((ele2) => {
            if (ele2.children && ele2.children.length > 0) {
              ele2.children = schemeList(ele2.children, permissionConfigMap, formKey, formShow,otherParams);
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
            const tableItemPermissionConfig:Array<string> = [];
            if(permissionConfig&&permissionConfig.children){
              if ((permissionConfig?.children || []).find((item) => item.fieldId === '_row_ctrl_' && !item.edit)) {
                schema.disabled = true;
              }
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
    otherParams.uploadComponentIds.push(key);
  }
  if (permissionConfig?.isSubTable) {
    // 子表单上传组件集合
    if (schema.componentType == 'FileUpload') {
      let key =
        formKey + separator + permissionConfig.tableName + separator + permissionConfig.fieldId;

      otherParams.uploadComponentIds.push(key);
    }
  }
  return schema;
}
