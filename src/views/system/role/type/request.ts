import type { BasePageParam } from '~/types/http'

export interface RoleSearchParam extends RoleSaveData, BasePageParam {
}

export interface RoleSaveData {
  roleCode?: string
  roleName?: string
}

export interface RoleDeleteParam extends RoleSaveData {
  id: number
}
