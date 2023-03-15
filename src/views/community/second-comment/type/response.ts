/**
 * AdminCommentVo
 */
import type { SimpleUserInfo } from '@/views/community/dynamic/type/response'

/**
 * SecondCommentVo
 */
export interface SecondCommentVo {
  /**
   * 被评论的一级评论
   */
  commentId?: number
  /**
   * 评论内容
   */
  content?: string
  /**
   * 发布时间
   */
  createdTime?: number
  /**
   * 目标id
   */
  dynamicId?: number
  /**
   * 二级评论id
   */
  id?: number
  /**
   * 是否被被评论人删除,默认 0 没有删除
   */
  isDeleted?: boolean
  /**
   * 是否点赞
   */
  isLike?: boolean
  /**
   * 点赞数
   */
  likeNumber?: number
  /**
   * 回复目标id
   */
  replyId?: number
  scUserInfo?: SimpleUserInfo
  /**
   * @用户
   */
  toUserId?: number
  toUserInfo?: SimpleUserInfo
  /**
   * 发表用户
   */
  userId?: number
}
