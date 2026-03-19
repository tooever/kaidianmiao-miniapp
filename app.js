/**
 * 开店喵 - 应用入口
 */

App({
  onLaunch() {
    // 初始化
    console.log('[App] 开店喵小程序启动')
    
    // 检查登录状态
    this.checkLoginStatus()
    
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
    systemInfo: null
  }
})