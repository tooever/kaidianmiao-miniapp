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
 * 获取订单状态
 * @param {string} orderId 订单ID
 */
function getOrderStatus(orderId) {
  return get(`${API_PATHS.GET_ORDER_STATUS}/${orderId}`)
}

/**
 * 获取订单列表
 * @param {Object} params 分页参数
 */
function getOrderList(params = {}) {
  return get(API_PATHS.GET_ORDER_LIST, params)
}

module.exports = {
  createOrder,
  getOrderStatus,
  getOrderList
}