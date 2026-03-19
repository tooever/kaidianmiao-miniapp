/**
 * 开店喵 - 评估报告详情页
 * 功能：展示完整评估报告、分享、重新评估
 */

const taskService = require('../../services/assessment')

// Mock 数据 - 用于开发和调试
const mockReport = {
  score: 72,
  riskLevel: "medium",
  summary: "该区域竞争适中，有一定发展空间，但需注意差异化经营",
  dimensions: [
    { name: "竞争饱和度", score: 65, analysis: "周边500米内有8家同类餐饮店，竞争较为激烈，需寻找差异化定位" },
    { name: "客流潜力", score: 78, analysis: "该区域靠近商业中心，工作日午间客流量大，适合快餐类业态" },
    { name: "成本结构", score: 70, analysis: "该区域租金处于中等水平，人力成本可控，综合成本适中" },
    { name: "差异化空间", score: 75, analysis: "该品类在该区域尚未饱和，特色产品有机会脱颖而出" }
  ],
  suggestions: [
    { priority: 1, content: "建议选择靠近写字楼的位置，主攻工作日午餐时段" },
    { priority: 2, content: "避开与现有连锁品牌的正面竞争，主打差异化产品" },
    { priority: 3, content: "控制初期投入在预算的70%以内，预留运营周转资金" }
  ],
  risks: [
    { level: "high", content: "该区域租金有上涨趋势", mitigation: "建议签订长期租约锁定价格" },
    { level: "medium", content: "周边新商业体即将开业", mitigation: "关注新商业体的招商进展，调整营销策略" }
  ]
}

Page({
  data: {
    taskId: '',
    report: null,
    isLoading: true,
    hasError: false,
    errorMessage: '',
    risksExpanded: false,  // 风险清单默认折叠
    scoreBgColor: '#3B82F6',  // 评分背景色
    riskLevelText: '中等风险'  // 风险等级文字
  },

  onLoad(options) {
    const taskId = options.taskId
    if (taskId) {
      this.setData({ taskId })
      this.loadReport(taskId)
    } else {
      // 没有taskId时使用mock数据（开发调试）
      this.loadMockData()
    }
  },

  /**
   * 加载报告数据
   */
  async loadReport(taskId) {
    this.setData({
      isLoading: true,
      hasError: false
    })

    try {
      const reportData = await taskService.getTaskReport(taskId)
      this.processReport(reportData)
    } catch (err) {
      console.error('[Report] 加载报告失败:', err)
      
      // 开发模式：加载失败时使用mock数据
      const isDev = !taskId || taskId === 'mock'
      if (isDev) {
        console.log('[Report] 使用Mock数据')
        this.loadMockData()
        return
      }
      
      this.setData({
        isLoading: false,
        hasError: true,
        errorMessage: err.message || '加载报告失败，请稍后重试'
      })
    }
  },

  /**
   * 加载Mock数据（开发调试用）
   */
  loadMockData() {
    setTimeout(() => {
      this.processReport(mockReport)
    }, 500)  // 模拟网络延迟
  },

  /**
   * 处理报告数据
   */
  processReport(reportData) {
    // 计算评分颜色和等级
    const scoreColor = this.getScoreColor(reportData.score)
    const riskText = this.getRiskLevelText(reportData.riskLevel)

    // 处理维度数据 - 添加颜色
    const dimensions = (reportData.dimensions || []).map(item => ({
      ...item,
      color: this.getScoreColor(item.score)
    }))

    // 处理建议数据 - 添加图标
    const suggestions = (reportData.suggestions || []).map(item => ({
      ...item,
      icon: this.getPriorityIcon(item.priority)
    }))

    // 处理风险数据 - 添加文字
    const risks = (reportData.risks || []).map(item => ({
      ...item,
      levelText: this.getRiskItemText(item.level)
    }))

    this.setData({
      isLoading: false,
      hasError: false,
      report: {
        ...reportData,
        dimensions,
        suggestions,
        risks
      },
      scoreBgColor: scoreColor,
      riskLevelText: riskText
    })
  },

  /**
   * 根据分数获取颜色
   */
  getScoreColor(score) {
    if (score >= 80) return '#10B981'  // 绿色
    if (score >= 60) return '#3B82F6'  // 蓝色
    if (score >= 40) return '#F59E0B'  // 橙色
    return '#EF4444'  // 红色
  },

  /**
   * 获取风险等级文字
   */
  getRiskLevelText(level) {
    const map = {
      'low': '低风险',
      'medium': '中等风险',
      'high': '高风险'
    }
    return map[level] || '中等风险'
  },

  /**
   * 获取风险项文字
   */
  getRiskItemText(level) {
    const map = {
      'low': '低风险',
      'medium': '中风险',
      'high': '高风险'
    }
    return map[level] || '中风险'
  },

  /**
   * 获取优先级图标
   */
  getPriorityIcon(priority) {
    const map = {
      1: '🔥',
      2: '💡',
      3: '📌'
    }
    return map[priority] || '📌'
  },

  /**
   * 切换风险清单展开/折叠
   */
  toggleRisks() {
    this.setData({
      risksExpanded: !this.data.risksExpanded
    })
  },

  /**
   * 重新加载
   */
  onRetry() {
    if (this.data.taskId) {
      this.loadReport(this.data.taskId)
    } else {
      this.loadMockData()
    }
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    const { report } = this.data
    const score = report ? report.score : '--'
    return {
      title: `我的开店选址评估报告 - 综合评分${score}分`,
      path: '/pages/index/index',
      imageUrl: '/assets/images/share.png'
    }
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { report } = this.data
    const score = report ? report.score : '--'
    return {
      title: `开店选址评估报告 - 综合评分${score}分`,
      query: '',
      imageUrl: '/assets/images/share.png'
    }
  },

  /**
   * 重新评估 - 跳转到表单页
   */
  onReassess() {
    wx.navigateTo({
      url: '/pages/form/form'
    })
  }
})