import { defineStore } from 'pinia'
import { removeToken } from '@/utils/auth/token'
import { toLogin } from '@/utils/auth/router'

interface UserInfo {
  id?: number
  name?: string
  avatar?: string
  role?: Array<string>
  departmentId?: string
  menu?: Array<string>
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo>{},
    }
  },
  getters: {
    userId(): number | undefined {
      return <number> this.userInfo.id || undefined
    },
    name(): string {
      return this.userInfo.name || ''
    },
    avatar(): string {
      return this.userInfo.avatar || ''
    },
    departmentId(): string {
      return this.userInfo.departmentId || ''
    },
    role(): Array<string> {
      return this.userInfo.role || []
    },
    menu(): Array<string> {
      return this.userInfo.menu || []
    },

  },
  actions: {
    async getUserInfo() {
      try {
        // const res = await api.getUser()
        const userInfo = sessionStorage.getItem('userInfo')
        const res = userInfo ? JSON.parse(userInfo) : null
        // if (res.code === 200) {
        if (res) {
          // res.data && (this.userInfo = { id:res.data?.userId, name:res.data?.username, avatar:res.data?.avgPath, role:['admin'] })
          res.role.menu && (this.userInfo.menu = JSON.parse(res.role.menu))
          this.userInfo.role = [res?.role?.roleCode]
          this.userInfo.name = res.name
          this.userInfo.id = res.id
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
      sessionStorage.removeItem('userInfo')
      this.userInfo = {}
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
