/**
 * 分析等待页
 * 4阶段进度展示，轮询任务状态
 */
const { STATUS } = require('../../utils/constants')
const taskService = require('../../services/assessment')

// 阶段配置
const STAGES = [
  {
    icon: '🔍',
    title: '正在分析区域数据...',
    desc: '分析商圈人流、消费水平',
    progress: 25
  },
  {
    icon: '📊',
    title: '评估竞争环境...',
    desc: '识别周边竞品分布情况',
    progress: 50
  },
  {
    icon: '📈',
    title: '计算开店成功率...',
    desc: '综合多维度数据建模',
    progress: 75
  },
  {
    icon: '💡',
    title: '生成个性化建议...',
    desc: '根据分析结果定制建议',
    progress: 100
  }
]

// 阶段时长（毫秒）
const STAGE_DURATION = 7500 // 每阶段约 7.5 秒
const POLL_INTERVAL = 3000  // 轮询间隔 3 秒
const TIMEOUT = 120000      // 超时时间 2 分钟

Page({
  data: {
    taskId: '',
    currentStage: 0,
    progress: 0,
    remainingTime: 30,
    
    // 当前阶段信息
    stageIcon: STAGES[0].icon,
    stageTitle: STAGES[0].title,
    stageDesc: STAGES[0].desc,
    
    // 状态
    isLoading: true,
    isTimeout: false,
    isCompleted: false,
    hasError: false,
    errorMessage: ''
  },

  onLoad(options) {
    if (options.taskId) {
      this.setData({ taskId: options.taskId })
      this.startAnalysis()
    } else {
      this.setData({ 
        hasError: true, 
        errorMessage: '缺少任务ID' 
      })
    }
  },

  onUnload() {
    this.stopAll()
  },

  startAnalysis() {
    this.startTime = Date.now()
    
    // 开始阶段动画
    this.startStageAnimation()
    
    // 开始轮询任务状态
    this.startPolling()
    
    // 设置超时检测
    this.startTimeoutCheck()
    
    // 开始剩余时间倒计时
    this.startCountdown()
  },

  stopAll() {
    this.stopStageAnimation()
    this.stopPolling()
    this.stopTimeoutCheck()
    this.stopCountdown()
  },

  // ========== 阶段动画 ==========

  startStageAnimation() {
    this.progressToCurrentStage()
    
    this.stageTimer = setInterval(() => {
      // 检查是否超时
      if (this.data.isTimeout || this.data.isCompleted) {
        this.stopStageAnimation()
        return
      }
      
      const nextStage = this.data.currentStage + 1
      
      if (nextStage < STAGES.length) {
        this.setData({ currentStage: nextStage })
        this.progressToCurrentStage()
      } else {
        // 到达最后阶段，停在 100%
        this.stopStageAnimation()
      }
    }, STAGE_DURATION)
  },

  stopStageAnimation() {
    if (this.stageTimer) {
      clearInterval(this.stageTimer)
      this.stageTimer = null
    }
  },

  progressToCurrentStage() {
    const stage = STAGES[this.data.currentStage]
    this.setData({
      stageIcon: stage.icon,
      stageTitle: stage.title,
      stageDesc: stage.desc,
      progress: stage.progress
    })
  },

  // ========== 状态轮询 ==========

  startPolling() {
    this.pollStatus()
  },

  stopPolling() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
      this.pollTimer = null
    }
  },

  async pollStatus() {
    try {
      const result = await taskService.getTaskStatus(this.data.taskId)
      
      // 对齐后端状态：pending/analyzing/completed/failed
      if (result.status === STATUS.TASK_COMPLETED || result.status === 'completed') {
        this.onAnalysisComplete()
      } else if (result.status === STATUS.TASK_FAILED || result.status === 'failed') {
        this.onAnalysisError(result.error || result.message || '分析过程中出现错误')
      } else {
        // pending 或 analyzing 状态，继续轮询
        this.pollTimer = setTimeout(() => {
          this.pollStatus()
        }, POLL_INTERVAL)
      }
    } catch (err) {
      console.error('[AnalysisWaiting] 状态查询失败:', err)
      // 网络错误继续轮询
      this.pollTimer = setTimeout(() => {
        this.pollStatus()
      }, POLL_INTERVAL)
    }
  },

  // ========== 超时检测 ==========

  startTimeoutCheck() {
    this.timeoutTimer = setTimeout(() => {
      if (!this.data.isCompleted) {
        this.onTimeout()
      }
    }, TIMEOUT)
  },

  stopTimeoutCheck() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = null
    }
  },

  onTimeout() {
    this.stopAll()
    this.setData({ 
      isTimeout: true,
      isLoading: false
    })
  },

  // ========== 倒计时 ==========

  startCountdown() {
    this.updateRemainingTime()
    
    this.countdownTimer = setInterval(() => {
      this.updateRemainingTime()
    }, 1000)
  },

  stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
      this.countdownTimer = null
    }
  },

  updateRemainingTime() {
    const elapsed = Date.now() - this.startTime
    const remaining = Math.max(0, Math.ceil((30000 - elapsed) / 1000))
    this.setData({ remainingTime: remaining })
  },

  // ========== 完成与错误处理 ==========

  onAnalysisComplete() {
    this.stopAll()
    this.setData({ 
      isCompleted: true,
      isLoading: false,
      progress: 100
    })
    
    // 更新到完成阶段
    const lastStage = STAGES[STAGES.length - 1]
    this.setData({
      stageIcon: '🎉',
      stageTitle: '分析完成！',
      stageDesc: '正在跳转到报告页面...'
    })
    
    // 跳转到报告页
    setTimeout(() => {
      wx.redirectTo({
        url: `/pages/report/report?taskId=${this.data.taskId}`
      })
    }, 1000)
  },

  onAnalysisError(message) {
    this.stopAll()
    this.setData({ 
      hasError: true,
      isLoading: false,
      errorMessage: message
    })
  },

  // ========== 用户操作 ==========

  onRetry() {
    this.setData({
      hasError: false,
      isTimeout: false,
      isLoading: true,
      currentStage: 0,
      progress: 0
    })
    this.startAnalysis()
  },

  onViewInProfile() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

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
  }
})