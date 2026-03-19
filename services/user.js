/**
 * 开店喵 - 用户相关API
 */

const { post, get } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 微信登录
 * @param {string} code 微信登录code
 */
function login(code) {
  return post(API_PATHS.LOGIN, { code }, { needToken: false })
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return get(API_PATHS.GET_USER_INFO)
}

/**
 * 更新用户信息
 * @param {Object} data 用户信息
 */
function updateUserInfo(data) {
  return post(API_PATHS.UPDATE_USER_INFO, data)
}

/**
 * 登出
 */
function logout() {
  return post(API_PATHS.LOGOUT)
}

module.exports = {
  login,
  getUserInfo,
  updateUserInfo,
  logout
}