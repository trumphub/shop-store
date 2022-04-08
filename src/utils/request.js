import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Access-Token'] = getToken()
    }
    if (config.params) {
      let str = ''
      for (const key in config.params) {
        if (Object.hasOwnProperty.call(config.params, key)) {
          const val = config.params[key];
          if (val || val === 0) {
            if (Array.isArray(val)) {
              for (let i = 0; i < val.length; i++) {
                if (val[i] instanceof Date) {
                  str += `&${key}[]=${val[i].toJSON()}`
                } else {
                  str += `&${key}[]=${val[i]}`
                }
              }
            } else {
              str += `&${key}=${val}`
            }
          }
        }
      }
      config.url += str
      config.params = undefined
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.status === 401) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
