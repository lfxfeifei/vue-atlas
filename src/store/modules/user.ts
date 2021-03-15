import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { login, getUserInfo } from '@/api/users'
import store from '@/store'

export interface IUserState {
  id_token: string
  username: string
  password: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public id_token = getToken() || ''
  public username = ''
  public password = ''
  public roles: string[] = []

  @Mutation
  private SET_TOKEN(token: string) {
    this.id_token = token
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles

  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    location.reload()
  }

  @Action
  public async Login(params: any) {
    let { username, password, router } = params
    username = username.trim()

    const accessToken  = "admin-token"
    setToken(accessToken)
    this.SET_TOKEN(accessToken)
    router.push('/')
  }

  @Action
  public async GetUserInfo() {
    if (this.id_token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    // const { data } = await getUserInfo()
    // console.log(data.user.roles)
    // if (!data) {
    //   throw Error('Verification failed, please Login again.')
    // }
    const  roles= ["admin"]
   
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }

    this.SET_ROLES(roles)
  }
}

export const UserModule = getModule(User)
