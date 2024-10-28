import axios from 'axios'
import brandService from './brandService'
import categoryService from './categoryService'
import { authHeader, authImageHeader } from '../authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/products'

const getAll = async (page, pageSize, search) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? '',
    },
  })

const getById = async (id, data) => await axios.get(API_URL + `/get/${id}`, data)

const fetchProductAttributes = async () => {
  try {
    const brands = await brandService.getBrands()
    const categories = await categoryService.getAllCategory()
    const data = {
      brands: brands.data,
      categories: categories.data,
    }
    return data
  } catch (error) {
    return new Error(error)
  }
}

const addProduct = async (data) =>
  await axios.post(API_URL + '/create', data, { headers: authImageHeader() })

const updateProduct = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, { headers: authImageHeader() })

const deleteProduct = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const updateEnable = async (id, data) =>
  await axios.put(API_URL + `/updateEnable/${id}`, data, { headers: authHeader() })

const getName = async () => await axios.get(API_URL + '/name', { headers: authHeader() })

const productService = {
  getAll,
  fetchProductAttributes,
  addProduct,
  getById,
  updateProduct,
  deleteProduct,
  updateEnable,
  getName,
}

export default productService
