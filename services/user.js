/**
 * 开店喵 - 用户相关API
 */

const { get, post } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 微信登录
 * POST /api/auth/wechat-login
 * @param {string} code 微信登录码
 */
function wechatLogin(code) {
  return post(API_PATHS.WECHAT_LOGIN, { code }, { needToken: false })
}

/**
 * 获取当前用户信息
 * GET /api/user/me
 */
function getUserInfo() {
  return get(API_PATHS.USER_ME)
}

/**
 * 获取用户报告列表
 * GET /api/user/reports
 * @param {Object} params 分页参数 { page, pageSize }
 */
function getUserReports(params = {}) {
  return get(API_PATHS.USER_REPORTS, params)
}

/**
 * 获取用户订单列表
 * GET /api/user/orders
 * @param {Object} params 分页参数
 */
function getUserOrders(params = {}) {
  return get(API_PATHS.USER_ORDERS, params)
}

module.exports = {
  wechatLogin,
  getUserInfo,
  getUserReports,
  getUserOrders
}