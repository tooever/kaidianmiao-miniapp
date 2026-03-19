/**
 * 开店喵 - 分析任务相关API
 */

const { get, post } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 创建分析任务
 * @param {Object} data 任务数据（表单数据）
 */
function createTask(data) {
  return post(API_PATHS.CREATE_TASK, data)
}

/**
 * 获取任务状态
 * @param {string} taskId 任务ID
 */
function getTaskStatus(taskId) {
  return get(`${API_PATHS.TASK_STATUS}/${taskId}/status`)
}

/**
 * 获取任务报告
 * @param {string} taskId 任务ID
 */
function getTaskReport(taskId) {
  return get(`${API_PATHS.TASK_REPORT}/${taskId}/report`)
}

/**
 * 获取用户报告列表
 * @param {Object} params 分页参数
 */
function getUserReports(params = {}) {
  return get(API_PATHS.USER_REPORTS, params)
}

module.exports = {
  createTask,
  getTaskStatus,
  getTaskReport,
  getUserReports
}