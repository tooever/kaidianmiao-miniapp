/**
 * 个人中心页面
 */
const auth = require('../../utils/auth')

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    menuItems: [
      { icon: '📋', title: '我的报告', path: '/pages/report-list/report-list', action: 'navigate' },
      { icon: '💰', title: '消费记录', path: '', action: 'coming' },
      { icon: '📞', title: '联系客服', path: '', action: 'contact' },
      { icon: '❓', title: '常见问题', path: '', action: 'coming' },
      { icon: '⚙️', title: '设置', path: '', action: 'coming' }
    ]
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const app = getApp()
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      userInfo: app.globalData.userInfo
    })
  },

  onLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  onMenuTap(e) {
    const { item } = e.currentTarget.dataset
    
    switch (item.action) {
      case 'navigate':
        wx.navigateTo({ url: item.path })
        break
      case 'contact':
        wx.makePhoneCall({
          phoneNumber: '400-123-4567'
        })
        break
      case 'coming':
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        })
        break
    }
  },

  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          getApp().clearLoginStatus()
          this.checkLoginStatus()
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          })
        }
      }
    })
  }
})