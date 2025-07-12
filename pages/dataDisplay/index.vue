<template>
	<view class="data-display">
		<view style="margin: -10px -10px 10px;">
			<Banner :config="bannerConfig"></Banner>
		</view>
		<Dashboard :config="dashboardConfig"></Dashboard>
		<Modules :config="modulesConfig"></Modules>
		<TodoList :config="todoConfig"></TodoList>
		<MyTask :config="taskConfig"></MyTask>
		<LineChart :config="lineConfig"></LineChart>
		<PieChart :config="pieConfig"></PieChart>
		<RadarChart :config="radarConfig"></RadarChart>
		<GaugeChart :config="gaugeConfig"></GaugeChart>
		<FunnelChart :config="funnelConfig"></FunnelChart>
		<BarChart :config="barConfig"></BarChart>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import Banner from '@/components/dataDisplay/Banner.vue';
	import Dashboard from '@/components/dataDisplay/Dashboard.vue';
	import Modules from '@/components/dataDisplay/Modules.vue';
	import TodoList from '@/components/dataDisplay/TodoList.vue';
	import MyTask from '@/components/dataDisplay/MyTask.vue';
	import LineChart from '@/components/dataDisplay/LineChart.vue';
	import PieChart from '@/components/dataDisplay/PieChart.vue';
	import RadarChart from '@/components/dataDisplay/RadarChart.vue';
	import GaugeChart from '@/components/dataDisplay/GaugeChart.vue';
	import FunnelChart from '@/components/dataDisplay/FunnelChart.vue';
	import BarChart from '@/components/dataDisplay/BarChart.vue';

	const bannerConfig = ref({
		height: 300,
		imgs: [
			'https://staticcehsi.oss-cn-hangzhou.aliyuncs.com/static/uniapp_net/static/banner/banner1.png',
			'https://staticcehsi.oss-cn-hangzhou.aliyuncs.com/static/uniapp_net/static/banner/banner2.png',
			'https://staticcehsi.oss-cn-hangzhou.aliyuncs.com/static/uniapp_net/static/banner/banner3.png',
			'https://staticcehsi.oss-cn-hangzhou.aliyuncs.com/static/uniapp_net/static/banner/banner4.png'
		],
	})
	const dashboardConfig = ref({
		"apiConfig": {
			"name": "dashboard",
			"method": "GET",
			"path": "test/dashboard",
			"requestParamsConfigs": [{
				"name": "name",
				"dataType": "String",
				"assignmentType": "value",
				"value": "name",
				"config": ""
			}],
			"requestHeaderConfigs": [],
			"requestBodyConfigs": []
		},
		"numColor": "#666666",
		"labelColor": "#999999",
		"dashboard": [{
			"name": "aasas",
			"field": "isUp",
		}, {
			"name": "dfdfdf",
			"field": "value1"
		}]
	})
	const modulesConfig = ref({
		title: '常用功能',
		functions: [{
				name: '代码生成器',
				path: '',
				color: '#5e95ff',
				icon: 'ant-design:users',
			},
			{
				name: '测试111',
				path: '',
				color: '#5e95ff',
				icon: 'ant-design:cloud-fill'
			},
			{
				name: '微服务',
				path: '',
				color: '#5e95ff',
				icon: 'ant-design:microservices'
			},
			{
				name: '销售汇报',
				path: '',
				color: '#5e95ff',
				icon: 'ant-design:bar-chart-outlined'
			},
		],
	})
	const todoConfig = ref({
		title: '待办事项11',
		maxRows: 3,
	})
	const taskConfig = ref({
		title: '我的任务11',
	})
	const barConfig = ref({
		title: '柱状百分比',
		height: 400,
		"apiConfig": {
			"name": "chart-funnel",
			"method": "GET",
			"path": "test/chart-funnel",
			"requestParamsConfigs": [{
				"name": "keyword",
				"dataType": "String",
				"assignmentType": "value",
				"value": "",
				"config": ""
			}],
			"requestHeaderConfigs": [],
			"requestBodyConfigs": []
		},
		"labelKey": "name",
		"valueKey": "value1",
		"targetKey": "value2",
		"unit": "万元"
	})
	const funnelConfig = ref({
		apiConfig: {
			name: "chart-funnel",
			method: "GET",
			path: "test/chart-funnel",
			requestParamsConfigs: [{
				"name": "keyword",
				"dataType": "String",
				"assignmentType": "value",
				"value": "的人突然",
				"config": ""
			}],
			requestHeaderConfigs: [],
			requestBodyConfigs: []
		},
		options: {
			labelFormat: "{c}",
			dataLabel: true,
			color: ['#c91d1d'],
			padding: [60, 40, 60, 40],
			legend: {
				show: true,
				position: "left",
				float: "left",
				margin: 8,
				legendShape: "circle",
				fontColor: "#c91d1d",
			},
			extra: {
				funnel: {
					"activeOpacity": 0.3,
					"activeWidth": 10,
					"border": true,
					"borderWidth": 2,
					"borderColor": "#FFFFFF",
					"fillOpacity": 1,
					"labelAlign": "right",
					type: "triangle" //倒三角，pyramid金字塔
				}
			}
		},

		labelKey: "name",
		title: "漏斗图",
		valueKey: "value1"
	});

	const gaugeConfig = ref({
		apiConfig: {
			name: "chart-funnel",
			method: "GET",
			path: "test/chart-funnel",
			requestParamsConfigs: [{
				"name": "keyword",
				"dataType": "String",
				"assignmentType": "value",
				"value": "",
				"config": ""
			}],
			requestHeaderConfigs: [],
			requestBodyConfigs: []
		},
		labelKey: "name",
		title: "仪表盘",
		height: 300,
		valueKey: "value3",
	});
	const radarConfig = ref({
		apiConfig: {
			name: "chart-radar",
			method: "GET",
			path: "test/chart-radar",
			requestParamsConfigs: [{
				"name": "keyword",
				"dataType": "String",
				"assignmentType": "value",
				"value": "",
				"config": ""
			}],
			requestHeaderConfigs: [],
			requestBodyConfigs: []
		},
		labelKey: "name",
		title: "雷达图",
		height: 350,
		indicator: [{
			"value": "value1",
			"name": "指标1"
		}, {
			"value": "value2",
			"name": "指标2"
		}, {
			"value": "value3",
			"name": "指标3"
		}],
		pointShape: "circle",
		options: {
			dataLabel: true,
			legend: {
				"show": true,
				"position": "bottom",
				"float": "center",
				"margin": 8,
				"legendShape": "circle",
				"fontColor": "#000"
			},
			color: [],
			extra: {
				"radar": {
					radius: 100,
					"gridType": "circle",
					"gridColor": "#CCCCCC",
					border: true,
					"opacity": 0.2,
				},
			}
		}
	});
	const pieConfig = ref({
		apiConfig: {
			name: "chart-radar",
			method: "GET",
			path: "test/chart-radar",
			requestParamsConfigs: [{
				"name": "keyword",
				"dataType": "String",
				"assignmentType": "value",
				"value": "",
				"config": ""
			}],
			requestHeaderConfigs: [],
			requestBodyConfigs: []
		},
		labelKey: "name",
		valueKey: "value1",
		title: "饼图",
		height: 300,
		fontSize: 12,
		fontColor: "#000000",
		pieType: "rose", //rose玫瑰图，pie饼图，ring环形图
		options: {
			labelFormat: "{b}: {d}",
			dataLabel: true,
			legend: {
				"show": true,
				"position": "bottom",
				"float": "center",
				"margin": 8,
				"legendShape": "circle",
				"fontColor": "#000"
			},
			color: [],
			extra: {
				rose: {
					type: "radius",
					minRadius: 33,
					labelWidth: 10,
					border: false,
				}
			}
		}
	});
	const lineConfig = ref({
	            height: 260,
	            title: "折线/柱状图", 
	            condition: {"color":"#cb3a3a","selected":"#885959"},
	            count: {"show":true,"unit":"sd","title":"sdfdfdf"},
	            dataList:[{"title":"ssss","valueKey":"name","apiConfig":{"id":"copy1682508080882d89496","name":"chart-funnel","method":"GET","path":"test/chart-funnel","requestParamsConfigs":[{"name":"keyword","dataType":"String","assignmentType":"value","value":"","config":""}],"requestHeaderConfigs":[],"requestBodyConfigs":[]},"indicator":[{"type":"bar","color":"#3dd1a5","name":"x","value":"value1","showAreaStyle":false,"gradualStartColor":"","gradualEndColor":""},{"type":"line","color":"#682c2c","name":"xd","value":"value2","showAreaStyle":true,"gradualStartColor":"#b72424","gradualEndColor":"#2f933a"}],"options":{"extra":{"mix":{"column":{"seriesGap":120},"area":{"gradient":true,"opacity":6}}},"yAxis":{"data":[{"type":"value","position":"left","title":"","titleFontColor":"","titleFontSize":12,"format":"lineYAxis","axisFormat":"{value}","fontColor":"","axisLine":true,"axisLineColor":""}]},"xAxis":{"title":"","titleFontColor":"","titleFontSize":12,"fontColor":"","axisLine":true,"axisLineColor":"","format":"lineXAxis","axisFormat":"{value}"},"dataLabel":false,"legend":{"show":true,"position":"bottom","float":"center","margin":8,"legendShape":"circle","fontColor":"#000"}}}], 
	            line: {"smooth":false,"stack":false,"showAreaStyle":true,"gradualStartColor":"#dd4b4b","gradualEndColor":"#cda432","showSymbol":true},
	            fontSize:12,
	            fontColor:"#000000",    
	          });
</script>

<style>

</style>