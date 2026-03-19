/**
 * 开店喵 - 订单/支付相关API
 */

const { get, post } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 创建订单
 * @param {Object} data 订单数据
 */
function createOrder(data) {
  return post(API_PATHS.CREATE_ORDER, data)
}

/**
 * 获取订单详情
 * @param {string} orderId 订单ID
 */
function getOrderDetail(orderId) {
  return get(`${API_PATHS.ORDER_DETAIL}/${orderId}`)
}

/**
 * 确认支付（核销码核销）
 * @param {string} orderId 订单ID
 */
function confirmPaid(orderId) {
  return post(`${API_PATHS.CONFIRM_PAID}/${orderId}/confirm-paid`)
}

/**
 * 获取用户订单列表
 * @param {Object} params 分页参数
 */
function getUserOrders(params = {}) {
  return get(API_PATHS.USER_ORDERS, params)
}

module.exports = {
  createOrder,
  getOrderDetail,
  confirmPaid,
  getUserOrders
}