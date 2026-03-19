/**
 * 开店喵 - API 数据兼容层
 * 安全处理各种 API 返回格式
 */

/**
 * 安全提取列表数据
 * 兼容：数组、{ items: [] }、{ data: [] }、null
 */
function safeListData(response) {
  if (!response) return []
  const data = response.data ?? response
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.list)) return data.list
  if (Array.isArray(data?.records)) return data.records
  return []
}

/**
 * 安全提取分页信息
 */
function safePagination(response) {
  const data = response?.data ?? response
  return {
    total: data?.total ?? 0,
    page: data?.page ?? data?.pageNum ?? 1,
    pageSize: data?.pageSize ?? data?.size ?? 20
  }
}

/**
 * 安全提取单个对象
 */
function safeObjectData(response) {
  if (!response) return null
  const data = response.data ?? response
  if (Array.isArray(data)) return data[0] ?? null
  if (typeof data === 'object') return data
  return null
}

/**
 * 判断是否为空
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  if (typeof value === 'string') return value.trim() === ''
  return false
}

module.exports = {
  safeListData,
  safePagination,
  safeObjectData,
  isEmpty
}