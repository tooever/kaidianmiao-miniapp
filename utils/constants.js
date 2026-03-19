/**
 * 开店喵 - 常量定义
 * 包含API路径、品牌色、状态码等常量
 */

// API 基础地址
const API_BASE_URL = 'http://localhost:8080'

// API 路径常量 - 对齐后端接口
const API_PATHS = {
  // 认证
  WECHAT_LOGIN: '/api/auth/wechat-login',
  
  // 用户
  USER_ME: '/api/user/me',
  
  // 分析任务（后端使用 analysis-task）
  CREATE_TASK: '/api/analysis-task',
  TASK_STATUS: '/api/analysis-task',  // + /{id}/status
  TASK_REPORT: '/api/analysis-task',  // + /{id}/report
  
  // 订单
  CREATE_ORDER: '/api/order',
  CONFIRM_PAID: '/api/order',  // + /{id}/confirm-paid
  ORDER_DETAIL: '/api/order',  // + /{id}
  
  // 列表
  USER_REPORTS: '/api/user/reports',
  USER_ORDERS: '/api/user/orders'
}

// 品牌色常量
const COLORS = {
  PRIMARY: '#FF6B35',       // 开店橙
  PRIMARY_LIGHT: '#FFB347', // 辅色1
  PRIMARY_LIGHTER: '#FFD93D', // 辅色2
  BG: '#FAFAFA',            // 背景色
  TEXT_PRIMARY: '#1A1A1A',  // 主文字
  TEXT_SECONDARY: '#666666', // 次文字
  TEXT_TERTIARY: '#999999', // 辅助文字
  SUCCESS: '#10B981',       // 成功绿
  WARNING: '#F59E0B',       // 警告黄
  ERROR: '#EF4444',         // 错误红
  WHITE: '#FFFFFF',
  BORDER: '#EEEEEE'
}

// 状态常量
const STATUS = {
  // 评估/分析任务状态 - 对齐后端定义
  TASK_PENDING: 'pending',      // 待处理
  TASK_ANALYZING: 'analyzing',  // 分析中
  TASK_COMPLETED: 'completed',  // 已完成
  TASK_FAILED: 'failed',        // 失败
  
  // 订单状态
  ORDER_UNPAID: 'unpaid',           // 未支付
  ORDER_PENDING_VERIFY: 'pending_verify', // 待核销
  ORDER_PAID: 'paid',               // 已支付/已核销
  ORDER_EXPIRED: 'expired',         // 已过期
  ORDER_REFUNDED: 'refunded'        // 已退款
}

// 错误码 - 对齐后端定义
const ERROR_CODES = {
  SUCCESS: 0,
  TOKEN_EXPIRED: 40002,      // Token 过期错误码
  PERMISSION_DENIED: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  PARAM_ERROR: 10001,
  BUSINESS_ERROR: 10002
}

// 错误消息
const ERROR_MESSAGES = {
  [ERROR_CODES.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [ERROR_CODES.PERMISSION_DENIED]: '无权限访问',
  [ERROR_CODES.NOT_FOUND]: '资源不存在',
  [ERROR_CODES.SERVER_ERROR]: '服务器错误，请稍后重试',
  [ERROR_CODES.PARAM_ERROR]: '参数错误',
  [ERROR_CODES.BUSINESS_ERROR]: '业务处理失败'
}

// 存储键名
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  FORM_CACHE: 'formCache',           // 表单数据缓存
  ASSESSMENT_CACHE: 'assessmentCache',
  LAST_ASSESSMENT_ID: 'lastAssessmentId'
}

// 价格配置
const PRICES = {
  SINGLE_ASSESSMENT: 9.9,  // 单次评估价格
  PACKAGE_3: 26.9,         // 3次套餐
  PACKAGE_10: 79.9         // 10次套餐
}

module.exports = {
  API_BASE_URL,
  API_PATHS,
  COLORS,
  STATUS,
  ERROR_CODES,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  PRICES
}