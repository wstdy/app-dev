<template>
  <PageLayout title="功能列表">
    <MenuCardBox title="流程应用"  desc="长按可以操作应用">
      <menuList class="menu-box" :list="workflowList"></menuList>
    </MenuCardBox>
    <MenuCardBox v-for="item in FuncList" :title="item.name" :key="item.id" desc="长按可以操作应用">
      <menuList class="menu-box" :list="item.child"></menuList>
    </MenuCardBox>
  </PageLayout>
</template>

<script setup>
import PageLayout from "@/components/layout/Page.vue";
import menuList from "@/components/menu/List.vue";
 
import MenuCardBox from "./components/MenuCardBox.vue";
import {getAppMenu} from "@/common/api/system/dictionary/index.js"
import { onMounted,ref } from "vue";
const workflowList = [
  {
    title: "发起流程",
    iconType: "icon-liucheng",
    url: "/pages/workflow/launchList",
  },
  {
    title: "我的待办",
    iconType: "icon-daiban",
    url: "/pages/workflow/index?type=todo",
  },
  {
    title: "我的传阅",
    iconType: "icon-yuedu",
    url: "/pages/workflow/index?type=circulated",
  },
  {
    title: "我的任务",
    iconType: "icon-renwuguanli",
    url: "/pages/workflow/index?type=my",
  },
  {
    title: "我的已办",
    iconType: "icon-yiban10",
    url: "/pages/workflow/index?type=finished",
  },
];

const FuncList=ref([]);
onMounted(()=>{
	FuncList.value=[]
	getAppMenu().then((res)=>{
		if(!res.code){
			FuncList.value=res.data||[]
			FuncList.value.forEach(async k=>{
				k.child=[] 
				if(k.children?.length>0){
					k.children.forEach(o=>{
						k.child.push({
							title: o.name,
							type: "blue",
							iconType: o.icon,
							url: o.url,
							id:o.id
						})
					}) 
				} 
			})
		}
	}) 
})
</script>

<style lang="scss">
.menu-box {
  width: 100%;
}
</style>
