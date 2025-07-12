<template>
  <view class="wrap">
    <view class="content-box">
	  <view class="geg-logo"></view>
      <view class="form-box">
        <view class="form-box" v-if="state.type == LoginType.ACCOUNT">
          <view class="form-item">
            <text class="iconfont icon icon-yonghu"></text>
            <input
              class="input-text uni-input"
              v-model="state.accountLogin.userName"
              focus
              placeholder="请输入用户名"
            />
          </view>
          <view class="hr"></view>
          <view class="form-item">
            <text class="iconfont icon icon-mima"></text>
            <input
              class="input-text uni-input"
              placeholder="请输入密码"
              v-model="state.accountLogin.password"
              :password="state.showPsd ? false : true"
            />
            <text
              class="iconfont item-icon"
              @tap="state.showPsd = !state.showPsd"
              :class="state.showPsd ? 'icon-yanjing' : 'icon-yanjing1'"
            ></text>
          </view>
          <view class="hr"></view>
        </view>
        <view class="form-box" v-if="state.type == LoginType.PHONE">
          <view class="form-item">
            <text class="iconfont icon icon-shouji"></text>
            <input
              class="input-text uni-input"
              v-model="state.phoneLogin.mobile"
              focus
              placeholder="请输入您的手机号码"
            />
          </view>
          <view class="hr"></view>
          <view class="form-item">
            <text class="iconfont icon icon-yanzhengma"></text>
            <input
              class="input-text uni-input"
              v-model="state.phoneLogin.code"
              placeholder="请输入验证码"
            />
            <view class="item-btn" v-if="state.phoneMs.waitingTime >= 60" @tap="send">
              <text>{{ state.phoneMs.sendMsText }}</text>
            </view>
            <view class="item-btn" v-else>
              <text>{{ state.phoneMs.waitingTime }}</text>
            </view>
          </view>
          <view class="hr"></view> 
        </view>
				<view class="form-box" v-if="TENANT_ENABLED">
					<view class="form-item">
						<text class="iconfont icon icon-yanzhengma"></text>
						<input
							class="input-text uni-input"
							v-model="state.tenantCode"
							placeholder="请输入租户码"
						/> 
					</view> 
					<view class="hr"></view> 
				</view>
      </view>
      <view class="login-btn" @tap="bindLogin()"><text>登录</text></view>
      <view class="change-btn" @tap="changeType">
		  <text>{{ loginText }}</text>
		  </view>
    </view>

  </view>
</template>

