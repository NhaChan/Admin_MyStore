import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/categories'

const getAllCategory = async () => await axios.get(API_URL)

const addCategory = async (data) => await axios.post(API_URL + '/create', data)

const updateCategory = async (id, data) => await axios.put(API_URL + `/update/${id}`, data)

const deleteCategory = async (id) => await axios.delete(API_URL + `/delete/${id}`)

const categoryService = {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
}
export default categoryService
