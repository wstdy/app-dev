<template>
  <view class="item">
    <view class="left">
      <!-- <view class="img-box">
        <view class="user-img"><image :src="imgUrl" /></view>
      </view> -->
      <view class="title-box"
        ><text>{{ props.name }}</text></view
      >
    </view>
    <view class="right">
      <view class="checkbox__inner" :class="getClass">
        <view class="checkbox__inner-icon" v-if="props.checked"></view>
    </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import ossConfig from "@/common/config/oss.js";
const imgUrl = ossConfig.staticImgUrl + "/img/user.png";
/*
id 用户id
name 用户名字
checked 选中 Boolean
disabled  禁用 Boolean
*/
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    default: "",
  },
  checked: Boolean,
  disabled: Boolean,
});
const getClass = computed(() => {
  let str = '';
  if(props.checked) str+=' is-checked ';
  if(props.disabled) str+=' disabled ';
 return str
})
</script>

<style lang="scss" scoped>
.item {
  background: #ffffff;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  border-bottom: 1px solid #f5f6fa;
  // margin-bottom: 19rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 19rpx;
  .left {
    display: flex;
    align-items: center;
    .title-box {
      text {
        font-size: 27rpx;
        font-weight: 500;
        color: #253954;
        line-height: 32rpx;
      }
    }
    .img-box {
      background-color: #d1e4fe;
      border-radius: 50%;
      padding: 13rpx 15rpx;
      margin-right: 19rpx;
      .user-img {
        width: 27rpx;
        height: 31rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .right {
    margin-right: 6rpx;
    .checkbox__inner.is-checked {
      border-color: #007aff;
      background-color: #007aff;
    }
    .checkbox__inner.disabled{
      border-color: #babbbe;
      background-color: #babbbe;
    }
    .checkbox__inner {
      flex-shrink: 0;
      box-sizing: border-box;
      position: relative;
      width: 16px;
      height: 16px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      background-color: #fff;
      z-index: 1;
      border-radius: 50%;
    }
    .checkbox__inner.is-checked .checkbox__inner-icon {
      opacity: 1;
      transform: rotate(45deg);
    }

    .checkbox__inner .checkbox__inner-icon {
      position: absolute;
      top: 2px;
      left: 5px;
      height: 7px;
      width: 3px;
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      opacity: 0;
      transform-origin: center;
      transform: rotate(45deg);
      box-sizing: content-box;
    }
   
  }
}
</style>