<script setup>
import { reactive, computed } from "vue";
import { LoginType } from "@/common/enums/login.ts";
import { useUserStore } from "@/common/store/user";
import { sendSmsApi } from "@/common/api/login";
import ossConfig from "@/common/config/oss.js";
import config from "@/common/config/index.js";
console.log(config,'TENANT_ENABLED')
const TENANT_ENABLED=config.TENANT_ENABLED
const userStore = useUserStore();
const state = reactive({
  type: LoginType.ACCOUNT,
  showPsd: false,
  accountLogin: {
    userName: "",
    password: "",
  },
  phoneLogin: {
    mobile: "",
    code: "",
  },
  phoneMs: {
    disabled: true,
    sendMsText: "发送验证码",
    waitingTime: 60,
    coolDownTime: 60,
  },
	tenantCode:'' 
});
const loginText = computed(() => {
  return LoginType.ACCOUNT == state.type ? "手机号登录" : "账号登录";
});
function changeType() {
  state.type =
    LoginType.ACCOUNT == state.type
      ? (state.type = LoginType.PHONE)
      : (state.type = LoginType.ACCOUNT);
}
function bindLogin() {
  if (state.type == LoginType.PHONE) {
    phoneSubmit();
  } else if (state.type == LoginType.ACCOUNT) {
    accountSubmit();
  }
}
function send() {
  if (state.phoneMs.waitingTime >= 60) {
    sendSms();
  }
}
function changeWaitingTime() {
  if (state.phoneMs.waitingTime == 0) {
    state.phoneMs.waitingTime = state.phoneMs.coolDownTime;
  } else {
    state.phoneMs.waitingTime--;
    setTimeout(() => {
      changeWaitingTime();
    }, 1000);
  }
}
async function sendSms() {
  let checked = checkMobile();
  if (checked) {
    try {
      let res = await sendSmsApi(state.phoneLogin.mobile);
      if (res) {
        changeWaitingTime();
        uni.showToast({
          title: "发送成功",
          icon: "none",
          position: "top",
        });
      }
    } catch (error) {
      uni.showToast({
        title: "发送失败",
        icon: "none",
        position: "top",
      });
    }
  } else {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
      position: "top",
    });
  }
}
function checkMobile() {
  var re = /^1\d{10}$/;
  if (re.test(state.phoneLogin.mobile)) {
    return true;
  } else {
    return false;
  }
}
async function phoneSubmit() {
  if (!checkMobile()) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none",
      position: "top",
    });
    return;
  }
  if (state.phoneLogin.code.length < 6) {
    uni.showToast({
      icon: "none",
      title: "验证码不正确",
    });
    return;
  }
  try {
		if(TENANT_ENABLED){
			state.phoneLogin.tenantCode=state.tenantCode
		}
		state.phoneLogin.deviceType=1  //pc-0, app-1
    await userStore.phoneLogin(state.phoneLogin);
  } catch (error) {}
}
async function accountSubmit() {
  if (state.accountLogin.userName == "") {
    uni.showToast({
      icon: "none",
      title: "账号不正确",
    });
    return;
  }
  if (state.accountLogin.password.length == "") {
    uni.showToast({
      icon: "none",
      title: "密码不正确",
    });
    return;
  }
  try {
		if(TENANT_ENABLED){
			state.accountLogin.tenantCode=state.tenantCode
		}
		state.accountLogin.deviceType=1  //pc-0, app-1
    await userStore.login(state.accountLogin);
  } catch (error) {}
}
</script>

<style lang="scss">
page {
  background-color: #fff;
}
.login-bg {
  width: 100%;
  height: 730rpx;
  image,
  img,
  uni-img {
    width: 100%;
    height: 100%;
  }
}
.content-box {
  padding: 86rpx 78rpx;
}
.form-box {
  .form-box {
    .hr {
      width: 100%;
      border: 2rpx solid #f3f4f8;
      margin-bottom: 76rpx;
    }
    .form-item {
      position: relative;
      padding-bottom: 20rpx;
      height: 68rpx;
      display: flex;
      align-items: center;
      .icon {
        font-size: 35rpx;
        color: #253954;
        margin-right: 28rpx;
      }
      .input-text {
        font-size: 35rpx;
        font-weight: 500;
        color: #bdc3d6;
        line-height: 41rpx;
      }
      .uni-input-placeholder {
        color: #bdc3d6;
      }
      .item-icon {
        position: absolute;
        top: 20rpx;
        right: 0;
        font-size: 48rpx;
        color: #bdc3d6;
      }
      .item-btn {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        width: 184rpx;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(94, 149, 255, 0.5);
        border-radius: 29rpx 29rpx 29rpx 29rpx;
        text {
          color: #fff;
          font-size: 28rpx;
        }
      }
    }
  }
}
.login-btn {
  height: 96rpx;
  background: #5e95ff;
  border-radius: 58rpx 58rpx 58rpx 58rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 78rpx;
  text {
    font-size: 35rpx;
    font-weight: 500;
    color: #ffffff;
    line-height: 41rpx;
  }
}
.change-btn {
  height: 96rpx;
  background: #f3f4f8;
  border-radius: 58rpx 58rpx 58rpx 58rpx;
  margin-top: 38rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  text {
    font-size: 35rpx;
    font-weight: 500;
    color: #253954;
    line-height: 41rpx;
  }
}
.footer {
  margin-top: 100rpx;
  text-align: center;
  font-size: 23rpx;
  font-weight: 500;
  color: #bdc3d6;
  line-height: 27rpx;
}
.wrap {
	height: 100%;
	background-image: url('../../assets/images/login/login-bg.jpg');
	background-size: cover;
}
.geg-logo{
	background-image: url('../../assets/images/login/geg_logo.png');
	width: 200rpx;
	height: 200rpx;
	background-size: cover;
	margin: 40rpx auto;
}
</style>
