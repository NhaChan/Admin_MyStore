import axios from 'axios'
import authHeader from '../authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/brands'

const getBrands = async () => await axios.get(API_URL, { headers: authHeader() })

const addBrand = async (data) =>
  await axios.post(API_URL + '/create', data, { headers: authHeader() })

const updateBrand = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, { headers: authHeader() })

const deleteBrand = async (id) =>
  await axios.delete(API_URL + `/delete/${id}`, { headers: authHeader() })

const brandService = {
  getBrands,
  addBrand,
  deleteBrand,
  updateBrand,
}

export default brandService
