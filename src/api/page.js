import request from "@/utils/request"

/**
 * 页面列表
 * @param {*} params 
 * @returns 
 */
export function reqPageList(params) {
    return request({
        url: '/page/list',
        method: 'get',
        params
    })
}

/**
 * 设置默认首页
 * @param {*} data 
 * @returns 
 */
export function setHome(data) {
    return request({
        url: '/page/setHome',
        method: 'post',
        data
    })
}

/**
 * 删除页面
 * @param {*} data 
 * @returns 
 */
export function deletePage(data) {
    return request({
        url: '/page/delete',
        method: 'post',
        data
    })
}
