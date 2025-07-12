<template>
  <view class="tab-box">
    <view
        class="tab-item"
        v-for="(item, index) in tabHeadList"
        :key="index"
        :class="state.currentTabIndex == index ? 'cur' : ''"
        @tap="changeCurrentTabIndex(index)"
        >
        {{ item.title }}</view
      >
    <view class="hr"></view>
    
    <view class="tab-content">
      <view class="list" v-if="state.currentTabIndex == 0">
        <scroll-view scroll-y="true" class="scroll-Y">
          <uni-user-card
            v-for="(item, index) in data.approvedList"
            :key="index"
            :id="item.id"
            :name="item.name"
            :code="item.code"
            :checked="data.approvedIds.includes(item.id)"
            :disabled="item.canRemove ? false : true"
            @tap="checkApprovedId(item)"
          ></uni-user-card>
        </scroll-view>
      </view>
      <view class="list" v-if="state.currentTabIndex == 1">
        <view class="more-btn"
          ><SelectUser
            :disabledIds="data.disabledIds"
            :selectedList="data.selectedList"
            @change="changeSelectIds"
        /></view>
        <scroll-view scroll-y="true" class="scroll-Y">
          <uni-user-card
            v-for="(item, index) in data.selectedList"
            :key="index"
            :id="item.id"
            :name="item.name"
            :checked="data.selectedIds.includes(item.id)"
            :disabled="data.disabledIds.includes(item.id) ? true : false"
            @tap="checked(item)"
          ></uni-user-card>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import SelectUser from "./SelectUser.vue";
import { getApproveUserList } from "@/common/api/workflow/index";
const props = defineProps({
  schemaId: String,
  taskId: String,
});
const emits = defineEmits(["change"]);
const tabHeadList = [
  {
    title: "候选人",
  },
  {
    title: "已选人员",
  },
];
const state = reactive({
  currentTabIndex: 0,
});
let data = reactive({
  approvedList: [],
  selectedList: [],
  approvedIds: [],
  disabledIds: [],
  selectedIds: [],
});
onMounted(() => {
  getCandidateList();
});
async function getCandidateList() {
  try {
    let userListRes = await getApproveUserList(props.schemaId, props.taskId);
    let userList = userListRes.data;
    data.approvedList = JSON.parse(JSON.stringify(userList));
    data.approvedIds = data.approvedList.map((ele) => {
      return ele.id;
    });
    data.disabledIds = data.approvedList
      .filter((ele) => {
        return !ele.canRemove;
      })
      .map((ele) => {
        return ele.id;
      });

    data.selectedList = JSON.parse(JSON.stringify(userList));
    data.selectedIds = data.selectedList.map((ele) => {
      return ele.id;
    });
    change();
  } catch (error) {
    uni.showToast({
      icon: "none",
      title: "获取下一节点审批人失败",
    });
  }
}
function changeCurrentTabIndex(index) {
  state.currentTabIndex = index;
}
function change() {
  emits("change", data.selectedIds);
}
function checkApprovedId(user) {
  if (data.disabledIds.includes(user.id)) {
    return false;
  }
  if (data.approvedIds.includes(user.id)) {
    data.approvedIds.splice(
      data.approvedIds.findIndex((item) => item === user.id),
      1
    );
    data.selectedIds.splice(
      data.selectedIds.findIndex((item) => item === user.id),
      1
    );
    data.selectedList.splice(
      data.selectedList.findIndex((item) => item.id === user.id),
      1
    );
  } else {
    data.approvedIds.push(user.id);
    data.selectedIds.push(user.id);
    data.selectedList.push(user);
  }
  change();
}
function checked(user) {
  if (data.disabledIds.includes(user.id)) {
    return false;
  }

  if (data.selectedIds.includes(user.id)) {
    data.selectedList.splice(
      data.selectedList.findIndex((item) => item.id === user.id),
      1
    );
    data.selectedIds = data.selectedIds.filter((o) => {
      return o != user.id;
    });
  } else {
    data.selectedList.push(user);
    data.selectedIds.push(user.id);
  }

  if (data.approvedIds.includes(user.id)) {
    data.approvedIds.splice(
      data.approvedIds.findIndex((item) => item === user.id),
      1
    );
  } else {
    data.approvedIds.push(user.id);
  }
  change();
}
function changeSelectIds(selectedList) {
  data.selectedList = JSON.parse(JSON.stringify(selectedList));
  data.selectedIds = data.selectedList.map((ele) => {
    return ele.id;
  });
  change();
}
</script>

<style lang="scss">
.tab-item {
  display: inline-block;
  text-align: center;
  font-size: 27rpx;
  font-weight: bold;
  color: #253954;
  line-height: 62rpx;
  margin-right: 11rpx;
  padding: 0 30rpx;
}
.cur {
  color: #5E95FF;
  border-bottom: 4rpx solid;
}

.hr{
  border: 2rpx solid #E7EBF2;
  margin-bottom: 19rpx;
}

.more-btn {
  position: absolute;
  top: -88rpx;
  right: 0;
}
.list{
  position: relative;
}
.height-box {
  height: 80rpx;
}
</style>
