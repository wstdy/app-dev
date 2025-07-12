<template>
	<view class="uni-date">
		<view class="uni-date-editor">
			<slot>
				<view class="uni-date-editor--x" :class="{'uni-date-editor--x__disabled': disabled,
		'uni-date-x--border': border && isRange}">
					<view v-if="!isRange" class="uni-date-x uni-date-single x-time__x-input" @click="initTimePicker">
						<!-- <uni-icons type="calendar" color="#8d97a3" size="22"></uni-icons> -->
						<view class="uni-date__x-input" :class="{'t-color':!time}" >
							<text class="x-time-text">{{time||placeholder}}</text>
						</view>
					</view>
					<view v-else class="uni-date-x uni-date-range">
						<uni-icons type="calendar" color="#8d97a3" size="22"></uni-icons>
						<view class="uni-date__x-input t-c"  :class="{'t-color':!range.startTime}"
						@click="initTimePicker('start')"><text class="x-text">{{range.startTime||startTimePlaceholder}}</text></view>
						<slot>
							<view class="">-</view>
						</slot>
						<view class="uni-date__x-input t-c" :class="{'t-color':!range.endTime}"
							 @click="initTimePicker('end')" ><text class="x-text">{{range.endTime||endTimePlaceholder}}</text></view>
					</view>
					<view v-if="!isRange && !disabled" class="uni-date__icon-clear x-time-icon">
						<uni-icons type="right" color="#8d97a3" size="20"></uni-icons>
					</view>
					<view v-else-if="clearable && !disabled" class="uni-date__icon-clear" @click.stop="clear">
						<uni-icons type="clear" color="#8d97a3" size="20"></uni-icons>
					</view>
				</view>
			</slot>
		</view>
		<view v-if="visible" id="mask" class="uni-datetime-picker-mask" @click="tiggerTimePicker"></view>
		<view v-if="visible" class="uni-datetime-picker-popup fix-nvue-height" :style="fixNvueBug">
			<view class="uni-title">
				<text class="uni-datetime-picker-text">{{selectTimeText}}</text>
			</view>
			<view class="uni-datetime-picker__container-box">
				<picker-view class="uni-datetime-picker-view" :class="[hideSecond ? 'time-hide-second' : '']"
					:indicator-style="indicatorStyle" :value="hms" @change="bindTimeChange">
					<picker-view-column>
						<view class="uni-datetime-picker-item" v-for="(item,index) in hours" :key="index">
							<text class="uni-datetime-picker-item">{{lessThanTen(item)}}</text>
						</view>
					</picker-view-column>
					<picker-view-column>
						<view class="uni-datetime-picker-item" v-for="(item,index) in minutes" :key="index">
							<text class="uni-datetime-picker-item">{{lessThanTen(item)}}</text>
						</view>
					</picker-view-column>
					<picker-view-column v-if="!hideSecond">
						<view class="uni-datetime-picker-item" v-for="(item,index) in seconds" :key="index">
							<text class="uni-datetime-picker-item">{{lessThanTen(item)}}</text>
						</view>
					</picker-view-column>
				</picker-view>
				<!-- 兼容 nvue 不支持伪类 -->
				<text class="uni-datetime-picker-sign" :class="[hideSecond ? 'sign-center' : 'sign-left']">:</text>
				<text v-if="!hideSecond" class="uni-datetime-picker-sign sign-right">:</text>
			</view>
			<view class="uni-datetime-picker-btn">
				<view class="uni-datetime-picker-btn-group">
					<view @click="setTime">
						<text class="uni-datetime-picker-btn-text">{{okText}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		initVueI18n
	} from '@dcloudio/uni-i18n'
	import messages from '@/uni_modules/uni-datetime-picker/components/uni-datetime-picker/i18n/index.js'
	const {
		t
	} = initVueI18n(messages)

	/**
	 * UniTimeSelect 时间选择器
	 * @description 可以同时选择日期和时间的选择器
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=xxx
	 * @property {String} type = [datetime | date | time] 显示模式
	 * @property {Boolean} multiple = [true|false] 是否多选
	 * @property {String|Number} value 默认值
	 * @property {String|Number} start 起始日期或时间
	 * @property {String|Number} end 起始日期或时间
	 * @property {String} return-type = [timestamp | string]
	 * @event {Function} change  选中发生变化触发
	 */

	export default {
		name: 'UniTimeSelect',
		emits: [
			"update:modelValue", "update:sTime", "update:eTime", "input", 'change'
		],
		model: {
			prop: "modelValue",
			event: "update:modelValue"
		},
		components: {

		},
		inject: {
			form: {
				from: 'uniForm',
				default: null
			},
			formItem: {
				from: 'uniFormItem',
				default: null
			},
		},
		data() {
			return {
				indicatorStyle: `height: 50px;`,
				visible: false,
				fixNvueBug: {},
				// 输入框当前时间
				time: '',
				rangeItem: [{
					text: '开始时间',
					value: 'start'
				}, {
					text: '结束时间',
					value: 'end'
				}],
				selectedIndex: 'start',
				hour: 0,
				minute: 0,
				second: 0,
				// 起始时间

				startHour: 0,
				startMinute: 0,
				startSecond: 0,
				// 结束时间

				endHour: 23,
				endMinute: 59,
				endSecond: 59,
				start: '',
				end: '',
				range: {
					startTime: '',
					endTime: ''
				},
				selectTimeText: t("uni-datetime-picker.selectTime")
			}
		},
		props: {
			type: {
				type: String,
				default: 'time'
			},
			value: {
				type: [String, Number, Array, Date],
				default: ''
			},
			modelValue: {
				type: [String, Number, Array, Date],
				default: ''
			},
			sTime: {
				type: [String, Number, Array, Date],
				default: ''
			},
			eTime: {
				type: [String, Number, Array, Date],
				default: ''
			},
			returnType: {
				type: String,
				default: 'string'
			},
			disabled: {
				type: [Boolean, String],
				default: false
			},
			border: {
				type: [Boolean, String],
				default: true
			},
			hideSecond: {
				type: [Boolean, String],
				default: false
			},
			placeholder: {
				type: String,
				default: '请选择时间'
			},
			startTimePlaceholder: {
				type: String,
				default: '请选择开始时间'
			},
			endTimePlaceholder: {
				type: String,
				default: '请选择结束时间'
			},
			isRange: {
				type: [Boolean, String],
				default: false
			},
			clearable: {
				type: [Boolean, String],
				default: false
			},
		},
		watch: {
			// #ifndef VUE3
			value: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.initPicker(newVal)
					} else {
						this.time = '';
						this.range.startTime = '';
						this.range.endTime = '';
						this.parseValue(Date.now())
					}
				},
				immediate: true
			},
			// #endif
			// #ifdef VUE3
			modelValue: {
				handler(newVal, oldVal) {
					//console.log(newVal,'newValnewVal1111111newVal')
					if (newVal) {
						this.initPicker(newVal)
					} else {
						this.time = '';
						this.range.startTime = '';
						this.range.endTime = '';
					}
				},
				immediate: true
			},
			// #endif
			// 月、日、时、分、秒可选范围变化后，检查当前值是否在范围内，不在则当前值重置为可选范围第一项
			sTime(newVal) {
				//console.log(newVal,'newValnewValnewVal')
				this.range.startTime = newVal;
				this.start=newVal
			},
			eTime(newVal) {
				this.range.endTime = newVal;
				this.end=newVal
			},
			hours(newVal) {
				this.checkValue('hour', this.hour, newVal)
			},
			minutes(newVal) {
				this.checkValue('minute', this.minute, newVal)
			},
			seconds(newVal) {
				this.checkValue('second', this.second, newVal)
			}
		},
		computed: {
			hours() {
				return this.getCurrentRange('hour')
			},

			minutes() {
				return this.getCurrentRange('minute')
			},

			seconds() {
				return this.getCurrentRange('second')
			},

			// picker 当前值数组

			hms() {
				if (this.isRange) {
					let time = this.createDomSting()
					if (this.selectedIndex === 'start') {
						this.start = time;
					} else if (this.selectedIndex === 'end') {
						this.end = time;
					}
				}
				return [this.hour - this.minHour, this.minute - this.minMinute, this.second - this.minSecond]
			},

			minHour() {

				return this.startHour

			},
			maxHour() {

				return this.endHour

			},
			minMinute() {

				if (this.hour === this.startHour) {
					return this.startMinute
				} else {
					return 0
				}

			},
			maxMinute() {

				if (this.hour === this.endHour) {
					return this.endMinute
				} else {
					return 59
				}

			},
			minSecond() {

				if (this.hour === this.startHour && this.minute === this.startMinute) {
					return this.startSecond
				} else {
					return 0
				}

			},
			maxSecond() {

				if (this.hour === this.endHour && this.minute === this.endMinute) {
					return this.endSecond
				} else {
					return 59
				}

			},

			/**
			 * for i18n
			 */

			okText() {
				return t("uni-datetime-picker.ok")
			},
			cancelText() {
				return t("uni-datetime-picker.cancel")
			}
		},

		mounted() {
			// #ifdef APP-NVUE
			const res = uni.getSystemInfoSync();
			this.fixNvueBug = {
				top: res.windowHeight / 2,
				left: res.windowWidth / 2
			}
			// #endif
		//	console.log(this.sTime,this.eTime,this.modelValue,'sssssssssssss')
			if(this.sTime&&this.eTime){
				this.initPicker([this.sTime,this.eTime])
			}
		},

		methods: {
			/**
			 * @param {Object} item
			 * 小于 10 在前面加个 0
			 */

			lessThanTen(item) {
				return item < 10 ? '0' + item : item
			},

			/**
			 * 解析时分秒字符串，例如：00:00:00
			 * @param {String} timeString
			 */
			parseTimeType(timeString) {
				if (timeString) {
					let timeArr = timeString.split(':')
					this.hour = Number(timeArr[0])
					this.minute = Number(timeArr[1])
					this.second = Number(timeArr[2])
				}
			},

			/**
			 * 解析选择器初始值，类型可以是字符串、时间戳，例如：2000-10-02、'08:30:00'、 1610695109000
			 * @param {String | Number} datetime
			 */
			initPickerValue(datetime) {
				let defaultValue = null
				if (datetime) {
					defaultValue = this.compareValueWithStartAndEnd(datetime, this.start, this.end)
				} else {
					defaultValue = Date.now()
					defaultValue = this.compareValueWithStartAndEnd(defaultValue, this.start, this.end)
				}
				this.parseValue(defaultValue)
			},

			/**
			 * 初始值规则：
			 * - 用户设置初始值 value
			 * 	- 设置了起始时间 start、终止时间 end，并 start < value < end，初始值为 value， 否则初始值为 start
			 * 	- 只设置了起始时间 start，并 start < value，初始值为 value，否则初始值为 start
			 * 	- 只设置了终止时间 end，并 value < end，初始值为 value，否则初始值为 end
			 * 	- 无起始终止时间，则初始值为 value
			 * - 无初始值 value，则初始值为当前本地时间 Date.now()
			 * @param {Object} value
			 * @param {Object} dateBase
			 */
			compareValueWithStartAndEnd(value, start, end) {
				let winner = null
				value = this.superTimeStamp(value)
				start = this.superTimeStamp(start)
				end = this.superTimeStamp(end)

				if (start && end) {
					if (value < start) {
						winner = new Date(start)
					} else if (value > end) {
						winner = new Date(end)
					} else {
						winner = new Date(value)
					}
				} else if (start && !end) {
					winner = start <= value ? new Date(value) : new Date(start)
				} else if (!start && end) {
					winner = value <= end ? new Date(value) : new Date(end)
				} else {
					winner = new Date(value)
				}
				return winner
			},

			/**
			 * 转换为可比较的时间戳，接受日期、时分秒、时间戳
			 * @param {Object} value
			 */
			superTimeStamp(value) {
				let dateBase = ''
				if (value && typeof value === 'string') {
					const now = new Date()
					const year = now.getFullYear()
					const month = now.getMonth() + 1
					const day = now.getDate()
					dateBase = year + '/' + month + '/' + day + ' '
				}
				if (Number(value) && typeof value !== NaN) {
					value = parseInt(value)
					dateBase = 0
				}
				return this.createTimeStamp(dateBase + value)
			},

			/**
			 * 解析默认值 value，字符串、时间戳
			 * @param {Object} defaultTime
			 */
			parseValue(value) {
				if (!value) {
					return
				}
				if (typeof value === "string") {
					this.parseTimeType(value)
				} else {
					let defaultDate = null
					defaultDate = new Date(value)

					this.hour = defaultDate.getHours()
					this.minute = defaultDate.getMinutes()
					this.second = defaultDate.getSeconds()

				}
				if (this.hideSecond) {
					this.second = 0
				}
			},


			clear() {
				this.$emit('change', '')
				this.$emit('input', '')
				this.$emit('update:modelValue', '')
				if (this.isRange) {
					this.$emit('update:sTime', '')
					this.$emit('update:eTime', '')
				}
			},
			// 获取 年、月、日、时、分、秒 当前可选范围
			getCurrentRange(value) {
				const range = []
				for (let i = this['min' + this.capitalize(value)]; i <= this['max' + this.capitalize(value)]; i++) {
					range.push(i)
				}
				return range
			},

			// 字符串首字母大写
			capitalize(str) {
				return str.charAt(0).toUpperCase() + str.slice(1)
			},

			// 检查当前值是否在范围内，不在则当前值重置为可选范围第一项
			checkValue(name, value, values) {
				if (values.indexOf(value) === -1) {
					this[name] = values[0]
				}
			},

			/**
			 * 生成时间戳
			 * @param {Object} time
			 */
			createTimeStamp(time) {
				if (!time) return
				if (typeof time === "number") {
					return time
				} else {
					time = time.replace(/-/g, '/')
					return Date.parse(time)
				}
			},

			/**
			 * 生成日期或时间的字符串
			 */
			createDomSting() {
				let hhmmss = this.lessThanTen(this.hour) +
					':' +
					this.lessThanTen(this.minute)

				if (!this.hideSecond) {
					hhmmss = hhmmss + ':' + this.lessThanTen(this.second)
				}

				return hhmmss

			},
			initPicker(newVal) {
				if (!newVal) return;
				if (!this.isRange) {
					this.time = newVal
				} else {
					this.start = this.range.startTime=newVal[0]
					this.end = this.range.endTime= newVal[1]
				}
			},
			/**
			 * 初始化返回值，并抛出 change 事件
			 */
			initTime(emit = true) {
				if (!emit) return
				if (this.isRange) {
					if (this.start) this.range.startTime = this.start;
					if (this.end) this.range.endTime = this.end;
					if (this.start && this.end) {

						let start = this.superTimeStamp(this.start)
						let end = this.superTimeStamp(this.end)
						if(end<start){
							let value=this.start;
							this.start=this.end;
							this.end=value;
						}
						let time = [this.start, this.end]
						this.$emit('change', time)
						this.$emit('input', time)
						this.$emit('update:modelValue', time)
						this.tiggerTimePicker()
					}else if(this.start && !this.end){
						this.initTimePicker('end')
					}else if(!this.start && this.end){
						this.initTimePicker('start')
					}
					this.$emit('update:sTime', this.start)
					this.$emit('update:eTime', this.end)

				} else {
					this.time = this.createDomSting()
					this.$emit('change', this.time)
					this.$emit('input', this.time)
					this.$emit('update:modelValue', this.time)
					this.visible=false
				}
			},

			bindTimeChange(e) {
				const val = e.detail.value
				this.hour = this.hours[val[0]]
				this.minute = this.minutes[val[1]]
				this.second = this.seconds[val[2]]
				if (this.isRange) {
					this.time = this.createDomSting()
					if (this.selectedIndex === 'start') {
						this.start = this.time;
					} else if (this.selectedIndex === 'end') {
						this.end = this.time;
					}
				}
			},

			/**
			 * 初始化弹出层
			 */
			initTimePicker(type) {
				if (this.disabled) return
				let value = type == 'start' ? this.range.startTime||this.start : type == 'end' ? this.range.endTime||this.end : (this.modelValue || this.value)
				this.initPickerValue(value)
				this.visible = true
				this.selectedIndex = type
				this.selectTimeText = type == 'start' ? '开始时间' : type == 'end' ? '结束时间' : '选择时间'
			},

			/**
			 * 触发或关闭弹框
			 */
			tiggerTimePicker() {
				this.visible = !this.visible
			},

			/**
			 * 用户点击“确定”按钮
			 */
			setTime() {
				 this.initTime()
			}
		}
	}
