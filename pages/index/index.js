/**
 * 开店喵 - 首页
 */
const { COLORS, PRICES } = require('../../utils/constants')

Page({
  data: {
    slogan: '开店前，先评估',
    features: [
      {
        icon: '/assets/icons/analysis.png',
        title: '智能分析',
        desc: '多维度数据分析'
      },
      {
        icon: '/assets/icons/evaluate.png',
        title: '专业评估',
        desc: 'AI智能评分系统'
      },
      {
        icon: '/assets/icons/suggest.png',
        title: '省心建议',
        desc: '决策参考建议'
      }
    ],
    price: PRICES.SINGLE_ASSESSMENT,
    isLoading: false
  },

  onLoad() {
    // 页面加载
    console.log('[Index] 首页加载')
    this.initPage()
  },

  onShow() {
    // 页面显示
    this.checkLoginStatus()
  },

  /**
   * 初始化页面
   */
  initPage() {
    // 可以在这里加载一些初始化数据
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const app = getApp()
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn
    })
  },

  /**
   * 开始评估按钮点击
   */
  onStartAssessment() {
    const app = getApp()
    
    // 检查登录状态
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再进行评估',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?redirect=/pages/form/form'
            })
          }
        }
      })
      return
    }

    // 已登录，跳转到表单页
    wx.navigateTo({
      url: '/pages/form/form'
    })
  },

  /**
   * 查看历史报告
   */
  onViewHistory() {
    const app = getApp()
    
    if (!app.globalData.isLoggedIn) {
      wx.showModal({
        title: '提示',
        content: '请先登录后查看历史报告',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?redirect=/pages/report-list/report-list'
            })
          }
        }
      })
      return
    }

    wx.navigateTo({
      url: '/pages/report-list/report-list'
    })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 刷新数据
    this.checkLoginStatus()
    wx.stopPullDownRefresh()
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '开店喵 - 开店选址智能评估',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share.png'
    }
  }
})