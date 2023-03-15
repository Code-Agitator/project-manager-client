import type { AxiosRequestConfig } from 'axios'

/**
 * 响应体封装
 */
export interface IResponseData<T> {
  success: boolean
  code: number
  message: string | ''
  data: T | null
}

/**
 * 分页数据封装
 */
export interface ResponsePage<T> {
  countId?: string
  current?: number
  maxLimit?: number
  optimizeCountSql?: boolean
  orders?: OrderItem[]
  pages?: number
  records: T[]
  searchCount?: boolean
  size?: number
  total?: number
}

export interface OrderItem {
  asc?: boolean
  column?: string
}

/**
 * 分页参数
 */
export interface BasePageParam {
  pageNumber?: number | null
  pageSize?: number | null
}

export interface TargetParam {
  /**
     * 目标id
     */
  targetId?: number | null
  /**
     * {@link TargetType}
     */
  targetType?: string
}

/**
 * TokenInfo
 */
export interface TokenInfo {
  accessToken: string
  expireIn: number
  refreshToken: string
  refreshTokenExpireIn: number
}

export interface NamePair<T, R> {
  name: T
  value: R
}

export type ParamsSerializer = AxiosRequestConfig['paramsSerializer']

export enum TargetTypeCode {
  WORK = 1,
  DYNAMIC,
  COMMENT,
  SECOND_COMMENT,
  USER,
  DYNAMIC_IMAGE,
  CHAT,
}

export enum TargetType {

  DYNAMIC = 'dynamic',

}

