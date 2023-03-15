<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, useDialog } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import api from '@/views/system/role/api'
import type { UserVo } from '@/views/system/user/type/response'
import type { RoleSaveData, RoleSearchParam } from '@/views/system/role/type/request'
import type { Role } from '@/views/system/role/type/response'

const dialog = useDialog()

const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<RoleSaveData>({})
const editModalTitle = '我除了叫编辑我还能叫什么'
const loading = ref<boolean>(false)
const editModalMode = ref<number>(1)
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})
const queryForm = ref<RoleSearchParam>({})

const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchRole({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}
interface RowData extends Role {
}
const handleDeleteRole = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await api.deleteRole({ id })
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}
const columns: DataTableColumns<RowData> = [
  { title: '角色编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '角色名称', key: 'roleName', width: 150, ellipsis: { tooltip: true } },
  { title: '权限字符', key: 'roleCode', width: 150, ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => {
              editModalMode.value = 2
              editModal.value = row
              showEditModal.value = true
            },
          },
          { default: () => '修改' },
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            style: { marginLeft: '10px' },
            onClick: () => handleDeleteRole(row.id),
          },
          { default: () => '删除' },
        ),
      ]
    },
  },
]

const handelSaveBtnClick = async () => {
  try {
    if (editModalMode.value === 1)
      await api.saveRole(editModal.value)
    else
      await api.updateRole(editModal.value)
    window.$message?.success('修改成功')
    showEditModal.value = false
    initTableData()
  }
  catch (e) {
    window.$message?.error('修改失败')
  }
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
            <n-input v-model:value="queryForm.roleName" />
            <NButton ml="10" type="primary" @click="initTableData">
              搜索
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          ml="10" type="primary"
          @click="() => {
            editModalMode = 1
            editModal = {}
            showEditModal = true
          }"
        >
          + 新增
        </NButton>
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

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal">
          <n-form-item path="name" label="角色编号">
            <n-input v-model:value="editModal.roleCode" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="name" label="角色名称">
            <n-input v-model:value="editModal.roleName" @keydown.enter.prevent />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <NButton :loading="loading" class="mr-4" @click="showEditModal = false">
                  取消
                </NButton>
                <NButton :loading="loading" type="primary" @click="handelSaveBtnClick">
                  保存
                </NButton>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </n-card>
    </n-modal>
  </n-card>
</template>

<style scoped lang="scss">

</style>