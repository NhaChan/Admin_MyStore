import { notification } from 'antd'
import dayjs from 'dayjs'

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

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

export const dataValueLabel = (data) => {
  return data.map((item) => ({
    ...item,
    value: item.id,
    label: item.name,
  }))
}

export const formatVND = (value) => {
  const format = new Intl.NumberFormat('vi', {
    style: 'currency',
    currency: 'VND',
  })
  return format.format(value)
}

export const formatDateTime = (date) => new Date(date).toLocaleString('vi-VN')

export const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN')

export const formattedDayJs = (dateString) => {
  return dateString ? dayjs(dateString) : null
}

const timezone7 = 7 * 60 * 60 * 1000

export const getISOStringNow = () => {
  const time = new Date().getTime() + timezone7
  return new Date(time).toISOString()
}

export const getISOString = (date) => {
  const time = new Date(date).getTime() + timezone7
  return new Date(time).toISOString()
}
