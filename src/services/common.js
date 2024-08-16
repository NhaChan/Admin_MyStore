import { notification } from 'antd'

const API_URL = process.env.REACT_APP_BASE_URL

export const toImageLink = (link) => {
  return API_URL + '/' + link
}

export const showError = (error) => {
  const errorMessage = error?.response?.data?.title || error?.response?.data || error?.message

  notification.error({
    message: 'Error',
    description: errorMessage,
  })
}

export const toImageSrc = (url) => API_URL + '/' + url
