<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NGi, NGrid, NPopconfirm, NSelect } from 'naive-ui'
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { PaginationProps } from 'naive-ui/es/pagination'
import api from '@/views/community/comment/api'
import type { AdminGetCommentParam } from '@/views/community/comment/type/request'
import type { AdminCommentVo } from '@/views/community/comment/type/response'
import type { TargetParam } from '~/types/http'
import { TargetType } from '~/types/http'
import { renderIcon, timeFormat } from '@/utils/common'

const tableData = ref<RowData[]>([])
const loading = ref<boolean>(false)
const route = useRoute()
const router = useRouter()

const range = ref<[number, number ] | null>(null)

const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

const queryForm = ref<AdminGetCommentParam>({
  targetType: TargetType.DYNAMIC,
})

const targetTypeOptions: SelectMixedOption[] = [
  {
    label: '动态',
    value: TargetType.DYNAMIC,
  },
]

interface RowData extends AdminCommentVo {

}

const handleSelectStat = (row: RowData, value: number) => {
  loading.value = true
  // api.updateDynamic({ id: row.id, stat: value }).then(() => {
  //   row.stat = value
  //   window.$message?.success('修改成功')
  // }).catch(() => {
  //   window.$message?.error('修改成功')
  // }).finally(() => {
  //   loading.value = false
  // })
}

const updateTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  range.value && (queryForm.value.timeStart = range.value[0] ?? undefined)
  range.value && (queryForm.value.timeEnd = range.value[1] ?? undefined)

  api.getCommentList({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}

const handleDelete = (row: RowData) => {
  row.id && api.deleteComment(row.id).then(() => {
    window.$message?.success('删除成功')
  }).catch(() => {
    window.$message?.error('删除失败')
  }).finally(() => {
    loading.value = false
    updateTableData()
  })
}

function toSecondComment(id?: number) {
  id && router.push({ path: '/community/second-comment', query: { commentId: id } })
}

const columns: DataTableColumns<RowData> = [
  { title: 'id', key: 'id', width: 30, ellipsis: { tooltip: true } },
  { title: '目标id', key: 'targetId', width: 30, ellipsis: { tooltip: true } },
  { title: '用户名', key: 'userInfo.username', width: 50, ellipsis: { tooltip: true } },
  { title: '内容', key: 'content', width: 50, ellipsis: { tooltip: true } },
  {
    title: '发布时间',
    key: 'createdTime',
    width: 50,
    ellipsis: { tooltip: true },
    render: (row) => {
      return timeFormat(row.createdTime)
    },
  }, {
    title: '操作',
    key: 'operation',
    width: 40,
    align: 'center',
    fixed: 'left',
    render: (row: RowData) => {
      return [
        h(NButton, {
          size: 'small',
          type: 'primary',
          class: 'mr-12',
          onClick: () => toSecondComment(row.id),
        }, { default: () => '二级评论', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) }),
        h(NPopconfirm, {
          onPositiveClick: () => handleDelete(row),
        }, {
          default: () => '删除？你确定？',
          trigger: () => h(NButton, {
            size: 'small',
            type: 'error',
            disabled: row.isDeleted,
          }, { default: () => row.isDeleted ? '已删除' : '删除', icon: renderIcon('material-symbols:delete-outline', { size: 14 }) }),
        }),
      ]
    },
  },

]

onMounted(() => {
  const param: TargetParam = route.query
  param.targetType && (queryForm.value.targetType = param.targetType)
  param.targetId && (queryForm.value.targetId = param.targetId)
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
        <NGrid :cols="4" :x-gap="24">
          <n-form-item-gi
            path="keywords"
            label="关键词"
          >
            <n-input v-model:value="queryForm.keywords" />
          </n-form-item-gi>
          <n-form-item-gi
            path="targetType"
            label="评论目标类型"
          >
            <NSelect
              v-model:value="queryForm.targetType"
              clearable
              :options="targetTypeOptions"
            />
          </n-form-item-gi>
          <n-form-item-gi
            path="targetId"
            label="目标id"
          >
            <n-input v-model:value="queryForm.targetId" />
          </n-form-item-gi>
          <n-form-item-gi
            path="time"
            label="时间"
          >
            <n-date-picker v-model:value="range" type="datetimerange" clearable />
          </n-form-item-gi>
          <n-form-item-gi
            path="deleted"
            label="展示已删除"
          >
            <n-switch v-model:value="queryForm.deleted" @update:value="updateTableData" />
          </n-form-item-gi>
        </NGrid>
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
