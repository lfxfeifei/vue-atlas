import request from '@/utils/request'

export const getAccountRecords = (params: any) =>
    request({
        url: `/articles?page=${params.page}&limit=${params.size}`,
        method: 'get',
        data: {
            endDate: params.endDate,
            startDate: params.startDate,
            status: params.status
        }
    })
