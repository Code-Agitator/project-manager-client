import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Testing',
  path: '/testing',
  component: Layout,
  redirect: '/testing/plan',
  meta: {
    title: '测试管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'Plan',
      path: 'plan',
      component: () => import('@/views/testing/plan/index.vue'),
      meta: {
        title: '测试计划管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    }, {
      name: 'Defect',
      path: 'defect',
      component: () => import('@/views/testing/defect/index.vue'),
      meta: {
        title: '缺陷管理',
        icon: 'logos:unocss',
        role: ['admin', 'test', 'dev'],
        requireAuth: true,
      },
    },
    {
      name: 'Case',
      path: 'case',
      component: () => import('@/views/testing/case/index.vue'),
      meta: {
        title: '用例管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
  ],
} as RouteType
