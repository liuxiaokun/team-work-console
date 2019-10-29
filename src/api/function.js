import * as ax from '@/libs/http'

export const url = 'http://localhost:3333'

export const getFunctions = (params) => {
  return ax.g(url + '/function', params)
}
