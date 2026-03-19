/**
 * 报告列表页面
 * 功能：展示用户的历史评估报告列表
 * API: GET /api/user/reports
 */

const userService = require('../../services/user')
const { safeListData } = require('../../utils/apiHelper')

Page({
  data: {
    reports: [],
    isLoading: true,
    isRefreshing: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.loadReports()
  },

  onShow() {
    // 每次显示页面时刷新数据（可能有新报告）
    if (this.data.reports.length > 0) {
      this.onRefresh()
    }
  },

  /**
   * 加载报告列表
   * API: GET /api/user/reports
   */
  async loadReports(append = false) {
    if (!append) {
      this.setData({ isLoading: true })
    }

    try {
      const result = await userService.getUserReports({
        page: this.data.page,
        pageSize: this.data.pageSize
      })

      // 使用 safeListData() 处理返回数据
      const reports = safeListData(result)
      const total = result?.total ?? result?.data?.total ?? reports.length

      // 格式化报告数据
      const formattedReports = reports.map(item => this.formatReport(item))

      this.setData({
        isLoading: false,
        isRefreshing: false,
        reports: append ? [...this.data.reports, ...formattedReports] : formattedReports,
        hasMore: this.data.page * this.data.pageSize < total
      })
    } catch (err) {
      console.error('[ReportList] 加载失败:', err)
      
      // 开发环境使用 mock 数据
      const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
      const isNetworkError = err.message?.includes('网络') || err.message?.includes('timeout')
      
      if (isDev || isNetworkError) {
        this.loadMockData()
        return
      }
      
      this.setData({
        isLoading: false,
        isRefreshing: false
      })
      
      wx.showToast({
        title: err.message || '加载失败，请重试',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 加载 Mock 数据（开发调试用）
   */
  loadMockData() {
    const mockReports = [
      {
        id: '1',
        areaName: '北京市朝阳区三里屯街道',
        shopType: '餐饮美食',
        score: 78,
        riskLevel: 'medium',
        createdAt: '2024-03-19 12:30'
      },
      {
        id: '2',
        areaName: '北京市海淀区中关村大街',
        shopType: '美容美发',
        score: 85,
        riskLevel: 'low',
        createdAt: '2024-03-18 15:20'
      },
      {
        id: '3',
        areaName: '北京市西城区西单商圈',
        shopType: '零售购物',
        score: 62,
        riskLevel: 'high',
        createdAt: '2024-03-17 09:45'
      }
    ]

    this.setData({
      isLoading: false,
      isRefreshing: false,
      reports: mockReports.map(item => this.formatReport(item)),
      hasMore: false
    })
  },

  /**
   * 格式化报告数据
   * 兼容后端返回的各种字段名
   */
  formatReport(item) {
    // 兼容不同的字段名
    const id = item.id ?? item.taskId ?? item.reportId
    const areaName = item.areaName ?? item.area ?? item.location ?? '未知区域'
    const shopType = item.shopType ?? item.category ?? item.type ?? '未分类'
    const score = item.score ?? item.totalScore ?? 0
    const riskLevel = item.riskLevel ?? 'medium'
    const createdAt = item.createdAt ?? item.createTime ?? item.created_at ?? new Date().toISOString()
    
    // 计算风险等级文字和颜色
    const riskConfig = this.getRiskConfig(riskLevel, score)
    
    return {
      ...item,
      id,
      areaName,
      shopType,
      score,
      riskLevel,
      riskText: riskConfig.text,
      riskColor: riskConfig.color,
      scoreColor: this.getScoreColor(score),
      displayDate: this.formatDate(createdAt)
    }
  },

  /**
   * 获取风险配置
   */
  getRiskConfig(level, score) {
    if (level === 'low' || score >= 80) {
      return { text: '低风险', color: '#10B981' }
    }
    if (level === 'high' || score < 60) {
      return { text: '高风险', color: '#EF4444' }
    }
    return { text: '中等风险', color: '#F59E0B' }
  },

  /**
   * 获取分数颜色
   */
  getScoreColor(score) {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#3B82F6'
    if (score >= 40) return '#F59E0B'
    return '#EF4444'
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  },

  /**
   * 查看报告详情
   */
  onViewReport(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/report/report?taskId=${id}`
    })
  },

  /**
   * 下拉刷新
   */
  async onRefresh() {
    this.setData({ isRefreshing: true, page: 1, hasMore: true })
    await this.loadReports()
  },

  /**
   * 页面上拉触底
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.setData({ page: this.data.page + 1 })
      this.loadReports(true)
    }
  },

  /**
   * 去评估
   */
  onGoAssess() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 分享
   */
  onShareAppMessage() {
    return {
      title: '我的开店选址评估报告',
      path: '/pages/index/index'
    }
  }
})