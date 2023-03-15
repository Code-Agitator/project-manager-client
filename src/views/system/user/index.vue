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

const editModalMode = ref<number>(1)
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModalTitle = '我除了叫编辑我还能叫什么'
const editModal = ref<UserVo>({})
const loading = ref<boolean>(false)
const editModalWidth = '600px'
const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

interface RowData extends UserVo {
  isPublish?: boolean
  publishing?: boolean
}

const status: { [key: number]: string } = {
  0: '离职',
  1: '在职',
  2: '实习生',
}
const queryForm = ref<UserSearchParam>({})

const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchUser({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => { loading.value = false })
}
const handleDeleteUser = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await api.deleteUser(id)
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}
const columns: DataTableColumns<RowData> = [
  { title: '用户编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '用户名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '用户昵称', key: 'username', width: 150, ellipsis: { tooltip: true } },
  { title: '部门', key: 'departmentId', width: 150, render: row => row.department?.name },
  { title: '手机号码', key: 'phone', width: 150, ellipsis: { tooltip: true } },
  { title: '状态', key: 'status', width: 150, ellipsis: { tooltip: true }, render: row => row.status && status[row.status] },
  {
    title: '创建时间',
    key: 'createdTime',
    width: 150,
    ellipsis: { tooltip: true },
    render: (row) => {
      return timeFormat(row.createTime)
    },
  },
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
            onClick: () => handleDeleteUser(row.id),
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
      await api.saveUser(editModal.value)
    else
      await api.updateUser(editModal.value)
    window.$message?.success('修改成功')
    showEditModal.value = false
    initTableData()
  }
  catch (e) {
    window.$message?.error('修改失败')
  }
}

const departmentList = ref<DepartmentVo[]>([])
const getDepartmentList = async () => {
  const { data } = await departmentApi.searchDepartment({})
  departmentList.value = data?.records ?? []
}
getDepartmentList()

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
        <n-grid :cols="5" :x-gap="24">
          <n-form-item-gi label="名称">
            <n-input v-model:value="queryForm.name" />
          </n-form-item-gi>
          <n-form-item-gi label="用户状态">
            <n-select
              v-model:value="queryForm.status" ml="10"
              :options="[
                { label: '离职', value: 0 }, { label: '在职', value: 1 }, { label: '实习生', value: 2 },
              ]"
              placeholder="请选择用户状态"
            />
          </n-form-item-gi>
          <n-form-item-gi label="手机号码">
            <n-input v-model:value="queryForm.phone" ml="10" placeholder="手机号码" />
          </n-form-item-gi>
          <n-form-item-gi>
            <n-date-picker
              v-model:value="queryForm.startDate" ml="10" type="datetime"
              placeholder="请选择开始时间"
              clearable
              @confirm="(startDate) => {
                queryForm.startDate = startDate
              }"
            />
            <n-date-picker
              v-model:value="queryForm.endDate" ml="10" type="datetime"
              placeholder="请选择结束时间"
              clearable
              @confirm="(endDate) => {
                queryForm.endDate = endDate
              }"
            />
          </n-form-item-gi>

          <n-form-item-gi>
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
          <n-form-item v-if="editModalMode !== 1" path="no" label="工号">
            <n-input v-model:value="editModal.no" disabled @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="name" label="姓名">
            <n-input v-model:value="editModal.name" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="username" label="昵称">
            <n-input v-model:value="editModal.username" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="roleId" label="部门">
            <n-select
              v-model:value="editModal.departmentId"
              :options="departmentList.map(department => ({ label: department.name, value: department.id }))"
            />
          </n-form-item>
          <n-form-item path="roleId" label="角色">
            <n-select
              v-model:value="editModal.roleId" :options="[
                { label: '主管', value: 1 }, { label: '测试人员', value: 2 }, { label: '开发人员', value: 3 },
              ]"
            />
          </n-form-item>
          <n-form-item path="email" label="邮箱">
            <n-input v-model:value="editModal.email" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="phone" label="手机">
            <n-input v-model:value="editModal.phone" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="seat" label="座位">
            <n-input v-model:value="editModal.seat" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="status" label="状态">
            <n-select
              v-model:value="editModal.status" :options="[
                { label: '离职', value: 0 }, { label: '在职', value: 1 }, { label: '实习生', value: 2 },
              ]"
            />
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
