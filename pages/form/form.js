/**
 * 评估表单页
 */
Page({
  data: {
    formData: {
      shopName: '',
      shopType: '',
      address: '',
      area: '',
      rent: '',
      remark: ''
    },
    shopTypes: ['餐饮美食', '零售购物', '生活服务', '美容美发', '教育培训', '其他'],
    shopTypeIndex: null
  },

  onShopTypeChange(e) {
    const index = e.detail.value
    this.setData({
      shopTypeIndex: index,
      'formData.shopType': this.data.shopTypes[index]
    })
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [`formData.${field}`]: value
    })
  },

  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.address': res.address + ' ' + res.name
        })
      },
      fail: () => {
        wx.showToast({
          title: '请授权位置信息',
          icon: 'none'
        })
      }
    })
  },

  onSubmit() {
    const { formData } = this.data
    
    // 表单验证
    if (!formData.shopName) {
      return wx.showToast({ title: '请输入店铺名称', icon: 'none' })
    }
    if (!formData.shopType) {
      return wx.showToast({ title: '请选择店铺类型', icon: 'none' })
    }
    if (!formData.address) {
      return wx.showToast({ title: '请选择店铺地址', icon: 'none' })
    }
    
    // TODO: 提交表单
    wx.navigateTo({
      url: '/pages/payment/payment'
    })
  }
})