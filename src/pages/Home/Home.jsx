import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DollarTwoTone,
  ExclamationCircleTwoTone,
  IdcardTwoTone,
  PieChartTwoTone,
} from '@ant-design/icons'
import { Card, DatePicker, Divider, InputNumber, Select, Statistic } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { formatDate, formatVND, getISOString, showError } from '../../services/commonService'
import expenseService from '../../services/expenseService'
import statisticService from '../../services/statisticService'
import locale from 'antd/es/date-picker/locale/vi_VN'
import ChartDate from '../../components/Charts/ChartDate'
import MonthYearStatistic from '../../components/Charts/ChartMonthYear'

const { RangePicker } = DatePicker

const expenseColumns = [
  {
    title: 'Mã phiếu nhập',
    dataIndex: 'id',
  },
  {
    title: 'Ngày nhập hàng',
    dataIndex: 'entryDate',
    render: (value) => formatDate(value),
  },
  {
    title: 'Số tiền',
    dataIndex: 'total',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.total - b.total,
  },
]

const saleColumns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'id',
  },
  {
    title: 'Ngày nhận hàng',
    dataIndex: 'dateReceived',
    render: (value, record) => (value ? formatDate(value) : record.month + '/' + record.year),
  },
  {
    title: 'Phương thức thanh toán',
    dataIndex: 'paymentMethodName',
  },
  {
    title: 'Số tiền',
    dataIndex: 'total',
    render: (value) => formatVND(value),
    sorter: (a, b) => a.total - b.total,
  },
]

