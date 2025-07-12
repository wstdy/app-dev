<template>
  <view>

    <InfoCard>
      <template #head>
        <view class="head-box">
          <Title title="本月业绩目标"></Title>
        </view>
      </template>
      <template #content>
        <PieItem :progress="40"></PieItem>
      </template>
    </InfoCard>

    <InfoCard>
      <template #head>
        <view class="head-box">
          <Title title="本月回款目标"></Title>
        </view>
      </template>
      <template #content>
        <BarItem></BarItem>
      </template>
    </InfoCard>

    <InfoCard>
      <template #head>
        <view class="head-box">
          <Title title="我的排名"></Title>
        </view>
      </template>
      <template #content>
        <PieItem :progress="80"></PieItem>
      </template>
    </InfoCard>

    <InfoCard>
      <template #head>
        <view class="head-box">
          <Title title="业绩排名"></Title>
        </view>
      </template>
      <template #content>
        <PieItem :progress="60"></PieItem>
      </template>
    </InfoCard>

    <InfoCard>
      <template #head>
        <view class="head-box">
          <Title title="本月回款目标"></Title>
        </view>
      </template>
      <template #content>
        <BarItem></BarItem>
      </template>
    </InfoCard>
		
  </view>
</template>

<script setup>
import InfoCard from "@/components/info/InfoCard.vue";
import Title from "@/components/info/Title.vue";
import BarItem from "./BarItem.vue";
import PieItem from "./PieItem.vue";
</script>

<style lang="scss">
.head-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
