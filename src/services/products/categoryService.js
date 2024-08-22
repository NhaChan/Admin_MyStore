import axios from 'axios'
import authHeader from '../authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/categories'

const getAllCategory = async () => await axios.get(API_URL, { headers: authHeader() })

const addCategory = async (data) =>
  await axios.post(API_URL + '/create', data, { headers: authHeader() })

const updateCategory = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, { headers: authHeader() })

const deleteCategory = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const categoryService = {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
}
export default categoryService
