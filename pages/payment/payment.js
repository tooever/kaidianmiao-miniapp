/**
 * 支付确认页
 * 展示收款二维码，用户扫码支付后手动确认
 * API: POST /api/order（创建订单）
 * API: POST /api/order/{id}/confirm-paid（确认支付）
 */
const { PRICES } = require('../../utils/constants')
const orderService = require('../../services/order')

Page({
  data: {
    orderId: '',
    taskId: '',
    productInfo: {
      name: '开店选址评估报告',
      price: PRICES.SINGLE_ASSESSMENT
    },
    orderNo: '',
    isSubmitting: false,
    isLoading: true,
    // 占位二维码图片 - 后续替换真实收款码
    qrCodeUrl: '/assets/images/placeholder-qrcode.svg'
  },

  onLoad(options) {
    // 接收从表单页传递的 taskId
    if (options.taskId) {
      this.setData({ taskId: options.taskId })
      this.createOrder()
    } else if (options.orderId) {
      this.setData({ 
        orderId: options.orderId,
        isLoading: false 
      })
    } else {
      // 缺少必要参数
      wx.showToast({
        title: '缺少任务信息',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1500)
    }
  },

  // 创建订单 POST /api/order
  async createOrder() {
    try {
      const result = await orderService.createOrder({
        taskId: this.data.taskId,
        productType: 'single_assessment',
        amount: this.data.productInfo.price
      })
      
      this.setData({
        orderId: result.orderId || result.id,
        orderNo: result.orderNo || this.generateOrderNo(),
        isLoading: false
      })
    } catch (err) {
      console.error('[Payment] 创建订单失败:', err)
      wx.showToast({
        title: err.message || '创建订单失败',
        icon: 'none',
        duration: 2000
      })
      // 使用本地生成的订单号作为备用
      this.setData({
        orderNo: this.generateOrderNo(),
        isLoading: false
      })
    }
  },

  // 生成订单号
  generateOrderNo() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `KDM${year}${month}${day}${random}`
  },

  // 预览二维码（长按或点击）
  onPreviewQrCode() {
    wx.previewImage({
      urls: [this.data.qrCodeUrl],
      current: this.data.qrCodeUrl
    })
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

  // 确认已支付 POST /api/order/{id}/confirm-paid
  async onConfirmPaid() {
    if (this.data.isSubmitting) return
    
    // 确保有订单ID
    if (!this.data.orderId) {
      wx.showToast({
        title: '订单信息不完整，请重试',
        icon: 'none'
      })
      return
    }
    
    wx.showModal({
      title: '确认支付',
      content: '请确认您已完成扫码支付，点击确定提交审核',
      confirmText: '已支付',
      confirmColor: '#FF6B35',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ isSubmitting: true })
          
          try {
            // 调用确认支付接口
            await orderService.confirmPaid(this.data.orderId)
            
            wx.showToast({
              title: '提交成功',
              icon: 'success'
            })
            
            // 跳转到支付审核页，传递 orderId 和 taskId
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/payment-pending/payment-pending?orderId=${this.data.orderId}&taskId=${this.data.taskId}`
              })
            }, 1000)
          } catch (err) {
            console.error('[Payment] 确认支付失败:', err)
            wx.showToast({
              title: err.message || '提交失败，请重试',
              icon: 'none',
              duration: 2000
            })
          } finally {
            this.setData({ isSubmitting: false })
          }
        }
      }
    })
  }
})