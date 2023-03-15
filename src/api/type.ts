/**
 * UserProfileExtVo
 */
export interface UserProfileExtVo {
  addressDetails?: string
  areaCode?: string
  /**
     * 关注
     */
  attentions?: number
  avgPath?: string
  birthday?: Date
  coverUrl?: string
  credit?: number
  /**
     * 粉丝
     */
  fans?: number
  gender?: number
  /**
     * 是否被关注
     */
  isConcerned?: boolean
  /**
     * 是否关注
     */
  isFriend?: boolean
  point?: number
  realName?: string
  schoolId?: number
  /**
     * 学校名称
     */
  schoolName?: string
  signature?: string
  updatedTime?: number
  userId?: number
  username?: string
}
