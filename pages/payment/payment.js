/**
 * 支付页面
 */
const { PRICES } = require('../../utils/constants')

Page({
  data: {
    selectedPackage: 0,
    packages: [
      { count: 1, price: PRICES.SINGLE_ASSESSMENT, label: '单次评估' },
      { count: 3, price: PRICES.PACKAGE_3, label: '3次套餐', discount: true },
      { count: 10, price: PRICES.PACKAGE_10, label: '10次套餐', discount: true }
    ]
  },

  onSelectPackage(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ selectedPackage: index })
  },

  async onPay() {
    const pkg = this.data.packages[this.data.selectedPackage]
    
    try {
      wx.showLoading({ title: '发起支付...' })
      
      // TODO: 调用支付接口
      // const order = await orderService.createOrder({ packageId: pkg.count })
      // wx.requestPayment({
      //   ...order.payParams,
      //   success: () => {
      //     wx.redirectTo({ url: '/pages/analysis-waiting/analysis-waiting' })
      //   }
      // })
      
      // 模拟支付成功，跳转到分析等待页
      setTimeout(() => {
        wx.hideLoading()
        wx.redirectTo({ url: '/pages/analysis-waiting/analysis-waiting' })
      }, 1500)
      
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '支付失败',
        icon: 'none'
      })
    }
  }
})