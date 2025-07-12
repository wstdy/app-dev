const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'index.js');
const argv = process.argv;
const fixResponsive = argv.indexOf('fix-responsive') > 0;
const templates = require('./templates');

if (fs.existsSync(filePath)) {
    console.log('Reading ' + filePath);
    const file = fs.readFileSync(filePath, 'utf-8');
    const fileArr = file.split('\n');
    const confArr = [];
    let parseStart = false;

    fileArr.forEach((row) => {
        if (!parseStart && row.indexOf('export const formProps =') >= 0) {
            parseStart = true;
            confArr.push('{');
            return;
        }
        if (parseStart) {
            if (row.indexOf('};') === 0) {
                confArr.push('}');
                parseStart = false;
                return;
            }
            confArr.push(row);
        }
    });
    console.log('total rows: ' + confArr.length);
    formProps = eval('(' + confArr.join('\n') + ')');
} else {
    process.exit(0);
}

let tmpl = '';
let tabCount = 0;
let tableCount = 0;
const refList = [];
const refExportList = [];
const importList = [];
const components = [];
const dataList = [];

// 用于将config的表单格式展开成字段，以便二开
formProps.schemas.forEach((prop) => {
    appendTmpl(prop);
});

function appendTmpl(prop) {
    let schema = `schemaMap['${prop.key}']`;
    // 栅格布局
    tmpl += `<!-- ${prop.label || prop.field || prop.component}  -->\n`;
    if (prop.component == 'Grid') {
        prop.children.forEach((child) => {
            child.list.forEach((listChild) => {
                appendTmpl(listChild);
            });
        });
        return;
    } else if (prop.component == 'Segmented') { // 选项卡
        return appendTabTmpl(prop);
    } else if (prop.component == 'TableLayout') {
        return appendTableLayoutTmpl(prop);
    } else if (prop.component == 'Collapse') {
        return appendCardTmpl(prop);
    } else if (prop.component == 'SubForm') {
        return appendSubFormTmpl(prop);
    }
    tmpl += `
    <simple-form-item
        :schema="${schema}"
        :formApi="formActionType"
        :class="${schema}.componentProps.type === 'textarea' ? 'textarea-box' : ''"
        :refreshFieldObj="refreshFieldObj"
        v-if="getIfShow2('${prop.key}')"
        v-model="formModelRef[${schema}.field]"
    ></simple-form-item>
    `;
}

function appendSubFormTmpl(prop) {
    let schema = `schemaMap['${prop.key}']`;
    tableCount += 1;
    createSubFormFile();
    tmpl += `
        <CustomDevSubForm${tableCount} :schema="${schema}" v-model="formModelRef[${schema}.field]" />
    `;
    importList.push(`import CustomDevSubForm${tableCount} from './CustomDevSubForm${tableCount}.vue';`);
    components.push(`CustomDevSubForm${tableCount}`);
}

function createSubFormFile() {
    const subFormStr = templates.subFormTmpl;
    fs.writeFile(`../CustomDevSubForm${tableCount}.vue`, subFormStr, (err) => {
        if (err) throw err;
        console.log(`Write SubForm CustomDevSubForm${tabCount}.vue success`);
    });
}

function appendTabTmpl(prop) {
    tabCount += 1;
    const tabItems = prop.layout.map((tab, index) => `
    <view v-show="activeRef${tabCount} === ${index}">
        <!-- ${tab.name} 内容 -->
        ${tab.children.map(child => `
        <SimpleFormItem
            :schema="schemaMap['${child.key}']"
            :refreshFieldObj="refreshFieldObj"
            v-if="getIfShow(schemaMap['${child.key}'], formModelRef[schemaMap['${child.key}'].field])"
            v-model="formModelRef[schemaMap['${child.key}'].field]"
        />
        `).join('\n')}
    </view>
    `).join('\n');

    tmpl += `
        <uni-tab :data="schemaMap['${prop.key}'].layout" v-model="activeRef${tabCount}" v-bind="schemaMap['${prop.key}']" />
        ${tabItems}
    `;
    dataList.push(`activeRef${tabCount}: 0,`);
}
function appendTableLayoutTmpl(prop) {
    if (components.indexOf('TableLayoutPreview') < 0) {
        components.push('TableLayoutPreview');
        importList.push(`import { getIsShow, getIfShow } from '@/components/simple-form/utils/utils.js';`);
    }
    let schema = `schemaMap['${prop.key}']`;
    tmpl += `<uni-section :title="${schema}.name" type="line" :borderBottom="true" v-show="getIsShow(${schema},'')"> 
        <view v-for="(child, index) in ${schema}.layout" :key="${schema}.key+index"> 
        <template v-for="(schema, idx) in child.children" :key="schema.key">
                    <SimpleFormItem
                        :schema="schema"
                        :refreshFieldObj="refreshFieldObj" 
                        v-if="getIfShow(schema, formModelRef[${schema}.field])"
                        v-model ="formModelRef[${schema}.field]" 
                    />
                </template> 
            </view>
    </uni-section>
`;
}

