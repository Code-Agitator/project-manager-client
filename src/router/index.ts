import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { EMPTY_ROUTE, NOT_FOUND_ROUTE, basicRoutes as routes } from './routes'
import { getToken } from '@/utils/auth/token'
import { isNullOrWhitespace } from '@/utils/common'
import { usePermissionStore, useUserStore } from '@/store'
import type { RouteType } from '~/types/router'

const isHash = import.meta.env.VITE_USE_HASH === 'true'
const VITE_PUBLIC_PATH = import.meta.env.VITE_PUBLIC_PATH
export const router = createRouter({
  history: isHash ? createWebHashHistory(VITE_PUBLIC_PATH ?? '/') : createWebHistory(VITE_PUBLIC_PATH ?? '/'),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    router.hasRoute(name!) && router.removeRoute(name!)
  })
  await addDynamicRoutes()
}

export async function addDynamicRoutes() {
  // const token = getToken()
  const userInfo = localStorage.getItem('userInfo')

  // 没有token情况
  // if (isNullOrWhitespace(token)) {
  if (!userInfo) {
    router.addRoute(EMPTY_ROUTE)
    return
  }

  // 有token的情况
  try {
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    !userStore.userId && (await userStore.getUserInfo())
    const accessRoutes = permissionStore.generateRoutes(userStore.role)
    accessRoutes.forEach((route: RouteType) => {
      !router.hasRoute(route.name) && router.addRoute(route)
    })
    router.hasRoute(EMPTY_ROUTE.name) && router.removeRoute(EMPTY_ROUTE.name)
    router.addRoute(NOT_FOUND_ROUTE)
  }
  catch (error) {
    console.error(error)
  }
}

export async function setupRouter(app: App) {
  await addDynamicRoutes()
  setupRouterGuard(router)
  app.use(router)
}
