import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/review'

const deleteReview = async (id) => await axios.delete(API_URL + `/${id}`, { headers: authHeader() })

const reviewService = {
  deleteReview,
}

export default reviewService
