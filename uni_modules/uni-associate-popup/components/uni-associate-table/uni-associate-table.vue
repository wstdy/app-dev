<template>
  <uni-popup ref="tableRef" type="share" :is-mask-click="false" safeArea backgroundColor="#fff" class="popup-box">
    <view class="model-box">
      <view class="model-head">
        <text @tap="cancel">取消</text>
        <text class="text-title">{{ isMultiple ? '多选弹层' : '联想弹层' }}</text>
      </view>
      <view class="model-content">
        <Search class="search-box" @search="search" />

        <uni-table ref="tableInfoRef" class="table-box" border stripe type="selection" emptyText="暂无更多数据"
          @selection-change="selectionChange">
          <!-- 表头行 -->
          <uni-tr :isMultiple="isMultiple">
            <uni-th v-for="(item,index) in tableTh" :key="index" align="center">{{item.title}}</uni-th>
          </uni-tr>
          <!-- 表格数据行 -->
          <uni-tr :isMultiple="isMultiple" v-for="(item,index) in showDataSource" :key="index">
            <uni-td align="center" v-for="(title,idx) in tableTh">
              {{item[title.name]}}
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="page-box">
          <uni-pagination :total="total" :show-icon="true" @change="pageChange" />
        </view>
        <view class="form-btn-box">
          <button class="button" type="default" @click="cancel">取消</button>
          <button class="button" style="color:#fff" @click="submit">确定</button>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
  import {
    ref,
    nextTick,
    inject
  } from 'vue';
  import Search from '@/components/layout/Search.vue';
  import {
    getDicDetailList
  } from '@/common/api/system/dictionary/index.js';
  import {
    changeApiOptions
  } from '@/common/api/magic-api/useApiRequest.js';

  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    map: {
      type: Object,
      default: {}
    },
    associateOptions: {
      type: Array,
      default: []
    },
    apiConfig: {
      type: Object,
      default: {}
    },
    itemId: {
      type: String,
      default: ''
    },
    isMultiple: {
      type: Boolean,
      default: false
    }, //多选弹层为true,联想弹层为false 
		index: {
		  type: Number 
		}
  })
  const emits = defineEmits(['submit', 'getInputValue']);
  const formModel = inject('formModel');
  const isCustomForm = inject('isCustomForm', false);
  
  const total = ref(0)
  const tableRef = ref();
  const tableInfoRef = ref();
  const selectedList = ref([])
  const dataSource = ref([])
  const showDataSource = ref([])
  const searchDataSource = ref([])
  const tableTh = ref([])
  const searchTxt = ref('')

  function open() {
    tableRef.value.open();
    tableTh.value = props.associateOptions.filter(item => item.show).map(item => {
      return {
        name: item.name,
        title: item.tableTitle
      }
    })
    getData()
  }

  async function getData() {
    if (props.itemId) {
      let res = await getDicDetailList({
        itemId: props.itemId
      })
      if (res.success) {
        dataSource.value = Array.isArray(res.data) ? res.data : []
      }
    } else if (props.apiConfig?.path) {
      let res = await changeApiOptions(props.apiConfig, formModel.value, isCustomForm, props.index);
      if (res.data) {
        dataSource.value = Array.isArray(res.data) ? res.data : []
      }
    }
    if (props.modelValue) {
      let selectedIndex = []
      selectedList.value = dataSource.value.filter((data, index) => {
        return props.modelValue.split(',').some(val => {
          if (data[props.map.value] === val) {
            selectedIndex.push(index)
            return true
          }
        })
      })
      if (tableInfoRef.value) {
        nextTick(() => {
          tableInfoRef.value.toggleRowSelection(selectedIndex, true)
        })
      } else { //编辑回显
        const inputValue = selectedList.value?.map(x => x[props.map.text]).toString() || props.modelValue
        emits('getInputValue', inputValue)
      }
    }
    total.value = dataSource.value.length
    showDataSource.value = dataSource.value.slice(0, 10)
  }

  function pageChange(e) {
    const startIndex = 10 * (e.current - 1)
    showDataSource.value = searchTxt.value ? searchDataSource.value.slice(startIndex, startIndex + 10) : dataSource
      .value.slice(startIndex, startIndex + 10)
  }


  function selectionChange(e) {
    const indexArr = e.detail.index
    if (!props.isMultiple) {
      if (indexArr.length > 1) {
        const unCheckedIndex = indexArr.slice(0, indexArr.length - 1)
        tableInfoRef.value.toggleRowSelection(unCheckedIndex, false)
        tableInfoRef.value.toggleRowSelection(indexArr[indexArr.length - 1], true)
      }
      selectedList.value = dataSource.value.filter((item, index) => indexArr[indexArr.length - 1] === index)
    } else {
      selectedList.value = dataSource.value.filter((item, index) => indexArr.includes(index))
    }
  }

  function search(text) {
    searchDataSource.value = dataSource.value.filter(item => {
      return tableTh.value.some(title => {
        return item[title.name]?.includes(text)
      })
    })
    total.value = searchDataSource.value.length
    showDataSource.value = searchDataSource.value.slice(0, 10)
  }

  function submit() {
    emits('submit', selectedList.value);
    cancel();
  }

  function cancel() {
    tableRef.value.close();
    showDataSource.value = dataSource.value.slice(0, 10)
  }
  defineExpose({
    open,
    getData
  })
</script>

<style lang="scss">
  .uni-popup {
    z-index: 999;
  }

  .text-title {
    position: absolute;
    left: 70px;
    right: 70px;
    font-size: 32rpx;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    text-align: center;
  }

  .model-box {
    width: 100vw;
    height: 100vh
  }

  .model-content {
    padding: 10rpx 20rpx;
    height: calc(100% - 100rpx);
    box-sizing: border-box;
  }

  .search-box {
    background: #f3f4f8;
    border-radius: 20px;
  }

  .table-box {
    margin: 10px 0;
    height: calc(100% - 155px)
  }

  .model-head {
    display: flex;
    align-items: center;
    height: 100rpx;
    background-color: #fff;
    font-size: 30rpx;
    padding: 0 40rpx;
  }

  .model-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20rpx;
    padding: 40rpx;
    font-size: 28rpx;
    line-height: 2;
  }

  .next-btn {
    color: #3f8efb;
    border: none;
    margin-right: 20px;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    text-align: center;
  }

  .page-box {
    padding: 0 20rpx;
    height: 35px;
    // margin-bottom: 60rpx;
  }
</style>