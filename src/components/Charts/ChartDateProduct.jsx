import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { Statistic, Card, Divider } from 'antd'
import { formatVND } from '../../services/commonService'

const ChartDateProduct = ({ data, totalDate, loading }) => {
  const dataWithProfit = data.map((item) => ({
    ...item,
    Profit: (item.Sale || 0) - (item.Expense || 0),
  }))
  return (
    <>
      <Divider>Thống kê Doanh thu và Chi tiêu</Divider>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card bordered className="bg-indigo-200">
          <Statistic
            title="Chi tiêu"
            value={formatVND(totalDate.expense || 0)}
            precision={2}
            loading={loading}
          />
        </Card>
        <Card bordered className="bg-green-300">
          <Statistic
            title="Doanh thu"
            value={formatVND(totalDate.sale || 0)}
            precision={2}
            loading={loading}
          />
        </Card>
        <Card bordered className="bg-yellow-50">
          <Statistic
            title="Lợi nhuận"
            valueStyle={{
              color: totalDate.sale - totalDate.expense > 0 ? 'yellowgreen' : 'red',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
            value={formatVND((totalDate.sale || 0) - (totalDate.expense || 0))}
            precision={2}
            loading={loading}
          />
        </Card>
      </div>
      <div></div>
      <div className="flex items-center justify-center pt-4 bg-white">
        <ResponsiveContainer width="100%" height={500} className="border-4">
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                formatVND(value),
                name === 'Expense' ? 'Chi tiêu' : 'Doanh thu',
              ]}
            />
            <Legend formatter={(value) => (value === 'Expense' ? 'Chi tiêu' : 'Doanh thu')} />
            <Bar dataKey="Expense" fill="#8884d8" />
            <Bar dataKey="Sale" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={500} className="border-4">
          <LineChart data={dataWithProfit} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
  )
}

export default ChartDateProduct
