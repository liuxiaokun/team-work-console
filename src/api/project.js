import * as ax from '@/libs/http'

export const projectUrl = 'http://192.168.2.246:3333'

export const getProjects = (params) => {
  return ax.g(projectUrl + '/project', params)
}
