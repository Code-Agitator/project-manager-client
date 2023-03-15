/**
 * DynamicWithUserProfile
 */
export interface DynamicWithUserProfile {
  /**
   * 行政区编码
   */
  areaCode?: string
  areaInfo?: DynamicAreaInfo
  /**
   * 地名
   */
  areaName?: string
  /**
   * 浏览次数
   */
  browseNumber?: number
  /**
   * 评论次数
   */
  commentNumber?: number
  /**
   * 动态内容
   */
  content?: string
  /**
   * 创建时间
   */
  createdTime?: number
  /**
   * 被转发的动态ID
   */
  dynamicId?: number
  /**
   * 动态图片
   */
  dynamicImages?: ETWDynamicImage[]
  /**
   * 动态ID
   */
  id?: number
  /**
   * 是否逻辑删除 默认0 未被删除
   */
  isDeleted?: boolean
  /**
   * 是否关注
   */
  isFriend?: boolean
  /**
   * 是否点赞
   */
  isLike?: boolean
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 点赞数
   */
  likeNumber?: number
  /**
   * 经度
   */
  longitude?: number
  /**
   * 发布时间
   */
  publishTime?: number
  /**
   * 转发次数
   */
  shareNumber?: number
  /**
   * -1 审核不通过 0-审核中 1-审核通过 2-置顶
   */
  stat?: number
  /**
   * 更新时间
   */
  updatedTime?: number
  /**
   * 被@的用户ID
   */
  userId?: number
  userInfo?: SimpleUserInfo
  /**
   * 被转发的作品ID
   */
  workId?: number
}

/**
 * DynamicAreaInfo
 */
export interface DynamicAreaInfo {
  /**
   * 行政区编码
   */
  areaCode?: string
  /**
   * 地名
   */
  areaName?: string
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 经度
   */
  longitude?: number
}

/**
 * EtwDynamicImage
 */
export interface ETWDynamicImage {
  /**
   * 动态ID
   */
  dynamicId?: number
  /**
   * 图片id
   */
  id?: number
  /**
   * 图片序号
   */
  imgNumber?: number
  /**
   * 图片路径
   */
  imgUrl?: string
  /**
   * 发布用户id
   */
  userId?: number
}

/**
 * SimpleUserInfo
 */
export interface SimpleUserInfo {
  /**
   * 头像
   */
  avgPath?: string
  /**
   * 用户id
   */
  id?: number
  /**
   * 是否被关注
   */
  isConcerned?: boolean
  /**
   * 是否关注
   */
  isFriend?: boolean
  /**
   * 勋章
   */
  medals?: Medal[]
  /**
   * 个人简介
   */
  signature?: string
  /**
   * 用户名
   */
  username?: string
}

/**
 * Medal
 */
export interface Medal {
  createdTime?: number
  desc?: string
  id?: number
  name?: string
  stat?: number
  style?: string
}
