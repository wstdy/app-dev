<template>
	<view class="container">
		<view class="page-body">
			<view class='wrapper'>
				<view class='toolbar' @tap="format">
					<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
					<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
					<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
					<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
					<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align"
					 data-value="left"></view>
					<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi" data-name="align"
					 data-value="center"></view>
					<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align"
					 data-value="right"></view>
					<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi" data-name="align"
					 data-value="justify"></view>
					<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height" data-name="lineHeight"
					 data-value="2"></view>
					<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing" data-name="letterSpacing"
					 data-value="2em"></view>
					<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop"
					 data-value="20px"></view>
					<!-- <view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
					 data-name="marginBottom" data-value="20px"></view> -->
					<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
					<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view>
					<!-- <view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize"
					 data-value="24px"></view> -->
					<picker @change="RadioChange" :range="fontSizeArray"
						style="display: inline-block;width: auto;">
						<view class="iconfont icon-fontsize"></view>
					</picker>
					<!-- <view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color" data-name="color"
					 data-value="#0000ff"></view> -->
					<!-- <view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''" class="iconfont icon-fontbgcolor"
					 data-name="backgroundColor" data-value="#00ff00"></view> -->
					<view class="iconfont icon-text_color" :style="{ color : fontColorValue}" @tap="clickFontColor('font')">
					</view> 
					<view class="iconfont icon-fontbgcolor" :style="{ color : backgroundColorValue}" @tap="clickFontColor('bgm')">
					</view>
					<!-- <view class="iconfont icon-date" @tap="insertDate"></view> -->
					<view style="display: inline-block;width: auto;">
						<uni-datetime-picker v-model="single">
							<view class="iconfont icon-date"></view>
						</uni-datetime-picker>
					</view>
					<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
					<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie" data-name="list"
					 data-value="ordered"></view>
					<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie" data-name="list"
					 data-value="bullet"></view>
					<view class="iconfont icon-undo" @tap="undo"></view>
					<view class="iconfont icon-redo" @tap="redo"></view>

					<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
					<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
					<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
					<view class="iconfont icon-charutupian" @tap="insertImage"></view>
					<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1" data-name="header"
					 :data-value="1"></view>
					<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao" data-name="script"
					 data-value="sub"></view>
					<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao" data-name="script"
					 data-value="super"></view>
					<view class="iconfont icon-shanchu" @tap="clear"></view>
					<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl" data-name="direction"
					 data-value="rtl"></view>

				</view>

				<editor @input="editText" id="editor" class="ql-container" :placeholder="placeholder" showImgSize showImgToolbar showImgResize
				 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady" @blur="onBlur">
				</editor>
			</view>
		</view>
		<t-color-picker ref="colorPicker" :color="color" @confirmData="confirm"></t-color-picker>
	</view>
</template>

<script>
	import tColorPicker from '@/uni_modules/t-color-picker/t-color-picker.vue'
	import uniDatetimePicker from '@/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue'  
	import {
		uploadMutipleFile
	} from '@/common/api/system/dictionary/index.js';
	export default {
    props:{
      modelValue:{
        type:String,
        default:''
      } 
    },
		components: {
			tColorPicker,
			uniDatetimePicker
		},
		watch: { 
			single(val, old) {
				const that = this
				this.editorCtx.getContents({
					success: function(res) { 
						let html=res.html+val
						that.editorCtx.setContents({
							html: html
						}) 
						that.$emit("update:modelValue", html);
					}
				}); 
			},
		},
		data() {
			return {
        readOnly: false,
				formats: {},
				placeholder:'开始输入...',
				fontSizeArray: ['20px','22px','24px','26px','28px','30px'],
				fontColorValue: '',
				backgroundColorValue: '',
				colorType: '',
				color: 'rgba(255,0, 0,0.6)',
				single: '',    
			}
		}, 
		methods: {
      editText(res){
        this.$emit('update:modelValue',res.detail.html)
				this.$emit('change',res.detail.html)
      },
			onBlur(res){
				this.$emit('blur',res.detail.html)
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() { 
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context;
					setTimeout(()=>{ 
						this.editorCtx.setContents({    
						  html:this.modelValue    //初始化赋值内容。    
						}) 
					},500) 
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return 
				this.editorCtx.format(name, value)
			},
			RadioChange(e) {
				let font=this.fontSizeArray[e.detail.value];
				this.editorCtx.format('fontSize', font);  
			},
			clickFontColor(e) {
				// 打开颜色选择器
				this.$refs.colorPicker.open();
				this.colorType = e;
			},
			//确认
			confirm(e) {
				if (this.colorType === 'font') { 
					this.editorCtx.format('color', e);
					this.fontColorValue = e
				} else {
					this.editorCtx.format('backgroundColor', e);
					this.backgroundColorValue = e 
				} 
			},  
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: async (resultText) => {
						try {
							let res = await uploadMutipleFile('',
								{
								filePath:resultText.tempFilePaths[0],
								name: "file",
								file: resultText
							}
							);
							res.data.forEach((x) => {
								this.editorCtx.insertImage({
									src:  x.fileUrl,
									alt: '图像',
									success: function() {
										console.log('insert image success')
									}
								})
							});
						} catch (error) {
							console.error(error);
						}
					}
				})
			}
		},
		// onLoad() { 
		// 	uni.loadFontFace({
		// 		family: 'Pacifico',
		// 		source: 'url("./Pacifico.ttf")'
		// 	})
		// },
	}
</script>

<style> 
	@import "./cs.css";
	.wrapper { 
	}
  .toolbar{
    background: #fff;
  }
	.iconfont {
		display: inline-block;
		margin: 12px 8px; 
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}
	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
	}
	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 30vh;
		height: auto;
		background-color: #f5f6fa;
		border: 1px solid #ebecf0;
		font-size: 16px;
		line-height: 1.5; 
	}
	.ql-active {
		color: #06c;
	}
</style>