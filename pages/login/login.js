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
      // 获取微信登录 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        })
      })
      
      if (!loginRes.code) {
        throw new Error('微信登录失败')
      }
      
      // 调用后端登录接口
      const result = await authService.wechatLogin(loginRes.code)
      
      // 保存 token
      storage.setToken(result.token)
      
      // 保存用户信息
      if (result.userInfo) {
        storage.setUserInfo(result.userInfo)
      }
      
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
      console.error('[Login] 登录失败:', err)
      wx.showToast({
        title: err.message || '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  }
})