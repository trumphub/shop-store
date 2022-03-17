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
 * 菜单权限列表
 * @returns 
 */
export function menuList() {
    return request({
        url: '/store.menu/list',
        method: 'get'
    })
}

/**
 * 添加角色
 * @param {*} data 
 * @returns 
 */
export function addRole(data) {
    return request({
        url: '/store.role/add',
        method: 'post',
        data
    })
}

/**
 * 编辑角色
 * @param {*} data 
 * @returns 
 */
export function editRole(data) {
    return request({
        url: '/store.role/edit',
        method: 'post',
        data
    })
}

/**
 * 删除角色
 * @param {*} data 
 * @returns 
 */
export function deleteRole(data) {
    return request({
        url: '/store.role/delete',
        method: 'post',
        data
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
