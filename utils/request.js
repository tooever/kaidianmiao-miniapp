/**
 * 开店喵 - 网络请求封装
 * 统一处理 Token、错误、Loading
 */

const { API_BASE_URL, ERROR_CODES, ERROR_MESSAGES } = require('./constants')
const storage = require('./storage')
const auth = require('./auth')

/**
 * 封装请求方法
 * @param {Object} options 请求配置
 * @param {string} options.url 请求地址
 * @param {string} options.method 请求方法
 * @param {Object} options.data 请求数据
 * @param {boolean} options.showLoading 是否显示loading
 * @param {string} options.loadingText loading文案
 * @param {boolean} options.needToken 是否需要token
 * @returns {Promise}
 */
function request(options) {
  const {
    url,
    method = 'GET',
    data = {},
    showLoading = true,
    loadingText = '加载中...',
    needToken = true
  } = options

  // 显示loading
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    // 构建请求头
    const header = {
      'Content-Type': 'application/json'
    }
    
    // 添加Token
    if (needToken) {
      const token = storage.getToken()
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }
    }

    wx.request({
      url: `${API_BASE_URL}${url}`,
      method,
      data,
      header,
      success(res) {
        if (showLoading) {
          wx.hideLoading()
        }

        const { statusCode, data: responseData } = res

        // HTTP状态码检查
        if (statusCode !== 200) {
          handleHttpError(statusCode, reject)
          return
        }

        // 业务状态码检查
        if (responseData.code === ERROR_CODES.SUCCESS) {
          resolve(responseData.data)
        } else if (responseData.code === ERROR_CODES.TOKEN_EXPIRED) {
          // Token过期，清除登录态
          auth.logout()
          reject(new Error(ERROR_MESSAGES[ERROR_CODES.TOKEN_EXPIRED]))
          
          // 跳转登录页
          wx.navigateTo({
            url: '/pages/login/login'
          })
        } else {
          // 业务错误
          const errorMsg = responseData.message || ERROR_MESSAGES[responseData.code] || '请求失败'
          reject(new Error(errorMsg))
        }
      },
      fail(err) {
        if (showLoading) {
          wx.hideLoading()
        }
        
        console.error('[Request] 网络请求失败:', err)
        reject(new Error('网络请求失败，请检查网络连接'))
      }
    })
  })
}

/**
 * 处理HTTP错误
 */
function handleHttpError(statusCode, reject) {
  let message = '请求失败'
  
  switch (statusCode) {
    case 400:
      message = '请求参数错误'
      break
    case 401:
      message = '未授权，请重新登录'
      break
    case 403:
      message = '拒绝访问'
      break
    case 404:
      message = '请求资源不存在'
      break
    case 500:
      message = '服务器内部错误'
      break
    case 502:
      message = '网关错误'
      break
    case 503:
      message = '服务不可用'
      break
    case 504:
      message = '网关超时'
      break
    default:
      message = `请求失败(${statusCode})`
  }
  
  reject(new Error(message))
}

/**
 * GET请求
 */
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST请求
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT请求
 */
function put(url, data = {}, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE请求
 */
function del(url, data = {}, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

/**
 * 上传文件
 */
function upload(url, filePath, options = {}) {
  const {
    name = 'file',
    formData = {},
    showLoading = true,
    loadingText = '上传中...',
    needToken = true
  } = options

  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    })
  }

  return new Promise((resolve, reject) => {
    const header = {}
    
    if (needToken) {
      const token = storage.getToken()
      if (token) {
        header['Authorization'] = `Bearer ${token}`
      }
    }

    wx.uploadFile({
      url: `${API_BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header,
      success(res) {
        if (showLoading) {
          wx.hideLoading()
        }

        try {
          const data = JSON.parse(res.data)
          if (data.code === ERROR_CODES.SUCCESS) {
            resolve(data.data)
          } else {
            reject(new Error(data.message || '上传失败'))
          }
        } catch (e) {
          reject(new Error('上传响应解析失败'))
        }
      },
      fail(err) {
        if (showLoading) {
          wx.hideLoading()
        }
        reject(new Error('上传失败'))
      }
    })
  })
}

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload
}