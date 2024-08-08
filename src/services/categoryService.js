import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/categories'

const getAllCategory = async () => await axios.get(API_URL)

const categoryService = {
  getAllCategory,
}
export default categoryService
