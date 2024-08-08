import axios from "axios"

const API_URL = 'https://localhost:7049/api/auth'

const login = async(data) => await axios.post(API_URL + '/login', data)

const authService = {
    login,
}

export default authService