const Home = () => {
  const [countUser, setCountUser] = useState(0)
  // const [countProduct, setCountProduct] = useState(0)
  const [countOrder, setCountOrder] = useState(0)
  const [countOrderCancel, setCountOrderCancel] = useState(0)
  const [totalLoading, setTotalLoading] = useState(false)
  const [totalMonth, setTotalMonth] = useState({})
  const [loading, setLoading] = useState(false)
  const [expenseData, setExpenseData] = useState([])
  const [saleData, setSaleData] = useState([])
  const [totalObj, setTotalObj] = useState({})
  // const [total, setTotal] = useState(0)
  const [rangeDate, setRangeDate] = useState(null)
  const [statisticType, setStatisticType] = useState('monthYear')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [totalMonthYear, setTotalMonthYear] = useState({})
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false)

  const handleStatisticTypeChange = (value) => {
    setStatisticType(value)
    setRangeDate(null)
    setExpenseData([])
    setSaleData([])
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const resU = await expenseService.getCountUser()
        // console.log(resU)
        // const resP = await expenseService.getCountProduct()
        const resO = await expenseService.getCountOrder()
        const resOC = await expenseService.getCountOrderCancel()

        setCountUser(resU.data)
        // setCountProduct(resP.data)
        setCountOrder(resO.data)
        setCountOrderCancel(resOC.data)
      }
      fetchData()
    } catch (error) {
      showError(error)
    }
  }, [])

  useLayoutEffect(() => {
    const fetchCurrentMonthStatistics = async () => {
      const today = new Date()
      const start = getISOString(new Date(today.getFullYear(), today.getMonth(), 1))
      const end = getISOString(new Date(today.getFullYear(), today.getMonth() + 1, 0))

      setTotalLoading(true)
      try {
        const res = await statisticService.getStatistics(start, end)
        setTotalMonth({
          expense: res.data.expense.total,
          sale: res.data.sale.total,
        })
      } catch (error) {
        showError(error)
      } finally {
        setTotalLoading(false)
      }
    }

    fetchCurrentMonthStatistics()
  }, [])

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        if (statisticType === 'date' && rangeDate && rangeDate.length === 2) {
          const [from, to] = rangeDate.map((date) => date.format('YYYY-MM-DD'))
          const res = await statisticService.getStatistics(from, to)
          // console.log(res)
          setExpenseData(res.data.expense?.expenseList || [])
          setSaleData(res.data.sale?.saleList || [])
          setTotalObj({
            expense: res.data.expense.total,
            sale: res.data.sale.total,
          })
        } else if (statisticType === 'monthYear' && selectedYear) {
          const res = await statisticService.getStatisticYearMonth(selectedYear, selectedMonth)
          console.log('year', res)
          setExpenseData(res.data.expense.expenseList)
          setSaleData(res.data.sale.saleList)
          setTotalMonthYear({
            expense: res.data.expense.total,
            sale: res.data.sale.total,
          })
        }
      } catch (error) {
        showError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStatistics()
  }, [rangeDate, selectedYear, selectedMonth, statisticType])

  const handleDateRangeChange = (range) => {
    setRangeDate(range || [])
    setIsDateRangeSelected(!!range)
  }

  const processData = (expenseData, saleData) => {
    if (!expenseData.length && !saleData.length) {
      return []
    }

    // Gom dữ liệu chi tiêu theo ngày và tính tổng cho mỗi ngày
    const expenseByDate = expenseData.reduce((acc, item) => {
      if (item.entryDate) {
        const date = item.entryDate.split('T')[0] // Chỉ lấy phần ngày
        if (!acc[date]) {
          acc[date] = { total: 0 }
        }
        acc[date].total += item.total
      }
      return acc
    }, {})

    // Gom dữ liệu doanh thu theo ngày và tính tổng cho mỗi ngày
    const saleByDate = saleData.reduce((acc, item) => {
      if (item.dateReceived) {
        const date = item.dateReceived.split('T')[0] // Chỉ lấy phần ngày
        if (!acc[date]) {
          acc[date] = { total: 0 }
        }
        acc[date].total += item.total
      }
      return acc
    }, {})

    // Lấy danh sách tất cả các ngày duy nhất từ cả expenseByDate và saleByDate
    const allDates = Array.from(
      new Set([...Object.keys(expenseByDate), ...Object.keys(saleByDate)]),
    )

    // Tạo dữ liệu kết hợp cho biểu đồ
    const combinedData = allDates.map((date) => {
      const expenseTotal = expenseByDate[date] ? expenseByDate[date].total : 0
      const saleTotal = saleByDate[date] ? saleByDate[date].total : 0
      const label = formatDate(date)
      return {
        time: date,
        label: label,
        Expense: expenseTotal,
        Sale: saleTotal,
      }
    })

    // Sắp xếp dữ liệu theo ngày
    combinedData.sort((a, b) => new Date(a.time) - new Date(b.time))

    return combinedData
  }

  // const processData = (expenseData, saleData, rangeDate) => {
  //   if (!rangeDate) return []
  //   const startDate = rangeDate[0]
  //   const endDate = rangeDate[1]
  //   const isLongRange = (endDate - startDate) / (1000 * 60 * 60 * 24) > 365

  //   if (isLongRange) {
  //     // Group data by year
  //     const expenseByYear = expenseData.reduce((acc, item) => {
  //       const year = new Date(item.entryDate).getFullYear()
  //       acc[year] = (acc[year] || 0) + item.total
  //       return acc
  //     }, {})

  //     const saleByYear = saleData.reduce((acc, item) => {
  //       const year = new Date(item.dateReceived).getFullYear()
  //       acc[year] = (acc[year] || 0) + item.total
  //       return acc
  //     }, {})

  //     // Format data for BarChart
  //     return Object.keys(expenseByYear)
  //       .map((year) => ({
  //         name: year,
  //         Expense: expenseByYear[year],
  //         Sale: saleByYear[year] || 0,
  //       }))
  //       .sort((a, b) => a.name - b.name)
  //   } else {
  //     const isLongRange = endDate.diff(startDate, 'days') > 30
  //     const groupByKey = (date) => {
  //       const jsDate = new Date(date)
  //       return isLongRange
  //         ? `${jsDate.getFullYear()}-${jsDate.getMonth() + 1}`
  //         : jsDate.toISOString().split('T')[0]
  //     }

  //     const combinedData = {}

  //     expenseData.forEach((expense) => {
  //       const key = groupByKey(expense.entryDate)
  //       if (!combinedData[key]) combinedData[key] = { name: key, Expense: 0, Sale: 0 }
  //       combinedData[key].Expense += expense.total
  //     })

  //     saleData.forEach((sale) => {
  //       const key = groupByKey(sale.dateReceived)
  //       if (!combinedData[key]) combinedData[key] = { name: key, Expense: 0, Sale: 0 }
  //       combinedData[key].Sale += sale.total
  //     })

  //     return Object.values(combinedData)
  //       .map((item) => ({
  //         ...item,
  //         name: isLongRange
  //           ? `Tháng ${item.name.split('-')[1]} Năm ${item.name.split('-')[0]}`
  //           : item.name,
  //       }))
  //       .sort((a, b) => new Date(a.name) - new Date(b.name))
  //   }
  // }

  const data = processData(expenseData, saleData, rangeDate)

  const processDataYear = (expenseData, saleData, selectedYear, selectedMonth = null) => {
    const allTimes = Array.from(
      new Set([...expenseData.map((e) => e.time), ...saleData.map((s) => s.time)]),
    )

    const combinedData = allTimes.map((time) => {
      const expense = expenseData.find((e) => e.time === time)
      const sale = saleData.find((s) => s.time === time)

      const label = selectedMonth
        ? `${time}-${selectedMonth}-${selectedYear}`
        : `${time}-${selectedYear}`

      return {
        time,
        label,
        Expense: expense ? expense.total : 0,
        Sale: sale ? sale.total : 0,
      }
    })
    combinedData.sort((a, b) => new Date(a.time) - new Date(b.time))
    return combinedData
  }

  const dataYear = processDataYear(expenseData, saleData, selectedYear, selectedMonth)

  return (
    <>
      <div className="grid lg:grid-cols-6 grid-cols-3 sm:grid-cols-1 gap-4">
        <div className="col-span-3 grid md:grid-cols-3 sm:grid-cols-1 gap-2">
          <div className="col-span-full">
            <Divider className="border-0"></Divider>
          </div>
          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Khách hàng"
              value={countUser}
              precision={0}
              prefix={<IdcardTwoTone className="text-4xl" />}
            />
          </Card>
          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Đơn hàng"
              value={countOrder ?? 0}
              precision={0}
              prefix={<PieChartTwoTone className="text-4xl" />}
            />
          </Card>
          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Đơn bị hủy"
              value={countOrderCancel ?? 0}
              precision={0}
              prefix={<ExclamationCircleTwoTone className="text-4xl" />}
            />
          </Card>
        </div>
        <div className="col-span-3 grid md:grid-cols-3 sm:grid-cols-1 gap-2">
          <div className="col-span-full">
            <Divider style={{ margin: '0.2rem 0' }}>Doanh thu tháng hiện tại</Divider>
          </div>

          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Chi tiêu"
              value={formatVND(totalMonth.expense)}
              precision={2}
              loading={totalLoading}
              valueStyle={{
                color: 'red',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
              prefix={<ArrowDownOutlined className="text-2xl" />}
            />
          </Card>
          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Doanh thu"
              value={formatVND(totalMonth.sale)}
              precision={2}
              loading={totalLoading}
              valueStyle={{
                color: 'green',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
              prefix={<DollarTwoTone className="text-2xl" />}
            />
          </Card>
          <Card loading={loading} className="drop-shadow rounded-sm" bordered={false}>
            <Statistic
              title="Lợi nhuận"
              valueStyle={{
                color: totalMonth.sale - totalMonth.expense > 0 ? 'green' : 'red',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
              value={formatVND(totalMonth.sale - totalMonth.expense)}
              loading={totalLoading}
              prefix={
                totalMonth.sale - totalMonth.expense > 0 ? (
                  <ArrowUpOutlined className="text-2xl" />
                ) : (
                  <ArrowDownOutlined className="text-2xl" />
                )
              }
            />
          </Card>
        </div>
      </div>
      <div className="pt-4">
        <Select
          size="large"
          defaultValue="monthYear"
          onChange={handleStatisticTypeChange}
          style={{ width: 200, marginBottom: 16 }}
        >
          <Select.Option value="date">Thống kê theo ngày</Select.Option>
          <Select.Option value="monthYear">Theo tháng và năm</Select.Option>
        </Select>
      </div>
      {statisticType === 'date' && (
        <>
          <RangePicker
            size="large"
            className="rounded-none mb-4"
            onChange={handleDateRangeChange}
            locale={locale}
            style={{ width: '50%' }}
          />
          {isDateRangeSelected && (
            <ChartDate
              loading={loading}
              data={data}
              totalObj={totalObj}
              expenseColumns={expenseColumns}
              expenseData={expenseData}
              saleColumns={saleColumns}
              saleData={saleData}
            />
          )}
        </>
      )}

      {statisticType === 'monthYear' && (
        <>
          <InputNumber
            className="rounded-none"
            size="large"
            min={2015}
            max={new Date().getFullYear()}
            placeholder="Nhập năm"
            onChange={(value) => setSelectedYear(value)}
            value={selectedYear}
          />

          <InputNumber
            className="rounded-none"
            size="large"
            min={1}
            max={12}
            placeholder="Chọn tháng"
            onChange={(value) => setSelectedMonth(value || null)}
            value={selectedMonth}
          />
          <MonthYearStatistic
            data={dataYear}
            totalMonthYear={totalMonthYear}
            loading={totalLoading}
          />
        </>
      )}
    </>
  )
}

export default Home
