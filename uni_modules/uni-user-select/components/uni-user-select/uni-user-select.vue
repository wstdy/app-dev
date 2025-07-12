<template>
    <view class="uni-user-select">
        <uni-easyinput v-model="userNames" :disabled="disabled" :placeholder="placeholder" :prefixIcon="prefixIcon" :suffixIcon="sfxIcon" @clear="handleClear" @focus="open" :clearable="clearable" />
        <custom-dialog
        ref="selectMemberRef"
        title="人员选择"
        :hasFooterIcon="true"
        :hasCloseIcon="false"
        dialogHeight="1200rpx"
        maxHeight="1100rpx">
        
            <template #headerButton>
                <view @click="showSelected" class="header-button" :class="selectedList.length == 0 ? 'disabled' : ''">已选人员（{{ showSelectedList.length }}）</view>
            </template>
            
            <view class="dialog-content">
                <view class="search-input">
                    <uni-easyinput class="input" :clearable="false" v-model="searchAllMemberParams.keyword" @focus="focusSearch" @keydown.enter="focusSearch"/>
                    <view class="right-buttons">
                        <view class="iconfont icon-sousuo" @click="searchMember"></view>
                        <view class="history-cancel" v-if="searchAllMemberParams.keyword || showHistory" @click="cancelHistory">取消</view>
                    </view>
                </view>
                <view class="search-history-box" v-if="showHistory">
                    <view class="his-title">搜索历史</view>
                    <view class="search-history-list">
                        <view class="history-item" v-for="name in historyList" :key="name" @click="handleSearchHistory(name)">
                            {{ name }}
                        </view>
                    </view>
                </view>
                <template v-else>
                    <view class="breadcrumb breadcrumb-out">
                        <view class="breadcrumb-item" v-for="(item, index) in breadcrumbList" :key="index" @click="handleBreadcrumb(item)">
                            {{ item.name }}
                            </view>
                    </view>
                    <view class="list-content">
                        <uni-organization-tree :showList="showDepartList" :isSelect="false" @showChildren="showDepartChildren"></uni-organization-tree>
                        <view class="user-tree-list">
                            <view class="list-item" v-for="(item, index) in memberList" :key="index" @click="handleCheck(item)">
                                <view class="item-left">
                                    <view class="iconfont icon-a-1Frenyuanyonghu"></view>
                                    <view class="name">{{ item.name }}</view>
                                </view>
                                <view class="checked" :class="{'check-disabled': disabledIdList.includes(item.id)}" v-if="showCheck(item)">
                                    <view class="icon"></view>
                                </view>
                                <view class="kong" v-else></view>
                            </view>
                        </view>
                    </view>
                    <view class="blank"></view>
                </template>
            </view>
            
            <template #footer>
                <view class="next-btn">
                    <view class="btn left submit" @tap="confirmData"><text>确定</text></view>
                    <view class="btn right"  @tap="handleCancel"><text>取消</text></view>
                </view>
            </template>

        </custom-dialog>
        <custom-dialog
        ref="selectedMemberListRef"
        title="已选人员"
        :hasFooterIcon="true"
        :hasCloseIcon="false">
            <view class="dialog-content">
                <view class="user-tree-list-inner">
                    <view class="list-item" v-for="(item, index) in showSelectedList" :key="index">
                        <view class="item-left">
                            <view class="iconfont icon-a-1Frenyuanyonghu"></view>
                            <view class="name">{{ item.name }}</view>
                        </view>
                        <view class="button" :class="{'button-disabled': disabledIdList.includes(item.id)}" @click="delSelected(item, index)">删除</view>
                    </view>
                </view>
            </view>
            <template #footer>
                <view class="next-btn">
                    <view class="btn left submit" @tap="confirmSelectedData"><text>确定</text></view>
                    <view class="btn right"  @tap="handleCancelSelected"><text>取消</text></view>
                </view>
            </template>
        </custom-dialog>
    </view>
</template>

