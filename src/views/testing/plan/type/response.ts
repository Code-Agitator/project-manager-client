/**
 * TestingPlanVo
 */
export interface TestingPlanVo {
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
  user?: User
  /**
     * 负责人
     */
  userId?: number
}

/**
 * User
 */
export interface User {
  createTime?: Date
  /**
     * 部门id
     */
  departmentId?: number
  /**
     * 邮箱
     */
  email?: string
  id?: number
  /**
     * 姓名
     */
  name?: string
  /**
     * 工号
     */
  no?: string
  password?: string
  /**
     * 手机号码
     */
  phone?: string
  /**
     * 角色id
     */
  roleId?: number
  /**
     * 座位
     */
  seat?: string
  /**
     * 0-离职 1-在职 2-实习生
     */
  status?: number
  /**
     * 昵称
     */
  username?: string
}
