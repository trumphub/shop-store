import request from '@/utils/request'

/**
 * 角色列表
 * @param {*} params 
 * @returns 
 */
export function roleList(params) {
    return request({
        url: '/store.role/list',
        method: 'get',
        params
    })
}

/**
 * 管理员列表
 * @param {*} params 
 * @returns 
 */
export function userList(params) {
    return request({
        url: '/store.user/list',
        method: 'get',
        params
    })
}

/**
 * 删除管理员项
 * @param {*} data 
 * @returns 
 */
export function deleteUser(data) {
    return request({
        url: '/store.user/delete',
        method: 'post',
        data
    })
}

/**
 * 添加管理员项
 * @param {*} data 
 * @returns 
 */
export function addUser(data) {
    return request({
        url: '/store.user/add',
        method: 'post',
        data
    })
}

/**
 * 编辑管理员项
 * @param {*} data 
 * @returns 
 */
export function editUser(data) {
    return request({
        url: '/store.user/edit',
        method: 'post',
        data
    })
}
