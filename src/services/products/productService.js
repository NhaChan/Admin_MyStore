import axios from 'axios'
import brandService from './brandService'
import categoryService from './categoryService'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/products'

const getAll = async () => await axios.get(API_URL)

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

const addProduct = async (data) => await axios.post(API_URL + '/create', data)

const updateProduct = async (id, data) => await axios.put(API_URL + `/update/${id}`, data)

const deleteProduct = async (id) => await axios.delete(API_URL + `/delete/${id}`)

const productService = {
  getAll,
  fetchProductAttributes,
  addProduct,
  getById,
  updateProduct,
  deleteProduct,
}

export default productService
