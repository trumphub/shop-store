import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/passport/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/store.user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/passport/logout',
    method: 'post'
  })
}
