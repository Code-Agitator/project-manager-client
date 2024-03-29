import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { isWithoutToken } from './helpers'
import { getToken } from '~/src/utils/auth/token'
import { toLogin } from '@/utils/auth/router'
import { isNullOrUndef } from '@/utils/common'

export function reqResolve(config: AxiosRequestConfig) {
  // 防止缓存，给get请求加上时间戳
  if (config.method === 'get')
    config.params = { ...config.params, t: new Date().getTime() }

  // 处理不需要token的请求
  if (isWithoutToken(config))
    return config

  const token = getToken()
  if (!token) {
    // * 未登录或者token过期的情况下,跳转登录页重新登录
    toLogin()
    return Promise.reject(new Error('未登录'))
  }

  config.headers = { etoken: token }

  return config
}

export function reqReject(error: AxiosError) {
  return Promise.reject(error)
}

export function resResolve(response: AxiosResponse) {
  return response
}

export function resReject(error: AxiosError) {
  let { code, message }: any = error.response?.data || {}
  if (isNullOrUndef(code)) {
    // 未知错误
    code = -1
    message = '接口异常！'
  }
  else {
    /**
     * TODO 此处可以根据后端返回的错误码自定义框架层面的错误处理
     */
    switch (code) {
      case 400:
        message = message || '请求参数错误'
        break
      case 401:
        message = message || '登录已过期'
        break
      case 403:
        message = message || '没有权限'
        break
      case 404:
        message = message || '资源或接口不存在'
        break
      default:
        message = message || '未知异常'
        break
    }
  }
  console.error(`【${code}】 ${error}`)
  return Promise.resolve({ code, message, error })
}
