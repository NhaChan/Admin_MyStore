import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/expense'

const getCountUser = async () => await axios.get(API_URL + '/user', { headers: authHeader() })

const getCountProduct = async () => await axios.get(API_URL + '/product', { headers: authHeader() })

const getCountOrder = async () => await axios.get(API_URL + '/order', { headers: authHeader() })

const getCountOrderCancel = async () =>
  await axios.get(API_URL + '/order-cancel', { headers: authHeader() })

const expenseService = {
  getCountUser,
  getCountProduct,
  getCountOrder,
  getCountOrderCancel,
}

export default expenseService
