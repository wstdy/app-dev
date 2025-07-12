<template>
  <view>
  <view class="mini-btn" @tap="open">更多人员添加</view>
    <uni-user-popup ref="relationRef" 
    :selectedList="props.selectedList" 
    :disabledIds="props.disabledIds"
    @change="confirm"/>
  </view>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  selectedList: Array,
  disabledIds: Array,
});
const emits = defineEmits(["change"]);
const relationRef = ref();
async function open() {
  relationRef.value.open();
}
function confirm(selectedList){
  emits('change',selectedList);
}



</script>

<style lang="scss" scoped>
.mini-btn{
  width: 185rpx;
  height: 50rpx;
  background: #E9EEFD;
  border-radius: 25rpx 25rpx 25rpx 25rpx;
  font-size: 23rpx;
  font-weight: bold;
  color: #5E95FF;
  line-height: 27rpx;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>
