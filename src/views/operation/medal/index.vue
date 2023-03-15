<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSwitch } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import type { GetUserListParam } from '@/views/user/user/type/request'
import { SystemProperties } from '@/views/system/properties/type/response'
import { renderIcon } from '@/utils/common'
import type { Medal } from '@/views/community/dynamic/type/response'
import type { MedalQueryParam } from '@/views/operation/medal/type/request'
import api from '@/views/operation/medal/api'
const loading = ref<boolean>(false)
interface RowData extends Medal {
  loading: boolean
}
const tableData = ref<RowData[]>([])
const pagination = reactive<PaginationProps>({
  pageSizes: [10, 20],
  showSizePicker: true,
  page: 1,
  pageSize: 10,
})

const queryForm = ref<GetUserListParam>({})
const getMedalData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.getMedal(queryForm.value).then((res) => {
    res && res.data && (tableData.value = res.data.records as RowData[])
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => {
    loading.value = false
  })
}

const handleStatUpdate = (row: RowData) => {
  row.loading = false
}

const handlerDelete = (row: RowData) => {
  row.stat = 1
}

const handleEdit = (row: RowData) => {
  row.stat = 1
}

const columns: DataTableColumns<RowData> = [
  {
    title: '锁定',
    key: 'stat',
    width: '5%',
    align: 'center',
    fixed: 'left',
    render(row: RowData) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.stat === 1,
        loading: row.loading,
        onUpdateValue: () => handleStatUpdate(row),
      })
    },
  },
  { title: 'name', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: 'value', key: 'desc', width: 150, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 240,
    align: 'center',
    fixed: 'right',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            class: 'mr-12',
            onClick: () => handleEdit(row),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) },
        ),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handlerDelete(row),
        }, {
          default: () => '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
        }),
      ]
    },
  },
]

onMounted(() => {
  getMedalData()
  pagination.onChange = (page) => {
    pagination.page = page
    getMedalData()
  }
})
</script>

<template>
  <n-card h-full>
    <div w-full>
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
          <NButton type="primary" @click="updateTableData">
            搜索
          </NButton>
        </n-form-item>
      </n-form>
    </div>
    <n-data-table
      remote
      mt-20
      :columns="columns"
      :row-key="(row:RowData) => row.id"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
    />
  </n-card>
</template>

<style scoped lang="scss">

</style>
