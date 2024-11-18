import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/user'

const getAllUser = async (page, pageSize, search, roles) =>
  await axios.get(API_URL, {
    headers: authHeader(),
    params: {
      page: page,
      pageSize: pageSize,
      search: search ?? '',
      roles: roles,
    },
  })

const addUser = async (data) => await axios.post(API_URL + '/add', data, { headers: authHeader() })

const deleteUser = async (id) => await axios.delete(API_URL + `/${id}`, { headers: authHeader() })

const getUserId = async (id) => await axios.get(API_URL + `/${id}`, { headers: authHeader() })

const updateUser = async (id, data) =>
  await axios.put(API_URL + `/update/${id}`, data, { headers: authHeader() })

const lockOut = async (id, data) =>
  await axios.put(API_URL + `/lock/${id}`, data, { headers: authHeader() })

const userService = {
  getAllUser,
  addUser,
  deleteUser,
  getUserId,
  updateUser,
  lockOut,
}

export default userService
