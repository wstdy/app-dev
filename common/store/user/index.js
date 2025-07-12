import {
	defineStore
} from 'pinia';
import {
	getUserInfo,
	loginApi,
	singleLoginApi,
	loginPhoneApi,
	doLogout
} from '../../api/login';
import {
	ROLES_KEY,
	TOKEN_KEY,
	USER_INFO_KEY
} from '../../const/cache';
import {
	usePermissionStore
} from '../permission/permission';

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			// user info
			userInfo: null,
			// token
			token: undefined,
			// roleList
			roleList: [],
		};
	},
	getters: {
		getUserInfo() {
			return this.userInfo || uni.getStorageSync(USER_INFO_KEY) || {};
		},
		getToken() {
			return this.token || uni.getStorageSync(TOKEN_KEY);
		},
		getRoleList() {
			return this.roleList || uni.getStorageSync(ROLES_KEY);
		},

	},
	actions: {
		setToken(info) {
			this.token = info ? info : '';
			uni.setStorageSync(TOKEN_KEY, this.token)
		},
		setUserInfo(info) {
			this.userInfo = info;
			uni.setStorageSync(USER_INFO_KEY, this.userInfo)
		},
		setRoleList(info) {
			this.roleList = info;
			uni.setStorageSync(ROLES_KEY, this.roleList)
		},
		/**
		 * @description: login
		 */
		async login(params) {
			const res = await loginApi(params);

			//存储token
			this.setToken(res.data.token);

			await this.afterLoginAction();

			uni.showToast({
				title: '登录成功！',
				icon: 'none'
			});
			uni.reLaunch({
				url: "../home/home"
			})
		},
		/**
		 * @description: login
		 */
		async singleLogin(params) {
			const res = await singleLoginApi(params);

			//存储token
			this.setToken(res.data.token);

			await this.afterLoginAction();
			
			// 直接拼url和redirect2接口给的参数有区别
			uni.reLaunch({
				url: params?.targetURL || params?.redirect || "../home/home"
			})
		},
		/**
		 * @description: login
		 */
		async phoneLogin(params) {
			const res = await loginPhoneApi(params);

			//存储token
			this.setToken(res.data.token);

			await this.afterLoginAction();

			uni.showToast({
				title: '登录成功！',
				icon: 'none'
			});
			uni.reLaunch({
				url: "../home/home"
			})
		},
		/**
		 * @description: login登陆后的操作
		 */
		async afterLoginAction() {
			if (!this.getToken) return null;

			// get user info
			const userInfo = await this.getUserInfoAction();

			const permissionStore = usePermissionStore();
			await permissionStore.changePermissionCode();


		},
		async getUserInfoAction() {
			if (!this.getToken) return null;
			const userInfoResult = await getUserInfo();

			const {
				roles = [],
					data,
			} = userInfoResult;

			this.setUserInfo(data);
			this.setRoleList(roles);
			return Promise.resolve(data);
		},
		async logout() {
      if (this.getToken) {
        try {
          await doLogout();
					uni.showToast({
						title: '退出登录成功！',
						icon: 'none'
					});
					uni.reLaunch({
						url: "../login/login"
					})
					this.setToken('');
        } catch {
          console.log('注销Token失败');
        }
      }
    },

	}
});