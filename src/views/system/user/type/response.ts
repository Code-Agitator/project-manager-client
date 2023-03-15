/**
 * UserVo
 */
export interface UserVo extends User {
  department?: Department
  role?: Role
}

/**
 * Department
 */
export interface Department {
  createTime?: Date
  id?: number
  /**
   * 部门名称
   */
  name?: string
  /**
   * 部门主管id
   */
  userId?: number
}

/**
 * Role
 */
export interface Role {
  /**
   * 权限编号
   */
  id?: number
  /**
   * 权限字符
   */
  roleCode?: string
  /**
   * 角色名称
   */
  roleName?: string
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
   * 姓名
   */
  username?: string

  name?: string
}
