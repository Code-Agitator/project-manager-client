/**
 * DepartmentVo
 */
import type { User } from '@/views/system/user/type/response'

export interface DepartmentVo {
  createTime?: Date
  id?: number
  /**
   * 部门名称
   */
  name?: string
  user?: User
  /**
   * 部门主管id
   */
  userId?: number
}
