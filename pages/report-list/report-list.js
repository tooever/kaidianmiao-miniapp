/**
 * 报告列表页面
 */
Page({
  data: {
    reports: [],
    isLoading: true,
    hasMore: true,
    page: 1
  },

  onLoad() {
    this.loadReports()
  },

  async loadReports() {
    // 模拟数据
    this.setData({
      isLoading: false,
      reports: [
        {
          id: '1',
          shopName: '小王烧烤店',
          shopType: '餐饮美食',
          address: '北京市朝阳区xxx街道',
          score: 78,
          level: '良好',
          createdAt: '2024-03-19 12:30'
        },
        {
          id: '2',
          shopName: '美甲小屋',
          shopType: '美容美发',
          address: '北京市海淀区xxx路',
          score: 85,
          level: '优秀',
          createdAt: '2024-03-18 15:20'
        },
        {
          id: '3',
          shopName: '便利店',
          shopType: '零售购物',
          address: '北京市西城区xxx街',
          score: 62,
          level: '一般',
          createdAt: '2024-03-17 09:45'
        }
      ]
    })
  },

  onViewReport(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/report/report?id=${id}`
    })
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    this.loadReports().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.loadReports()
    }
  }
})