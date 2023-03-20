<script setup lang="ts">
import type { DataTableColumns, FormInst, FormItemRule } from 'naive-ui'
import { NButton, NInput, NSwitch, useDialog } from 'naive-ui'
import type { PaginationProps } from 'naive-ui/es/pagination'
import md5 from 'md5'
import type { FormRules } from 'naive-ui/es/form/src/interface'
import { renderIcon, timeFormat } from '@/utils/common'
import api from '@/views/system/user/api'
import departmentApi from '@/views/system/department/api'
import type { User, UserVo } from '@/views/system/user/type/response'
import type { UserSearchParam } from '@/views/system/user/type/request'
import type { RoleSaveData } from '@/views/system/role/type/request'
import type { DepartmentVo } from '@/views/system/department/type/response'
import { useUserStore } from '@/store'

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

const formRef = ref<FormInst | null>(null)
const rules: FormRules = {
  no: { required: true, trigger: ['input', 'blur'] },
  name: { required: true, trigger: ['input', 'blur'] },
  departmentId: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value !== undefined,
  },
  roleId: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value !== undefined,
  },
  email: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value: string) => /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),
  },
  phone: {
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value: string) => /^[1]+[3,8]+\\d{9}$/.test(value),
  },
  seat: { required: true, trigger: ['input', 'blur'] },
  status: {
    required: true,
    trigger: ['input', 'blur'],
    validator: (rule: FormItemRule, value?: number) => value !== undefined,
  },
}

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
const dialog = useDialog()
const userInfo = useUserStore()
const columns: DataTableColumns<RowData> = [
  { title: '用户编号', key: 'id', width: 60, ellipsis: { tooltip: true } },
  { title: '用户名称', key: 'name', width: 150, ellipsis: { tooltip: true } },
  { title: '部门', key: 'departmentId', width: 150, render: row => row.department?.name },
  { title: '手机号码', key: 'phone', width: 150, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    width: 150,
    ellipsis: { tooltip: true },
    render: row => row.status && status[row.status],
  },
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
    width: 200,
    render(row) {
      const role = userInfo.role[0]
      const isAdmin = role === 'admin' || role === 'major'
      const isSelf = row.id === (userInfo.userId as unknown as number)

      return [
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            type: 'error',
            disabled: !isAdmin && !isSelf,
            onClick: () => {
              const pwd = ref('')
              dialog.warning({
                title: '修改密码',
                positiveText: '确定',
                onPositiveClick: async () => {
                  return new Promise<void>((resolve, reject) => {
                    if (pwd.value.length < 6) {
                      window.$message?.warning('密码必须大于6位')
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return reject()
                    }
                    api.updateUser({
                      id: row.id,
                      password: md5(pwd.value),
                    }).then(() => {
                      window.$message?.success(editModalMode.value === 1 ? '新增成功' : '修改成功')
                    }).catch(() => {
                      window.$message?.error(editModalMode.value === 1 ? '新增失败' : '修改失败')
                    }).finally(() => {
                      resolve()
                    })
                  })
                },
                content: () => h(
                  NInput,
                  {
                    placeholder: '请输入密码',
                    value: pwd.value,
                    type: 'password',
                    onInput: value => pwd.value = value,
                  },
                ),
              })
            },
          },
          { default: () => '修改密码' },
        ),
        h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            disabled: !isAdmin,
            style: { marginLeft: '10px' },
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
            disabled: !isAdmin,
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
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        if (editModalMode.value === 1)
          await api.saveUser(editModal.value)
        else
          await api.updateUser(editModal.value)
        window.$message?.success(editModalMode.value === 1 ? '新增成功' : '修改成功')
        showEditModal.value = false
        initTableData()
      }
      catch (e) {
        window.$message?.error(editModalMode.value === 1 ? '新增失败' : '修改失败')
      }
    }
  })
}

const departmentList = ref<DepartmentVo[]>([])
const getDepartmentList = async () => {
  const { data } = await departmentApi.searchDepartment({})
  departmentList.value = data?.records ?? []
}
getDepartmentList()

onMounted(() => {
  const role = userInfo.role[0]
  if (role === 'major')
    queryForm.value.departmentId = userInfo.departmentId as unknown as number
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
            <NInput v-model:value="queryForm.name" />
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
            <NInput v-model:value="queryForm.phone" ml="10" placeholder="手机号码" />
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
          :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')"
          ml="10" type="primary"
          mr="10"
          @click="() => {
            editModalMode = 1
            editModal = {}
            showEditModal = true
          }"
        >
          + 新增
        </NButton>
        <n-upload
          inline
          abstract
          action="/service/user/import"
          @finish="initTableData"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <NButton type="primary" @click="handleClick">
              上传
            </NButton>
            <n-upload-file-list hidden />
          </n-upload-trigger>
        </n-upload>
        <NButton ml="10" type="primary" @click="initTableData">
          导出
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
      :loading="loading"
    />

    <n-modal v-model:show="showEditModal" :mask-closable="false">
      <n-card
        style="width: 600px" :title="editModalMode === 1 ? '新增' : '更新'" size="huge" role="dialog"
        aria-modal="true" closable @close="showEditModal = false"
      >
        <n-form ref="formRef" :model="editModal" :rules="rules">
          <n-form-item v-if="editModalMode !== 1" path="no" label="工号">
            <NInput v-model:value="editModal.no" :disabled="userInfo.role[0] !== 'admin'" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="name" label="姓名">
            <NInput v-model:value="editModal.name" :disabled="userInfo.role[0] !== 'admin'" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="departmentId" label="部门">
            <n-select
              v-model:value="editModal.departmentId"
              :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')"
              :options="departmentList.map(department => ({ label: department.name, value: department.id }))"
            />
          </n-form-item>
          <n-form-item path="roleId" label="角色">
            <n-select
              v-model:value="editModal.roleId"
              :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')" :options="[
                { label: '超级管理', value: 1 }, { label: '测试人员', value: 2 }, { label: '开发人员', value: 3 }, { label: '主管', value: 4 },
              ]"
            />
          </n-form-item>
          <n-form-item path="email" label="邮箱">
            <NInput v-model:value="editModal.email" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="phone" label="手机">
            <NInput v-model:value="editModal.phone" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item path="seat" label="座位">
            <NInput
              v-model:value="editModal.seat"
              :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')"
              @keydown.enter.prevent
            />
          </n-form-item>
          <n-form-item path="status" label="状态">
            <n-select
              v-model:value="editModal.status"
              :disabled="!(userInfo.role[0] === 'admin' || userInfo.role[0] === 'major')" :options="[
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
