<template>
  <view class="loading blue" :style="styles">
    <view class="left"></view>
    <view class="right"></view>
    <view class="progress">{{ props.progress }}%</view>
  </view>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  progress: 40,
  title: "",
});
const styles = computed(() => {
  let rightRotate = 0;
  let leftRotate = 0;
  if (props.progress > 50) {
    rightRotate = 0;
    leftRotate = 3.6 * props.progress;
  } else {
    rightRotate = (props.progress - 50) * 3.6;
    leftRotate = 180;
  }

  return {
    "--leftRotate": "rotate(" + leftRotate + "deg)",
    "--rightRotate": "rotate(" + rightRotate + "deg)",
  };
});

</script>

<style lang="scss">
.loading {
  width: 8em;
  height: 8em;
  position: relative;
}

.loading .progress {
  position: absolute;
  width: 6em;
  height: 6em;
  background-color: white;
  border-radius: 50%;
  left: 1em;
  top: 1em;
  line-height: 6em;
  text-align: center;
}

.left,
.right {
  width: 4em;
  height: 8em;
  overflow: hidden;
  position: relative;
  float: left;
  background-color: #3cd09e;
}

.left {
  border-radius: 8em 0 0 8em;
}

.right {
  border-radius: 0 8em 8em 0;
}

.left:after,
.right:after {
  content: "";
  position: absolute;
  display: block;
  width: 4em;
  height: 8em;
  border-radius: 8em 0 0 8em;
}
.blue .left:after {
  background-color: #58a3f7;
}
.blue .right:after {
  background-color: #58a3f7;
}
.right:after {
  content: "";
  position: absolute;
  display: block;
  border-radius: 0 8em 8em 0;
}
.left:after {
  transform-origin: right center;
  transform: var(--leftRotate);
}

.right:after {
  transform-origin: left center;
  transform: var(--rightRotate);
}
</style>
