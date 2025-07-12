<template>
  <uni-grid class="uni-grid-wrap" :column="4" :show-border="false" :square="false">
    <uni-grid-item
      v-for="(item, index) in props.list"
      :key="index"
      class="uni-grid-item grid-item"
      :class="'grid-item' + (index % 8)"
      @tap="clickItem(item)"
    >
      <view class="grid-item-icon">
        <view class="iconfont bg-icon icon-Vectorbgcolor">
          <view v-if="isIconFont(item)" class="fund-box">
            <view class="iconfont fund-icon" :class="item.iconType"></view>
          </view>
          <view v-else class="iconfont fund-box">
            <view class="fund-icon">
              <uni-icons
                class="icon"
                :custom-prefix="isAntFont(item) ? 'antfont' : ''"
                :type="item.iconType ? item.iconType : 'list'"
                color="transparent"
                size="20"
              ></uni-icons>
            </view>
          </view>
        </view>
      </view>
      <text>{{ item.title }}</text>
    </uni-grid-item>
  </uni-grid>
</template>

<script setup>
import {getAppAuth} from '@/common/api/system/dictionary/index.js';
const props = defineProps({
  list: Array,
});
function isIconFont(item) {
  return item?.iconType?.includes("icon-") ? true : false;
}
function isAntFont(item) {
  return item?.iconType?.includes("ant-design:") ? true : false;
}
async function clickItem(item) {
  if (item.type == "scan") {
    scan();
  } else if (item.url) { 
		let auth=await getAppAuth(item.id);
		uni.setStorageSync('MenuAuth',auth.data)
    uni.navigateTo({ url: item.url});
  }
}
function scan() {
  // #ifdef H5
  uni.showModal({
    title: "提示",
    content: "抱歉H5界面暂不支持扫码功能",
    showCancel: false,
    confirmText: "确定",
  });
  // #endif
  // #ifdef MP-WEIXIN
  uni.scanCode({
    success: (res) => {
      let result = res.result;
      console.log('result: ', result);
    },
  });
  // #endif
  // #ifdef APP-PLUS
  uni.scanCode({
    success: (res) => {
      let result = res.result;
      console.log('result: ', result);
    },
  });
  // #endif
}
</script>

<style lang="scss">
.grid-item {
  margin-top: 28rpx;
}
.grid-item text {
  font-size: 30rpx;
  font-weight: 500;
  color: #253954;
  line-height: 35rpx;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.bg-icon {
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  position: relative;
  font-size: 100rpx; // 控制图标大小
}
.fund-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.fund-icon {
  font-size: 40rpx; // 控制图标大小
  display: inline-block;
  -webkit-background-clip: text;
  color: transparent;
}
.grid-item0 .grid-item-icon {
  .bg-icon {
    color: #d8e5fc;
  }
  .uni-icon,
  .uni-icon text {
    color: #4d8eff !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #4d8eff 0%, rgba(77, 142, 255, 0.5) 100%);
  }
}
.grid-item1 .grid-item-icon {
  .bg-icon {
    color: #ded7ff;
  }
  .uni-icon,
  .uni-icon text {
    color: #7a60ff !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #7a60ff 0%, rgba(122, 96, 255, 0.5) 100%);
  }
}
.grid-item2 .grid-item-icon {
  .bg-icon {
    color: #f3ddb0;
  }
  .uni-icon,
  .uni-icon text {
    color: #f8932d !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #f8932d 0%, rgba(248, 147, 45, 0.5) 100%);
  }
}
.grid-item3 .grid-item-icon {
  .bg-icon {
    color: #d2ede4;
  }
  .uni-icon,
  .uni-icon text {
    color: #22c891 !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #22c891 0%, rgba(34, 200, 145, 0.5) 100%);
  }
}
.grid-item4 .grid-item-icon {
  .bg-icon {
    color: #fad8d8;
  }
  .uni-icon,
  .uni-icon text {
    color: #f97474 !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #f97474 0%, rgba(249, 116, 116, 0.5) 100%);
  }
}
.grid-item5 .grid-item-icon {
  .bg-icon {
    color: #cdeaff;
  }
  .uni-icon,
  .uni-icon text {
    color: #3a9fff !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #3a9fff 0%, rgba(58, 159, 255, 0.5) 100%);
  }
}
.grid-item6 .grid-item-icon {
  .bg-icon {
    color: #bce7ea;
  }
  .uni-icon,
  .uni-icon text {
    color: #29bac2 !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #29bac2 0%, rgba(41, 186, 194, 0.5) 100%);
  }
}
.grid-item7 .grid-item-icon {
  .bg-icon {
    color: #f9ddd3;
  }
  .uni-icon,
  .uni-icon text {
    color: #fe8b61 !important;
  }
  .fund-icon {
    background-image: linear-gradient(180deg, #fe8b61 0%, rgba(254, 139, 97, 0.5) 100%);
  }
}
.grid-item uni-text {
  font-size: 27rpx;
  font-weight: 500;
  color: #253954;
  line-height: 35rpx;
}
</style>