function appendCardTmpl(prop) {
    let schema = `schemaMap['${prop.key}']`;
    tmpl += `
        <uni-section :title="${schema}.name" type="line" :borderBottom="true"> 
            <uni-card v-if="cardShow" :is-shadow="false" is-full :border="false"> 
                <view v-for="(child, index) in ${schema}.layout" :key="${schema}.key+index"> 
                    <template v-for="(schema, idx) in child.children" :key="schema.key">
                        <SimpleFormItem
                            :schema="schema"
                            :refreshFieldObj="refreshFieldObj" 
                            v-if="getIfShow(schema, formModelRef[${schema}.field])"
                            v-model ="formModelRef[${schema}.field]" 
                        />
                    </template> 
                </view>
            
            </uni-card> 
            <template v-slot:right>
                <view class="card-title-box iconfont" :class="cardShow?'icon-shouqi':'icon-zhankai'" @click="()=>{cardShow=!cardShow}"></view>
            </template>
        </uni-section>
    `
    if (components.indexOf('CollapseContainer') < 0) {
        components.push('CollapseContainer');
        // importList.push(`import { CollapseContainer } from '/@/components/Container';`);
    }
}

const fullVue = `
<template>
	<view class="example">
		<!-- 自定义表单校验 -->
		<uni-forms v-if="showForm" ref="formRef" v-bind="formPropsRef" :modelValue="formModelRef">
            ${tmpl}
		</uni-forms>
		<uni-load-more v-if="!showForm" iconType="auto" status="loading" />
		<view v-if="formPropsRef.showButton">
			<button type="primary" @click="submit">提交</button>
			<button type="primary" @click="reset">重置</button>
			<button type="primary" @click="disabled">{{ disabledRef ? '取消禁用' : '禁用' }}</button>
		</view>
	</view>
</template>

<script>
    // 注意，这里继承的是SimpleFormSetup，使用script setup写法的组件无法继承，必须使用特别的版本
    import SimpleFormItem from '@/components/simple-form/SimpleFormItem.vue';
    import SimpleFormSetup from '@/components/simple-form/SimpleFormSetup.vue'
    import { ref } from 'vue';
    ${importList.join('\n')}

    export default {
        components: { 
            SimpleFormItem ${components.length ? (',' + components.join(',\n')) : ''} 
        },
        mixins: [SimpleFormSetup],
        setup(props, ctx) {
            const ret = SimpleFormSetup.setup(props, ctx);
            const expose = ctx.expose;
            ${refList.join('\n')}
            
            return {
                ${refExportList.length ? refExportList.join(',\n') + ',' : ''}
                ...ret
            };
        },
        data() {
            return {
                cardShow: true,
                ${dataList.join('\n')}
            }
        },
        computed: {
            // 这里需要增加一个计算属性 否则流程关联时字段读写状态会失效
            schemaMap() {
                const schemaMap = {};
                this.getSchemas.forEach((schema) => {
                    schemaMap[schema.key] = schema;
                    if(schema.children) {
                        schema.children.forEach(sChild=>{
                           if(sChild.list){
                               sChild.list.forEach(lChild=>{
                                   schemaMap[lChild.key] = lChild;
                               });
                           } 
                        });
                    } else if (schema.layout) {
                        schema.layout.forEach((child, index) => {
                            child.children.forEach((schema, idx) => {
                                schemaMap[schema.key] = schema;
                            });
                        });
                    }
                });
                return schemaMap;
            }
        },
        methods: {
            getIfShow2: function (key) {
                return this.getIfShow(this.schemaMap[key], this.formModelRef[this.schemaMap[key].field]);
            },

            getTabProps(key) {
                const schema = this.schemaMap[key];
                return {
                    size: schema.componentProps.tabSize,
                    tabPosition: schema.componentProps.tabPosition,
                    type: schema.componentProps.type
                }
            },
            
            getTdStyle(tdElement) {
                return {
                    height: tdElement.height ? tdElement.height + 'px' : '',
                    minHeight: (tdElement.height || '42') + 'px',
                    overflow: 'hidden',
                    padding: '10px'
                }
            },
            getComponentsProps(schema) {
                let { componentProps = {}, events } = schema;
                //如果是函数
                if (isFunction(componentProps)) {
                    componentProps = componentProps({ schema: schema, formModel, formApi: formActionType }) || {};
                    return componentProps;
                }
            
                //如果有配置事件
                if (events) {
                    for (const eventKey in events) {
                        
                        try {
                            const fun = events[eventKey];
                            let event;
                            if (typeof fun === 'string') {
                                event = new Function('schema', 'formModel', 'formActionType', 'extParams', \`\${fun}\`);
                            } else if (typeof fun === 'function') {
                                event = fun;
                            }
                            componentProps['on' + upperFirst(eventKey)] = function (value, selectedOptions) {
                                //console.log(eventKey,componentProps)
                                event(schema, formModel.value, formActionType, {  value, selectedOptions });
                            };
                        } catch (error) {
                            console.log('error', error);
                        }
                    }
                }
                return componentProps;
            }
        }
    };
</script>
<style lang="scss">
.example {
	// padding:15px 15px 82px;
	background-color: #fff;
	padding-bottom: 40rpx;
}

.segmented-control {
	margin-bottom: 15px;
}

.button-group {
	margin-top: 15px;
	display: flex;
	justify-content: space-around;
}

.form-item {
	display: flex;
	align-items: center;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 35px;
}
::v-deep .textarea-box {
	.uni-forms-item {
		padding: 0;
	}
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	margin-bottom: 10rpx;
}
::v-deep .textarea-box {
	.uni-forms-item {
		padding: 0;
	}
}
</style>
`;

fs.writeFile('../CustomDevForm.vue', fullVue, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
