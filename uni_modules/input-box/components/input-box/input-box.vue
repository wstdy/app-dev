<template>
    <view
        :class="{ 'uni-easyinput-error': msg }"
        :style="boxStyle"
        class="uni-easyinput"
    >
        <view v-if="addonBefore" class="uni-numbox__minus uni-numbox-btns">
            <text class="uni-numbox--text">{{ addonBefore }}</text>
        </view>
        <view
            :class="inputContentClass"
            :style="inputContentStyle"
            class="uni-easyinput__content"
        >
            <slot name="prefixIcon">
                <uni-icons
                    v-if="prefixIcon" :type="prefixIcon"
                    class="content-clear-icon"
                    color="#8d97a3"
                    custom-prefix="antfont"
                    size="22"
                    @click="onClickIcon('prefix')"
                ></uni-icons>
            </slot>
            <slot name="content"></slot>
            <template v-if="type === 'password'">
                <!-- 开启密码时显示小眼睛 -->
                <uni-icons
                    v-if="isVal"
                    :class="{ 'is-textarea-icon': type === 'textarea' }"
                    :color="focusShow ? primaryColor : '#8d97a3'"
                    :size="22"
                    :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
                    class="content-clear-icon"
                    @click="onEyes"
                >
                </uni-icons>
            </template>
            <template v-else-if="suffixIcon || $slots.suffixIcon">
                <slot name="suffixIcon">
                    <!-- right是选择框的右侧箭头，这个不需要前缀  -->
                    <uni-icons
                        v-if="suffixIcon" :custom-prefix="suffixIcon == 'right' ? '' : 'antfont'"
                        :type="suffixIcon"
                        class="content-clear-icon"
                        color="#8d97a3"
                        size="20"
                        @click="onClickIcon('suffix')"
                    ></uni-icons>
                </slot>
            </template>

            <uni-icons
                v-if="clearable && isVal && !disabled "
                :class="{ 'is-textarea-icon': type === 'textarea' }"
                :color="msg ? '#dd524d' : focusShow ? primaryColor : '#8d97a3'"
                :size="clearSize"
                class="content-clear-icon"
                type="clear"
                @click="onClear"
            ></uni-icons>

            <slot name="right"></slot>
        </view>
        <view v-if="addonAfter" class="uni-numbox__plus uni-numbox-btns">
            <text class="uni-numbox--text">{{ addonAfter }}</text>
        </view>
        <slot name="dialog"></slot>
    </view>
</template>

