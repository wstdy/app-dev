<template>
  <uni-popup ref="popupRef" background-color="#fff">
    <view class="wrap" v-if="state.visible">
      <view class="mask-box"></view>
      <view class="dialog-box" :style="{height: dialogHeight}">
        <view class="head-box">
          <view class="title">{{ props.title }}</view
          >
          <view
            class="close iconfont icon-guanbi1"
            v-if="props.hasCloseIcon"
            @tap="close"
          ></view>
          <slot name="headerButton"></slot>
          </view>
        <scroll-view class="content-box" :scroll-y="scrollY" :style="{maxHeight}">
          <slot></slot>
        </scroll-view>
        <view class="footer-box" v-if="props.hasFooterIcon"
          ><slot name="footer"></slot
        ></view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
import { ref, reactive } from "vue";
const emits = defineEmits(["close", "open"]);
const props = defineProps({
  title: String,
  hasCloseIcon: {
    type: Boolean,
    default: true,
  },
  hasFooterIcon: {
    type: Boolean,
    default: false,
  },
  scrollY: {
	type: Boolean,
	default: true
  },
  maxHeight: {
	type: String,
	default: '800rpx'
  },
  dialogHeight: {
	type: String,
	default: '948rpx'  
  }
});
const popupRef = ref();
const state = reactive({
  visible: false,
});
function open() {
  popupRef.value.open();
  state.visible = true;
  emits("open");
}
function close() {
  popupRef.value.close();
  state.visible = false;
  emits("close");
}
defineExpose({ open, close });
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // z-index: 1;
  width: 100vw;
  height: 100vh;
  // background: rgba(0, 0, 0, 0.5);
  .dialog-box {
    background: #f6f9ff;
    border-radius: 19rpx 19rpx 0rpx 0rpx;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    // z-index: 2;
    padding: 28rpx 28rpx;
  }
  .head-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 35rpx;
      font-weight: bold;
      color: #253954;
      line-height: 42rpx;
    }
    .close {
      color: #bdc3d6;
    }
  }
  .content-box {
    padding: 28rpx 0;
  }
  .footer-box {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    padding: 0 28rpx;
  }
}
</style>
