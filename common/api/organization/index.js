import {
  http
} from '@/common/request/index.js'; // 局部引入

const api = {
  OrganizationTree: '/organization/department/tree',
  OrganizationTrees: '/organization/department/trees',
  OrganizationInfo: '/organization/department/info',
  MultiInfo: '/organization/user/info/multi',
  UserPage: '/organization/user/page',
  UserList: '/organization/user/list',
  UserInfo: '/organization/user/info',
}

export const getOrganizationTree = (params) => {
  return http.get(api.OrganizationTree, {
    params
  })
}

// 查询部门树(新)
export const getOrganizationTrees = (params) => {
  return http.get(api.OrganizationTrees, {
    params
  })
}

export const getUserPage = (params) => {
  return http.get(api.UserPage, {
    params
  })
}
export const getUserMulti = (ids) => {
  return http.get(api.MultiInfo, {
    params:{
      ids
    }
  })
}

export const getAllUserList = () => {
  return http.get(api.UserList)
}

/**
 * 根据用户id 获取用户信息
 */
export const getUserInfoById = (id) => {
  return http.get(api.UserInfo, {
    params: {
      id
    }
  })
}

/**
 * 根据用户id 获取部门信息
 */
export const getOrganizationInfo = (id) => {
  return http.get(api.OrganizationInfo, {
    params: {
      id
    }
  })
}