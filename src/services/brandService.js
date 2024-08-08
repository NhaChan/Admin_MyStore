import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/brands'

const getBrands = async () => await axios.get(API_URL)

const addBrand = async (data) => await axios.post(API_URL + '/create', data)

const deleteBrand = async (id) => await axios.delete(`${API_URL}/${id}`)

const brandService = {
  getBrands,
  addBrand,
  deleteBrand,
}

export default brandService
