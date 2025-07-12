<template>
<view class="org-tree-list">
    <view class="list-item" v-for="(item, index) in showList" :key="index" @click="showChildren(item)">
        <view class="item-left">
            <view class="iconfont icon-gf-folderOpen"></view>
            <view class="name">{{ item.name }}</view>
        </view>
        <template v-if="isSelect">
            <view class="checked" v-if="showCheck(item)" @click.stop="handleCheck(item)">
                <view class="icon"></view>
            </view>
            <view class="kong" v-else @click.stop="handleCheck(item)"></view>
        </template>
        <template v-else>
            <view class="button">
                <uni-icons type="right" color="#8d97a3" size="20"></uni-icons>
            </view>  
        </template>      
    </view>
</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
const props = defineProps({
    showList: {
        type: Array,
        default: () => []
    },
    selectedNodes: {
        type: Array,
        default: () => []
    },
    isSelect: {
        type: Boolean,
        default: true
    }
})
const emits = defineEmits(['showChildren', 'handleCheck'])
function showCheck(item) {
    return props.selectedNodes.some((node) => node.id === item.id);
}
function showChildren(item) {
    emits('showChildren', item)
}
function handleCheck(item) {
    emits('handleCheck', item)
}
</script>

<style lang="scss">
.org-tree-list {
    min-height: 0;
    // overflow-y: auto;
    .list-item {
        
        background: #FFFFFF;
        border-radius: 10rpx 10rpx 10rpx 10rpx;
        margin-bottom: 19rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 23rpx;

        .item-left {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
            
            .iconfont {
                color: #5E95FF;
                font-size: 42rpx;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .name {
                margin-left: 16rpx;
                font-size: 32rpx;
                font-weight: 500;
                color: #253954;
                line-height: 32rpx;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                flex: 1;
            }
        }
        .button {
            color: #5E95FF;
        }

        .kong {
            width: 27rpx;
            height: 27rpx;
            background: #FFFFFF;
            border-radius: 0rpx 0rpx 0rpx 0rpx;
            opacity: 1;
            border: 2rpx solid #E7EBF2;
            border-radius: 50%;
        }

        .checked {
            width: 27rpx;
            height: 27rpx;
            background: #FFFFFF;
            opacity: 1;
            border: 2rpx solid #5E95FF;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;

            .icon {
                width: 15rpx;
                height: 15rpx;
                background: #5E95FF;
                border-radius: 50%;
            }
        }
    }
}
</style>