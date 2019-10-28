import * as ax from '@/libs/http'

export const projectUrl = 'http://localhost:3333'

export const getProjects = (params) => {
  return ax.g(projectUrl + '/project', params)
}