</script>

<style lang="scss">
	$uni-primary: #007aff !default;

	.uni-date {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		flex: 1;
	}

	.uni-date-x {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 0 6px 0 10px;
		border-radius: 4px;
		background-color: #fff;
		color: #666;
		font-size: 14px;
		flex: 1;
	}

	.uni-date-x--border {
		box-sizing: border-box;
		border-radius: 4px;
		// border: 1px solid #e5e5e5;
	}

	.uni-date-editor--x {
		display: flex;
		align-items: center;
		position: relative;
	}

	.uni-date-editor--x .uni-date__icon-clear {
		display: flex;
		align-items: center;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.uni-date__x-input {
		padding: 0 8px;
		/* #ifndef APP-NVUE */
		width: auto;
		/* #endif */
		position: relative;
		overflow: hidden;
		flex: 1;
		display: flex;
		align-items: center;
		font-size: 14px;
		height: 35px;
	}
	.x-text {
	    overflow: hidden;
	    white-space: nowrap;
	    position: absolute;
	    left: 10px;
	    right: 10px;
	}
	.x-time__x-input {
		padding: 0;
	}
	.x-time-text {
		overflow: hidden;
	    white-space: nowrap;
	    position: absolute;
	    left: 10px;
	    right: 0;
		text-align: right;
	}
	.t-c {
		justify-content: center;
	}

	.uni-date-editor--x__disabled {
		opacity: 0.4;
		cursor: default;
	}

	.uni-datetime-picker-view {
		height: 130px;
		width: 270px;
		/* #ifndef APP-NVUE */
		cursor: pointer;
		/* #endif */
	}

	.uni-datetime-picker-item {
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
	}

	.uni-datetime-picker-btn {
		margin-top: 60px;
		/* #ifndef APP-NVUE */
		display: flex;
		cursor: pointer;
		/* #endif */
		flex-direction: row;
		justify-content: flex-end;
	}

	.uni-datetime-picker-btn-text {
		font-size: 14px;
		color: $uni-primary;
	}

	.uni-datetime-picker-btn-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-datetime-picker-cancel {
		margin-right: 30px;
	}

	.uni-datetime-picker-mask {
		position: fixed;
		bottom: 0px;
		top: 0px;
		left: 0px;
		right: 0px;
		background-color: rgba(0, 0, 0, 0.4);
		transition-duration: 0.3s;
		z-index: 998;
	}

	.uni-datetime-picker-popup {
		border-radius: 8px;
		padding: 30px;
		width: 270px;
		/* #ifdef APP-NVUE */
		height: 500px;
		/* #endif */
		/* #ifdef APP-NVUE */
		width: 330px;
		/* #endif */
		background-color: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		transition-duration: 0.3s;
		z-index: 999;
	}

	.fix-nvue-height {
		/* #ifdef APP-NVUE */
		height: 330px;
		/* #endif */
	}

	.uni-datetime-picker-text {
		font-size: 14px;
		line-height: 50px
	}

	.uni-datetime-picker-sign {
		position: absolute;
		top: 53px;
		/* 减掉 10px 的元素高度，兼容nvue */
		color: #999;
		/* #ifdef APP-NVUE */
		font-size: 16px;
		/* #endif */
	}

	.sign-left {
		left: 86px;
	}

	.sign-right {
		right: 86px;
	}

	.sign-center {
		left: 135px;
	}

	.uni-datetime-picker__container-box {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40px;
	}

	.time-hide-second {
		width: 180px;
	}

	.selected-list {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-wrap: nowrap;
		/* #endif */
		flex-direction: row;
		padding: 0 5px;
		border-bottom: 1px solid #f8f8f8;
	}

	.selected-item {
		margin-left: 10px;
		margin-right: 10px;
		padding: 12px 0;
		text-align: center;
		/* #ifndef APP-NVUE */
		white-space: nowrap;
		/* #endif */
	}

	.selected-item-active {
		border-bottom: 2px solid $uni-primary;
	}
	.t-color{
		color: gray;
	}
</style>
