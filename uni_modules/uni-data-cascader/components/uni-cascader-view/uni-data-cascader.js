import {
	changeApiOptions
} from '@/common/api/magic-api/useApiRequest.js';
import { getAreaList } from '@/common/api/system/dictionary/index.js';
import { getOrganizationTree } from "@/common/api/organization/index";
export default {
	props: {
		localdata: {
			type: [Array, Object],
			default () {
				return []
			}
		},
		value: {
			type: [Array, String, Number],
			default () {
				return []
			}
		},
		type: {
			type: String,
			default: 'cascader'
		},
		modelValue: {
			type: [Array, String, Number],
			default () {
				return []
			}
		},
		preload: {
			type: Boolean,
			default: false
		},
		selfField: {
			type: String,
			default: ''
		}, 
		apiConfig: {
			type: Object,
			default () {
				return {}
			}
		},
		selectedConfig: {
			type: String,
			default: 'selectMostChildLevel'
		},
	},
	inject: {
		formModel: {
			from: "formModel",
			default: null,
		},
		isCustomForm: {
			from: "isCustomForm",
			default: false,
		},
	},
	data() {
		return {
			loading: false,
			errorMessage: '',
			loadMore: {
				contentdown: '',
				contentrefresh: '',
				contentnomore: ''
			},
			dataList: [],
			selected: [],
			selectedIndex: 0,
			map:{
				text: 'label',
				value: 'value',
			},
			parentField:'parent',
			dataValue:[]
		}
	},
	// watch: { 
	// 	value(newVal) { 
	// 		this.initData(newVal)
	// 	},
	// 	modelValue(newVal) { 
	// 		this.initData(newVal) 
	// 	}
	// },
	computed: {
		isLocalData() {
			return this.localdata.length;
		}, 
		hasValue() {
			return true
			if (typeof this.dataValue === 'number') {
				return true
			}
			return (this.dataValue != null) && (this.dataValue.length > 0)
		}
	},
	created() {
		this._treeData = []; 
		if(this.type=='area' || this.type === 'organization'){
			this.map={
				text: 'name',
				value: 'id',
			}
			this.parentField='parentId'
		}
	},
	methods: {
	// 	initData(val){ 
	// 		if(Object.prototype.toString.call(val)==='[object String]') this.dataValue=val.split(',')
			
 
	// 		// this.selected=[]
	// 		// if(this.type=='area'){
	// 		// 	this.dataValue.forEach(async o=>{
	// 		// 		let res=await getAreaList({id:o}) 
	// 		// 		let obj=res.data.find(k=>{return k.id==o})
	// 		// 		if(obj) this.selected.push({
	// 		// 			text:obj[this.map.text],
	// 		// 			value:obj[this.map.value]
	// 		// 		})
	// 		// 		this._treeData.push(...res.data)
	// 		// 	}) 
	// 		// }
	// 	},
		// 填充 pickview 数据
		async loadData() {
			if (this.isLocalData) {
				this.loadLocalData(this.localdata);
			} else if (this.type == 'area' || this.type === 'organization') {
				await this.loadAreaTree()
			} else {
				await this.loadCloudDataTree();
			}
		},

		// 加载本地数据
		async loadLocalData(treeData) {
			this._treeData = [];
			this._extractTree(treeData, this._treeData);

			let inputValue = this.dataValue;
			if (inputValue === undefined) {
				return;
			}
 
			if (Array.isArray(inputValue)) {
				inputValue = inputValue[inputValue.length - 1];
				if (typeof inputValue === 'object' && inputValue[this.map.value]) {
					inputValue = inputValue[this.map.value];
				}
			}

			this.selected = this._findNodePath(inputValue, treeData);
		},
		async loadAreaTree(id) {
			if (this.loading) {
				return;
			}
			this.loading = true;

			try {
				let responseData = [] 
        let response
        if (this.type === 'area') {
          response = await getAreaList({id:id?id:'0'})
        } else if (this.type === 'organization') {
          response = await getOrganizationTree()
        }
				if (response.data) {
					responseData = response.data;
				} 
				this.loadLocalData(responseData);

			} catch (e) {
				this.errorMessage = e;
			} finally {
				this.loading = false;
			}
		},
		// 加载 Cloud 数据 (树形)
		async loadCloudDataTree() {
			if (this.loading) {
				return;
			}
			this.loading = true;

			try {
				let responseData = []
				if (this.apiConfig?.path) {
					let response = await changeApiOptions(this.apiConfig, this.formModel.value, this.isCustomForm)
					if (response.data) {
						responseData = response.data;
					}
				}
				this.loadLocalData(responseData);

			} catch (e) {
				this.errorMessage = e;
			} finally {
				this.loading = false;
			}
		},

		_updateBindData(node) {

			const {
				dataList,
				hasNodes
			} = this._filterData(this._treeData, this.selected)

			let isleaf = !hasNodes
			if(node){
				isleaf=false
				node.isleaf=false
			}

			this.dataList = dataList

			return {
				isleaf,
				hasNodes
			}
		},

		_updateSelected() {
			let dl = this.dataList
			let sl = this.selected
			let textField = this.map.text
			let valueField = this.map.value
			for (let i = 0; i < sl.length; i++) {
				let value = sl[i].value
				let dl2 = dl[i]
				for (let j = 0; j < dl2.length; j++) {
					let item2 = dl2[j]
					if (item2[valueField] === value) {
						sl[i].text = item2[textField]
						break
					}
				}
			}
		},

		_filterData(data, paths) {
			let dataList = []
			let hasNodes = true
			dataList.push(data.filter((item) => {
				return (item[this.parentField] === null || item[this.parentField] === undefined || item[this
					.parentField] === ''|| item[this.parentField] === '0')
			}))
			for (let i = 0; i < paths.length; i++) {
				let value = paths[i].value
				let nodes = data.filter((item) => {
					return item[this.parentField] === value
				})

				if (nodes.length) {
					dataList.push(nodes)
				} else if(this.type!='area'){ 
					hasNodes = false
				}
			}
			return {
				dataList,
				hasNodes
			}
		},

		_extractTree(nodes, result, parent_value) {
			let list = result || []
			let valueField = this.map.value
			for (let i = 0; i < nodes.length; i++) {
				let node = nodes[i]

				let child = {}
				for (let key in node) {
					if (key !== 'children') {
						child[key] = node[key]
					}
				}
				if (parent_value !== null && parent_value !== undefined && parent_value !== '') {
					child[this.parentField] = parent_value
				}
				result.push(child)

				let children = node.children
				if (children) {
					this._extractTree(children, result, node[valueField])
				}
			}
		},


		_findNodePath(key, nodes, path = []) {
			let textField = this.map.text
			let valueField = this.map.value
			for (let i = 0; i < nodes.length; i++) {
				let node = nodes[i]
				let children = node.children
				let text = node[textField]
				let value = node[valueField]

				path.push({
					value,
					text
				})

				if (value === key) {
					return path
				}

				if (children) {
					const p = this._findNodePath(key, children, path)
					if (p.length) {
						return p
					}
				}

				path.pop()
			}
			return []
		}
	}
}