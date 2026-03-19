/**
 * 支付等待页面
 */
Page({
  data: {
    countdown: 300 // 5分钟倒计时
  },

  onLoad() {
    this.startCountdown()
  },

  startCountdown() {
    this.timer = setInterval(() => {
      const countdown = this.data.countdown - 1
      if (countdown <= 0) {
        clearInterval(this.timer)
        // 支付超时
        wx.showModal({
          title: '支付超时',
          content: '支付时间已过，请重新发起',
          showCancel: false,
          success: () => {
            wx.navigateBack()
          }
        })
        return
      }
      this.setData({ countdown })
    }, 1000)
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  formatTime(seconds) {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }
})