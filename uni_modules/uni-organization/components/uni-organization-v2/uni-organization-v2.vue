<template>
  <view class="uni-organization">
    <uni-easyinput ref="easyInput" :disabled="disabled" v-model="departNames" style="text-align: right;" :placeholder="placeholder"  :inputBorder="false" @focus="focusInput" :clearable="false"/>
    <custom-dialog
      ref="departTreeRef" 
      :title="title"
      :hasFooterIcon="true"
      :hasCloseIcon="false"
	  dialogHeight="1000rpx"
	  maxHeight="900rpx"
	  @close="closeTree">
		<template #headerButton>
			<view @click="showSelected" class="header-button" :class="selectedNodes.length == 0 ? 'disabled' : ''">已选组织（{{ selectedNodes.length }}）</view>
		</template>
        <view class="dialog-content">
			<view class="breadcrumb">
				<view class="breadcrumb-item" v-for="(item, index) in breadcrumbList" :key="index" @click="handleBreadcrumb(item)">
					{{ item.name }}
					</view>
			</view>
			<uni-organization-tree :showList="showList" :selectedNodes="selectedNodes" @handleCheck="handleCheck" @showChildren="showChildren"></uni-organization-tree>
			<view class="blank"></view>
		</view>
        <template #footer>
          <view class="next-btn">
            <view class="btn left submit" @tap="confirmDepartData"><text>确定</text></view>
            <view class="btn right"  @tap="handleCancel"><text>取消</text></view>
          </view>
        </template>
      </custom-dialog>
	  <custom-dialog
      ref="selectedDepartTreeRef"
      title="已选组织"
      :hasFooterIcon="true"
      :hasCloseIcon="false"
	  dialogHeight="900rpx"
	  maxHeight="800rpx"
	  @close="closeSelect">
	  	<view class="dialog-content">
			<view class="org-tree-list">
				<view class="list-item" v-for="(item, index) in showSelectedList" :key="index">
					<view class="item-left">
						<view class="iconfont icon-gf-folderOpen"></view>
						<view class="name">{{ item.name }}</view>
					</view>
					<view class="button" @click="delSelected(item, index)">删除</view>
				</view>
			</view>
			<view class="blank"></view>
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
	import { ref, watch, computed, nextTick } from 'vue';
	import { getOrganizationTrees } from "@/common/api/organization/index";
	const props = defineProps({
		// prefix: String,
		// suffix: String,
		placeholder: {
			type: String,
			default: '请选择组织架构'
		},
		title: {
			type: String,
			default: '组织架构'
		},
		readonly: Boolean,
		disabled: Boolean,
		parentNode: String,
		size: String,
		modelValue: {
			type: String || Array,
		},
		isArray: {
			type: Boolean,
			default: false
		},
		bordered: {
			type: Boolean,
			default: true
		},
		multiple: {
			type: Boolean,
			default: true
		},
		componentProps: {
			type: Object,
			default: {}
		},
		sepTextField: '', // 将文字描述存在独立字段，增加首次渲染速度
		row: Object,
		onlyUserCompany: { // 仅在登录用户公司范围内筛选
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
		}
	});
	const emit = defineEmits(['update:modelValue','change']);
	const departNames = ref('');
	const departTreeRef = ref(null);
	const selectedDepartTreeRef = ref(null);
	const selectedNodes = ref([]);
	const treeData = ref([]);
	const treeMap = ref({});
	const showDepartId = ref('');
	const breadcrumbList = ref([]);
	const showSelectedList = ref([]);
	const defaultDepts = ref('');// 仅在登录用户公司范围内筛选
	const showList = computed(() => {
		return showDepartId.value ? treeMap.value[showDepartId.value].children : treeData.value;
	});
	watch(
	() => props.modelValue,
	(val) => {
		let ids = props.isArray ? val?.join(',') : val
		if (ids) {
			if (props.sepTextField && !valChanged.value) {
				departNames.value = props.row[camelCaseString(props.sepTextField)];
			} else {
				getDefaultList(ids);
			}
		} else {
			departNames.value = ''
			selectedNodes.value = []
		}
	},
	{
		immediate: true
	});

	function showCheck(item) {
		return selectedNodes.value.some((node) => node.id === item.id);
	}

	function getBreadName(item, index, out = false) {
		let list = breadcrumbList.value;
		if(list.length >= 3) {
			if(index == 0) {
				return '… >'
			}
			if(list.length >= 5) {
				if(index <= 2) {
					return '… >'
				}
			}
		}
		if (index === list.length - 1) {
			return item.name;
		} else {
			return item.name + '>';
		}
	}

	async function getDefaultList(ids) {
		let params = {
			ids: ids,
            code: '',
            name: '',
            parentNode: false
		}
		const res = await getOrganizationTrees(params);
		let list = res.data;
        selectedNodes.value = list;
        let nameList = selectedNodes.value.map((item) => item.name);
        const names = nameList.join(',');
        departNames.value = names;
        updateSepTextField(names);
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

	function updateSepTextField(v) {
        if (!props.sepTextField || !props.row) {
            return;
        }
        props.row[camelCaseString(props.sepTextField)] = v;
    }

	function handleCheck(item) {
		let findIndex = selectedNodes.value.findIndex((node) => node.id === item.id)
		if(props.multiple) {
			if(findIndex > -1) {
				selectedNodes.value.splice(findIndex, 1)
			} else {
				selectedNodes.value.push(item);
			}
		} else {
			selectedNodes.value = [item]
		}
		
	}

	async function showChildren(item) {
		await loadListData(item);
		if(item.children.length > 0) {
			showDepartId.value = item.id;
			breadcrumbList.value.push(item);
			// 添加滚动控制
			nextTick(() => {
				const scrollContainer = document.querySelector('.breadcrumb');
				if (scrollContainer) {
					scrollContainer.scrollLeft = scrollContainer.scrollWidth;
				}
			});
		} else {
			handleCheck(item)
		}
	}

	function handleBreadcrumb(item) {
		let index = breadcrumbList.value.findIndex((node) => node.id === item.id)
		breadcrumbList.value.splice(index)
		showDepartId.value = breadcrumbList.value.length > 0? breadcrumbList.value[breadcrumbList.value.length - 1]?.id || '' : '';
	}

	function showSelected() {
		if(!selectedNodes.value.length) {
			return;
		}
		showSelectedList.value = [...selectedNodes.value]
		selectedDepartTreeRef.value.open();
	}

	function handleChange (value) {
		const arr = value.split(',')
		const id = arr[arr.length - 1]
		emit('update:modelValue', id)
		emit('change', id)
	}
	function focusInput() {
        if(props.defaultDeptField) {
            defaultDepts.value = props.row[props.defaultDeptField]
        }
		loadListData()
		departTreeRef.value.open();
	}
	function confirmDepartData() {
		let ids = selectedNodes.value.map((item) => item.id);
		let names = selectedNodes.value.map((item) => item.name);
		const namesStr = names.join(',');
		const idsStr = ids.join(',');
        updateSepTextField(namesStr);
		emit('update:modelValue', idsStr)
		emit('change', idsStr)
		closeTree()
		departTreeRef.value.close();
	}
	function handleCancel() {
		closeTree()
		departTreeRef.value.close();
	}

	function delSelected(item, index) {
		// let index = showSelectedList.value.findIndex((node) => node.id === item.id)
		showSelectedList.value.splice(index, 1);
	}
	
	function confirmSelectedData() {
		selectedNodes.value = [...showSelectedList.value];
		handleCancelSelected();
	}
	
	function handleCancelSelected() {
		selectedDepartTreeRef.value.close();
		showSelectedList.value = [];
	}

	function closeTree() {
		treeData.value = [];
		treeMap.value = {};
		breadcrumbList.value = [];
		showDepartId.value = '';
	}
</script>

<style scoped lang="scss">

.blank {
    height: 80rpx;
}
.uni-organization {
	.breadcrumb {
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
		-webkit-overflow-scrolling: touch; /* 优化移动端滚动 */
		padding: 10rpx 0;
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
  .disabled {
    color: #999999!important;
  }
  .header-button {
	color: #5e95ff;
	font-weight: 600;
  }
  .dialog-content {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	
	:deep(.org-tree-list) {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;
		.list-item {
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
		}
	}
  }
}
.next-btn {
	// position: absolute;
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

:deep(.dialog-box) {
	display: flex;
	flex-direction: column;
	.content-box {
		flex: 1;
	}
}
</style>