<script setup>
    import {
        ref,
        watch,
        computed,
        nextTick
    } from 'vue';
    import { useUserStore } from "@/common/store/user";
    import { getUserPage, getUserMulti } from "@/common/api/organization/index";
	import { getOrganizationTrees } from "@/common/api/organization/index";
    import { cloneDeep } from '@/utils/helper/utils.js';
    const props = defineProps({
        modelValue: {
            type: [String, Array],
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        prefixIcon: String,
        suffixIcon: String,
        placeholder: String,
        readonly: Boolean,
        disabled: Boolean,
        size: String,
        multiple: {
            type: Boolean,
            default: false
        },
        row: Object, // 行数据，在表格里用的到
        sepTextField: String, // 将文本表示存储在独立字段
        onlyUserCompany: { // 仅在登录用户公司范围内筛选
            type: Boolean,
            default: false
        },
        buttonShow: {
            type: Boolean,
            default: false
        },
        defaultDeptField: { // 默认选择公司范围key值
            type: String,
            default: ''
        },
        justCompany: {
            type: Boolean,
            default: false
        },
        selectedDisabled: { // 选中的用户不可编辑
            type: Boolean,
            default: false
        },
        clearable: { // 是否可清空
            type: Boolean,
            default: true
        }
    })
    const emits = defineEmits(['update:value', 'change', 'selectedId', 'update:modelValue']);
    let resetMemberList = []; // 重置选中的人员列表
    const selectMemberRef = ref(null);
    const selectedMemberListRef = ref(null);
    const defaultDepts = ref('')
    if(props.onlyUserCompany) {
        const userStore = useUserStore();
        const userInfo = userStore.getUserInfo;
        defaultDepts.value = userInfo.departmentId
    }
    const userNames = ref(''); // 人员名称
    const valChanged = ref(false);
    const searchAllMemberParams = ref({
        limit: 1,
        size: 999,
        isOnlyCurrentDepartment: true,
        keyword: '',
        departmentId: '',
        departmentIds: defaultDepts.value
    });
    const pagenation = ref({
        total: 0, // 总条数
        size: 999, // 每页条数
        limit: 1, // 当前页码
    });

    const memberList = ref([])
    const selectedList = ref([]) // 选中的人员列表
    const showSelectedList = ref([]) // 显示的已选人员列表
    const disabledIdList = ref([]); // 不可编辑的人员id列表
    const showDepartId = ref(''); // 显示的部门id
    const treeMap = ref({}); // 部门树结构
    const treeData = ref([]); // 部门树结构
    const breadcrumbList = ref([]); // 面包屑
    const showHistory = ref(false);
    const historyList = ref([]); // 搜索历史
	const showDepartList = computed(() => {
		return searchAllMemberParams.value.keyword ? [] : (showDepartId.value ? treeMap.value[showDepartId.value].children : treeData.value);
	});
    watch(
        props,
        async () => {
            if (props.modelValue && !valChanged.value && props.sepTextField) {
                const idArr = props.modelValue.split(',');
                let valStr = props.row[camelCaseString(props.sepTextField)];
                valStr = valStr ? valStr : idArr ? idArr.reduce((a, b) => a + ',' + b) : '';
                const valArr = valStr.split(',');
                userNames.value = valStr;
                const initValue = idArr.map((id, index) => {
                    return {
                        id,
                        name: valArr[index]
                    };
                });
                selectedList.value = initValue;
                resetMemberList = cloneDeep(initValue);
                return;
            }
            if (props.modelValue && !resetMemberList.length) {
                const res = await getUserMulti(props.modelValue);
                let list = res.data;
                if(props.selectedDisabled) {
                    disabledIdList.value = list.map((item) => {
                        return item.id;
                    })
                }
                selectedList.value = list;
                resetMemberList = cloneDeep(list);
                const nameList = resetMemberList.map((item) => {
                    return item.name;
                });
                userNames.value = nameList.join(',');
            }
            showSelectedList.value = [...selectedList.value]
            if(!props.modelValue) {
                userNames.value = ''
                selectedList.value = []
            }
        },
        {
            immediate: true
        }
    );

    function clearSearch() {
        searchAllMemberParams.value.keyword = '';
        getMemberList();
    }

    function cancelHistory() {
        showHistory.value = false;
        clearSearch();
    }

    function focusSearch() {
        showHistory.value = true;
        historyList.value = JSON.parse(localStorage.getItem('searchHistory')) || [];
    }
    
    async function showDepartChildren(item) {
    	await loadListData(item)
        showDepartId.value = item.id;
        breadcrumbList.value.push(item);
        searchAllMemberParams.value.departmentId = item.id;
        getMemberList()
        // 添加滚动控制
        nextTick(() => {
            const scrollContainer = document.querySelector('.breadcrumb');
            if (scrollContainer) {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth;
            }
        });
    }

    async function loadListData(node) {
		if (node && node.children.length || node?.hasChildren == 'N') {
			return;
		}
		let param = {
			id: node ? node.id : '',
			code: '',
			name: '',
			parentNode: false,
			excludeDeptTypes: props.justCompany ? '0' : '',
			ids: defaultDepts.value
		}
		let res = await getOrganizationTrees(param)
		let list = res.data;
		if(node) {
			node.children = list[0].children
			if(node.children.length > 0) {
				node.children.forEach(item => {
					treeMap.value[item.id] = item;
				});
			} else {
				node.hasChildren = 'N'
			}
			
		} else {
			treeData.value = list
			treeData.value.forEach(item => {
				treeMap.value[item.id] = item;
				item.children.forEach(child => {
					treeMap.value[child.id] = child;
				});
			});
		}
	}

    function showCheck(item) {
		return selectedList.value.some((node) => node.id === item.id);
	}

    function handleCheck(item) {
        if(disabledIdList.value.includes(item.id)) {
            return;
        }
		let findIndex = selectedList.value.findIndex((node) => node.id === item.id)
		if(props.multiple) {
			if(findIndex > -1) {
				selectedList.value.splice(findIndex, 1)
			} else {
				selectedList.value.push(item);
			}
		} else {
			selectedList.value = [item]
		}
		
		showSelectedList.value = [...selectedList.value]
	}

    function searchMember() {
        if (!searchAllMemberParams.value.keyword) {
            uni.showToast({
                title: `请输入搜索项`,
                icon: 'none'
            })
        	return
        }
        breadcrumbList.value = [];
        showDepartId.value = ''; // 显示的部门id
        searchAllMemberParams.value.departmentId = '';
        showHistory.value = false;
        setHistoryList();
        getMemberList();
    }

    function handleSearchHistory(item) {
        console.error(33333, item)
        searchAllMemberParams.value.keyword = item;
        searchMember();
    }

    function setHistoryList() {
        let index = historyList.value.findIndex(item => item == searchAllMemberParams.value.keyword)
        if(index !== -1) {
            historyList.value.splice(index, 1)
        }
        historyList.value.unshift(searchAllMemberParams.value.keyword);
        localStorage.setItem('searchHistory', JSON.stringify(historyList.value))
    }

    async function handleBreadcrumb(item) {
		let index = breadcrumbList.value.findIndex((node) => node.id === item.id)
		breadcrumbList.value.splice(index)
		showDepartId.value = breadcrumbList.value.length > 0? breadcrumbList.value[breadcrumbList.value.length - 1]?.id || '' : '';
        await getMemberList();
	}

    async function getMemberList() {
        if(!searchAllMemberParams.value.keyword && !showDepartId.value) {
            memberList.value = [];
        	return
        }
        let res = await getUserPage(searchAllMemberParams.value);
        let data = res.data;
        pagenation.value.total = data.total;
        memberList.value = setSelected(data.list);
        
        // 添加滚动控制
        nextTick(() => {
            const scrollContainer = document.querySelector('.list-content');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
        });
    }

    async function loadMore(e) {
        searchAllMemberParams.value.limit = e.current;
        await getMemberList();
    }

    function setSelected(list) {
        const idList = selectedList.value.map((item) => item.id);
        const ids = idList.join(',');
        list.forEach((item) => {
            if (ids?.includes(item.id)) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        });
        return list;
    }
    function delSelected(item, index) {
        if(disabledIdList.value.includes(item.id)) {
            return;
        }
		// let index = showSelectedList.value.findIndex((node) => node.id === item.id)
		showSelectedList.value.splice(index, 1);
	}

    async function open() {
        if(props.defaultDeptField) {
            defaultDepts.value = props.row[props.defaultDeptField]
            searchAllMemberParams.value.departmentIds = defaultDepts.value;
        }
        showSelectedList.value = [...selectedList.value]
        selectMemberRef.value.open();
        await loadListData()
        await getMemberList()
    }

    function showSelected() {
		if(!selectedList.value.length) {
			return;
		}
		showSelectedList.value = [...selectedList.value]
		selectedMemberListRef.value.open();
	}
    function confirmSelectedData() {
		selectedList.value = [...showSelectedList.value];
		selectedMemberListRef.value.close();
	}
	
	function handleCancelSelected() {
		showSelectedList.value = [...selectedList.value]
		selectedMemberListRef.value.close();
		// showSelectedList.value = [];
	}
    
    function confirmData () {
		selectedList.value = [...showSelectedList.value];
        showSelectedList.value = [];
    	let idsList = [];
        let namesList = [];
        selectedList.value.forEach((item) => {
            idsList.push(item.id);
            namesList.push(item.name);
        });
        const ids = idsList.join(',');
        const names = namesList.join(',');
        resetMemberList = cloneDeep(selectedList.value);
        userNames.value = names;
        updateSepTextField(names);
        emits('update:value', ids);
        emits('update:modelValue', ids);
        emits('selectedId', ids);
        emits('change', ids, selectedList.value, disabledIdList.value);
        valChanged.value = false;
        handleCancel()
    }
    function updateSepTextField(v) {
        if (!props.sepTextField || !props.row) {
            return;
        }
        props.row[camelCaseString(props.sepTextField)] = v;
    }
    
    function resetDialog () {
        showSelectedList.value = [];
        showHistory.value = false;
        showDepartId.value = ''; // 显示的部门id
        searchAllMemberParams.value.departmentId = '';
        breadcrumbList.value = [];
        selectedList.value = cloneDeep(resetMemberList);
    	
    }

    function handleCancel() {
        selectMemberRef.value.close();
        resetDialog();
    }

    function handleClear() {
        if (props.disabled) return;
        selectedList.value = [];
        showSelectedList.value = [];
        emits('update:value', '');
        emits('update:modelValue', '');
    }

</script>

<style lang="scss" scoped>
.blank {
    height: 80rpx;
}
.uni-user-select{
    background: #FFFFFF;
    .dialog-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .search-input {
            position: relative;
            .input {
                :deep(.uni-input-input) {
                    text-align: left;
                    padding: 0 48rpx 0 20rpx;
                }
                :deep(.uniui-clear) {
                    padding-right: 60rpx;
                }
            }
            .right-buttons {
                height: 100%; // 设置高度为父元素的高度，使其垂直居中对齐;
                position: absolute;
                right: 0;
                top: 0;
                display: flex;
                color: #5E95FF;
                align-items: center;
                .iconfont {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    font-size: 42rpx;
                    font-weight: 600;
                    width: 48rpx;
                    margin-right: 20rpx;
                }
                .history-cancel {
                    float: right;
                    margin-right: 20rpx;
                }
            }
            
        }
        .search-history-box {
            flex: 1;
            margin-top: 10rpx;
            display: flex;
            flex-direction: column;
            .his-title {
                color: #999;
            }
            .search-history-list {
                flex: 1;
                padding: 10rpx;
                background: #fff;
                .history-item {
                    cursor: pointer;
                    display: inline-block;
                    background: #f5f5f5;
                    color: #666;
                    padding: 6px 16px;
                    margin-right: 21px;
                    border-radius: 15px;
                    position: relative;
                    margin-bottom: 6px;
                    -webkit-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
            }
        }
        .breadcrumb {
            display: flex;
            overflow-x: auto;
            white-space: nowrap;
            -webkit-overflow-scrolling: touch; /* 优化移动端滚动 */
            padding: 20rpx 0;
            // height: 60rpx;
            align-items: center;
            
            /* 隐藏滚动条 */
            scrollbar-width: none; /* Firefox */
            &::-webkit-scrollbar {
                display: none; /* Chrome/Safari */
            }
        
            .breadcrumb-item {
                display: inline-block;
                color: #5E95FF;
                display: inline;
                flex-shrink: 0;
                padding: 0 8rpx;
                line-height: 40rpx;
                font-size: 28rpx;
                
                &:not(:last-child)::after {
                    content: '>';
                    margin-left: 20rpx;
                    color: #ccc;
                }
            }
        }
        .list-content {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
        }
        .user-tree-list {
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
                    .iconfont {
                        background: #5E95FF;
                        color: #fff;
                        font-size: 28rpx;
                        border-radius: 50%;
                        width: 42rpx;
                        height: 42rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        // width: 40rpx;
                    }
                    .name {
                        font-size: 32rpx;
                        font-weight: 500;
                        color: #253954;
                        line-height: 32rpx;
                        margin-left: 16rpx;
                    }
                }
               
                .button {
                    color: #5E95FF;
                }
                .button-disabled {
                    color: #999999;
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
                .check-disabled {
                    border: 2rpx solid #999;
                    .icon {
                        width: 15rpx;
                        height: 15rpx;
                        background: #999;
                        border-radius: 50%;
                    }
                }
            }
        }
        .user-tree-list-inner {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
            .list-item {
                
                background: #FFFFFF;
                border-radius: 10rpx 10rpx 10rpx 10rpx;
                margin-bottom: 19rpx;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 36rpx 23rpx;

                .item-left {
                    display: flex;
                    align-items: center;
                    .iconfont {
                        background: #5E95FF;
                        color: #fff;
                        font-size: 28rpx;
                        border-radius: 50%;
                        width: 42rpx;
                        height: 42rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        // width: 40rpx;
                    }
                    .name {
                        font-size: 32rpx;
                        font-weight: 500;
                        color: #253954;
                        line-height: 32rpx;
                        margin-left: 16rpx;
                    }
                }
                .button {
                    color: #5E95FF;
                }
                .button-disabled {
                    color: #999999;
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
                .check-disabled {
                    border: 2rpx solid #999;
                    .icon {
                        width: 15rpx;
                        height: 15rpx;
                        background: #999;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
}
:deep(.dialog-box) {
    display: flex;
    flex-direction: column;
    .content-box {
      flex: 1;
    }
  }
  .disabled {
    color: #999999!important;
  }
  .header-button {
	color: #5e95ff;
	font-weight: 600;
  }
.next-btn {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	height: 135rpx;
	background: #ffffff;
	padding: 0 48rpx;
	.btn {
		flex: 1;
		height: 72rpx;
		border: 1px solid #5e95ff;
		// border-radius: 12rpx;
		justify-content: center;
		align-items: center;
		display: flex;

		&.left {
			border-radius: 12rpx 0  0 12rpx;
			margin-left: 36rpx
		// 	margin-right: 16rpx;
		}

		&.right {
			border-radius: 0 12rpx 12rpx 0;
			margin-right: 36rpx
		// 	margin-left: 16rpx;
		}

		&.submit {
			background: #5e95ff;

			text {
				color: #fff;
			}
		}

		text {
			font-size: 31rpx;
			font-weight: 500;
			color: #5e95ff;
			line-height: 36rpx;
		}
	}
}
</style>