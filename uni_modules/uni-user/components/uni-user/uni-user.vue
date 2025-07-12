<template>
    <view>
        <uni-easyinput v-model="users" :disabled="disabled" :placeholder="placeholder" :prefixIcon="prefixIcon" :suffixIcon="sfxIcon"
                       @clear="handleClear" @focus="open" />
        <uni-user-popup ref="relationRef" :selectedIds="selectedIds" @change="handleChange" />
    </view>
</template>

<script setup>
    import {
        ref,
        watch,
        computed
    } from 'vue';
    import {
        camelCaseString,
    } from '@/utils/helper/utils.js';

    const props = defineProps({
        disabled: Boolean,
        placeholder: String,
        prefixIcon: String,
        suffixIcon: String,
        modelValue: {
            type: String,
            default: ''
        },
        sepTextField: {
            type: String,
            default: ''
        },
        row: {
            type: Object,
            default: () => {
                return {}
            }
        }
    })

    const sfxIcon = computed(() => {
        return props.disabled ? '' : (props.suffixIcon || 'right');
    });

    const emits = defineEmits(['update:modelValue', 'change', 'click']);
    const selectedIds = ref('')
    const relationRef = ref();
    const users = ref('');
    const isOpen = ref(false);
    const valChanged = ref(false);

    watch(
        () => props.modelValue,
        (val) => {
            if (!props.modelValue) users.value = ''
            if (props.sepTextField && !valChanged.value) {
                users.value = props.row[camelCaseString(props.sepTextField)];
            } else if (props.modelValue && !isOpen.value) {
                selectedIds.value = val
                setTimeout(async () => {
                    if (relationRef.value) {
                        await relationRef.value.getInfoByIds(val);
                        relationRef.value.confirm();
                    }
                }, 0);
                // nextTick(async () => {
                //   if (relationRef.value) {
                //     await relationRef.value.getInfoByIds(val);
                //     relationRef.value.confirm();
                //   }
                // })
            }
        },
        {
            immediate: true
        }
    )


    async function open() {
        isOpen.value = true
        valChanged.value = true
        relationRef.value.open();
        emits('click');
    }

    function handleClear() {
        emits('update:modelValue', '');
        emits('change', '');
    }

    function handleChange(selectedList) {
        const name = selectedList.map(item => item.name)
        users.value = name.toString()
        updateSepTextField(users.value)
        const userIds = selectedList.map(item => item.id)
        emits('update:modelValue', userIds.toString());
        emits('change', userIds.toString());
    }

    function updateSepTextField(v) {
        if (!props.sepTextField || !props.row) {
            return;
        }
        props.row[camelCaseString(props.sepTextField)] = v;
    }
</script>
