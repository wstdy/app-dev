# mrdotyan-count-to
## 数字滚动 count_number

## 别问问就是搬运过来的

[源码传送](https://github.com/PanJiaChen/vue-countTo.git)

## props
```js
	///文字样式
		textStyle:{
			type:[Object,String],
			default:''
		},
		///开始值
		startVal: {
			type: Number,
			required: false,
			default: 0
		},
		///结束值
		endVal: {
			type: Number,
			required: false,
			default: 2017
		},
		///++时间
		duration: {
			type: Number,
			required: false,
			default: 3000
		},
		///是否自动开始++
		autoplay: {
			type: Boolean,
			required: false,
			default: true
		},
		///保留几位小数
		decimals: {
			type: Number,
			required: false,
			default: 0,
			validator(value) {
				return value >= 0;
			}
		},
		///小数部分分隔符
		decimal: {
			type: String,
			required: false,
			default: '.'
		},
		// 整数部分分隔符
		separator: {
			type: String,
			required: false,
			default: ','
		},
		///数字前缀
		prefix: {
			type: String,
			required: false,
			default: ''
		},
		///数字后缀
		suffix: {
			type: String,
			required: false,
			default: ''
		},
		//使用动画计算公式
		useEasing: {
			type: Boolean,
			required: false,
			default: true
		},
		// 动画计算公式 这里会存在这个问题，在APP上面这个公式必须嵌套一层才不会报错，而在H5上面却不能嵌套，有懂的大佬没有，有的话解决一下让大家更好用
		easingFn: {
			type: Function,
			// #ifdef APP-PLUS
			default: () => {
				return (t, b, c, d) => {
					return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
				};
			},
			// #endif
			// #ifdef H5
			default: (t, b, c, d) => {
				return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
			}
			// #endif
		}
```

## emits

```js
	emits:['mountedCallback','callback'],
```


## demo 

```html
<template>
	<view>
		<mrdotyan-count-to 
			:endVal="state.count" 
			:decimals="2"
			:text-style="state.textStyle"
		></mrdotyan-count-to>
	</view>
</template>

<script setup>
import { onShow, onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';

const state = reactive({
	count: 10000.69,
	textStyle:{
		fontSize:'32rpx'
	}
});

onShow(() => {});
onLoad(() => {});
</script>

<style lang="scss" scoped></style>


```