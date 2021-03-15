import request from '@/utils/request'

export const login = (data: any) =>
  request({
    url: '/users/login',
    method: 'post',
    data
  })

export const getUserInfo = () =>
  request({
    url: '/users/info',
    method: 'post'
  })
