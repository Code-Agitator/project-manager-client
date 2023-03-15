/**
 * AdminCommentVo
 */
import type { SimpleUserInfo } from '@/views/community/dynamic/type/response'

export interface AdminCommentVo {
  /**
     * 评论数
     */
  commentNumber?: number
  /**
     * 评论内容
     */
  content?: string
  /**
     * 发布时间
     */
  createdTime?: number
  /**
     * 评论id
     */
  id?: number
  /**
     * 是否逻辑删除 默认0 未被删除
     */
  isDeleted?: boolean
  /**
     * 点赞数
     */
  likeNumber?: number
  /**
     * 被评论目标ID
     */
  targetId?: number
  /**
     * 被评论目标类型
     */
  targetType?: number
  /**
     * 发起评论用户
     */
  userId?: number
  userInfo?: SimpleUserInfo
}
