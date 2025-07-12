<template>
  <canvas :canvas-id="codekey" :style="{width: size * 2 +'rpx', height: size * 2 + 'rpx'}"></canvas>
</template>

<script>
import UQRCode from "./qrcode";
var qr = new UQRCode();
export default {
  name: "QRcode",
  props: { 
		codekey: {
			type: String,
			default: ''
		},  
    size: {
        type: Number,
        default: 200
    },
  },
  components: {},
  data() {
    return { 
		};
  },
  methods: {
    createCode(va) {
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = va;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = this.size;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext(this.codekey, this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas();
    },
  },
  mounted() {
		  
  },
  watch: {},
  computed: {},
  filters: {},
};
</script>

<style scoped lang='scss'>
</style>