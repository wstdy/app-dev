// 开发环境配置
const config = {
	// baseUrl: 'http://192.168.0.72:8080',
	baseUrl: 'http://10.180.7.118:8180',
	version: 1, 
	TENANT_ENABLED: false, // 租户开关
}
if (process.env.NODE_ENV === 'development') {
	config.baseUrl = 'http://10.180.7.118:8180';
} else {
	config.baseUrl = 'http://10.180.7.118:8180';
}
export default config;