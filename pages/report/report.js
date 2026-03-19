/**
 * 开店喵 - 评估报告详情页
 * 功能：展示完整评估报告、分享、保存图片、重新评估
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
    risksExpanded: false,
    scoreBgColor: '#3B82F6',
    riskLevelText: '中等风险',
    isSavingImage: false
  },

  onLoad(options) {
    const taskId = options.taskId
    if (taskId) {
      this.setData({ taskId })
      this.loadReport(taskId)
    } else {
      this.loadMockData()
    }
  },

  /**
   * 加载报告数据
   * API: GET /api/analysis-task/{id}/report
   * 响应字段: score, riskLevel, summary, dimensions[], suggestions[], risks[]
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
      
      // 开发环境使用 mock 数据
      const isDev = !taskId || taskId === 'mock'
      if (isDev) {
        console.log('[Report] 使用Mock数据')
        this.loadMockData()
        return
      }
      
      // 判断是否是网络错误
      const errorMsg = err.message || '加载报告失败，请稍后重试'
      const isNetworkError = errorMsg.includes('网络') || errorMsg.includes('timeout')
      
      this.setData({
        isLoading: false,
        hasError: true,
        errorMessage: isNetworkError ? '网络连接失败，请检查网络后重试' : errorMsg
      })
    }
  },

  /**
   * 加载Mock数据
   */
  loadMockData() {
    setTimeout(() => {
      this.processReport(mockReport)
    }, 500)
  },

  /**
   * 处理报告数据
   * 对齐后端响应字段: score, riskLevel, summary, dimensions[], suggestions[], risks[]
   */
  processReport(reportData) {
    // 安全提取字段，兼容各种返回格式
    const score = reportData.score ?? reportData.totalScore ?? 0
    const riskLevel = reportData.riskLevel ?? 'medium'
    const summary = reportData.summary ?? reportData.conclusion ?? ''
    
    const scoreColor = this.getScoreColor(score)
    const riskText = this.getRiskLevelText(riskLevel)

    // 处理维度数据 dimensions[]
    const dimensions = (reportData.dimensions || reportData.dimensionList || []).map(item => ({
      ...item,
      name: item.name ?? item.dimensionName ?? '',
      score: item.score ?? 0,
      analysis: item.analysis ?? item.desc ?? '',
      color: this.getScoreColor(item.score ?? 0)
    }))

    // 处理建议数据 suggestions[]
    const suggestions = (reportData.suggestions || reportData.suggestionList || []).map(item => ({
      ...item,
      content: item.content ?? item.suggestion ?? '',
      priority: item.priority ?? 1,
      icon: this.getPriorityIcon(item.priority ?? 1)
    }))

    // 处理风险数据 risks[]
    const risks = (reportData.risks || reportData.riskList || []).map(item => ({
      ...item,
      content: item.content ?? item.risk ?? '',
      level: item.level ?? 'medium',
      mitigation: item.mitigation ?? item.suggestion ?? '',
      levelText: this.getRiskItemText(item.level ?? 'medium')
    }))

    this.setData({
      isLoading: false,
      hasError: false,
      report: {
        ...reportData,
        score,
        riskLevel,
        summary,
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
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#3B82F6'
    if (score >= 40) return '#F59E0B'
    return '#EF4444'
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
   * 保存分享图片到相册
   */
  async onSaveImage() {
    if (this.data.isSavingImage) return

    const { report } = this.data
    if (!report) {
      wx.showToast({ title: '报告数据不存在', icon: 'none' })
      return
    }

    this.setData({ isSavingImage: true })

    try {
      // 检查相册权限
      const authRes = await wx.getSetting()
      if (!authRes.authSetting['scope.writePhotosAlbum']) {
        try {
          await wx.authorize({ scope: 'scope.writePhotosAlbum' })
        } catch (e) {
          // 用户拒绝授权，引导去设置页面
          wx.showModal({
            title: '需要相册权限',
            content: '保存图片需要您授权访问相册，是否前往设置？',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
          this.setData({ isSavingImage: false })
          return
        }
      }

      // 绘制分享卡片
      const tempFilePath = await this.drawShareCard()
      
      // 保存到相册
      await wx.saveImageToPhotosAlbum({ filePath: tempFilePath })
      
      wx.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (err) {
      console.error('[Report] 保存图片失败:', err)
      wx.showToast({ title: '保存失败，请重试', icon: 'none' })
    } finally {
      this.setData({ isSavingImage: false })
    }
  },

  /**
   * 绘制分享卡片
   * @returns {Promise<string>} 临时文件路径
   */
  drawShareCard() {
    return new Promise((resolve, reject) => {
      const { report } = this.data
      
      // Canvas 尺寸：375×500 (rpx 转换后约为 750×1000，这里用实际像素)
      const width = 375
      const height = 500
      const dpr = wx.getSystemInfoSync().pixelRatio || 2

      // 创建离屏 canvas
      const canvas = wx.createOffscreenCanvas({
        type: '2d',
        width: width * dpr,
        height: height * dpr
      })
      const ctx = canvas.getContext('2d')
      
      // 缩放以适应 DPR
      ctx.scale(dpr, dpr)

      // 绘制背景
      this.drawBackground(ctx, width, height)
      
      // 绘制品牌标题
      this.drawBrandTitle(ctx, width)
      
      // 绘制评分区域
      this.drawScoreSection(ctx, width, report)
      
      // 绘制区域信息
      this.drawAreaInfo(ctx, width, report)
      
      // 绘制核心建议
      this.drawSuggestions(ctx, width, report)
      
      // 绘制底部品牌语
      this.drawBrandSlogan(ctx, width, height)

      // 生成图片
      wx.canvasToTempFilePath({
        canvas: canvas,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
      })
    })
  },

  /**
   * 绘制背景
   */
  drawBackground(ctx, width, height) {
    // 渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#FFFFFF')
    gradient.addColorStop(1, '#FFF5F0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // 顶部品牌色条
    const topGradient = ctx.createLinearGradient(0, 0, width, 0)
    topGradient.addColorStop(0, '#FF6B35')
    topGradient.addColorStop(1, '#FFB347')
    ctx.fillStyle = topGradient
    ctx.fillRect(0, 0, width, 8)
  },

  /**
   * 绘制品牌标题
   */
  drawBrandTitle(ctx, width) {
    ctx.fillStyle = '#1A1A1A'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('开店喵 🐱', width / 2, 40)
    
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#999999'
    ctx.fillText('选址评估报告', width / 2, 58)
  },

  /**
   * 绘制评分区域
   */
  drawScoreSection(ctx, width, report) {
    const score = report.score || 0
    const riskText = this.getRiskLevelText(report.riskLevel)
    const scoreColor = this.getScoreColor(score)

    // 评分圆圈
    const centerX = width / 2
    const centerY = 110
    const radius = 45

    // 外圈
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = scoreColor
    ctx.lineWidth = 6
    ctx.stroke()

    // 分数
    ctx.fillStyle = scoreColor
    ctx.font = 'bold 32px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(score.toString(), centerX, centerY + 12)

    // 风险等级标签
    ctx.fillStyle = scoreColor
    ctx.font = '14px sans-serif'
    ctx.fillText(riskText, centerX, centerY + 40)
  },

  /**
   * 绘制区域信息
   */
  drawAreaInfo(ctx, width, report) {
    const areaName = report.areaName || report.summary || '选址评估'
    
    ctx.fillStyle = '#333333'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'left'
    
    // 截断过长的文本
    let displayText = areaName
    if (displayText.length > 30) {
      displayText = displayText.substring(0, 30) + '...'
    }
    
    // 文本换行处理
    const maxWidth = width - 40
    ctx.fillText(displayText.substring(0, 20), 20, 185)
    if (displayText.length > 20) {
      ctx.fillText(displayText.substring(20), 20, 205)
    }
  },

  /**
   * 绘制核心建议
   */
  drawSuggestions(ctx, width, report) {
    const suggestions = report.suggestions || []
    
    ctx.fillStyle = '#666666'
    ctx.font = '13px sans-serif'
    ctx.textAlign = 'left'

    // 最多显示2条建议
    const displaySuggestions = suggestions.slice(0, 2)
    
    displaySuggestions.forEach((item, index) => {
      const y = 250 + index * 50
      const text = item.content || item
      
      // 建议序号
      ctx.fillStyle = '#FF6B35'
      ctx.fillText(`${index + 1}.`, 20, y)
      
      // 建议内容（自动换行）
      ctx.fillStyle = '#333333'
      const shortText = text.length > 28 ? text.substring(0, 28) + '...' : text
      ctx.fillText(shortText.substring(0, 18), 40, y)
      if (shortText.length > 18) {
        ctx.fillText(shortText.substring(18), 40, y + 18)
      }
    })
  },

  /**
   * 绘制底部品牌语
   */
  drawBrandSlogan(ctx, width, height) {
    // 底部分割线
    ctx.strokeStyle = '#EEEEEE'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(20, height - 60)
    ctx.lineTo(width - 20, height - 60)
    ctx.stroke()

    // 品牌语
    ctx.fillStyle = '#FF6B35'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('开店前，先评估', width / 2, height - 30)

    // 小程序码提示
    ctx.fillStyle = '#999999'
    ctx.font = '10px sans-serif'
    ctx.fillText('扫码使用开店喵小程序', width / 2, height - 12)
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