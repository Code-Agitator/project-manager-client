import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'User',
  path: '/user',
  component: Layout,
  redirect: '/user/user',
  meta: {
    title: '系统用户',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'User',
      path: 'user',
      component: () => import('@/views/user/user/index.vue'),
      meta: {
        title: '系统用户',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
  ],
} as RouteType
