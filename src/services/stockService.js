import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/stock'

const getAllStock = async (page, pageSize, search) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? '',
    },
  })

const addStock = async (data) => await axios.post(API_URL, data, { headers: authHeader() })

const getStockId = async (id) => await axios.get(API_URL + `/${id}`, { headers: authHeader() })

const stockService = {
  getAllStock,
  addStock,
  getStockId,
}

export default stockService
