/**
 * TestingCase
 */
import type { BasePageParam } from '~/types/http'

export interface TestingCase {
  /**
     * 备注
     */
  comment?: string
  id?: number
  /**
     * 用例链接
     */
  link?: string
  /**
     * 用例标题
     */
  name?: string
  /**
     * 用例计划id
     */
  plantId?: number
  /**
     * 测试结果
     */
  result?: string
  /**
     * 输出者
     */
  userId?: number
}

/**
 * TestingCaseSearchDto
 */
export interface TestingCaseSearchDto extends BasePageParam {
  name?: string
  plantId?: number
  userId?: number
}
