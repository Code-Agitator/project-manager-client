import type { BasePageParam } from '~/types/http'

export interface SelectDynamicAdminParam extends BasePageParam {
  keywords?: string
  stat?: number
  deleted?: boolean
  timeStart?: number
  timeEnd?: number
}

/**
 * EtwDynamic
 */
export interface ETWDynamic {
  /**
   * 行政区编码
   */
  areaCode?: string
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
   * 动态ID
   */
  id?: number
  /**
   * 是否逻辑删除 默认0 未被删除
   */
  isDeleted?: boolean
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
  /**
   * 被转发的作品ID
   */
  workId?: number
}
