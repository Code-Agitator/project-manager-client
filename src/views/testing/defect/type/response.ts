import type { User } from '@/views/system/user/type/response'

/**
 * DefectVo
 */
export interface DefectVo {
  /**
   * 描述
   */
  comment?: string
  id?: number
  /**
   * 严重程度 none-无 death-致命 important-严重 normal-普通 low-轻微
   */
  level?: string
  /**
   * 优先级 high-紧急 mid-中 low-低 delay-延迟
   */
  priority?: string
  /**
   * 重复概率 none-无 must-必然 high-大概率 mid-偶然 low-难以复现
   */
  repeatedProbability?: string
  reportUser?: User
  /**
   * 报告人id
   */
  reportUserId?: number
  /**
   * 1-待解决 2-正在解决 3-已解决 4-关闭
   */
  status?: number
  /**
   * 标题
   */
  title?: string
  /**
   * defect-缺陷 improve-改进 experience-体验
   */
  type?: string
  user?: User
  /**
   * 经办人id
   */
  userId?: number

  description?: string
}
