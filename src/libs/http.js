import axios from 'axios'
import config from '@/config'
import qs from 'qs'
import iview from 'iview'
import { setToken, getToken } from '@/libs/util'

export const url = 'http://localhost:3333/'

if (getToken()) {
  axios.defaults.headers.common['Authorization'] = getToken()
}

let ax = axios.create({
  baseURL: url,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const itr = (type, url, params) => {
  if (typeof params !== 'object') {
    params = {}
  }
  let arg = qs.stringify(params, {
    allowDots: true
  })
  if (arg != null && arg !== '' && type === 'get') {
    if (url.indexOf('?') > 0) {
      url += '&'
    } else {
      url += '?'
    }
    url += arg
    arg = ''
    return ax[type](url, arg)
  }
  return ax[type](url, params)
}

export const g = (url, params) => {
  return base('get', url, params)
}

export const p = (url, params) => {
  return base('post', url, params)
}

export const d = (url, params) => {
  return base('delete', url, params)
}

export const u = (url, params) => {
  return base('put', url, params)
}
export const pa = (url, params) => {
  return base('patch', url, params)
}

export const op = (url, params) => {
  return base('options', url, params)
}

export const up = (url, data) => {
  let headers = {
    'Content-Type': 'multipart/form-data'
  }
  if (getToken()) {
    headers['Authorization'] = getToken()
  }
  let config = {
    headers
  }
  return new Promise((resolve, reject) => {
    let axs = axios.create(config)
    axs.post(url, data).then((response) => {
      if (response.headers['authorization']) {
        setToken(response.headers['authorization'])
      }
      if (response.data.success) {
        resolve(response)
      } else {
        if (response.data.code === 100403) {
          iview.Notice.error({
            title: '无权访问该数据',
            desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
          })
        } else if (response.data.code === 100500) {
          iview.Notice.error({
            title: '操作失败',
            desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
          })
        }
      }
    }).catch((thrown) => {
      if (thrown.response.status === 401) {
        // signin
        window.location.href = '/login'
      } else if (thrown.response.status === 403) {
        iview.Notice.error({
          title: '无权访问',
          desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
        })
      } else {
        iview.Notice.error({
          title: '操作失败',
          desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
        })
      }
      let spins = document.getElementsByClassName('ivu-spin')
      if (spins.length > 0) {
        for (let i = 0; i < spins.length; i++) {
          spins[i].style.display = 'none'
        }
      }
    })
  })
}

export function base (type, url, params) {
  let self = this
  return new Promise((resolve, reject) => {
    itr(type, url, params).then((response) => {
      if (response.headers['authorization']) {
        setToken(response.headers['authorization'])
      }
      if (response.data.code === 100200) {
        resolve(response)
      } else if (response.data.code === 100401) {
        iview.Notice.error({
          title: '用户名密码不匹配'
        })
      } else if (response.data.code === 100400) {
        iview.Notice.error({
          title: response.data.message,
          desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
        })
      } else if (response.data.code === 100403) {
        iview.Notice.error({
          title: '无权访问该数据',
          desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
        })
      }
    }).catch((thrown) => {
      if (thrown.response !== undefined) {
        if (thrown.response.status === 401) {
          // signin
          if (url.indexOf('/login') != -1) {
            iview.Notice.error({
              title: '用户名或密码错误！'
            })
          } else {
            window.location.href = '/login'
          }
        } else if (thrown.response.status === 403) {
          iview.Notice.error({
            title: '无权访问',
            desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
          })
        } else {
          iview.Notice.error({
            title: '操作失败',
            desc: `<p><span style="color:#ff3300">请与系统管理员联系。</span></p>`
          })
        }
        let spins = document.getElementsByClassName('ivu-spin')
        if (spins.length > 0) {
          for (let i = 0; i < spins.length; i++) {
            spins[i].style.display = 'none'
          }
        }
      }
    })
  })
}
