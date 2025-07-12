import { reactive } from 'vue';
import { ElectronicSignatureVerification } from "@/common/enums/workflow.ts";
export default function () {
  const approveUserData = reactive({
    visible: false,
    list: [],
    schemaId: '',
  });
  const data = reactive({
    xml: '',
    item: { id: '', code: '', categoryName: '', name: '', remark: '' }, //工作流模板信息
    formInfos: [],
    relationTasks: [],
    taskRecords: [],
    taskApproveOpinions: [],
    predecessorTasks: [],
    opinions: [],
    opinionsComponents: [],
    hasStamp: false,
    hasStampPassword: false,
    submitLoading: false,
    formAssignmentData: null,
    workflowChat:'',//流程信息 流程图
    processId:''
  });
  function initProcessData(res) {
    if (res&&res.schemaInfo){
      data.item.id = res.schemaInfo.id;
      data.item.name = res.schemaInfo.name;
      data.item.code = res.schemaInfo.code;
      data.item.remark = res.schemaInfo.remark;
    }
    if(res.workflowChat){
      data.workflowChat = res.workflowChat;
    }
    data.taskApproveOpinions = [];
    data.predecessorTasks = [];
    data.opinions = [];
    data.opinionsComponents = [];
    data.hasStamp = false;
    data.hasStampPassword = false;
    data.submitLoading = false;
    data.xml = '';
    if (res.schemaInfo.xmlContent) {
      data.xml = res.schemaInfo.xmlContent;
    }
    data.formInfos = [];
    if (res.formInfos) {
      data.formInfos = res.formInfos;
    }
    data.taskRecords = [];
    if (res.taskRecords) {
      data.taskRecords.push({
        records: res.taskRecords,
        schemaName: '当前流程',
      });
    }

    if (res.otherProcessApproveRecord) {
      data.taskRecords = data.taskRecords.concat(res.otherProcessApproveRecord);
    }
    data.taskApproveOpinions = [];
    if (res.taskApproveOpinions) {
      data.taskApproveOpinions = res.taskApproveOpinions;
    }

    if (res.formAssignmentData) {
      data.formAssignmentData = res.formAssignmentData;
    }

    if (res.relationTasks) {
      data.relationTasks = res.relationTasks;
      data.relationTasks.forEach((element) => {
        data.predecessorTasks.push({
          schemaId: element.schemaId,
          schemaName: element.schemaName,
          taskId: '',
          taskName: '',
          processId: '',
        });
      });
    }
    if (res.opinionConfig) {
      if (res.opinionConfig.enabled) {
        data.hasStamp = true;
        if (res.opinionConfig.signature === ElectronicSignatureVerification.PASSWORD_REQUIRED) {
          data.hasStampPassword = true;
        }
        if (res.opinionConfig.component && res.opinionConfig.component.length > 0) {
          data.opinionsComponents = res.opinionConfig.component;
          getOpinionFormData();
        }
      }
    }
    if (res.formAssignmentData) {
      data.formAssignmentData = res.formAssignmentData;
    }
  }

  function getOpinionFormData() {
    data.opinions = data.taskApproveOpinions;
  }
  return {
    data,
    approveUserData,
    initProcessData
  };
}
