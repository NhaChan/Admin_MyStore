import React from 'react'
import { Card, Divider, Skeleton, Statistic, Table } from 'antd'
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { formatVND } from '../../services/commonService'

const ChartDate = ({
  loading,
  data,
  totalObj,
  expenseColumns,
  expenseData,
  saleColumns,
  saleData,
}) => {
  const dataWithProfit = data.map((item) => ({
    ...item,
    Profit: (item.Sale || 0) - (item.Expense || 0),
  }))
  return (
    <>
      <Divider>Thống kê Doanh thu và Chi tiêu</Divider>
      <Card className="shadow-sm">
        <div className="space-y-4">
          {loading && <Skeleton />}
          {!loading && data.length > 0 && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <Card bordered className="bg-indigo-200">
                  <Statistic
                    title="Chi tiêu"
                    value={formatVND(totalObj.expense || 0)}
                    precision={2}
                    loading={loading}
                    valueStyle={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  />
                </Card>
                <Card bordered className="bg-green-300">
                  <Statistic
                    title="Doanh thu"
                    value={formatVND(totalObj.sale || 0)}
                    precision={2}
                    loading={loading}
                    valueStyle={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  />
                </Card>
                <Card bordered className="bg-yellow-50">
                  <Statistic
                    title="Lợi nhuận"
                    valueStyle={{
                      color: totalObj.sale - totalObj.expense > 0 ? 'green' : 'red',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                    value={formatVND((totalObj.sale || 0) - (totalObj.expense || 0))}
                    precision={2}
                    loading={loading}
                  />
                </Card>
              </div>
              <div className="flex md:flex-row flex-col items-center justify-center pt-4 bg-white">
                <ResponsiveContainer width="100%" height={500} className="border-4">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        formatVND(value),
                        name === 'Expense' ? 'Chi tiêu' : 'Doanh thu',
                      ]}
                    />
                    <Legend
                      formatter={(value) => (value === 'Expense' ? 'Chi tiêu' : 'Doanh thu')}
                    />
                    <Bar dataKey="Expense" fill="#8884d8" />
                    <Bar dataKey="Sale" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={500} className="border-4">
                  <LineChart
                    data={dataWithProfit}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Profit" stroke="#0000FF" name="Lợi nhuận" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
          {saleData.length > 0 && (
            <div className="overflow-x-auto">
              <Table
                title={() => <span className="text-lg font-semibold">Doanh thu</span>}
                className="shadow-sm"
                columns={saleColumns}
                dataSource={saleData}
                rowKey={(record) => record.id}
                footer={() => (
                  <span className="text-lg font-semibold">
                    Tổng cộng: {formatVND(totalObj.sale)}
                  </span>
                )}
              />
            </div>
          )}
          {expenseData.length > 0 && (
            <div className="overflow-x-auto">
              <Table
                title={() => <span className="text-lg font-semibold">Chi</span>}
                className="min-w-full shadow-sm"
                columns={expenseColumns}
                dataSource={expenseData}
                rowKey={(record) => record.id}
                footer={() => (
                  <span className="text-lg font-semibold">
                    Tổng cộng: {formatVND(totalObj.expense)}
                  </span>
                )}
              />
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

export default ChartDate
