import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Dashboard',
  path: '/',
  component: Layout,
  redirect: '/workbench',
  meta: {
    order: 0,
  },
  children: [
    {
      name: 'Workbench',
      path: 'workbench',
      component: () => import('./index.vue'),
      meta: {
        title: '个人信息',
        icon: 'mdi:home',
      },
    },
  ],
} as RouteType
