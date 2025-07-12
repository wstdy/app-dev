<template>
  <view class="bg">
    <view class="iconfont icon-sousuo search-icon"></view>
    <uni-easyinput
      v-model="state.value"
      placeholder="请输入关键字"
      :inputBorder="false"
      @clear="searchReset"
      @confirm="search"
    ></uni-easyinput>
  </view>
</template>

<script setup>
import { reactive } from "vue";
const emits = defineEmits(["search"]);
const state = reactive({
  value: "",
});
function search() {
  emits("search", state.value);
}
function searchReset() {
  emits("search", "");
}
</script>

<style scoped>
.bg{
  margin-top: 20rpx;
  background: #EBEFF6;
  border-radius: 48rpx 48rpx 48rpx 48rpx;
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon{
  margin-left: 40rpx;
  color: #BDC3D6;
}

</style>
