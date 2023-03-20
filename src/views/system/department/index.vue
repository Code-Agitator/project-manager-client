<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NSwitch } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import { renderIcon, timeFormat } from '@/utils/common'
import api from '@/views/system/department/api'
import userApi from '@/views/system/user/api'
import type { Department, User, UserVo } from '@/views/system/user/type/response'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { DepartmentSearchParam } from '@/views/system/department/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'

const modalForm = ref<DepartmentSearchParam>({})
const tableData = ref<RowData[]>([])
const showEditModal = ref<boolean>(false)
const editModal = ref<DepartmentVo>({})
const loading = ref<boolean>(false)
const editModalMode = ref<number>(1)
const selectedUserName = ref<string>('')
const searchUserResult = ref<UserVo[]>([])
const autoCompleteOptions = computed(() => searchUserResult.value?.map((user) => {
  return {
    label: user.name,
    value: user.id,
  }
}) ?? [])

const pagination = reactive<PaginationProps>({
  pageSize: 10,
})

interface RowData extends DepartmentVo {

}
const queryForm = ref<UserSearchParam>({})
const initTableData = () => {
  loading.value = true
  queryForm.value.pageSize = pagination.pageSize
  queryForm.value.pageNumber = pagination.page
  api.searchDepartment({ ...queryForm.value }).then((res) => {
    tableData.value = res.data?.records as RowData[]
    pagination.page = res.data?.current
    pagination.pageCount = res.data?.pages
    pagination.itemCount = res.data?.total
  }).finally(() => loading.value = false)
}
const handleDeleteDepartment = async (id?: number) => {
  if (id === undefined)
    return
  try {
    await api.deleteDepartment(id)
    window.$message?.success('删除成功')
    initTableData()
  }
  catch (e) {
    window.$message?.error('删除失败')
  }
}
const columns: DataTableColumns<RowData> = [
  { title: '部门编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '部门名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '主管工号', key: 'userId', render: row => row.user?.no, width: 150, ellipsis: { tooltip: true } },
  { title: '主管名称', key: 'userId', render: row => row.user?.name, width: 150, ellipsis: { tooltip: true } },
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
              row.user?.name && (selectedUserName.value = row.user.name)
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
            onClick: () => handleDeleteDepartment(row.id),
          },
          { default: () => '删除' },
        ),
      ]
    },
  },
]

const toShowEditModel = () => {
  if (editModalMode.value === 1)
    editModal.value = {}
  showEditModal.value = true
}

const selected = (str: number) => {
  editModal.value.userId = str
}
const handelSaveBtnClick = async () => {
  try {
    if (editModalMode.value === 1)
      await api.saveDepartment(editModal.value)
    else
      await api.updateDepartment(editModal.value)
    window.$message?.success(editModalMode.value === 1 ? '新增成功' : '修改成功')
    showEditModal.value = false
    initTableData()
  }
  catch (e) {
    window.$message?.error(editModalMode.value === 1 ? '新增失败' : '修改失败')

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
            label="部门名称"
          >
            <n-input v-model:value="queryForm.keywords" />
            <NButton ml="10" type="primary" @click="initTableData">
              搜索
            </NButton>
          </n-form-item-gi>
        </n-grid>
        <NButton
          ml="10" type="primary"
          @click="() => {
            editModal = 1
            toShowEditModel()
            selectedUserName = ''
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
          <n-form-item path="name" label="名称">
            <n-input v-model:value="editModal.name" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="userId" label="部门主管">
            <n-auto-complete
              v-model:value="selectedUserName" :options="autoCompleteOptions"
              @select="selected"
            >
              <template
                #default="{ handleInput, value: slotValue }"
              >
                <n-input
                  :value="slotValue"
                  placeholder="选择主管"
                  @input="(name) => {
                    userApi.searchUser({ name }).then((res) => {
                      searchUserResult = res.data.records ?? []
                    }).catch(e => {
                      searchUserResult = []
                    })
                    handleInput(name)
                  }"
                />
              </template>
            </n-auto-complete>
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
