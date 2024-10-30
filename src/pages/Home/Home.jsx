import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { showError } from '../../services/commonService'
import expenseService from '../../services/expenseService'
import { FaTruck, FaUserCircle } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import Meta from 'antd/es/card/Meta'
import { FcDocument } from 'react-icons/fc'

const Home = () => {
  const [countUser, setCountUser] = useState(0)
  const [countProduct, setCountProduct] = useState(0)
  const [countOrder, setCountOrder] = useState(0)
  const [countOrderCancel, setCountOrderCancel] = useState(0)

  useEffect(() => {
    try {
      const fetchData = async () => {
        const resU = await expenseService.getCountUser()
        // console.log(resU)
        const resP = await expenseService.getCountProduct()
        const resO = await expenseService.getCountOrder()
        const resOC = await expenseService.getCountOrderCancel()

        setCountUser(resU.data)
        setCountProduct(resP.data)
        setCountOrder(resO.data)
        setCountOrderCancel(resOC.data)
      }
      fetchData()
    } catch (error) {
      showError(error)
    }
  }, [])
  return (
    <>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
        <Card title="Người dùng" bordered={false}>
          <Meta
            avatar={<FaUserCircle className="text-4xl text-blue-700" />}
            description={
              <span className="md:text-2xl text-md">
                {countUser} <span className="sm:block hidden">người dùng</span>
              </span>
            }
          />
        </Card>
        <Card title="Sản phẩm" bordered={false}>
          <Meta
            avatar={<FcDocument className="text-4xl text-orange-500" />}
            description={
              <span className="md:text-2xl text-md">
                {countProduct} <span className="sm:block hidden">sản phẩm</span>
              </span>
            }
          />
        </Card>
        <Card title="Đơn đặt hàng" bordered={false}>
          <Meta
            avatar={<FaTruck className="text-4xl text-green-700" />}
            description={
              <span className="md:text-2xl text-md">
                {countOrder} <span className="sm:block hidden">đơn</span>
              </span>
            }
          />
        </Card>
        <div>
          <Card title="Đơn hàng bị hủy" bordered={false}>
            <Meta
              avatar={<MdCancel className="text-4xl text-red-700" />}
              description={
                <span className="md:text-2xl text-md">
                  {countOrderCancel} <span className="sm:block hidden">đơn</span>
                </span>
              }
            />
          </Card>
        </div>
        <Card bordered={false} className="drop-shadow">
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
        <div>
          <Card bordered={false}>
            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export default Home
