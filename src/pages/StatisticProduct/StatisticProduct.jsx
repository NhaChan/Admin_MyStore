import { Card, DatePicker, InputNumber, Select, Spin, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { formatDate, showError } from '../../services/commonService'
import { MdAssignmentReturned } from 'react-icons/md'
import statisticService from '../../services/statisticService'
import MonthYearStatistic from '../../components/Charts/ChartMonthYear'
import productService from '../../services/products/productService'
import ChartDateProduct from '../../components/Charts/ChartDateProduct'

const { RangePicker } = DatePicker

const StatisticProduct = () => {
  const [productId, setProductId] = useState(null)
  const [totalLoading, setTotalLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expenseData, setExpenseData] = useState([])
  const [saleData, setSaleData] = useState([])
  const [statisticType, setStatisticType] = useState('date')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [totalMonthYear, setTotalMonthYear] = useState({})
  const [nameProduct, setNameProduct] = useState([])
  const [totalDate, setTotalDate] = useState({})
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false)
  const [dateRange, setDateRange] = useState([])
  const [search, setSearch] = useState('')

  const handleStatisticTypeChange = (value) => {
    setStatisticType(value)
    setProductId(null)
    setSelectedYear(null)
    setSelectedMonth(null)
    setExpenseData([])
    setSaleData([])
  }

  const handleSearch = (key) => key && key !== search && setSearch(key)
  // const handleSearch = (key) => {
  //   setSearch(key || '')
  // }

  useEffect(() => {
    const fetchName = async () => {
      search && setLoading(true)

      try {
        const res = await productService.getName(search)
        // console.log(res.data)
        setNameProduct(res.data)
      } catch (error) {
        showError(error)
      } finally {
        setTotalLoading(false)
        setLoading(false)
      }
    }
    const debounceFetch = setTimeout(() => {
      fetchName()
    }, 300)

    return () => clearTimeout(debounceFetch)
    // fetchName()
  }, [search])

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!productId) return
      setLoading(true)
      setExpenseData([])
      setSaleData([])
      try {
        if (statisticType === 'date' && dateRange.length === 2) {
          const [from, to] = dateRange.map((date) => date.format('YYYY-MM-DD'))
          const res = await statisticService.getStatisticProductDate(productId, from, to)
          setExpenseData(res.data.expense?.expenseList || [])
          setSaleData(res.data.sale?.saleList || [])
          setTotalDate({
            expense: res.data.expense.total,
            sale: res.data.sale.total,
          })
        } else if (statisticType === 'monthYear' && selectedYear) {
          const res = await statisticService.getStatisticProductYear(
            productId,
            selectedYear,
            selectedMonth,
          )
          setExpenseData(res.data.expense.expenseListProduct)
          setSaleData(res.data.sale.saleListProduct)
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
  }, [productId, dateRange, selectedYear, selectedMonth, statisticType])

  const handleDateRangeChange = (range) => {
    setDateRange(range || [])
    setIsDateRangeSelected(!!range)
  }

  const processDataDate = (expenseData, saleData) => {
    if (!expenseData.length && !saleData.length) {
      return []
    }
    const allDates = Array.from(
      new Set([...expenseData.map((e) => e.time), ...saleData.map((s) => s.time)]),
    )

    const combinedData = allDates.map((date) => {
      const expense = expenseData.find((e) => e.time === date)
      const sale = saleData.find((s) => s.time === date)
      const label = formatDate(date)
      return {
        time: date,
        label: label,
        Expense: expense ? expense.total : 0,
        Sale: sale ? sale.total : 0,
      }
    })
    combinedData.sort((a, b) => new Date(a.time) - new Date(b.time))
    return combinedData
  }

  const dataDate = processDataDate(expenseData, saleData)
  // console.log('Data for BarChart:', dataDate)

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
    return combinedData
  }
  const dataYear = processDataYear(expenseData, saleData, selectedYear, selectedMonth)
  //   console.log('Data for BarChart:', dataYear)

  return (
    <>
      <div className="grid sm:grid-cols-6 grid-cols-3 gap-4">
        <Card className=" shadow-sm" bordered>
          <Statistic
            title={<span className=" font-semibold">Sản phẩm</span>}
            value="11"
            prefix={
              <div className="rounded-full bg-orange-200 p-2">
                <MdAssignmentReturned className="text-2xl  text-orange-500" />
              </div>
            }
          />
        </Card>
      </div>
      <div className="pt-4 flex md:flex-row flex-col space-x-4">
        <Select
          size="large"
          defaultValue="date"
          onChange={handleStatisticTypeChange}
          style={{ width: 200, marginBottom: 16 }}
        >
          <Select.Option value="date">Thống kê theo ngày</Select.Option>
          <Select.Option value="monthYear">Theo tháng và năm</Select.Option>
        </Select>
        <Select
          loading={loading}
          value={productId}
          onChange={setProductId}
          // onSearch={(key) => {
          //   handleSearch(key)
          // }}
          onSearch={handleSearch}
          filterOption={false}
          allowClear
          // optionFilterProp="label"
          showSearch={true}
          size="large"
          className="w-full"
          placeholder="Chọn sản phẩm muốn thống kê"
        >
          {loading ? (
            <Select.Option value="" disabled>
              <Spin size="large" />
            </Select.Option>
          ) : (
            nameProduct.map((name) => (
              <Select.Option key={name.id} value={name.id} label={name.name}>
                {name.name}
              </Select.Option>
            ))
          )}
        </Select>
      </div>
      <div>
        {statisticType === 'date' && (
          <>
            <RangePicker
              className="rounded-none"
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              size="large"
            />
            {isDateRangeSelected && (
              <ChartDateProduct
                loading={loading}
                data={dataDate}
                // totalObj={totalObj}
                totalDate={totalDate}
                expenseData={expenseData}
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
      </div>
    </>
  )
}

export default StatisticProduct
