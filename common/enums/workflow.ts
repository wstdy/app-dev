export enum WorkflowListType {
  TODO = 'todo', //待办
  FINISHED = 'finished', //已办
  CIRCULATED = 'circulated', //传阅
  MY = 'my', //我的任务
}
//  审批类型 0 同意 1 拒绝 2 驳回 3 结束 4 其他（用户自定义按钮）
export enum ApproveType {
  AGREE = 0, //同意
  DISAGREE, //拒绝
  REJECT, //驳回
  FINISH, //结束
  OTHER, //其他（用户自定义按钮）
}
export enum ApproveCode {
  AGREE = 'agree', //同意
  DISAGREE = 'disagree', //拒绝
  REJECT = 'reject', //驳回
  FINISH = 'finish', //结束
  OTHER = 'other', //其他（用户自定义按钮）
}
// 工作流分类id
export enum FlowCategory {
  ID = '1419276800524425555',
}
//电子签章验证
export enum ElectronicSignatureVerification {
  NO_PASSWORD_REQUIRED = 0, //直接使用不需要密码
  PASSWORD_REQUIRED, //填写密码
}