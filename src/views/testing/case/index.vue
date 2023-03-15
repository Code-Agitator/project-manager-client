<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSwitch } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import { renderIcon, timeFormat } from '@/utils/common'
import api from '@/views/system/user/api'
import departmentApi from '@/views/system/department/api'
import type { User, UserVo } from '@/views/system/user/type/response'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { RoleSaveData } from '@/views/system/role/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'
</script>

<template>
  <n-card h-full>
    <div bg-white w-full />
  </n-card>
</template>

<style scoped lang="scss">

</style>
