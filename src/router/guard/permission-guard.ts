import type { Router } from 'vue-router'
import { getToken, refreshAccessToken } from '@/utils/auth/token'
import { isNullOrWhitespace } from '@/utils/common'
import { getLocal } from '@/utils/storage';

const WHITE_LIST = ['/login']
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to) => {
    // const token = getToken()
    const userInfo = localStorage.getItem('userInfo')
    /** 没有token的情况 */
    // if (isNullOrWhitespace(token)) {
    if (!userInfo) {
      if (WHITE_LIST.includes(to.path))
        return true
      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }

    /** 有token的情况 */
    if (to.path === '/login')
      return { path: '/' }

    refreshAccessToken()
    return true
  })
}
