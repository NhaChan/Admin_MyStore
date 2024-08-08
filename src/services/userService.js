import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/user'

const getAllUser = async () => await axios.get(API_URL)

const userService = {
  getAllUser,
}

export default userService
