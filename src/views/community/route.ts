import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Community',
  path: '/community',
  component: Layout,
  redirect: '/community/dynamic',
  meta: {
    title: '社区管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 2,
  },
  children: [
    {
      name: 'Dynamic',
      path: 'dynamic',
      component: () => import('@/views/community/dynamic/index.vue'),
      meta: {
        title: '动态管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    }, {
      name: 'Comment',
      path: 'comment',
      component: () => import('@/views/community/comment/index.vue'),
      meta: {
        title: '评论管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
    {
      name: 'SecondComment',
      path: 'second-comment',
      component: () => import('@/views/community/second-comment/index.vue'),
      meta: {
        title: '二级评论管理',
        icon: 'logos:unocss',
        role: ['admin'],
        requireAuth: true,
      },
    },
  ],
} as RouteType
