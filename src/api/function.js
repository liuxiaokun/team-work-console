import * as ax from '@/libs/http'
import { projectUrl } from './project'

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

export const createFunction = (params) => {
  return ax.p(projectUrl + '/function', params)
}

export const getFunctionState = (params) => {
  return ax.g(url + '/function/state', params)
}
