import {
	defineStore
} from 'pinia';
import {
	getPermCode
} from '../../api/login';
import {
	PERMISSION_KEY
} from '../../const/cache';
import {
	useUserStore
} from '../user';

export const usePermissionStore = defineStore('permission', {
	state: () => {
		return {
			permCodeList: [],
		};
	},
	getters: {
		getPermCodeList() {
			return this.permCodeList || uni.getStorageSync(PERMISSION_KEY);
		},
	},
	actions: {
		setPermCodeList(permList) {
			this.permCodeList = permList;
			uni.setStorageSync(PERMISSION_KEY, this.permCodeList)
		},
		async changePermissionCode() {
			const userStore = useUserStore();
			const userInfo = userStore.getUserInfo;

			const permResult = await getPermCode();
      const data = permResult.data
			userInfo.departmentId = data.departmentId;
			userInfo.departmentName = data.departmentName;
			userInfo.postId = data.postId;
			userInfo.postName = data.postName;
			userInfo.desktopSchema = data.desktopSchema;

			userStore.setUserInfo(userInfo);
			this.setPermCodeList(permResult.menuAuthList);
		},
	}
});