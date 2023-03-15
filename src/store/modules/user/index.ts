import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth/token'
import { toLogin } from '@/utils/auth/router'

interface UserInfo {
  id?: number | string
  name?: string
  avatar?: string
  role?: Array<string>
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo>{},
    }
  },
  getters: {
    userId(): string {
      return <string> this.userInfo.id || ''
    },
    name(): string {
      return this.userInfo.name || ''
    },
    avatar(): string {
      return this.userInfo.avatar || ''
    },
    role(): Array<string> {
      return this.userInfo.role || []
    },
  },
  actions: {
    async getUserInfo() {
      try {
        // const res = await api.getUser()
        const userInfo = localStorage.getItem('userInfo')
        const res = userInfo ? JSON.parse(userInfo) : null
        // if (res.code === 200) {
        if (res) {
          // res.data && (this.userInfo = { id:res.data?.userId, name:res.data?.username, avatar:res.data?.avgPath, role:['admin'] })
          this.userInfo = res
          this.userInfo.role = [res?.role?.roleCode]
          return Promise.resolve(res)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      removeToken()
      localStorage.removeItem('userInfo')
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
