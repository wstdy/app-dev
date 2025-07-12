<template>
  <!-- 附件汇总 -->
  <view>
    <view class="card-list" v-if="state.list.length>0">
        <view
          v-for="(item, index) in state.list"
          :key="index"
          class="card-item"
          @tap="previewFile(item)"
        >
          <view class="item">
            <image :src="FuJianImg" class="item-icon"></image>
            <text class="item-text">{{ item.fileName }}</text>
          </view>
        </view>
      </view>
      <Empty v-else title="附近汇总记录为空" />
    <uni-popup ref="imgRef" background-color="#fff">
			<image :src="state.previewFileUrl"></image>
			</uni-popup>
    <custom-dialog  ref="webRef" title="webRef预览" :hasCloseIcon="true" >
        <web-view :src="state.previewFileUrl"></web-view>
    </custom-dialog>
  </view>
</template>

<script setup>
import { ref,reactive,onMounted } from "vue";
import { getSummaryOfAttachmentList } from "@/common/api/workflow/index";
import Empty from "@/components/layout/Empty.vue";
import ossConfig from "@/common/config/oss.js";
const FuJianImg = ossConfig.staticImgUrl + "/img/fujian.png";
const props = defineProps({
  processId: "",
});
const imgRef = ref();
const webRef = ref();
onMounted(async () => {
  if(props.processId){
    let res = await getSummaryOfAttachmentList({ processId: props.processId });
    if(res.data){
      state.list = res.data;
    }
  }
})
const state = reactive({
  list: [],
  previewFileUrl: "",
});

function previewFile(item) {
 
  if(isImgTypeFromFileName(item.fileType)){
    state.previewFileUrl = item.fileUrl;
    imgRef.value.open();
  }
  else {
    // webRef.value.open();
    uni.showModal({
    title: "提示",
    content: "抱歉暂不支持预览功能",
    showCancel: false,
    confirmText: "确定",
  });
  }
}
function isImgTypeFromFileName(type) {
  let imgType = [".bmp", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico"];
  return imgType.includes(type);
}
// function down(){
//   webRef.value.open();
// }
</script>

<style lang="scss">
.card-list {
  .card-item {
    background: #ffffff;
    border-radius: 19rpx 19rpx 19rpx 19rpx;
    margin: 20rpx 0;
    position: relative;
    .item {
      display: flex;
      height: 96rpx;
      align-items: center;
      .item-icon {
        width: 57rpx;
        height: 57rpx;
        margin: 20rpx;
      }
      .item-text {
        flex: 1;
        font-size: 27rpx;
        font-weight: 500;
        color: #253954;
        line-height: 32rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
