/**
 * 开店喵 - 本地存储封装
 * 提供统一的存储接口
 */

const { STORAGE_KEYS } = require('./constants')

/**
 * 获取存储数据
 * @param {string} key 存储键名
 * @returns {any} 存储的数据
 */
function get(key) {
  try {
    const value = wx.getStorageSync(key)
    return value || null
  } catch (e) {
    console.error('[Storage] 读取失败:', key, e)
    return null
  }
}

/**
 * 设置存储数据
 * @param {string} key 存储键名
 * @param {any} value 存储的数据
 * @returns {boolean} 是否成功
 */
function set(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('[Storage] 写入失败:', key, e)
    return false
  }
}

/**
 * 移除存储数据
 * @param {string} key 存储键名
 * @returns {boolean} 是否成功
 */
function remove(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('[Storage] 删除失败:', key, e)
    return false
  }
}

/**
 * 清空所有存储
 * @returns {boolean} 是否成功
 */
function clear() {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('[Storage] 清空失败:', e)
    return false
  }
}

/**
 * 获取Token
 */
function getToken() {
  return get(STORAGE_KEYS.TOKEN)
}

/**
 * 设置Token
 */
function setToken(token) {
  return set(STORAGE_KEYS.TOKEN, token)
}

/**
 * 移除Token
 */
function removeToken() {
  return remove(STORAGE_KEYS.TOKEN)
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return get(STORAGE_KEYS.USER_INFO)
}

/**
 * 设置用户信息
 */
function setUserInfo(userInfo) {
  return set(STORAGE_KEYS.USER_INFO, userInfo)
}

/**
 * 移除用户信息
 */
function removeUserInfo() {
  return remove(STORAGE_KEYS.USER_INFO)
}

/**
 * 获取评估缓存
 */
function getAssessmentCache() {
  return get(STORAGE_KEYS.ASSESSMENT_CACHE)
}

/**
 * 设置评估缓存
 */
function setAssessmentCache(cache) {
  return set(STORAGE_KEYS.ASSESSMENT_CACHE, cache)
}

/**
 * 清除评估缓存
 */
function clearAssessmentCache() {
  return remove(STORAGE_KEYS.ASSESSMENT_CACHE)
}

module.exports = {
  get,
  set,
  remove,
  clear,
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  getAssessmentCache,
  setAssessmentCache,
  clearAssessmentCache
}