import { Divider, Image, Select, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import { HomeTwoTone } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { formatVND, showError, toImageLink } from '../../services/commonService'
import orderService from '../../services/orderService'

const OrderDetail = () => {
  const { id } = useParams()
  const [data, setData] = useState([])
  const [orderInfo, setOrderInfo] = useState({})
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  const breadcrumb = (id) => [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      path: '/orders',
      title: 'Đơn đặt hàng',
    },
    {
      title: `Chi tiết đơn hàng #${id}`,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orderService.getOrder(id)
        //console.log('orderDetail', res.data.productOrderDetails)
        setData(res.data.productOrderDetails)
        setOrderInfo(res.data)
      } catch (error) {
        showError(error)
      }
    }
    fetchData()
  }, [id])

  //const approximate = orderInfo.total - orderInfo.shippingCost

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'imageUrl',
      render: (imageUrl, record) => (
        <div className="flex items-center">
          <Image
            className="rounded-md"
            width={100}
            height={100}
            src={toImageLink(imageUrl)}
            alt={record.productName}
          />
          <span className="ml-4">{record.productName}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      align: 'center',
      dataIndex: 'quantity',
    },
    {
      title: 'Đơn giá',
      align: 'center',
      dataIndex: 'originPrice',
      render: (value, record) => (
        <>
          <div className="line-through">{formatVND(value)}</div>
          <div className="font-bold text-red-700">{formatVND(record.price)}</div>
        </>
      ),
    },

    // {
    //   title: 'Thành tiền',
    //   align: 'center',
    //   key: 'total',
    //   render: (_, record) => {
    //     const total = (record.price - (record.price * record.discount) / 100) * record.quantity
    //     return <span>{formatVND(total)}</span>
    //   },
    // },
  ]
  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
        <div className="flex justify-between">
          <div>
            <div className="text-lg py-2 font-bold">Thông tin nhận hàng</div>
            <div>
              <span>{orderInfo.receiver}</span>
              <Divider className="my-[0.3rem] border-0" />
              <span>{orderInfo.deliveryAddress}</span>
            </div>
          </div>
          {/* <div>
            <span>Phương thức thanh toán</span>
            <span>COD</span>
          </div> */}
          {/* <div>
            Trạng thái giao hàng
            <Select
              defaultValue="lucy"
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={[
                {
                  value: 'jack',
                  label: 'Jack',
                },
                {
                  value: 'lucy',
                  label: 'Lucy',
                },
                {
                  value: 'Yiminghe',
                  label: 'yiminghe',
                },
                {
                  value: 'disabled',
                  label: 'Disabled',
                  disabled: true,
                },
              ]}
            />
          </div> */}
        </div>
        <Divider />
        <div>
          {/* <div className="text-lg py-2 font-bold">Sản phẩm</div> */}
          <Table
            pagination={false}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.productId}
            className="overflow-x-auto"
          />
        </div>
        <div className="grid grid-cols-6 gap-4 p-4">
          <div className="col-span-4"></div>
          <div className="text-left space-y-2 font-bold">
            <div>Tạm tính</div>
            <div>Phí vận chuyển</div>
            <div>Tổng cộng</div>
            <div>Đã thanh toán</div>
          </div>
          <div className="text-right space-y-2">
            <div>{formatVND(orderInfo.total - orderInfo.shippingCost)}</div>
            <div>{formatVND(orderInfo.shippingCost)}</div>
            <div className="font-bold text-red-600">{formatVND(orderInfo.total)}</div>
            <div>{formatVND(orderInfo.amountPaid)}</div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default OrderDetail
