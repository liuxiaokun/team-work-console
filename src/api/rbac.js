import * as ax from '@/libs/http'

export const rbacUrl = 'http://192.168.2.246:3333'

export const getOrgTree = (params) => {
  return ax.g(rbacUrl + '/org/tree', params)
}

export const getUser = (params) => {
  return ax.g(rbacUrl + '/user', params)
}
