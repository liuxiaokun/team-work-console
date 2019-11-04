import * as ax from '@/libs/http'

export const rbacUrl = 'http://192.168.2.246:3333'

export const getOrgTree = (params) => {
  return ax.g(rbacUrl + '/org/tree', params)
}

export const getUser = (params) => {
  return ax.g(rbacUrl + '/user', params)
}

// 查询指定组织id下的所有用户
export const getOrgUser = (params) => {
  return ax.g(rbacUrl + '/org/' + params.id + '/user', params)
}
