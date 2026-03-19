/**
 * 个人中心页面
 * 功能：用户信息展示、菜单导航、退出登录
 */

const auth = require('../../utils/auth')
const userService = require('../../services/user')

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    reportCount: 0,  // 报告数量
    menuItems: [
      { icon: '📋', title: '我的报告', path: '/pages/report-list/report-list', action: 'navigate', showCount: true },
      { icon: '💰', title: '历史订单', path: '/pages/report-list/report-list?tab=orders', action: 'navigate' },
      { icon: '📞', title: '联系客服', action: 'contact' },
      { icon: 'ℹ️', title: '关于我们', action: 'about' }
    ]
  },

  onShow() {
    this.checkLoginStatus()
    if (this.data.isLoggedIn) {
      this.loadUserInfo()
    }
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const app = getApp()
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      userInfo: app.globalData.userInfo
    })
  },

  /**
   * 加载用户信息
   */
  async loadUserInfo() {
    try {
      const userInfo = await userService.getUserInfo()
      const app = getApp()
      
      // 更新全局数据和本地存储
      app.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      
      this.setData({ userInfo })
      
      // 同时获取报告数量
      this.loadReportCount()
    } catch (err) {
      console.error('[Profile] 获取用户信息失败:', err)
      // 如果是 401 错误，说明 token 失效
      if (err.message && err.message.includes('登录')) {
        this.handleTokenExpired()
      }
    }
  },

  /**
   * 加载报告数量
   */
  async loadReportCount() {
    try {
      const result = await userService.getUserReports({ page: 1, pageSize: 1 })
      // 兼容不同的返回格式
      const count = result?.total || result?.length || 0
      this.setData({ reportCount: count })
    } catch (err) {
      console.error('[Profile] 获取报告数量失败:', err)
    }
  },

  /**
   * 处理 Token 过期
   */
  handleTokenExpired() {
    const app = getApp()
    app.clearLoginStatus()
    this.setData({
      isLoggedIn: false,
      userInfo: null,
      reportCount: 0
    })
  },

  /**
   * 点击登录
   */
  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 菜单点击
   */
  onMenuTap(e) {
    const { item } = e.currentTarget.dataset
    
    switch (item.action) {
      case 'navigate':
        wx.navigateTo({ url: item.path })
        break
      case 'contact':
        this.showContactOptions()
        break
      case 'about':
        this.showAbout()
        break
    }
  },

  /**
   * 显示联系客服选项
   */
  showContactOptions() {
    wx.showActionSheet({
      itemList: ['拨打电话：400-123-4567', '添加微信客服'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.makePhoneCall({
              phoneNumber: '4001234567',
              fail: () => {
                wx.showToast({ title: '拨打电话失败', icon: 'none' })
              }
            })
            break
          case 1:
            wx.setClipboardData({
              data: 'kaidianmiao_service',
              success: () => {
                wx.showToast({ title: '微信号已复制', icon: 'success' })
              }
            })
            break
        }
      }
    })
  },

  /**
   * 显示关于我们
   */
  showAbout() {
    wx.showModal({
      title: '关于开店喵',
      content: '开店喵是一款专业的开店选址评估工具，基于大数据分析，帮助创业者科学评估选址风险，做出更明智的开店决策。\n\n版本：1.0.0\n© 2024 开店喵团队',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          const app = getApp()
          app.clearLoginStatus()
          this.setData({
            isLoggedIn: false,
            userInfo: null,
            reportCount: 0
          })
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})