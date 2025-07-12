<template>
  <view>
    <InfoCard>
      <template #head>
      <Title title="新闻"></Title>
      </template>
      <template #content>
      <Item title="XJR快速开发平台融合了时下最实用web技术"></Item>
      <Item title="XJR快速开发平台融合了时下最实用web技术"></Item>
      </template>
    </InfoCard>

    <InfoCard>
      <template #head>
        <Title  title="通知公告"></Title>
      </template>
      <template #content>
        <Item title="春节放假通知"></Item>
        <Item title="国庆节放假通知"></Item>
      </template>
    </InfoCard>
  </view>
</template>

<script setup>
import InfoCard from "@/components/info/InfoCard.vue";
import Title from "@/components/info/Title.vue";
import Item from "./Item.vue";
</script>
