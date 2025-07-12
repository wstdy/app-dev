<template>
  <view class="wrap">
    <PageHead :title="pageTitle" />
    <view class="box">
      <text class="title">旧密码</text>
      <uni-easyinput
        class="list-input"
        v-model="state.oldPassword"
        focus
        placeholder="请输入旧密码"
      ></uni-easyinput>
    </view>
    <view class="box">
      <text class="title">新密码</text>
      <uni-easyinput
        class="list-input"
        v-model="state.newPassword"
        focus
        placeholder="请输入新密码"
      ></uni-easyinput>
      <view class="hr"></view>
      <text class="title">确认新密码</text>

      <uni-easyinput
        class="list-input"
        v-model="state.confirmPassword"
        focus
        placeholder="请再次输入新密码"
      ></uni-easyinput>
    </view>
    <view class="button-login" hover-class="button-hover" @tap="submit()">
      <text>确认</text>
    </view>
  </view>
</template>

<script setup>
import PageHead from "./components/Head.vue";
import { putUpdatePassword } from "@/common/api/login/index";
import { reactive } from "vue";
const state = reactive({
  confirmPassword: "",
  newPassword: "",
  oldPassword: "",
});
const pageTitle = "修改密码";
async function submit() {
  if (state.oldPassword == "") {
    uni.showToast({
      icon: "none",
      title: "请填写旧密码",
    });
    return;
  }
  if (state.newPassword == "") {
    uni.showToast({
      icon: "none",
      title: "请填写新密码",
    });
    return;
  }
  if (state.confirmPassword == "") {
    uni.showToast({
      icon: "none",
      title: "请再次输入新密码",
    });
    return;
  }
  if (state.confirmPassword !== state.newPassword) {
    uni.showToast({
      icon: "none",
      title: "两次新密码不一致",
    });
    return;
  }
  // 验证 密码必须包含大写字母、小写字母、数字和特殊字符，长度8~16位
  if (state.newPassword.length < 8 || state.newPassword.length > 16) {
    uni.showToast({
      icon: "none",
      title: "密码须长度8~16位",
    });
    return;
  }
  let pwdCount = 0;
  let pwdRegex1 = new RegExp("(?=.*[0-9]).{8,16}"); //纯数字
  let pwdRegex2 = new RegExp("(?=.*[a-z]).{8,16}"); //小写字母
  let pwdRegex3 = new RegExp("(?=.*[A-Z]).{8,16}"); //大写字母
  let pwdRegex4 = new RegExp("(?=.*[^a-zA-Z0-9]).{8,16}"); //特殊字符
  if (pwdRegex1.test(state.newPassword)) {
    pwdCount = pwdCount + 1;
  }
  if (pwdRegex2.test(state.newPassword)) {
    pwdCount = pwdCount + 1;
  }
  if (pwdRegex3.test(state.newPassword)) {
    pwdCount = pwdCount + 1;
  }
  if (pwdRegex4.test(state.newPassword)) {
    pwdCount = pwdCount + 1;
  }
  if (pwdCount < 4) {
    uni.showToast({
      icon: "none",
      title: "密码须含大写,小写,数字和特殊字符",
    });
    return;
  }
  try {
    await putUpdatePassword(state);
    uni.showToast({
      icon: "none",
      title: "修改成功",
    });
    //停顿两秒返回上一页
    setTimeout(() => {
      uni.navigateBack();
    }, 2000);
  } catch (error) {
    uni.showToast({
      icon: "none",
      title: "提交错误",
    });
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  background: #f6f9ff;
}
.box {
  background-color: #fff;
  margin: 20rpx 28rpx;
  padding: 28rpx;
  border-radius: 19rpx 19rpx 19rpx 19rpx;
  .title {
    display: inline-block;
    margin-bottom: 20rpx;
  }
  text{
    line-height: 32rpx;
    font-size: 27rpx;
    font-weight: 500;
    color: #253954;
  }
  .hr{
    height: 28rpx;
  }
}
.uni-input-placeholder {
  color: #bdc3d6;
}
.list-input {
  color: #999;
  font-size: 27rpx;
}

.button-login {
  height: 96rpx;
  background: #5e95ff;
  border-radius: 58rpx 58rpx 58rpx 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 53rpx 28rpx 0 28rpx;
  text {
    font-size: 31rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 36rpx;
  }
}
</style>
