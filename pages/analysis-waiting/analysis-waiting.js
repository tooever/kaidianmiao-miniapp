/**
 * 分析等待页面
 */
const taskService = require('../../services/assessment')

Page({
  data: {
    taskId: '',
    progress: 0,
    statusText: '正在分析选址数据...'
  },

  onLoad(options) {
    if (options.taskId) {
      this.setData({ taskId: options.taskId })
    }
    this.startPolling()
  },

  onUnload() {
    this.stopPolling()
  },

  startPolling() {
    // 模拟进度动画
    this.progressTimer = setInterval(() => {
      let progress = this.data.progress + Math.random() * 10
      if (progress > 95) progress = 95 // 停在95%等待真实完成
      this.updateProgress(progress)
    }, 500)
    
    // 轮询任务状态
    this.pollStatus()
  },

  stopPolling() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer)
      this.progressTimer = null
    }
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
      this.pollTimer = null
    }
  },

  async pollStatus() {
    try {
      const result = await taskService.getTaskStatus(this.data.taskId)
      
      if (result.status === 'completed') {
        this.stopPolling()
        this.updateProgress(100)
        
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/report/report?taskId=${this.data.taskId}`
          })
        }, 500)
      } else if (result.status === 'failed') {
        this.stopPolling()
        wx.showModal({
          title: '分析失败',
          content: result.error || '分析过程中出现错误，请重试',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
      } else {
        // 继续轮询
        this.pollTimer = setTimeout(() => {
          this.pollStatus()
        }, 2000)
      }
    } catch (err) {
      console.error('[Analysis] 状态查询失败:', err)
      // 继续轮询
      this.pollTimer = setTimeout(() => {
        this.pollStatus()
      }, 3000)
    }
  },

  updateProgress(progress) {
    const statusTexts = [
      '正在分析选址数据...',
      '正在评估商圈潜力...',
      '正在计算客流量...',
      '正在生成评估报告...',
      '即将完成...'
    ]
    const statusIndex = Math.min(Math.floor(progress / 25), 4)
    
    this.setData({ 
      progress: Math.min(progress, 100),
      statusText: statusTexts[statusIndex]
    })
  }
})