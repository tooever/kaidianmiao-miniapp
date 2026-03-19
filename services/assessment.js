/**
 * 开店喵 - 评估相关API
 */

const { get, post } = require('../utils/request')
const { API_PATHS } = require('../utils/constants')

/**
 * 创建评估
 * @param {Object} data 评估数据
 */
function createAssessment(data) {
  return post(API_PATHS.CREATE_ASSESSMENT, data)
}

/**
 * 获取评估详情
 * @param {string} assessmentId 评估ID
 */
function getAssessment(assessmentId) {
  return get(`${API_PATHS.GET_ASSESSMENT}/${assessmentId}`)
}

/**
 * 获取评估列表
 * @param {Object} params 分页参数
 */
function getAssessmentList(params = {}) {
  return get(API_PATHS.GET_ASSESSMENT_LIST, params)
}

/**
 * 获取评估报告
 * @param {string} assessmentId 评估ID
 */
function getAssessmentReport(assessmentId) {
  return get(`${API_PATHS.GET_ASSESSMENT_REPORT}/${assessmentId}`)
}

module.exports = {
  createAssessment,
  getAssessment,
  getAssessmentList,
  getAssessmentReport
}