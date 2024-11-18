import axios from 'axios'
import { authHeader } from './authHeader'

const API_URL = process.env.REACT_APP_BASE_URL + '/api/statistic'

const getStatistics = async (from, to) =>
  await axios.get(API_URL + `/getStatisticsFormTo?from=${from}&to=${to}`, { headers: authHeader() })

const getStatisticYearMonth = async (year, month) =>
  await axios.get(API_URL + `/byYear?year=${year}${month ? `&month=${month}` : ''}`, {
    headers: authHeader(),
  })

const getStatisticProductYear = async (productId, year, month) =>
  await axios.get(
    API_URL +
      `/by-productYear?productId=${productId}&year=${year}${month ? `&month=${month}` : ''}`,
    {
      headers: authHeader(),
    },
  )

const getStatisticProductDate = async (productId, from, to) =>
  await axios.get(
    API_URL + `/getStatisticsProductFormTo?productId=${productId}&from=${from}&to=${to}`,
    {
      headers: authHeader(),
    },
  )

const statisticService = {
  getStatistics,
  getStatisticYearMonth,
  getStatisticProductYear,
  getStatisticProductDate,
}

export default statisticService
