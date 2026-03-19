/**
 * 开店喵 - 用户相关API
 */

const { post, get } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 微信登录
 * @param {string} code 微信登录code
 */
function wechatLogin(code) {
  return post(API_PATHS.WECHAT_LOGIN, { code }, { needToken: false })
}

/**
 * 获取当前用户信息
 */
function getUserInfo() {
  return get(API_PATHS.USER_ME)
}

module.exports = {
  wechatLogin,
  getUserInfo
}