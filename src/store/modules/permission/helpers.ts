import type { RouteType, RoutesType } from '~/types/router'

function hasPermission(route: RouteType, role: string[], menu: Array<string> = []) {
  // * 不需要权限直接返回true
  if (!route.meta?.requireAuth)
    return true

  if (role[0] === 'admin')
    return true

  const routeRole = route.meta?.role ? route.meta.role : []

  // * 登录用户没有角色或者路由没有设置角色判定为没有权限
  if (!role.length || !routeRole.length)
    return false
  // * 路由指定的角色包含任一登录用户角色则判定有权限

  console.log(role[0], route.name, menu.includes(route.name))
  return menu.includes(route.name)
}

export function filterAsyncRoutes(routes: RoutesType = [], role: Array<string>, menu: Array<string> = []): RoutesType {
  const ret: RoutesType = []
  routes.forEach((route) => {
    if (hasPermission(route, role, menu)) {
      const curRoute: RouteType = {
        ...route,
        children: [],
      }
      if (route.children && route.children.length)
        curRoute.children = filterAsyncRoutes(route.children, role, menu) || []
      else
        Reflect.deleteProperty(curRoute, 'children')

      ret.push(curRoute)
    }
  })
  return ret
}
