import React, { useEffect, useState } from 'react'
import { formatDateTime, formatVND, showError, toImageSrc } from '../../services/commonService'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tabs,
  Tag,
} from 'antd'
import orderService from '../../services/orderService'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import { HomeTwoTone } from '@ant-design/icons'
import {
  AwaitingPickup,
  CancelStatus,
  ConfirmedStatus,
  OrderStatus,
  ProcessingStatus,
  ReceivedStatus,
} from '../../services/const'
import { FaMapMarkerAlt, FaRegEye } from 'react-icons/fa'

const breadcrumb = [
  {
    path: '/',
    title: <HomeTwoTone />,
  },
  {
    title: 'Đơn đặt hàng',
  },
]

const Order = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [orderStatus, setOrderStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [orderId, setOrderId] = useState()

  const columns = (loading, nextOrderStatus, cancelOrder, openOrderDetail) => [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span>#{value}</span>,
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'orderDate',
      render: (value) => value !== null && formatDateTime(value),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      width: 180,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      render: (value) => formatVND(value),
    },
    {
      title: 'Đã thanh toán',
      dataIndex: 'amountPaid',
      render: (value) => formatVND(value),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'orderStatus',
      align: 'center',
      filters: orderStatus,
      onFilter: (value, record) => record.orderStatus === value,
      render: (value) => {
        let color = ''
        switch (value) {
          case 0:
            color = 'gold'
            break
          case 1:
            color = 'processing'
            break
          case 2:
            color = 'blue'
            break
          case 3:
            color = 'lime'
            break
          case 4:
            color = 'cyan'
            break
          case 5:
            color = 'error'
            break
          default:
            color = 'default'
            break
        }
        return <Tag color={color}> {OrderStatus[value]}</Tag>
      },
    },
    {
      title: 'Hành động',
      align: 'center',
      dataIndex: 'id',
      width: 230,
      render: (value, record) => (
        <>
          {!(
            record.orderStatus === CancelStatus ||
            record.orderStatus === ReceivedStatus ||
            record.orderStatus === ConfirmedStatus
          ) ? (
            <Popconfirm
              title={
                <>
                  Duyệt đơn thành{' '}
                  <div className="font-semibold text-red-700">
                    {OrderStatus[record.orderStatus + 1]}
                  </div>
                </>
              }
              loading={loading}
              onConfirm={() => nextOrderStatus(value)}
            >
              <Button className="m-1" type="primary">
                Duyệt
              </Button>
            </Popconfirm>
          ) : (
            record.orderStatus === ConfirmedStatus && (
              <Popconfirm
                title="Xác nhận gọi đơn vị vận chuyển!"
                onConfirm={() => showModal(record.id)}
              >
                <Button className="m-1" type="dashed" danger>
                  Giao đơn
                </Button>
              </Popconfirm>
            )
          )}
          <Button onClick={() => openOrderDetail(value)}>
            <FaRegEye />
          </Button>
        </>
      ),
    },
    {
      align: 'center',
      dataIndex: 'orderStatus',
      render: (value, record) => (
        <>
          {value === ProcessingStatus && (
            <Popconfirm
              title="Xác nhận hủy đơn"
              loading={loading}
              onConfirm={() => cancelOrder(record.id)}
            >
              <Button type="primary" danger>
                Hủy đơn
              </Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  const handleSearch = (key) => key && key !== search && setSearch(key)

  useEffect(() => {
    const fetchData = async () => {
      search ? setSearchLoading(true) : setIsLoading(true)
      try {
        const res = await orderService.getAll(currentPage, currentPageSize, search)

        var newOrderStatus = [...new Set(res.data?.items?.map((order) => order.orderStatus))].map(
          (value) => {
            return {
              value: value,
              text: OrderStatus[value],
            }
          },
        )
        setOrderStatus(newOrderStatus)
        // console.log('order', res.data)
        setData(res.data?.items)
        setTotalItems(res.data?.totalItems)
      } catch (error) {
        showError(error)
      } finally {
        setIsLoading(false)
        setSearchLoading(false)
      }
    }
    fetchData()
  }, [currentPage, currentPageSize, search])

  const nextOrderStatus = async (id) => {
    try {
      setLoading(true)
      await orderService.updateStatus(id)
      // setData((pre) => pre.filter((e) => e.id !== id))
      setData((pre) =>
        pre.map((order) =>
          order.id === id ? { ...order, orderStatus: order.orderStatus + 1 } : order,
        ),
      )
    } catch (error) {
      showError(error)
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (id) => {
    try {
      setLoading(true)
      await orderService.cancel(id)
      setData((pre) =>
        pre.map((order) => (order.id === id ? { ...order, orderStatus: CancelStatus } : order)),
      )
    } catch (error) {
      showError(error)
    }
  }

  const showModal = (id) => {
    setIsModalOpen(true)
    setOrderId(id)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleShipping = async () => {
    try {
      setLoading(true)
      const value = await form.validateFields()
      await orderService.shipping(orderId, value)
      setData((pre) =>
        pre.map((order) =>
          order.id === orderId ? { ...order, orderStatus: AwaitingPickup } : order,
        ),
      )
    } catch (error) {
      showError(error)
    } finally {
      setIsModalOpen(false)
    }
  }

  const onCloseDrawer = () => {
    setOpenDrawer(false)
  }

  const openOrderDetail = async (id) => {
    setOpenDrawer(true)
    try {
      setOrderLoading(true)
      const res = await orderService.getOrder(id)
      console.log('dt', res)
      setOrderDetails(res.data)
    } catch (error) {
      showError(error)
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <>
      <Modal
        title="Đơn vị vận chuyển"
        open={isModalOpen}
        onOk={handleShipping}
        onCancel={handleCancel}
      >
        <Divider />
        <Form form={form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Dài"
              name="length"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập độ dài sản phẩm',
                },
              ]}
            >
              <InputNumber className="w-full" size="large" />
            </Form.Item>
            <Form.Item
              label="Nặng"
              name="weight"
              rules={[
                {
                  required: true,
                  message: 'Cân nặng là bắt buộc',
                },
              ]}
            >
              <InputNumber size="large" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Cao"
              name="height"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập chiều cao sản phẩm',
                },
              ]}
            >
              <InputNumber className="w-full" size="large" />
            </Form.Item>
            <Form.Item
              label="Rộng"
              name="width"
              rules={[
                {
                  required: true,
                  message: 'Chiều rộng là bắt buộc',
                },
              ]}
            >
              <InputNumber size="large" />
            </Form.Item>
          </div>
          <Form.Item label="Chú ý:" name="required_note">
            <Select
              size="large"
              placeholder="Ghi chú"
              options={[
                {
                  value: 0,
                  label: 'Cho thử hàng',
                },
                {
                  value: 1,
                  label: 'Chỉ xem hàng, không thử',
                },
                {
                  value: 2,
                  label: 'Không cho xem hàng',
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <Input.Search
            loading={searchLoading}
            className="w-1/3"
            size="large"
            allowClear
            placeholder="Tìm theo mã đơn, phương thức thanh toán"
            onSearch={(key) => handleSearch(key)}
            onChange={(e) => e.target.value === '' && setSearch('')}
          />

          <Tabs
            // onChange={onChange}
            type="card"
            className="w-full"
            items={Object.entries({ all: 'Tất cả', ...OrderStatus }).map(([key, value]) => {
              return {
                label: value,
                key: key,
                children: (
                  <Table
                    pagination={false}
                    loading={isLoading}
                    columns={columns(loading, nextOrderStatus, cancelOrder, openOrderDetail)}
                    dataSource={data}
                    rowKey={(record) => record.id}
                    className="overflow-x-auto"
                  />
                ),
              }
            })}
            activeKey={orderStatus}
          />

          {/* <Table
            pagination={false}
            loading={isLoading}
            columns={columns(loading, nextOrderStatus, cancelOrder, openOrderDetail)}
            dataSource={data}
            rowKey={(record) => record.id}
            className="overflow-x-auto"
          /> */}
          <Pagination
            align="end"
            hideOnSinglePage
            showSizeChanger
            defaultCurrent={currentPage}
            defaultPageSize={currentPageSize}
            total={totalItems}
            onChange={(newPage, newPageSize) => {
              setCurrentPage(newPage)
              setCurrentPageSize(newPageSize)
            }}
          />
        </div>
      </div>
      <Drawer
        open={openDrawer}
        destroyOnClose
        loading={orderLoading}
        onClose={onCloseDrawer}
        title="Chi tiết đơn hàng"
        footer={
          orderDetails && (
            <>
              <div className="py-1">Ngày đặt hàng: {formatDateTime(orderDetails.orderDate)}</div>
              <div className="py-1">
                Tạm tính: {formatVND(orderDetails.total - orderDetails.shippingCost)}
              </div>

              <div className="py-1">Phí vận chuyển: {formatVND(orderDetails.shippingCost)}</div>
              <div>
                Tổng cộng:{' '}
                <span className="text-lg font-semibold">{formatVND(orderDetails.total)}</span>
              </div>
            </>
          )
        }
      >
        {orderDetails && (
          <>
            <div className="flex items-center gap-1 py-2">
              <FaMapMarkerAlt className="text-xl text-red-600" />
              <div className="font-bold inline-block truncate">{orderDetails.receiver}</div>
            </div>
            <div>{orderDetails.deliveryAddress}</div>
            <Divider />
            <div>
              <span>Mã đơn #{orderDetails.id}</span>
            </div>
            <Divider />
            <List
              itemLayout="vertical"
              size="large"
              dataSource={orderDetails.productOrderDetails}
              renderItem={(item) => (
                <List.Item style={{ padding: 0 }} key={item.productName}>
                  <List.Item.Meta
                    avatar={
                      <Image
                        width={80}
                        height={80}
                        alt={item.productName}
                        className="object-cover"
                        src={toImageSrc(item.imageUrl)}
                      />
                    }
                    title={<div className="truncate">{item.productName}</div>}
                    description={
                      <>
                        <div>
                          {item.quantity} x {formatVND(item.price)}
                        </div>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </>
  )
}

export default Order
