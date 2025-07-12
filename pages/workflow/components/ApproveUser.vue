<template>
  <custom-dialog
    ref="relationRef"
    title="下一节点审批人"
    :hasCloseIcon="false"
    :hasFooterIcon="true"
  >
  <view class="head-hr"></view>
    <view class="model-content">
      <scroll-view class="tab-box" scroll-x="true" scroll-left="120">
        <view
          class="tab-item"
          v-for="(item, index) in props.approveUserData.list"
          :key="index"
          @tap="changeCurrentTabIndex(index, item.taskId)"
        >
        <view :class="state.currentTabIndex == index?'cur':''">{{ item.taskName }}</view>
      <view v-if="state.currentTabIndex == index" class="tag-box"></view>
        </view>
      </scroll-view>
      <view class="head-hr"></view>
      <SelectApproveUser
        v-if="state.show"
        :schemaId="props.approveUserData.schemaId"
        :taskId="state.taskId"
        @change="changeApproveUserData"
      />
    </view>
    <template #footer>
    <custom-dialog-submit @tap="confirm"></custom-dialog-submit>
    </template>
  </custom-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import SelectApproveUser from "./nextNode/SelectApproveUser.vue";
import { batchApproverUsers } from "@/common/api/workflow/index";
const props = defineProps({
  launchId: String,
  approveUserData: Object,
});
const emits = defineEmits(["submit"]);
const state = reactive({
  currentTabIndex: 0,
  taskId: "",
  show: false,
  approveUserList: [],
});
const relationRef = ref();
onMounted(() => {
  relationRef.value.open();
  state.approveUserList = [];
  if (props.approveUserData.list.length > 0) {
    state.taskId = props.approveUserData.list[0].taskId;
    props.approveUserData.list.forEach((element) => {
      state.approveUserList.push({
        taskId: element.taskId,
        approvedUsers: [],
      });
    });
    state.show = true;
  }
});
function changeCurrentTabIndex(index, taskId) {
  state.currentTabIndex = index;
  state.taskId = taskId;
}
function changeApproveUserData(data) {
  state.approveUserList[state.currentTabIndex].approvedUsers = data;
}
async function confirm() {
  try {
    if (props.approveUserData.schemaId) {
      let res = await batchApproverUsers(
        props.approveUserData.schemaId,
        state.approveUserList
      );
      if (res) {
        emits("submit");
      } else {
        uni.showToast({
          icon: "none",
          title: "选择下一节点审批人失败",
        });
      }
    }
  } catch (_error) {
    uni.showToast({
      icon: "none",
      title: "选择下一节点审批人失败",
    });
  }
}
</script>

<style lang="scss">
.head-hr{
  border: 2rpx solid #E7EBF2;
}
.tab-box{
  padding: 21rpx 0 ;
}
 .tag-box{
    height: 15rpx;
   background: linear-gradient(90deg, rgba(94,149,255,0) 0%, rgba(94,149,255,0.9) 51%, rgba(94,149,255,0) 100%);
  }
  .tab-item {
    display: inline-block;
    text-align: center;
    height: 42rpx;
    font-size: 27rpx;
    font-weight: bold;
    color: #BBBEC9;
    line-height: 32rpx;
    margin-right: 60rpx;
  }
  .cur {
    font-size: 31rpx;
    font-weight: bold;
    color: #253954;
    line-height: 36rpx;
  }
</style>