<script>
    /**
     * input-box 输入框样式共用组件
     * @description 此组件可以实现输入型组件的头尾图标和标签。
     * @tutorial https://ext.dcloud.net.cn/plugin?id=3455
     * @property {String}  value  输入内容
     * @property {String }  type  输入框的类型（默认text） password/text/textarea/..
     *  @value text			文本输入键盘
     *  @value textarea	多行文本输入键盘
     *  @value password	密码输入键盘
     *  @value number		数字输入键盘，注意iOS上app-vue弹出的数字键盘并非9宫格方式
     *  @value idcard		身份证输入键盘，信、支付宝、百度、QQ小程序
     *  @value digit		带小数点的数字键盘	，App的nvue页面、微信、支付宝、百度、头条、QQ小程序支持
     * @property {Boolean}  clearable  是否显示右侧清空内容的图标控件，点击可清空输入框内容（默认true）
     * @property {String }  placeholder  输入框的提示文字
     * @property {String }  placeholderStyle  placeholder的样式(内联样式，字符串)，如"color: #ddd"
     * @property {Boolean}  disabled  是否禁用（默认false）
     * @property {Number }  clearSize  清除图标的大小，单位px（默认15）
     * @property {String}  prefixIcon  输入框头部图标
     * @property {String}  suffixIcon  输入框尾部图标
     * @property {String}  addonBefore  前置标签
     * @property {String}  addonAfter  后置标签
     * @property {String}  primaryColor  设置主题色（默认#2979ff）
     * @property {Boolean}  inputBorder  是否显示input输入框的边框（默认true）
     * @property {Object}  styles  自定义颜色
     * @event {Function}  iconClick  点击图标时触发
     * @slot prefixIcon 输入框头部插槽
     * @slot suffixIcon 输入框尾部插槽
     * @example <input-box v-model="mobile"></input-box>
     */
    function obj2strClass(obj) {
        let classess = "";
        for (let key in obj) {
            const val = obj[key];
            if (val) {
                classess += `${key} `;
            }
        }
        return classess;
    }

    function obj2strStyle(obj) {
        let style = "";
        for (let key in obj) {
            const val = obj[key];
            style += `${key}:${val};`;
        }
        return style;
    }

    export default {
        name: "input-box",
        emits: [
            "click",
            "iconClick",
            //"update:modelValue",
            //"input",
            //"focus",
            //"blur",
            //"confirm",
            "clear",
            "eyes",
            "change",
        ],
        model: {
            prop: "modelValue",
            //event: "update:modelValue",
        },
        options: {
            virtualHost: true,
        },
        inject: {
            form: {
                from: "uniForm",
                default: null,
            },
            formItem: {
                from: "uniFormItem",
                default: null,
            },
        },
        props: {
            name: String,
            value: [Number, String],
            modelValue: [Number, String],
            type: {
                type: String,
                default: "text",
            },
            clearable: {
                type: Boolean,
                default: true,
            },
            placeholder: {
                type: String,
                default: " ",
            },
            placeholderStyle: String,
            disabled: {
                type: Boolean,
                default: false,
            },
            clearSize: {
                type: [Number, String],
                default: 24,
            },
            inputBorder: {
                type: Boolean,
                default: true,
            },
            focusShow: {
                type: Boolean,
                default: false,
            },
            prefixIcon: {
                type: String,
                default: "",
            },
            suffixIcon: {
                type: String,
                default: "",
            },
            addonBefore: {
                type: String,
                default: "",
            },
            addonAfter: {
                type: String,
                default: "",
            },
            trim: {
                type: [Boolean, String],
                default: true,
            },
            primaryColor: {
                type: String,
                default: "#2979ff",
            },
            styles: {
                type: Object,
                default() {
                    return {
                        color: "#333",
                        disableColor: "#F7F6F6",
                        borderColor: "#F2F2F2",
                    };
                },
            },
            errorMessage: {
                type: [String, Boolean],
                default: "",
            },
            localMsg: {
                type: [String, Boolean],
                default: "",
            },
        },
        data() {
            return {
                val: "",
                border: false,
                showPassword: false,
            };
        },
        computed: {
            // 输入框内是否有值
            isVal() {
                const val = this.val;
                // fixed by mehaotian 处理值为0的情况，字符串0不在处理范围
                if (val || val === 0) {
                    return true;
                }
                return false;
            },

            msg() {
                // TODO 处理头条 formItem 中 errMsg 不更新的问题
                return this.localMsg || this.errorMessage;
            },


            // 处理外层样式的style
            boxStyle() {
                return `color:${
                    this.inputBorder && this.msg ? "#e43d33" : this.styles.color
                };`;
            },
            // input 内容的类和样式处理
            inputContentClass() {
                return obj2strClass({
                    "is-input-border": this.inputBorder,
                    "is-input-error-border": this.inputBorder && this.msg,
                    "is-textarea": this.type === "textarea",
                    "is-disabled": this.disabled,
                    "is-left-radius": this.addonBefore,
                    "is-right-radius": this.addonAfter
                });
            },
            inputContentStyle() {
                const focusColor = this.focusShow
                    ? this.primaryColor
                    : this.styles.borderColor;
                const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
                return obj2strStyle({
                    "border-color": borderColor || "#e5e5e5",
                    "background-color": this.disabled
                        ? this.styles.disableColor
                        : this.styles.backgroundColor,
                    "display": this.type == 'textarea' ? 'block' : 'flex'
                });
            },
            // input右侧样式
            inputStyle() {
                const paddingRight =
                    this.type === "password" || this.clearable || this.prefixIcon
                        ? ""
                        : "10px";
                return obj2strStyle({
                    "padding-right": paddingRight,
                    "padding-left": this.prefixIcon ? "" : "10px",
                });
            },
        },
        created() {
            this.init()
        },
        watch: {
            value(newVal) {
                this.val = newVal;
            },
            modelValue(newVal) {
                this.val = newVal;
            },
        },
        methods: {
            init() {
                if (this.value || this.value === 0) {
                    this.val = this.value;
                } else if (this.modelValue || this.modelValue === 0) {
                    this.val = this.modelValue;
                } else {
                    this.val = null;
                }
            },
            /**
             * 点击图标时触发
             * @param {Object} type
             */
            onClickIcon(type) {
                this.$emit("iconClick", type);
            },

            /**
             * 显示隐藏内容，密码框时生效
             */
            onEyes() {
                this.showPassword = !this.showPassword;
                this.$emit("eyes", this.showPassword);
            },
            /**
             * 清理内容
             * @param {Object} event
             */
            onClear(event) {
                this.val = "";
                // TODO 兼容 vue2
                //this.$emit("input", "");
                // TODO 兼容 vue2
                // TODO　兼容　vue3
                //	this.$emit("update:modelValue", "");
                // 点击叉号触发
                this.$emit("clear");
            },
        },
    };
