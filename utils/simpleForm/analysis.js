export const separator = '___';
export function handleWorkflow(data,formId,rowKey){
  const workflowData = data.workflowData;
  //与工作流有关联的表单
  if (workflowData.status) {
      //如果是本人需要审批的数据 就会有taskIds  所以需要修改绑定事件
      if (workflowData.taskIds) {
        // 审批流程
        handleApproveProcess(workflowData);
      } else {
        if(workflowData.status === 'ACTIVE'){
          console.log('按钮名称改为：审批中');
        }else{
          console.log('按钮名称改为：审批已完成');
        }
        //查看流程
        handleViewProcess(workflowData);
      }
    } else {
      // 发起审批
      handleLaunchProcess(workflowData,data,formId,rowKey);
    }
}
function handleViewProcess(workflowData) {
  if (workflowData&&workflowData.processId) {
    uni.navigateTo({
      url: "/pages/workflow/look?processId="+workflowData.processId+"&backUrl=-1"
    });
  }
}
function handleLaunchProcess(workflowData,data,formId,rowKey) {
  if (data&&data.id&&formId&&workflowData.schemaId) {
    let rowId = data[rowKey];
    uni.navigateTo({
    url: "/pages/workflow/launch?id=" + workflowData.schemaId+"&rowId="+rowId+"&formId="+formId,
    });
  }
}
function handleApproveProcess(workflowData) {
  console.log('workflowData: ', workflowData);
  if (workflowData&&workflowData.taskIds&&workflowData.taskIds[0]&&workflowData.processId) {
    uni.navigateTo({
      url: "/pages/workflow/approval?taskId="+workflowData.taskIds[0]+"&processId="+workflowData.processId+"&backUrl=-1"
    });
  }
}