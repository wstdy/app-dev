<template>
	<view class="count-to-wrapper">
		<text :style="textStyle">{{ displayValue }}</text>
	</view>
</template>
<script>
export default {
	props: {
		///文字样式
		textStyle: {
			type: [Object, String],
			default: ''
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
		// 动画计算公式
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
	},
	data() {
		return {
			localStartVal: this.startVal,
			displayValue: this.formatNumber(this.startVal),
			printVal: null,
			paused: false,
			localDuration: this.duration,
			startTime: null,
			timestamp: null,
			remaining: null,
			rAF: null,
			lastTime: 0
		};
	},
	emits: ['mountedCallback', 'callback'],
	computed: {
		countDown() {
			return this.startVal > this.endVal;
		}
	},
	watch: {
		startVal() {
			if (this.autoplay) {
				this.start();
			}
		},
		endVal() {
			if (this.autoplay) {
				this.start();
			}
		}
	},
	mounted() {
		if (this.autoplay) {
			this.start();
		}
		this.$emit('mountedCallback');
	},
	methods: {
		start() {
			this.localStartVal = this.startVal;
			this.startTime = null;
			this.localDuration = this.duration;
			this.paused = false;
			this.rAF = this.requestAniFra(this.count);
		},
		pauseResume() {
			if (this.paused) {
				this.resume();
				this.paused = false;
			} else {
				this.pause();
				this.paused = true;
			}
		},
		pause() {
			this.clearAniFra(this.rAF);
		},
		resume() {
			this.startTime = null;
			this.localDuration = +this.remaining;
			this.localStartVal = +this.printVal;
			this.requestAniFra(this.count);
		},
		reset() {
			this.startTime = null;
			this.clearAniFra(this.rAF);
			this.displayValue = this.formatNumber(this.startVal);
		},
		count(timestamp) {
			if (!this.startTime) this.startTime = timestamp;
			this.timestamp = timestamp;
			const progress = timestamp - this.startTime;
			this.remaining = this.localDuration - progress;

			if (this.useEasing) {
				if (this.countDown) {
					this.printVal =
						this.localStartVal -
						this.easingFn(
							progress,
							0,
							this.localStartVal - this.endVal,
							this.localDuration
						);
				} else {
					this.printVal = this.easingFn(
						progress,
						this.localStartVal,
						this.endVal - this.localStartVal,
						this.localDuration
					);
				}
			} else {
				if (this.countDown) {
					this.printVal =
						this.localStartVal -
						(this.localStartVal - this.endVal) *
							(progress / this.localDuration);
				} else {
					this.printVal =
						this.localStartVal +
						(this.endVal - this.localStartVal) *
							(progress / this.localDuration);
				}
			}
			if (this.countDown) {
				this.printVal =
					this.printVal < this.endVal ? this.endVal : this.printVal;
			} else {
				this.printVal =
					this.printVal > this.endVal ? this.endVal : this.printVal;
			}

			this.displayValue = this.formatNumber(this.printVal);
			if (progress < this.localDuration) {
				this.rAF = this.requestAniFra(this.count);
			} else {
				this.$emit('callback');
			}
		},
		isNumber(val) {
			return !isNaN(parseFloat(val));
		},
		formatNumber(num) {
			num = num.toFixed(this.decimals);
			num += '';
			const x = num.split('.');
			let x1 = x[0];
			const x2 = x.length > 1 ? this.decimal + x[1] : '';
			const rgx = /(\d+)(\d{3})/;
			if (this.separator && !this.isNumber(this.separator)) {
				while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + this.separator + '$2');
				}
			}
			return this.prefix + x1 + x2 + this.suffix;
		},
		clearAniFra(id) {
			clearTimeout(id);
		},
		requestAniFra(callback) {
			const currTime = new Date().getTime();
			// 为了使setTimteout的尽可能的接近每秒60帧的效果
			const timeToCall = Math.max(0, 16 - (currTime - this.lastTime));
			const id = setTimeout(() => {
				callback && callback(currTime + timeToCall);
			}, timeToCall);
			this.lastTime = currTime + timeToCall;
			return id;
		}
	},
	destroyed() {
		this.clearAniFra(this.rAF);
	}
};
</script>
<style></style>
