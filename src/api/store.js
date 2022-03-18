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

/**
 * 地址列表
 * @param {*} params 
 * @returns 
 */
export function addressList(params) {
    return request({
        url: '/store.address/list',
        method: 'get',
        params
    })
}

/**
 * 添加地址
 * @param {*} data 
 * @returns 
 */
export function addAddress(data) {
    return request({
        url: '/store.address/add',
        method: 'post',
        data
    })
}

/**
 * 编辑地址
 * @param {*} data 
 * @returns 
 */
export function editAddress(data) {
    return request({
        url: '/store.address/edit',
        method: 'post',
        data
    })
}

/**
 * 删除地址
 * @param {*} data 
 * @returns 
 */
export function deleteAddress(data) {
    return request({
        url: '/store.address/delete',
        method: 'post',
        data
    })
}

/**
 * 地区列表
 * @returns 
 */
export function regionTree() {
    return request({
        url: '/region/tree',
        method: 'get',
    })
}
