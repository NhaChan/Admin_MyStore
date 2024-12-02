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
  AreaChart,
  Area,
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
                  <AreaChart
                    data={dataWithProfit}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0033FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0033FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Profit"
                      stroke="#0033FF"
                      fill="url(#colorProfit)"
                      name="Lợi nhuận"
                    />
                  </AreaChart>
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
