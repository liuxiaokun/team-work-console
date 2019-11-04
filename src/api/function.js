import * as ax from '@/libs/http'

export const url = 'http://192.168.2.246:3333'

export const getFunctions = (params) => {
  return ax.g(url + '/function', params)
}

export const getFunction = (params) => {
  return ax.g(url + '/function/' + params.id, params)
}

// 拿到需求节点变化数据
export const getFunctionStateHistory = (params) => {
  return ax.g(url + '/function/state/history', params)
}
