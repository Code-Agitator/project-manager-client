<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NRate, NSelect } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { PaginationProps } from 'naive-ui/es/pagination'
import api from '@/views/operation/feedback/api'
import { timeFormat } from '@/utils/common'
import type { Feedback } from '@/views/operation/feedback/type/response'
import type { AdminGetFeedbackParam } from '@/views/operation/feedback/type/request'

const tableData = ref<RowData[]>([])
const loading = ref<boolean>(false)
const range = ref<[number, number ] | null>(null)

const feedbackStatOptions: SelectMixedOption[] = [
  {
    label: '未处理',
    value: 1,
  }, {
    label: '已处理',
    value: 2,
  }, {
    label: '已废弃',
    value: 3,
  },
]

const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

const queryForm = ref<AdminGetFeedbackParam>({
})

interface RowData extends Feedback {

}

const handleSelectStat = (row: RowData, value: number) => {
  loading.value = true
  row.id && value && api.updateFeedbackStat({ id: row.id, stat: value }).then(() => {
    row.stat = value
    window.$message?.success('修改成功')
  }).catch(() => {
    window.$message?.error('修改成功')
  }).finally(() => {
    loading.value = false
  })
}

const updateTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  range.value && (queryForm.value.timeStart = range.value[0] ?? undefined)
  range.value && (queryForm.value.timeEnd = range.value[1] ?? undefined)

  api.getFeedbackList({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}

const columns: DataTableColumns<RowData> = [
  { title: '用户id', key: 'userId', width: 30, ellipsis: { tooltip: true } },
  {
    title: '评分',
    key: 'score',
    width: 50,
    render: (row: RowData) => {
      return h(NRate, {
        readonly: true,
        value: row.score,
      })
    },
  },
  { title: '内容', key: 'remark', width: 150, ellipsis: { tooltip: true } },
  {
    title: '发布时间',
    key: 'createdTime',
    width: 50,
    ellipsis: { tooltip: true },
    render: (row) => {
      return timeFormat(row.createdTime)
    },
  }, {
    title: '状态',
    key: 'stat',
    width: 30,
    align: 'center',
    fixed: 'left',
    render(row: RowData) {
      return h(NSelect, {
        'options': feedbackStatOptions,
        'value': row.stat,
        'onUpdate:value': (value) => {
          handleSelectStat(row, value)
        },
      })
    },
  },

]

onMounted(() => {
  queryForm.value.stat = 1
  updateTableData()
  pagination.onUpdatePage = (page) => {
    pagination.page = page
    updateTableData()
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
            path="stat"
            label="状态"
          >
            <NSelect
              v-model:value="queryForm.stat"
              clearable
              :options="feedbackStatOptions"
              @update:value="updateTableData()"
            />
          </n-form-item-gi>
          <n-form-item-gi
            path="time"
            label="时间"
          >
            <n-date-picker v-model:value="range" type="datetimerange" clearable />
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
      :pagination="pagination"
      :scroll-x="1600"
      :loading="loading"
    />
  </n-card>
</template>

<style scoped lang="scss">

</style>
