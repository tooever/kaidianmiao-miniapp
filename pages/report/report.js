/**
 * 评估报告页面
 */
Page({
  data: {
    report: null,
    isLoading: true
  },

  onLoad(options) {
    const reportId = options.id
    // TODO: 加载报告数据
    this.loadReport(reportId)
  },

  async loadReport(reportId) {
    // 模拟数据
    this.setData({
      isLoading: false,
      report: {
        id: '1',
        shopName: '小王烧烤店',
        shopType: '餐饮美食',
        address: '北京市朝阳区xxx街道xxx号',
        score: 78,
        level: '良好',
        dimensions: [
          { name: '客流分析', score: 85, status: 'good' },
          { name: '竞争环境', score: 72, status: 'medium' },
          { name: '交通便利', score: 90, status: 'good' },
          { name: '消费潜力', score: 68, status: 'medium' },
          { name: '租金性价比', score: 75, status: 'good' }
        ],
        suggestions: [
          '该区域餐饮客流稳定，适合开设烧烤类店铺',
          '建议关注周边竞品店铺数量，适当差异化经营',
          '交通便利性较好，有利于吸引更多顾客',
          '消费潜力中等，建议合理定价'
        ],
        createdAt: '2024-03-19 12:30'
      }
    })
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    })
  },

  onShareAppMessage() {
    return {
      title: '我的开店选址评估报告',
      path: '/pages/index/index',
      imageUrl: '/assets/images/share.png'
    }
  }
})