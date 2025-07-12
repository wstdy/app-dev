<template>
  <custom-dialog
    ref="relationRef"
    title="选择人员"
    :hasCloseIcon="true"
    :hasFooterIcon="true"
  >
    <view class="model-content">
      <uni-organization
        style="margin: 19rpx 0; background: #fff"
        v-model="state.departmentId"
        @change="deptChange"
      />
      <view class="user-box" v-if="state.userList.length > 0">
        <uni-user-card
          v-for="(item, index) in state.userList"
          :key="index"
          :id="item.id"
          :name="item.name"
          :code="item.code"
          :checked="state.selectedIds.includes(item.id)"
          :disabled="props.disabledIds.includes(item.id) ? true : false"
          @tap="checked(item)"
        ></uni-user-card>
      </view>
      <view class="user-box" v-else>
        <Empty title="暂无数据" />
      </view>
    </view>
    <template #footer>
      <view class="page-box" v-if="state.userList.length > 0">
        <uni-pagination
          :show-icon="true"
          :total="state.page.total"
          :pageSize="state.page.size"
          title=""
          @change="loadMore"
        />
      </view>
      <view class="hr"></view>
      <custom-dialog-submit @tap="confirm"></custom-dialog-submit>
    </template>
  </custom-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import Empty from "@/components/layout/Empty.vue";
import { getUserPage, getAllUserList } from "@/common/api/organization/index";
const props = defineProps({
  selectedList: {
    type: Array,
    default: [],
  },
  selectedIds: {
    type: String,
    default: "",
  },
  disabledIds: {
    type: Array,
    default: [],
  },
});
const emits = defineEmits(["change", "update:modelValue"]);
const state = reactive({
  selectedIds: [],
  selectedList: [],
  userList: [],
  departmentId: "",
  page: {
    limit: 1,
    size: 5,
    total: 0,
  },
});
const relationRef = ref();

async function getInfoByIds(userIds = "") {
  const infoIds = userIds || props.selectedIds;
  if (!infoIds) {
    state.selectedList = []
    state.selectedIds = []
  }
  if (!props.selectedList.length && infoIds) {
    const ids = infoIds.split(",");
    const res = await getAllUserList();
    state.selectedList = res.data.filter((item) => ids.includes(item.id));
    state.selectedIds = ids;
  }else{
    if(props.selectedList.length){
      state.selectedList = props.selectedList;
      state.selectedIds = state.selectedList.map(ele=>{
        return ele.id;
      });
    }
  }
}
async function open() {
  state.departmentId = "";
  if (props.selectedList.length) {
    state.selectedList = JSON.parse(JSON.stringify(props.selectedList));
    state.selectedIds = state.selectedList.map((ele) => {
      return ele.id;
    });
  }

  await getInfoByIds();
  await getUserList();
  relationRef.value.open();
}
async function loadMore(e) {
  state.page.limit = e.current;
  await getUserList();
}

function confirm() {
  emits("change", state.selectedList);
  emits("update:modelValue", state.selectedList);
  cancel();
}

function cancel() {
  relationRef.value.close();
}

function checked(user) {
  if (state.selectedIds.includes(user.id)) {
    state.selectedIds.splice(
      state.selectedIds.findIndex((item) => item === user.id),
      1
    );
    state.selectedList.splice(
      state.selectedList.findIndex((item) => item.id === user.id),
      1
    );
  } else {
    state.selectedIds.push(user.id);
    state.selectedList.push(user);
  }
}

async function getUserList() {
  let params = {
    departmentId: state.departmentId,
    limit: state.page.limit,
    size: state.page.size,
  };
  let res = await getUserPage(params);
  state.userList = res.data.list;
  state.page.total = res.data.total;
}

function deptChange() {
  getUserList();
}

defineExpose({
  open,
  getInfoByIds,
  confirm,
});
</script>

<style lang="scss" scoped>
.page-box {
  margin: 0 auto;
  text-align: center;
  padding: 19rpx 0;
  background-color: #ffffff;
}
.hr {
  width: 100%;
  border: 2rpx solid #f3f4f8;
}
.btn-list {
  .btn {
    height: 96rpx;
    border-radius: 48rpx 48rpx 48rpx 48rpx;
    margin: 20rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .text {
      font-size: 31rpx;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .btn1 {
    background: #5e95ff;
  }
}
</style>
