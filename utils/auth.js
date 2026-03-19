/**
 * 开店喵 - 登录态管理
 * 处理用户登录、登出、登录检查等
 */

const storage = require('./storage')
const request = require('./request')
const { API_PATHS } = require('./constants')

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  return !!storage.getToken()
}

/**
 * 获取登录Token
 */
function getToken() {
  return storage.getToken()
}

/**
 * 微信登录
 * 获取code后请求后端换取token
 */
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          // 请求后端接口获取token
          request.post(API_PATHS.LOGIN, {
            code: loginRes.code
          }, {
            needToken: false,
            showLoading: true,
            loadingText: '登录中...'
          })
          .then(data => {
            // 保存token和用户信息
            storage.setToken(data.token)
            if (data.userInfo) {
              storage.setUserInfo(data.userInfo)
            }
            resolve(data)
          })
          .catch(err => {
            console.error('[Auth] 登录失败:', err)
            reject(err)
          })
        } else {
          console.error('[Auth] wx.login失败:', loginRes.errMsg)
          reject(new Error('微信登录失败'))
        }
      },
      fail(err) {
        console.error('[Auth] wx.login调用失败:', err)
        reject(new Error('微信登录调用失败'))
      }
    })
  })
}

/**
 * 静默登录
 * 不弹窗提示，适用于自动检查登录态
 */
function silentLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(loginRes) {
        if (loginRes.code) {
          request.post(API_PATHS.LOGIN, {
            code: loginRes.code
          }, {
            needToken: false,
            showLoading: false
          })
          .then(data => {
            storage.setToken(data.token)
            if (data.userInfo) {
              storage.setUserInfo(data.userInfo)
            }
            resolve(data)
          })
          .catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('微信登录失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

/**
 * 登出
 * 清除本地登录态
 */
function logout() {
  storage.removeToken()
  storage.removeUserInfo()
  storage.clearAssessmentCache()
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return storage.getUserInfo()
}

/**
 * 更新用户信息
 */
function updateUserInfo(userInfo) {
  storage.setUserInfo(userInfo)
}

/**
 * 检查登录态并跳转
 * @param {Object} options 配置
 * @param {string} options.redirectUrl 登录后跳转地址
 * @param {boolean} options.showModal 未登录时是否弹窗提示
 */
function checkLogin(options = {}) {
  const { redirectUrl, showModal = true } = options
  
  if (isLoggedIn()) {
    return true
  }
  
  if (showModal) {
    wx.showModal({
      title: '提示',
      content: '请先登录后再继续操作',
      confirmText: '去登录',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/login/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`
          })
        }
      }
    })
  }
  
  return false
}

/**
 * 需要登录的页面装饰器
 * 用于页面onLoad生命周期
 */
function requireLogin(onLoad, redirectUrl) {
  return function(options) {
    if (!isLoggedIn()) {
      wx.navigateTo({
        url: `/pages/login/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`
      })
      return
    }
    if (onLoad) {
      onLoad.call(this, options)
    }
  }
}

module.exports = {
  isLoggedIn,
  getToken,
  login,
  silentLogin,
  logout,
  getUserInfo,
  updateUserInfo,
  checkLogin,
  requireLogin
}