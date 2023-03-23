<script setup lang="ts">
import { timeFormat } from '@/utils/common/timeUtil'
import { useUserStore } from '@/store'
import AppFooter from '@/components/common/AppFooter.vue'
import api from '@/views/workbench/api'
import type { SystemStatistical } from '@/views/workbench/type/response'
const dataList = ref<SystemStatistical>({})

const init = () => {
  api.getStatistical().then((res) => {
    dataList.value = res.data ?? {}
  })
}
let roundInit: string | number | NodeJS.Timer | undefined
const handleAutoRefreshChange = (value: boolean) => {
  if (value)
    roundInit = setInterval(() => init(), 5000)
  else
    clearInterval(roundInit)
}

onMounted(() => {
  init()
})
const userStore = useUserStore()
</script>

<template>
  <div min-w-375>
    <n-watermark
      cross
      selectable
      :font-size="16"
      :line-height="16"
      :width="192"
      :height="128"
      :x-offset="12"
      :y-offset="28"
      :rotate="-15"
    >
      <n-card rounded-10>
        <div flex items-center>
          <img rounded-full width="60" :src="userStore.avatar">
          <div ml-20>
            <p text-16>
              Hello, {{ userStore.name }} ！
            </p>
            <n-gradient-text
              mt-5 text-12 op-60
              gradient="linear-gradient(90deg, red 0%, green 50%, blue 100%)"
            >
              他日若遂凌云志，敢笑黄巢不丈夫~
            </n-gradient-text>
          </div>
        </div>
      </n-card>
    </n-watermark>

    <n-card title="个人信息" size="small" :segmented="true" mt-15 rounded-10>
      <div>
        <table width="600px" border="1" cellspacing="0" cellpadding="0" border-color="#eeeeee" class="table-style">
          <tr>
            <td>用户名：</td>
            <td>{{ userStore.userInfo.name }}</td>
          </tr>
          <tr>
            <td>邮箱：</td>
            <td>{{ userStore.userInfo.email }}</td>
          </tr>
          <tr>
            <td>角色：</td>
            <td>{{ userStore.userInfo.roleName }}</td>
          </tr>
          <tr>
            <td>加入时间：</td>
            <td>
              {{ timeFormat(userStore.userInfo.createdTime) }}
            </td>
          </tr>
        </table>
      </div>

      <div w-300 h-0 />
      <div w-300 h-0 />
      <div w-300 h-0 />
      <div w-300 h-0 />
    </n-card>

    <AppFooter mt-20 />
  </div>
</template>

<style>
.table-style{

}
.table-style>tr>td{
padding: 12px;
}
</style>
