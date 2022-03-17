import request from '@/utils/request'

/**
 * 商城信息
 * @returns 
 */
export function info() {
    return request({
        url: '/store/info',
        method: 'get',
    })
}

/**
 * 更新商城信息
 * @param {*} data 
 * @returns 
 */
export function update(data) {
    return request({
        url: '/store/update',
        method: 'post',
        data
    })
}
