/**
 * 登录页面
 */
const authService = require('../../services/user')
const storage = require('../../utils/storage')
const auth = require('../../utils/auth')

Page({
  data: {
    redirect: '',
    isLoading: false
  },

  onLoad(options) {
    if (options.redirect) {
      this.setData({
        redirect: decodeURIComponent(options.redirect)
      })
    }
  },

  async onLogin() {
    if (this.data.isLoading) return
    
    this.setData({ isLoading: true })
    
    try {
      const result = await authService.login()
      auth.updateUserInfo(result.userInfo || {})
      
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      setTimeout(() => {
        if (this.data.redirect) {
          wx.redirectTo({ url: this.data.redirect })
        } else {
          wx.switchTab({ url: '/pages/index/index' })
        }
      }, 1000)
    } catch (err) {
      wx.showToast({
        title: err.message || '登录失败',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  }
})