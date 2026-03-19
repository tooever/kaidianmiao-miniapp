/**
 * 支付页面
 */
const { PRICES } = require('../../utils/constants')
const orderService = require('../../services/order')

Page({
  data: {
    taskId: '',
    selectedPackage: 0,
    packages: [
      { count: 1, price: PRICES.SINGLE_ASSESSMENT, label: '单次评估' },
      { count: 3, price: PRICES.PACKAGE_3, label: '3次套餐', discount: true },
      { count: 10, price: PRICES.PACKAGE_10, label: '10次套餐', discount: true }
    ],
    isPaying: false
  },

  onLoad(options) {
    if (options.taskId) {
      this.setData({ taskId: options.taskId })
    }
  },

  onSelectPackage(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedPackage: index })
  },

  async onPay() {
    if (this.data.isPaying) return
    
    const pkg = this.data.packages[this.data.selectedPackage]
    this.setData({ isPaying: true })
    
    try {
      // 创建订单
      const order = await orderService.createOrder({
        taskId: this.data.taskId,
        packageCount: pkg.count,
        amount: pkg.price
      })
      
      // 发起微信支付
      wx.requestPayment({
        ...order.payParams,
        success: () => {
          wx.redirectTo({ 
            url: `/pages/analysis-waiting/analysis-waiting?taskId=${this.data.taskId}` 
          })
        },
        fail: (err) => {
          if (err.errMsg.includes('cancel')) {
            wx.showToast({ title: '已取消支付', icon: 'none' })
          } else {
            wx.showToast({ title: '支付失败', icon: 'none' })
          }
        }
      })
    } catch (err) {
      wx.showToast({
        title: err.message || '发起支付失败',
        icon: 'none'
      })
    } finally {
      this.setData({ isPaying: false })
    }
  }
})