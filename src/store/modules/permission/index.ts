import { defineStore } from 'pinia'
import { filterAsyncRoutes } from './helpers'
import { asyncRoutes, basicRoutes } from '@/router/routes'
import type { RoutesType } from '~/types/router'

export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: <RoutesType> [],
    }
  },
  getters: {
    routes(): RoutesType {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus(): RoutesType {
      return this.routes.filter(route => route.name && !route.isHidden && route.children?.length)
    },
  },
  actions: {
    generateRoutes(role: Array<string> = [], menu: Array<string> = []): RoutesType {
      const accessRoutes = filterAsyncRoutes(asyncRoutes, role, menu)
      this.accessRoutes = accessRoutes
      return accessRoutes
    },
  },
})
