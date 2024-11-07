import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/log'

const getAllLog = async (page, pageSize, search) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? '',
    },
  })

const getLogId = async (id) => await axios.get(API_URL + `/${id}`, { headers: authHeader() })

const logService = {
  getAllLog,
  getLogId,
}

export default logService
