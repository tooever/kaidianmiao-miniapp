/**
 * 选址评估表单页 - 三步式
 */
const storage = require('../../utils/storage')
const taskService = require('../../services/assessment')
const auth = require('../../utils/auth')

// 表单数据缓存键
const FORM_CACHE_KEY = 'formCache'

// 表单选项配置
const FORM_OPTIONS = {
  // 预算范围
  budgetRanges: ['<10万', '10-30万', '30-50万', '50-100万', '>100万'],
  // 经营品类
  categories: ['快餐', '正餐', '茶饮/咖啡', '烘焙', '小吃', '其他'],
  // 目标客群
  customerGroups: ['上班族', '学生', '居民', '游客', '其他'],
  // 预估客单价
  priceRanges: ['<20元', '20-50元', '50-100元', '>100元'],
  // 营业时段
  timeSlots: ['早餐', '午餐', '下午茶', '晚餐', '夜宵'],
  // 核心优势
  advantages: ['位置好', '产品特色', '价格优势', '服务优质', '品牌知名度', '其他']
}

Page({
  data: {
    currentStep: 1,
    
    // 步骤配置
    steps: [
      { title: '基本信息', desc: '选址与预算' },
      { title: '客群定位', desc: '目标与时段' },
      { title: '补充信息', desc: '竞品与优势' }
    ],
    
    // 表单数据
    formData: {
      // Step 1: 基本信息
      region: [],           // 省市区
      regionText: '',       // 地区文本
      area: '',             // 具体区域/商圈
      budgetIndex: null,    // 预算范围索引
      categoryIndex: null,  // 经营品类索引
      
      // Step 2: 客群定位
      customerGroups: [],   // 目标客群
      priceIndex: null,     // 预估客单价索引
      timeSlots: [],        // 营业时段
      
      // Step 3: 补充信息
      hasCompetitor: null,  // 是否有竞品信息
      competitors: '',      // 主要竞品
      advantages: [],       // 核心优势
      remark: ''            // 其他补充
    },
    
    // 选项数据
    options: FORM_OPTIONS,
    
    // UI 状态
    isSubmitting: false
  },

  onLoad(options) {
    // 检查登录状态
    if (!auth.isLoggedIn()) {
      wx.navigateTo({
        url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/form/form')
      })
      return
    }
    
    // 恢复缓存的表单数据
    this.restoreFormData()
  },

  // 恢复表单数据
  restoreFormData() {
    const cache = storage.getFormCache()
    if (cache && cache.formData) {
      this.setData({
        currentStep: cache.currentStep || 1,
        formData: { ...this.data.formData, ...cache.formData }
      })
    }
  },

  // 保存表单数据到缓存
  saveFormData() {
    storage.setFormCache({
      currentStep: this.data.currentStep,
      formData: this.data.formData,
      updatedAt: Date.now()
    })
  },

  // 步骤切换
  onStepChange(e) {
    const { step } = e.detail
    if (step < this.data.currentStep) {
      this.setData({ currentStep: step })
    }
  },

  // ========== Step 1: 基本信息 ==========

  // 城市选择
  onRegionChange(e) {
    const { value, code } = e.detail
    const regionText = value.join(' ')
    this.setData({
      'formData.region': code,
      'formData.regionText': regionText
    })
  },

  // 区域输入
  onAreaInput(e) {
    this.setData({ 'formData.area': e.detail.value })
  },

  // 预算选择
  onBudgetChange(e) {
    this.setData({ 'formData.budgetIndex': e.detail.value })
  },

  // 品类选择
  onCategoryChange(e) {
    this.setData({ 'formData.categoryIndex': e.detail.value })
  },

  // ========== Step 2: 客群定位 ==========

  // 目标客群选择
  onCustomerGroupChange(e) {
    const { value } = e.detail
    let groups = this.data.formData.customerGroups
    const index = groups.indexOf(value)
    if (index > -1) {
      groups.splice(index, 1)
    } else {
      groups = [...groups, value]
    }
    this.setData({ 'formData.customerGroups': groups })
  },

  // 客单价选择
  onPriceChange(e) {
    this.setData({ 'formData.priceIndex': e.detail.value })
  },

  // 营业时段选择
  onTimeSlotChange(e) {
    const { value } = e.detail
    let slots = this.data.formData.timeSlots
    const index = slots.indexOf(value)
    if (index > -1) {
      slots.splice(index, 1)
    } else {
      slots = [...slots, value]
    }
    this.setData({ 'formData.timeSlots': slots })
  },

  // ========== Step 3: 补充信息 ==========

  // 是否有竞品
  onCompetitorChange(e) {
    const hasCompetitor = e.detail.value === 'yes'
    this.setData({ 
      'formData.hasCompetitor': hasCompetitor,
      // 如果选否，清空竞品信息
      'formData.competitors': hasCompetitor ? this.data.formData.competitors : ''
    })
  },

  // 竞品输入
  onCompetitorsInput(e) {
    this.setData({ 'formData.competitors': e.detail.value })
  },

  // 核心优势选择
  onAdvantageChange(e) {
    const { value } = e.detail
    let advantages = this.data.formData.advantages
    const index = advantages.indexOf(value)
    if (index > -1) {
      advantages.splice(index, 1)
    } else {
      advantages = [...advantages, value]
    }
    this.setData({ 'formData.advantages': advantages })
  },

  // 备注输入
  onRemarkInput(e) {
    this.setData({ 'formData.remark': e.detail.value })
  },

  // ========== 步骤验证 ==========

  validateStep1() {
    const { regionText, area, budgetIndex, categoryIndex } = this.data.formData
    if (!regionText) {
      wx.showToast({ title: '请选择城市', icon: 'none' })
      return false
    }
    if (!area) {
      wx.showToast({ title: '请输入具体区域', icon: 'none' })
      return false
    }
    if (budgetIndex === null) {
      wx.showToast({ title: '请选择预算范围', icon: 'none' })
      return false
    }
    if (categoryIndex === null) {
      wx.showToast({ title: '请选择经营品类', icon: 'none' })
      return false
    }
    return true
  },

  validateStep2() {
    const { customerGroups, priceIndex, timeSlots } = this.data.formData
    if (customerGroups.length === 0) {
      wx.showToast({ title: '请选择目标客群', icon: 'none' })
      return false
    }
    if (priceIndex === null) {
      wx.showToast({ title: '请选择预估客单价', icon: 'none' })
      return false
    }
    if (timeSlots.length === 0) {
      wx.showToast({ title: '请选择营业时段', icon: 'none' })
      return false
    }
    return true
  },

  validateStep3() {
    const { hasCompetitor, competitors } = this.data.formData
    if (hasCompetitor === null) {
      wx.showToast({ title: '请选择是否有竞品信息', icon: 'none' })
      return false
    }
    if (hasCompetitor && !competitors) {
      wx.showToast({ title: '请输入主要竞品', icon: 'none' })
      return false
    }
    return true
  },

  // ========== 按钮操作 ==========

  // 下一步
  onNextStep() {
    let valid = false
    switch (this.data.currentStep) {
      case 1:
        valid = this.validateStep1()
        break
      case 2:
        valid = this.validateStep2()
        break
    }
    
    if (valid) {
      this.saveFormData()
      this.setData({ currentStep: this.data.currentStep + 1 })
    }
  },

  // 上一步
  onPrevStep() {
    if (this.data.currentStep > 1) {
      this.setData({ currentStep: this.data.currentStep - 1 })
    }
  },

  // 提交表单
  async onSubmit() {
    if (!this.validateStep3()) return
    
    this.saveFormData()
    this.setData({ isSubmitting: true })
    
    try {
      // 构建提交数据 - 对齐后端 CreateAnalysisTaskRequest
      const { formData, options } = this.data
      
      // 解析 region 为 city 和 district
      const regionParts = formData.regionText.split(' ')
      const city = regionParts[0] || ''
      const district = regionParts.slice(1).join(' ') || ''
      
      const submitData = {
        // 基本信息 - 对齐后端字段名
        city: city,
        district: district,
        area: formData.area,
        budget: options.budgetRanges[formData.budgetIndex],  // index 转文本
        category: options.categories[formData.categoryIndex],  // index 转文本
        
        // 客群定位 - 字段名对齐
        targetCustomers: formData.customerGroups,
        avgPrice: options.priceRanges[formData.priceIndex],  // index 转文本
        businessHours: formData.timeSlots,
        
        // 补充信息 - 字段名对齐
        hasCompetitorInfo: formData.hasCompetitor,
        competitors: formData.hasCompetitor ? formData.competitors : '',
        advantages: formData.advantages,
        additionalInfo: formData.remark
      }
      
      // 调用创建任务接口
      const result = await taskService.createTask(submitData)
      
      // 清除缓存
      storage.clearFormCache()
      
      // 跳转到支付页
      wx.redirectTo({
        url: `/pages/payment/payment?taskId=${result.taskId || result.id}`
      })
    } catch (err) {
      console.error('[Form] 提交失败:', err)
      wx.showToast({
        title: err.message || '提交失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ isSubmitting: false })
    }
  }
})