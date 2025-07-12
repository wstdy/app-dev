<template>
  <uni-easyinput v-model="name" />
</template>

<script setup>
  import {
    onMounted,
    ref,
    watch
  } from 'vue';
  import {
    getUserInfoById,
    getOrganizationInfo
  } from '@/common/api/organization';
  import {
    useUserStore
  } from '@/common/store/user';
  import {
    timeToString
  } from '@/utils/helper/utils.js';
  const userStore = useUserStore();

  const props = defineProps({
    modelValue: String,
    infoType: Number,
    loadAgain: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:modelValue']);
  const name = ref();

  watch(
    () => props.modelValue,
    async () => {
      if (props.modelValue) {
        //当前用户
        if (props.infoType === 0) {
          //判断传入的值 是不是当前登录人 或需要二次加载  就不需要发请求获取用户信息了
          if (props.modelValue === userStore.getUserInfo.id || props.loadAgain) {
            name.value = userStore.getUserInfo.name;
            emit('update:modelValue', userStore.getUserInfo.id);
          } else {
            //如果不是当前登陆人  需要用户id  查询当前用户信息
            const userInfo = await getUserInfoById(props.modelValue);
            name.value = userInfo.data.name;

          }
        }

        //当前部门
        if (props.infoType === 1) {
          //判断传入的值 是不是当前登陆人的部门 或需要二次加载  就不需要发请求获取用户信息了
          if (props.modelValue === userStore.getUserInfo.departmentId || props.loadAgain) {
            name.value = userStore.getUserInfo.departmentName;
            emit('update:modelValue', userStore.getUserInfo.departmentId);
          } else {
            //如果不是当前登陆人  需要用户id  查询当前用户信息
            const dept = await getOrganizationInfo(props.modelValue);
            name.value = dept.data.name;
          }
        }

        //当前时间
        if (props.infoType === 2) {
          //如果是时间 需要二次加载展示当前时间  不需要则默认显示参数时间
          name.value = props.loadAgain ?
            timeToString(new Date(), '-') :
            props.modelValue;
          emit('update:modelValue', name.value);
        }
      } else {
        //当前用户
        if (props.infoType === 0) {
          //判断传入的值 是不是当前登录人  就不需要发请求获取用户信息了
          name.value = userStore.getUserInfo.name;
          emit('update:modelValue', userStore.getUserInfo.id);
        }

        //当前部门
        if (props.infoType === 1) {
          //判断传入的值 是不是当前登陆人的部门  就不需要发请求获取用户信息了
          name.value = userStore.getUserInfo.departmentName;
          emit('update:modelValue', userStore.getUserInfo.departmentId);
        }

        //当前时间
        if (props.infoType === 2) {
          //如果是时间 默认显示参数时间
          name.value = timeToString(new Date(), '-')
          emit('update:modelValue', name.value);
        }
      }
    }, {
      immediate: true
    });
</script>

<style>
</style>