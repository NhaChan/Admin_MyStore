import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/brands'

const getBrands = async () => await axios.get(API_URL)

const addBrand = async (data) => await axios.post(API_URL + '/create', data)

const updateBrand = async (id, data) => await axios.put(API_URL + `/update/${id}`, data)

const deleteBrand = async (id) => await axios.delete(API_URL + `/delete/${id}`)

const brandService = {
  getBrands,
  addBrand,
  deleteBrand,
  updateBrand,
}

export default brandService
