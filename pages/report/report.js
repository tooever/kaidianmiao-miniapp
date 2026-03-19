/**
 * 评估报告页面
 */
const taskService = require('../../services/assessment')

Page({
  data: {
    taskId: '',
    report: null,
    isLoading: true,
    scoreLevel: '' // low, medium, high
  },

  onLoad(options) {
    const taskId = options.taskId
    if (taskId) {
      this.setData({ taskId })
      this.loadReport(taskId)
    }
  },

  async loadReport(taskId) {
    try {
      const report = await taskService.getTaskReport(taskId)
      
      // 计算评分等级
      let scoreLevel = 'medium'
      if (report.score >= 80) {
        scoreLevel = 'high'
      } else if (report.score < 60) {
        scoreLevel = 'low'
      }
      
      this.setData({
        isLoading: false,
        report,
        scoreLevel
      })
    } catch (err) {
      console.error('[Report] 加载失败:', err)
      wx.showToast({
        title: '加载报告失败',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  onShareAppMessage() {
    const { report } = this.data
    return {
      title: `我的开店选址评估报告 - ${report?.area || '开店喵'}`,
      path: '/pages/index/index',
      imageUrl: '/assets/images/share.png'
    }
  },

  // 返回首页
  onBackHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 查看更多报告
  onViewMore() {
    wx.switchTab({
      url: '/pages/report-list/report-list'
    })
  }
})