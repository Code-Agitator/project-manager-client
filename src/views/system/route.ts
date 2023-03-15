import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'System',
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  meta: {
    title: '系统管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'User',
      path: 'user',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    }, {
      name: 'Department',
      path: 'department',
      component: () => import('@/views/system/department/index.vue'),
      meta: {
        title: '部门管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
  ],
} as RouteType
