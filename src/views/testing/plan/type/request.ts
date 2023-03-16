/**
 * TestingPlanSearchDto
 */
import type { BasePageParam } from '~/types/http'

export interface TestingPlanSearchDto extends BasePageParam {
  endTime?: string
  name?: string
  startTime?: string
  userId?: number
}

/**
 * TestingPlan
 */
export interface TestingPlan {
  createTime?: Date
  id?: number
  /**
   * 测试计划连接
   */
  link?: string
  /**
   * 测试计划名称
   */
  name?: string
  /**
   * 负责人
   */
  userId?: number
}

