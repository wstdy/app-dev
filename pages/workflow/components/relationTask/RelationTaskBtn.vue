<template>
    <view class="btn"  v-if="props.content">
      <text  @tap="shareToggle">关联任务</text>
     <!-- 关联前置任务 -->
     <custom-dialog  ref="relationRef" title="关联前置任务" :hasCloseIcon="true"  :hasFooterIcon="true">
      <view class="model-content">
          <RelationTaskItem
            v-for="(item, index) in state.relationTasks"
            :key="index"
            :itemIndex="index"
            :launchId="props.launchId"
            :relationSchemaId="item.schemaId"
            :relationSchemaName="item.schemaName"
            :processId="item.processId"
            @submit="checkItem"
          >
          {{ item.processId?item.taskName:'请点击选择关联任务' }}
          </RelationTaskItem>
        </view>
        <template #footer>
          <custom-dialog-submit @tap="confirm"></custom-dialog-submit>
        </template>
    </custom-dialog>
    </view>
</template>

<script setup>
import { ref,reactive } from "vue";
import RelationTaskItem from "./RelationTaskItem.vue";
const props = defineProps({
  launchId: String,
  content: Array,
});
const emits = defineEmits(["submit"]);
const relationRef = ref();
const state = reactive({relationTasks:[]})
function shareToggle() {
  state.relationTasks = props.content;
  relationRef.value.open();
}
function confirm(){
  emits('submit',state.relationTasks);
  relationRef.value.close();
}
function checkItem(params){
  state.relationTasks[params.itemIndex]['taskId'] = params.taskId;
  state.relationTasks[params.itemIndex]['taskName'] = params.taskName;
  state.relationTasks[params.itemIndex]['processId'] = params.processId;
}
</script>

<style lang="scss">

.btn{
 text{
  font-size: 27rpx;
    font-weight: bold;
    color: #B7BACA;
    line-height: 32rpx;
 }
}

</style>
