<script setup lang="ts">
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
          <div ml-auto items-center hidden md:flex>
            <n-statistic label="待办" :value="4" w-80>
              <template #suffix>
                / 10
              </template>
            </n-statistic>
            <n-statistic label="Stars" w-80 ml-20>
              <a href="https://github.com/zclzone/qs-admin">
                <img allt="stars" src="https://badgen.net/github/stars/zclzone/qs-admin">
              </a>
            </n-statistic>
            <n-statistic label="Forks" w-80 ml-20>
              <a href="https://github.com/zclzone/qs-admin">
                <img allt="forks" src="https://badgen.net/github/forks/zclzone/qs-admin">
              </a>
            </n-statistic>
          </div>
        </div>
      </n-card>
    </n-watermark>

    <n-card title="项目" size="small" :segmented="true" mt-15 rounded-10>
      <template #header-extra>
        <n-button text type="primary">
          更多
        </n-button>
      </template>
      <div flex flex-wrap justify-around>
        <n-card
          title="数据"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <template #header-extra>
            <icon-material-symbols-refresh text-true-gray text-25 mr-2 />
            <n-switch @update:value="handleAutoRefreshChange" />
          </template>

          <n-grid :cols="5">
            <n-gi>
              <n-statistic label="用户数" :value="dataList.userCount" />
            </n-gi>
            <n-gi>
              <n-statistic label="在线人数" :value="dataList.onlineUserCount" />
            </n-gi>
            <n-gi>
              <n-statistic label="动态数" :value="dataList.dynamicCount" />
            </n-gi>
          </n-grid>
        </n-card>
        <div w-300 h-0 />
        <div w-300 h-0 />
        <div w-300 h-0 />
        <div w-300 h-0 />
      </div>
    </n-card>

    <AppFooter mt-20 />
  </div>
</template>
