import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Operation',
  path: '/operation',
  component: Layout,
  redirect: '/operation/medal',
  meta: {
    title: '运营管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 3,
  },
  children: [
    {
      name: 'Medal',
      path: 'medal',
      component: () => import('@/views/operation/medal/index.vue'),
      meta: {
        title: '勋章管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
    {
      name: 'Feedback',
      path: 'feedback',
      component: () => import('@/views/operation/feedback/index.vue'),
      meta: {
        title: '用户反馈',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
    // 占坑 要不不能显示sidebar 不能线上“运营管理”
    {
      name: 'Other',
      path: 'other',
      component: () => import('@/views/operation/other/index.vue'),
      meta: {
        title: '其他管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
  ],
} as RouteType
