import request from '@/utils/request'

/**
 * 获取订单列表
 * @param {*} params 
 * @returns 
 */
export function getOrderList(params) {
    return request({
        url: '/order/list',
        method: 'get',
        params
    })
}

/**
 * 订单详情
 * @param {*} params 
 * @returns 
 */
export function getDetail(params) {
    return request({
        url: '/order/detail',
        method: 'get',
        params
    })
}

/**
 * 取消订单
 * @param {*} data 
 * @returns 
 */
export function orderCancel(data) {
    return request({
        url: '/order.event/confirmCancel',
        method: 'post',
        data
    })
}

/**
 * 所有物流公司
 * @returns 
 */
export function getAllExpress() {
    return request({
        url: '/setting.express/all',
        method: 'get'
    })
}

/**
 * 发货
 * @param {*} data {orderId: 11, form: {express_id: 10007, express_no: "111"}}
 * @returns 
 */
export function orderDelivery(data) {
    return request({
        url: '/order.event/delivery',
        method: 'post',
        data
    })
}

/**
 * 删除订单
 * @param {*} data 
 * @returns 
 */
export function deleteOrder(data) {
    return request({
        url: '/order.event/delete',
        method: 'post',
        data
    })
}