</script>

<style lang="scss">
    $uni-error: #e43d33;
    $uni-border-1: #dcdfe6 !default;
    $bg: #f5f5f5;
    $br: 2px;
    $color: #333;
    .uni-easyinput {
        /* #ifndef APP-NVUE */
        width: 100%;
        /* #endif */
        flex: 1;
        position: relative;
        text-align: left;
        color: #333;
        font-size: 14px;
        display: flex;
    }

    .uni-easyinput__content {
        flex: 1;
        /* #ifndef APP-NVUE */
        width: 100%;
        display: flex;
        box-sizing: border-box;
        // min-height: 36px;
        /* #endif */
        flex-direction: row;
        align-items: center;
        // 处理border动画刚开始显示黑色的问题
        border-color: #fff;
        transition-property: border-color;
        transition-duration: 0.3s;
    }

    .uni-easyinput__content-input {
        /* #ifndef APP-NVUE */
        width: auto;
        /* #endif */
        position: relative;
        overflow: hidden;
        flex: 1;
        line-height: 1;
        font-size: 14px;
        height: 35px;
        // min-height: 36px;
    }

    .is-textarea {
        align-items: flex-start;
    }

    .is-textarea-icon {
        margin-top: 5px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .content-clear-icon {
        padding: 0
    }

    .label-icon {
        margin-right: 5px;
        margin-top: -1px;
    }

    // 显示边框
    .is-input-border {
        /* #ifndef APP-NVUE */
        display: flex;
        box-sizing: border-box;
        /* #endif */
        flex-direction: row;
        align-items: center;
        border: 1px solid $uni-border-1;
        border-radius: 4px;
        /* #ifdef MP-ALIPAY */
        overflow: hidden;
        /* #endif */
    }

    .uni-error-message {
        position: absolute;
        bottom: -17px;
        left: 0;
        line-height: 12px;
        color: $uni-error;
        font-size: 12px;
        text-align: left;
    }

    .uni-error-msg--boeder {
        position: relative;
        bottom: 0;
        line-height: 22px;
    }


    .uni-easyinput--border {
        margin-bottom: 0;
        padding: 10px 15px;
        // padding-bottom: 0;
        border-top: 1px #eee solid;
    }

    .uni-easyinput-error {
        padding-bottom: 0;
    }

    .is-first-border {
        /* #ifndef APP-NVUE */
        border: none;
        /* #endif */
        /* #ifdef APP-NVUE */
        border-width: 0;
        /* #endif */
    }

    .is-left-radius {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    .is-right-radius {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .uni-numbox-btns {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        background-color: $bg;
        /* #ifdef H5 */
        cursor: pointer;
        /* #endif */
    }

    .uni-numbox__minus {
        border-top-left-radius: $br;
        border-bottom-left-radius: $br;
    }

    .uni-numbox__plus {
        border-top-right-radius: $br;
        border-bottom-right-radius: $br;
    }

    .uni-numbox--text {
        line-height: 20px;
        font-size: 12px;
        font-weight: 300;
        color: $color;
    }
</style>
