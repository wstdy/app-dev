<template>
  <view>
    <!-- 电子签章 -->
    <view class="box" @tap="open">
      <view class="text">{{ stampName }}</view>
    </view>
    <!-- 签章列表选择 -->
    <custom-dialog  ref="stampRef" title="选择签章" :hasCloseIcon="true" :hasFooterIcon="true"  >

      <view class="relation-box">
        <CardBox  v-for="(item, index) in stampData.stampList"
            :key="index">
          <view class="card-box">
            <view class="title-box">
              <text class="title">{{
                item.name}}</text>
              <view class="check-item"  @tap="checked(item.id)">
                <view
                  class="checked"
                  v-if="stampData.stampId == item.id"
                >
                  <view class="icon"></view>
                </view>
                <view class="kong" v-else></view>
              </view>
            </view>
            <view class="card-hr"></view>
            <view class="card-item-box">
            <view class="left">
              <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-a-1Frenyuanyonghu"></text>
              </view>
              <text class="text">{{ item.stampCategoryName }}</text>
            </view>
            <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-kaiguan"></text>
              </view>
              <text class="text">{{ item.enabledMark === 0 ? "停用" : "启用" }}</text>
            </view>
            <view class="card-content">
              <view class="icon">
                <text class="iconfont icon-beizhu-"></text>
              </view>
              <text class="text">{{ item.remark }}</text>
            </view>
            </view>
            <view class="right"> <view class="card-img-box"><image :src="item.fileUrl" /></view></view>
            </view>
          </view>
        </CardBox>
      </view>
      <template #footer>
        <custom-dialog-submit @tap="submit"></custom-dialog-submit>
      </template>
    </custom-dialog>
  </view>
</template>

<script setup>
import { ref,computed, reactive,onMounted } from "vue";
import { getStampList } from "@/common/api/workflow/index";
import CardBox from "@/components/card/CardBox.vue";
const props = defineProps({
  stampId: String,
});
const emits = defineEmits(["submit"]);
const stampRef = ref();
const stampData = reactive({
  stampId: "",
  password: "",
  localData: [],
  stampList: [],
});
const stampName = computed(() => {
  return stampData.stampId?getStampName():'请选择电子签章'
})
onMounted(async () => {
  await getList();
})
function getStampName(){
  let name = stampData.stampId;
  let names = stampData.stampList.filter(ele=>{
    return ele.id == stampData.stampId
  });
  if(names.length>0){
    name = names[0].name
  }
  return name;
}
async function open() {
  stampRef.value.open();
}
async function getList() {
  try {
    let res = await getStampList({ stampType: 0 });
    if (res && res.data && res.data.list && res.data.list.length > 0) {
      stampData.stampList = res.data.list;
      stampData.localData = res.data.list.map((ele) => {
        return { text: ele.name, value: ele.id, isDefault: ele.isDefault };
      });
    }
    if (props.stampId) {
      stampData.stampId = props.stampId;
    } else {
      let arr = stampData.stampList.filter((ele) => {
        return ele.isDefault == 1;
      });
      if (arr.length > 0) stampData.stampId = arr[0].value;
    }
  } catch (error) {}
}
function checked(id) {
  stampData.stampId = id;
}
function submit() {
  if (stampData.stampId) {
    emits("submit", stampData.stampId);
    cancel();
  } else {
    uni.showToast({
      icon: "none",
      title: "请选择签章",
    });
  }
}
function cancel() {
  stampRef.value.close();
}
</script>

<style lang="scss" scoped>

.box{
  height: 77rpx;
  background: #FFFFFF;
  border-radius: 10rpx 10rpx 10rpx 10rpx;
  opacity: 1;
  border: 2rpx solid #F2F2F2;
  display: flex;
  align-items: center;
  padding-left: 23rpx;
  .text{
    font-size: 27rpx;
    font-weight: 500;
    color: #BDC3D6;
    line-height: 32rpx;
  }
}
.card-item-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left{
    flex: 1;
  }
  .right{
    .card-img-box{
      width: 119rpx;
      height: 119rpx;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      image,img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
.card-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-bottom: 28rpx;
    .title {
      font-size: 31rpx;
      font-weight: bold;
      color: #253954;
      width: 550rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .btn {
    width: 100rpx;
    height: 42rpx;
    background: #e9eefd;
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    text {
      font-size: 20rpx;
      font-weight: 500;
      color: #5e95ff;
      line-height: 23rpx;
    }
  }
  .card-hr {
    width: 100%;
    height: 1rpx;
    background: #eeeeee;
    border-radius: 0rpx;
    opacity: 1;
    margin-bottom: 28rpx;
  }
  .card-content {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 10rpx 0;
    .icon {
      width: 35rpx;
      height: 35rpx;
      background: #d9dfea;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .iconfont {
      font-size: 18rpx;
      color: #fff;
    }
    .text {
      font-size: 27rpx;
      font-weight: 500;
      color: #253954;
      line-height: 32rpx;
      margin-left: 10rpx;
    }
  }
  .check-item {
    .kong {
      width: 27rpx;
      height: 27rpx;
      background: #ffffff;
      border-radius: 0rpx 0rpx 0rpx 0rpx;
      opacity: 1;
      border: 2rpx solid #e7ebf2;
      border-radius: 50%;
    }
    .checked {
      width: 27rpx;
      height: 27rpx;
      background: #ffffff;
      opacity: 1;
      border: 2rpx solid #5e95ff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 15rpx;
        height: 15rpx;
        background: #5e95ff;
        border-radius: 50%;
      }
    }
  }
}
</style>
