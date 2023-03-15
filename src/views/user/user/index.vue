<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSwitch } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import { renderIcon, timeFormat } from '@/utils/common'
import api from '@/views/user/user/api'
import type { UserListVo } from '@/views/user/user/type/response'
import type { GetUserListParam } from '@/views/user/user/type/request'

const modalForm = ref<UserListVo>({})
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModalTitle = '我除了叫编辑我还能叫什么'
const loading = ref<boolean>(false)
const editModalWidth = '600px'
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

interface RowData extends UserListVo {
  isPublish?: boolean
  publishing?: boolean
}

function handleLockUser(row: RowData) {
  api.lockUser({ userId: row.id, lock: row.notLocked }).then(() => {
    row.notLocked = !row.notLocked
    window.$message?.success('修改成功')
  }).catch(() => {
    window.$message?.error('修改失败')
  }).finally(() => {
    loading.value = false
  })
}

const columns: DataTableColumns<RowData> = [
  {
    title: '锁定',
    key: 'notLocked',
    width: 60,
    align: 'center',
    fixed: 'left',
    render(row: RowData) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: !row.notLocked,
        loading: row.publishing,
        onUpdateValue: () => handleLockUser(row),
      })
    },
  },
  { title: 'id', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '用户名', key: 'username', width: 150, ellipsis: { tooltip: true } },
  { title: '真实姓名', key: 'realName', width: 40, ellipsis: { tooltip: true } },
  {
    title: '注册时间',
    key: 'createdTime',
    width: 150,
    ellipsis: { tooltip: true },
    render: (row) => {
      return timeFormat(row.createdTime)
    },
  },
]
const queryForm = ref<GetUserListParam>({})

const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.getUserList({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}

onMounted(() => {
  initTableData()
  pagination.onUpdatePage = (page) => {
    pagination.page = page
    initTableData()
  }
})
</script>

<template>
  <n-card h-full>
    <div bg-white w-full>
      <n-form
        label-placement="left"
        :model="queryForm"
      >
        <n-grid :cols="4" :x-gap="24">
          <n-form-item-gi
            path="keywords"
            label="关键词"
          >
            <n-input v-model:value="queryForm.keywords" />
          </n-form-item-gi>
        </n-grid>
        <n-form-item float-right>
          <NButton type="primary" @click="initTableData">
            搜索
          </NButton>
        </n-form-item>
      </n-form>
    </div>

    <n-data-table
      mt-20
      remote
      :columns="columns"
      :row-key="(row:RowData) => row.id"
      :data="tableData"
      :pagination="pagination"
      :scroll-x="1600"
      :loading="loading"
    />
  </n-card>
</template>

<style scoped lang="scss">

</style>
