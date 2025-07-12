<template>
	<view class="uni-file-picker">
		<view v-if="title" class="uni-file-picker__header">
			<text class="file-title">{{ title }}</text>
			<text class="file-count">{{ filesList.length }}/{{ limitLength }}</text>
		</view>
		<upload-image v-if="showType === 'picture-card' " :readonly="readonly" :image-styles="imageStyles"
			:files-list="filesList" :limit="limitLength" :disablePreview="disablePreview" :delIcon="delIcon"
			  @choose="choose" @delFile="delFile">			 
		</upload-image>
		<upload-image v-else-if="showType === 'image' " :readonly="!isUpload||readonly" :image-styles="imageStyles"
			:files-list="filesList" :limit="1" :disablePreview="disablePreview" :delIcon="delIcon" :isUpload="isUpload" :showType="showType"
			  @choose="choose" @delFile="delFile">	
		</upload-image>
		<upload-file v-else :readonly="readonly" :list-styles="listStyles" :files-list="filesList" :showType="showType"
			:delIcon="delIcon"  @choose="choose" @delFile="delFile">
			<slot><button v-if="!disabled" type="primary" size="mini" style="margin-top: 10px">选择文件</button></slot>
		</upload-file>
	</view>
</template>

<script>
	import {
		chooseAndUploadFile,
		uploadCloudFiles
	} from './choose-and-upload-file.js'
	import {
		get_file_ext,
		get_extname,
		get_files_and_is_max,
		get_file_info,
		get_file_data
	} from './utils.js'
	import uploadImage from './upload-image.vue'
	import uploadFile from './upload-file.vue'
	import {
		uploadMutipleFile,
		getFileList,
		deleteSingleFile
	} from '@/common/api/system/dictionary/index.js';
	import config from '@/common/config/index.js'
	let fileInput = null
	/**
	 * FilePicker 文件选择上传
	 * @description 文件选择上传组件，可以选择图片、视频等任意文件并上传到当前绑定的服务空间
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=4079
	 * @property {Object|Array}	value	组件数据，通常用来回显 ,类型由return-type属性决定
	 * @property {Boolean}	disabled = [true|false]	组件禁用
	 * 	@value true 	禁用
	 * 	@value false 	取消禁用
	 * @property {Boolean}	readonly = [true|false]	组件只读，不可选择，不显示进度，不显示删除按钮
	 * 	@value true 	只读
	 * 	@value false 	取消只读
	 * @property {String}	return-type = [array|object]	限制 value 格式，当为 object 时 ，组件只能单选，且会覆盖
	 * 	@value array	规定 value 属性的类型为数组
	 * 	@value object	规定 value 属性的类型为对象
	 * @property {Boolean}	disable-preview = [true|false]	禁用图片预览，仅 mode:grid 时生效
	 * 	@value true 	禁用图片预览
	 * 	@value false 	取消禁用图片预览
	 * @property {Boolean}	del-icon = [true|false]	是否显示删除按钮
	 * 	@value true 	显示删除按钮
	 * 	@value false 	不显示删除按钮
	 * @property {Boolean}	auto-upload = [true|false]	是否自动上传，值为true则只触发@select,可自行上传
	 * 	@value true 	自动上传
	 * 	@value false 	取消自动上传
	 * @property {Number|String}	limit	最大选择个数 ，h5 会自动忽略多选的部分
	 * @property {String}	title	组件标题，右侧显示上传计数
	 * @property {String}	mode = [list|grid]	选择文件后的文件列表样式
	 * 	@value list 	列表显示
	 * 	@value grid 	宫格显示
	 * @property {String}	file-mediatype = [image|video|all]	选择文件类型
	 * 	@value image	只选择图片
	 * 	@value video	只选择视频
	 * 	@value all		选择所有文件
	 * @property {Array}	file-extname	选择文件后缀，根据 file-mediatype 属性而不同
	 * @property {Object}	list-style	mode:list 时的样式
	 * @property {Object}	image-styles	选择文件后缀，根据 file-mediatype 属性而不同
	 * @event {Function} select 	选择文件后触发
	 * @event {Function} progress 文件上传时触发
	 * @event {Function} success 	上传成功触发
	 * @event {Function} fail 		上传失败触发
	 * @event {Function} delete 	文件从列表移除时触发
	 */
	export default {
		name: 'uniFilePicker',
		components: {
			uploadImage,
			uploadFile
		},
		options: {
			virtualHost: true
		},
		emits: ['select', 'success', 'fail', 'progress', 'delete', 'update:modelValue', 'input',"change"],
		props: {
			// #ifdef VUE3
			modelValue: {
				type: String,
				default () {
					return ''
				}
			},
			// #endif

			// #ifndef VUE3
			value: {
				type: String,
				default () {
					return ''
				}
			},
			// #endif

			disabled: {
				type: Boolean,
				default: false
			},
			disablePreview: {
				type: Boolean,
				default: false
			},
			delIcon: {
				type: Boolean,
				default: true
			},
			// 自动上传
			autoUpload: {
				type: Boolean,
				default: true
			},
			// 最大选择个数 ，h5只能限制单选或是多选
			limit: {
				type: [Number, String],
				default: 9
			},
			// 列表样式 text | picture | picture-card | image
			showType: {
				type: String,
				default: 'text'
			},
			// 文件类型筛选
			fileExtname: {
				type: [Array, String],
				default () {
					return []
				}
			},
			title: {
				type: String,
				default: ''
			},
			listStyles: {
				type: Object,
				default () {
					return {
						// 是否显示边框
						border: true,
						// 是否显示分隔线
						dividline: true,
						// 线条样式
						borderStyle: {}
					}
				}
			},
			imageStyles: {
				type: Object,
				default () {
					return {
						width: 'auto',
						height: 'auto'
					}
				}
			},
			readonly: {
				type: Boolean,
				default: false
			},
			returnType: {
				type: String,
				default: 'array'
			},
			sizeType: {
				type: Array,
				default () {
					return ['original', 'compressed']
				}
			},
			multiple: {
				type: Boolean,
				default: false
			},
			maxSize: {
				type: Number,
				default: 5
			},
			isUpload: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				files: [],
				localValue: [],
				foldId: '', //文件夹id
			}
		},
		watch: {
			// #ifndef VUE3
			value: {
				handler(newVal, oldVal) {
					this.setValue(newVal, oldVal)
				},
				immediate: true
			},
			// #endif
			// #ifdef VUE3
			modelValue: {
				handler(newVal, oldVal) {
					this.setValue(newVal, oldVal)
				},
				immediate: true
			},
			// #endif
		},
		computed: {
			filesList() {
				let files = []
				this.files.forEach(v => {
					files.push(v)
				})
				return files
			},
			limitLength() {
				if (this.returnType === 'object') {
					return 1
				}
				if (!this.limit) {
					return 1
				}
				if (this.limit >= 9) {
					return 9
				}
				return this.limit
			}
		},
		created() {
			// TODO 兼容不开通服务空间的情况
			if (!(uniCloud.config && uniCloud.config.provider)) {
				this.noSpace = true
				uniCloud.chooseAndUploadFile = chooseAndUploadFile
			}
			this.form = this.getForm('uniForms')
			this.formItem = this.getForm('uniFormsItem')
			if (this.form && this.formItem) {
				if (this.formItem.name) {
					this.rename = this.formItem.name
					this.form.inputChildrens.push(this)
				}
			}
		},
		methods: {
 
			async setValue(newVal, oldVal) {
				
				if (newVal) {
					let res = await getFileList(newVal)
					if (res.data && !res.code) { 
						this.foldId = res.data[0].folderId;
						this.files = res.data.map(o => {
							return {
								name: o.fileName,
								id: o.id,
								progress: 100,
								fileType: o.fileType,
								url: (o.fileUrl.includes('http://') || o.fileUrl.includes('https://')) ?
									o.fileUrl : (config.baseUrl + o.fileUrl)
							}
						}) 
					}
				}else{
					this.foldId =''
					this.files =[]
				}
			},

			/**
			 * 选择文件
			 */
			choose() {

				if (this.disabled) return
				if (this.files.length >= Number(this.limitLength) && this.returnType ===
					'array') {
					uni.showToast({
						title: `您最多选择 ${this.limitLength} 个文件`,
						icon: 'none'
					})
					return
				}
				this.chooseFiles()
			},

			/**
			 * 选择文件并上传
			 */
			chooseFiles() {
				const _extname = get_extname(this.fileExtname)
				let count=1;
				// #ifndef MP-WEIXIN
				count=this.multiple ? this.limitLength - this.files.length : 1
				// #endif
				// 获取后缀
				uniCloud
					.chooseAndUploadFile({
						type: 'all',
						compressed: false,
						sizeType: this.sizeType,
						// TODO 如果为空，video 有问题
						extension: _extname.length > 0 ? _extname : undefined,
						count: count, //默认9
						onChooseFile: this.chooseFileCallback,
						onUploadProgress: progressEvent => {
							this.setProgress(progressEvent, progressEvent.index)
						}
					})
					.then(async result => { 
						this.setSuccessAndError(result.tempFiles)
						// #ifdef MP-WEIXIN
						//微信小程序
						for (let file of result.tempFiles) {
							let res=await uploadMutipleFile(this.foldId, {
								filePath:file.path,
								name: "file",
								file: file
							}) 
							if (!res.code && res.data) {
								this.foldId = res.data[0].folderId;
								if (this.foldId) { 
									this.$emit("input", this.foldId);
									this.$emit("update:modelValue", this.foldId);
									this.$emit("change", this.foldId);
								}
							} 
						} 
						// #endif
								
						// #ifndef MP-WEIXIN
						//除了微信小程序
						const fileArray = []
						for (let file of result.tempFiles) {
							fileArray.push({
								name: "file",
								file: file
							})
						}
						
						uploadMutipleFile(this.foldId, {
							files: fileArray
						}).then(res => { 
							if (!res.code && res.data) {
								this.foldId = res.data[0].folderId;
								if (this.foldId) { 
									this.$emit("input", this.foldId);
									this.$emit("update:modelValue", this.foldId);
									this.$emit("change", this.foldId);
								}
							}
						})
						// #endif
						 
					})
					.catch(err => {
						console.log('选择失败', err)
					})
			},

			/**
			 * 选择文件回调
			 * @param {Object} res
			 */
			async chooseFileCallback(res) {
				const _extname = get_extname(this.fileExtname)
				const is_one = (Number(this.limitLength) === 1 &&
						this.disablePreview &&
						!this.disabled) ||
					this.returnType === 'object'
				// 如果这有一个文件 ，需要清空本地缓存数据
				if (is_one) {
					this.files = []
				}

				let {
					filePaths,
					files
				} = get_files_and_is_max(res, _extname)
				if (!(_extname && _extname.length > 0)) {
					filePaths = res.tempFilePaths
					files = res.tempFiles
				}

				let currentData = []; 
				for (let i = 0; i < files.length; i++) {
					if (this.limitLength - this.files.length <= 0) break;
					if (this.maxSize && files[i].size / 1024 / 1024 > this.maxSize) {
						uni.showToast({
							duration:2000,
							title: `文件大小不能超过${this.maxSize}MB！`,
						});
						break;
					}
					files[i].uuid = Date.now()
					let filedata = await get_file_data(files[i], this.showType)
					filedata.progress = 0
					filedata.status = 'ready'
					this.files.push(filedata)
					currentData.push({
						...filedata,
						file: files[i]
					})
				} 
				res.tempFiles = files 
				// 停止自动上传
				// if (!this.autoUpload || this.noSpace) {
				// 	res.tempFiles = []
				// }
			},

			 

			/**
			 * 成功或失败
			 */
			async setSuccessAndError(res, fn) {
				let successData = []
				let errorData = []
				let tempFilePath = []
				let errorTempFilePath = []
				for (let i = 0; i < res.length; i++) {
					const item = res[i]
					const index = item.uuid ? this.files.findIndex(p => p.uuid === item.uuid) : item.index

					if (index === -1 || !this.files) break
					if (item.errMsg === 'request:fail') {
						this.files[index].url = item.path
						this.files[index].status = 'error'
						this.files[index].errMsg = item.errMsg
						// this.files[index].progress = -1
						errorData.push(this.files[index])
						errorTempFilePath.push(this.files[index].url)
					} else {
						this.files[index].errMsg = ''
						this.files[index].fileID = item.url
						const reg = /cloud:\/\/([\w.]+\/?)\S*/
						if (reg.test(item.url)) {
							this.files[index].url = await this.getTempFileURL(item.url)
						} else {
							this.files[index].url = item.url
						}

						this.files[index].status = 'success'
						this.files[index].progress += 10
						successData.push(this.files[index])
						tempFilePath.push(this.files[index].fileID)
					}
				}
 
			},

			/**
			 * 获取进度
			 * @param {Object} progressEvent
			 * @param {Object} index
			 * @param {Object} type
			 */
			setProgress(progressEvent, index, type) { 
				const fileLenth = this.files.length
				const percentNum = (index / fileLenth) * 100
				const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
				let idx = index
				if (!type) {
					idx = this.files.findIndex(p => p.uuid === progressEvent.tempFile.uuid)
				}
				if (idx === -1 || !this.files[idx]) return
				// fix by mehaotian 100 就会消失，-1 是为了让进度条消失
				this.files[idx].progress = percentCompleted - 1
				// 上传中
				this.$emit('progress', {
					index: idx,
					progress: parseInt(percentCompleted),
					tempFile: this.files[idx]
				})
			},

			/**
			 * 删除文件
			 * @param {Object} index
			 */
			async delFile(index) { 
				let res = await deleteSingleFile(this.files[index].id)
				if (!res.code) {
					this.foldId = res.data;
					this.files.splice(index, 1) 
					this.$emit("input", this.foldId);
					this.$emit("update:modelValue", this.foldId);
					this.$emit("change", this.foldId);
		 
				} else {
					uni.showToast({
						duration: 2000,
						title: '删除失败'
					})
				}
 
			},
 
			async getTempFileURL(fileList) {
				fileList = {
					fileList: [].concat(fileList)
				}
				const urls = await uniCloud.getTempFileURL(fileList)
				return urls.fileList[0].tempFileURL || ''
			},
			/**
			 * 获取父元素实例
			 */
			getForm(name = 'uniForms') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			}
		}
	}
</script>

<style>
	.uni-file-picker {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		overflow: hidden;
		width: 100%;
		/* #endif */
		flex: 1;
	}

	.uni-file-picker__header {
		padding-top: 5px;
		padding-bottom: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
	}

	.file-title {
		font-size: 14px;
		color: #333;
	}

	.file-count {
		font-size: 14px;
		color: #999;
	}

	.is-add {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}

	.icon-add {
		width: 50px;
		height: 5px;
		background-color: #f1f1f1;
		border-radius: 2px;
	}

	.rotate {
		position: absolute;
		transform: rotate(90deg);
	}
</style>