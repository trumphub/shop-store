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
 * 模板列表
 * @returns 
 */
export function deliveryList() {
    return request({
        url: '/setting.delivery/all',
        method: 'get'
    })
}

/**
 * 服务与承诺列表
 * @returns 
 */
export function serviceList() {
    return request({
        url: '/goods.service/all',
        method: 'get'
    })
}

/**
 * 会员等级列表
 * @param {*} params 
 * @returns 
 */
export function gradeList(params) {
    return request({
        url: '/user.grade/all',
        method: 'get',
        params
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

/**
 * 添加商品
 * @param {*} data 
 * @returns 
 */
export function addGood(data) {
    return request({
        url: '/goods/add',
        method: 'post',
        data
    })
}

/**
 * 删除商品
 * @param {*} data 
 * @returns 
 */
export function deleteGoods(data) {
    return request({
        url: '/goods/delete',
        method: 'post',
        data
    })
}

/**
 * 更新状态
 * @param {*} data 
 * @returns 
 */
export function updateStatus(data) {
    return request({
        url: '/goods/state',
        method: 'post',
        data
    })
}

/**
 * 获取单个商品
 * @param {*} params 
 * @returns 
 */
export function getGoodsById(params) {
    return request({
        url: '/goods/detail',
        method: 'get',
        params
    })
}

/**
 * 更新商品
 * @param {*} data 
 * @returns 
 */
export function updateGoods(data) {
    return request({
        url: '/goods/edit',
        method: 'post',
        data
    })
}

/**
 * 添加分类
 * @param {*} data 
 * @returns 
 */
export function addCategory(data) {
    return request({
        url: '/category/add',
        method: 'post',
        data
    })
}

/**
 * 编辑分类
 * @param {*} data 
 * @returns 
 */
export function editCategory(data) {
    return request({
        url: '/category/edit',
        method: 'post',
        data
    })
}

/**
 * 删除分类
 * @param {*} data 
 * @returns 
 */
export function deleteCategory(data) {
    return request({
        url: '/category/delete',
        method: 'post',
        data
    })
}

/**
 * 服务与承诺列表
 * @returns 
 */
export function serviceListPage(params) {
    return request({
        url: '/goods.service/list',
        method: 'get',
        params
    })
}

/**
 * 添加服务
 * @param {*} data 
 * @returns 
 */
export function addService(data) {
    return request({
        url: '/goods.service/add',
        method: 'post',
        data
    })
}

/**
 * 编辑服务
 * @param {*} data 
 * @returns 
 */
export function editService(data) {
    return request({
        url: '/goods.service/edit',
        method: 'post',
        data
    })
}

export function deleteService(data) {
    return request({
        url: '/goods.service/delete',
        method: 'post',
        data
    })
}
