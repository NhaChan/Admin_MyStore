import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/orders'

const getAll = async (page, pageSize, search) =>
  await axios.get(API_URL + '/get-all', {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? '',
    },
  })

const getOrder = async (id) => await axios.get(API_URL + `/${id}`, { headers: authHeader() })

const updateStatus = async (id) =>
  await axios.put(API_URL + `/${id}`, {}, { headers: authHeader() })

const cancel = async (id) => await axios.delete(API_URL + `/${id}`, { headers: authHeader() })

const nextStatus = async (orderId) =>
  await axios.put(API_URL + `/next-status/${orderId}`, { headers: authHeader() })

const shipping = async (id, data) =>
  await axios.put(API_URL + `/shipping/${id}`, data, { headers: authHeader() })

const orderService = {
  getAll,
  getOrder,
  updateStatus,
  cancel,
  nextStatus,
  shipping,
}

export default orderService
