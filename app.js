/**
 * 开店喵 - 应用入口
 */

const { API_PATHS, ERROR_CODES } = require('./utils/constants')

App({
  onLaunch() {
    // 初始化
    console.log('[App] 开店喵小程序启动')
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 检查 Token 有效性
    this.validateToken()
    
    // 检查更新
    this.checkUpdate()
  },

  onShow() {
    // 小程序显示
  },

  onHide() {
    // 小程序隐藏
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    this.globalData.isLoggedIn = !!token
    this.globalData.token = token
    this.globalData.userInfo = userInfo || null
  },

  /**
   * 验证 Token 是否有效
   * 通过调用 /api/user/me 接口来验证
   */
  async validateToken() {
    const token = wx.getStorageSync('token')
    
    if (!token) {
      console.log('[App] 无 Token，跳过验证')
      return
    }

    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${this.globalData.apiBaseUrl}${API_PATHS.USER_ME}`,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          success: resolve,
          fail: reject
        })
      })

      const { statusCode, data } = res

      if (statusCode === 200 && data.code === ERROR_CODES.SUCCESS) {
        // Token 有效，更新用户信息
        console.log('[App] Token 有效')
        this.globalData.userInfo = data.data
        wx.setStorageSync('userInfo', data.data)
      } else if (data?.code === ERROR_CODES.TOKEN_EXPIRED || statusCode === 401) {
        // Token 过期或无效，清除登录态
        console.log('[App] Token 已过期，清除登录态')
        this.clearLoginStatus()
      }
    } catch (err) {
      console.error('[App] Token 验证失败:', err)
      // 网络错误等，不清除登录态，让用户继续使用
    }
  },

  /**
   * 检查小程序更新
   */
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('[App] 检测到新版本')
        }
      })
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      
      updateManager.onUpdateFailed(() => {
        wx.showToast({
          title: '更新失败，请重试',
          icon: 'none'
        })
      })
    }
  },

  /**
   * 设置登录状态
   */
  setLoginStatus(token, userInfo) {
    this.globalData.isLoggedIn = true
    this.globalData.token = token
    this.globalData.userInfo = userInfo
    
    wx.setStorageSync('token', token)
    wx.setStorageSync('userInfo', userInfo)
  },

  /**
   * 清除登录状态
   */
  clearLoginStatus() {
    this.globalData.isLoggedIn = false
    this.globalData.token = null
    this.globalData.userInfo = null
    
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
  },

  globalData: {
    isLoggedIn: false,
    token: null,
    userInfo: null,
    systemInfo: null,
    apiBaseUrl: 'http://localhost:8080'
  }
})