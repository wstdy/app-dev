const currentFlowData = {
    schemaId: '',
    processId: '',
    taskId: '',
    formModel: {}
};
export function setCurrentFlowData(data) {
    Object.assign(currentFlowData, data);
}

export function getCurrentFlowData() {
    return currentFlowData;
}

export function setFormModel(data) {
    Object.assign(currentFlowData, {formModel: data});
}