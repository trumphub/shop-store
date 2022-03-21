import request from '@/utils/request'

/**
 * 分类列表
 * @returns 
 */
export function categoryList() {
    return request({
        url: '/category/list',
        method: 'get',
    })
}

/**
 * 商品列表
 * @param {*} params 
 * @returns 
 */
export function goodsList(params) {
    return request({
        url: '/goods/list',
        method: 'get',
        params
    })
}
