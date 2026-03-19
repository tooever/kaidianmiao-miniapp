/**
 * 分析等待页面
 */
Page({
  data: {
    progress: 0,
    statusText: '正在分析选址数据...'
  },

  onLoad() {
    this.simulateProgress()
  },

  simulateProgress() {
    const interval = setInterval(() => {
      let progress = this.data.progress + Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/report/report'
          })
        }, 500)
      }
      
      this.setData({ progress: Math.min(progress, 100) })
      
      // 更新状态文字
      const statusTexts = [
        '正在分析选址数据...',
        '正在评估商圈潜力...',
        '正在计算客流量...',
        '正在生成评估报告...',
        '即将完成...'
      ]
      const statusIndex = Math.min(Math.floor(progress / 25), 4)
      this.setData({ statusText: statusTexts[statusIndex] })
    }, 300)
  },

  onUnload() {
    // 清理定时器
  }
})