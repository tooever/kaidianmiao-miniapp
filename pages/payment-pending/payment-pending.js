/**
 * 支付审核中页
 * 显示支付审核状态，轮询订单状态
 */
const { STATUS } = require('../../utils/constants')
const orderService = require('../../services/order')

Page({
  data: {
    orderId: '',
    taskId: '',
    orderNo: '',
    submitTime: '',
    estimatedTime: '5-10分钟',
    // 审核状态
    status: 'pending', // pending, approved, rejected
    countdown: 600, // 10分钟倒计时
    pollInterval: 5000 // 轮询间隔 5秒
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({ orderId: options.orderId })
    }
    if (options.taskId) {
      this.setData({ taskId: options.taskId })
    }
    
    // 设置提交时间
    const now = new Date()
    const submitTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    
    this.setData({ 
      submitTime,
      orderNo: options.orderId || this.generateOrderNo()
    })
    
    // 开始轮询
    this.startPolling()
  },

  onUnload() {
    this.stopPolling()
  },

  generateOrderNo() {
    const now = new Date()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `KDM${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${random}`
  },

  startPolling() {
    // 立即检查一次
    this.checkOrderStatus()
    
    // 设置定时轮询
    this.pollTimer = setInterval(() => {
      this.checkOrderStatus()
    }, this.data.pollInterval)
  },

  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
  },

  async checkOrderStatus() {
    try {
      const result = await orderService.getOrderDetail(this.data.orderId)
      
      // 审核通过，跳转到分析等待页
      if (result.status === STATUS.ORDER_PAID || result.status === 'approved') {
        this.stopPolling()
        this.setData({ status: 'approved' })
        
        wx.showToast({
          title: '支付已确认',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.redirectTo({
            url: `/pages/analysis-waiting/analysis-waiting?taskId=${this.data.taskId || result.taskId}`
          })
        }, 1000)
      } 
      // 审核拒绝
      else if (result.status === 'rejected') {
        this.stopPolling()
        this.setData({ status: 'rejected' })
        
        wx.showModal({
          title: '审核未通过',
          content: result.reason || '支付信息核实失败，请联系客服处理',
          showCancel: false,
          confirmText: '联系客服',
          success: () => {
            this.onContactService()
          }
        })
      }
    } catch (err) {
      console.error('[PaymentPending] 查询订单状态失败:', err)
      // 不中断轮询，继续尝试
    }
  },

  // 联系客服
  onContactService() {
    wx.showModal({
      title: '联系客服',
      content: '请添加客服微信：kaidianmiao_service\n工作时间：9:00-21:00',
      confirmText: '复制微信号',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'kaidianmiao_service',
            success: () => {
              wx.showToast({ title: '已复制', icon: 'success' })
            }
          })
        }
      }
    })
  },

  // 返回首页
  onBackHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})