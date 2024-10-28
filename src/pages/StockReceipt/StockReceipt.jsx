import { CloseOutlined, HomeTwoTone, PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import stockService from '../../services/stockService'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Pagination,
  Select,
  Table,
  Tag,
} from 'antd'
import { formatDate, formatDateTime, formatVND, showError } from '../../services/commonService'
import productService from '../../services/products/productService'
import TextArea from 'antd/es/input/TextArea'
import { FaRegEye } from 'react-icons/fa'

const StockReceipt = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm()
  const [productNames, setProductNames] = useState([])
  const [stockDetails, setStockDetails] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const breadcrumb = [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      title: 'Phiếu nhập hàng',
    },
  ]

  const columns = (openStockDetail) => [
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span>#{value}</span>,
    },
    {
      title: 'Ngày tạo phiếu',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDate(value),
    },
    {
      title: 'Ngày nhập hàng',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Tổng giá nhập',
      dataIndex: 'total',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Thực hiện',
      dataIndex: 'id',
      render: (value, record) => (
        <Button onClick={() => openStockDetail(value)}>
          <FaRegEye />
        </Button>
      ),
    },
  ]

  const handleSearch = (key) => key && key !== search && setSearch(key)

  useEffect(() => {
    const fetchData = async () => {
      search ? setSearchLoading(true) : setIsLoading(true)
      try {
        const res = await stockService.getAllStock(currentPage, currentPageSize, search)
        const resName = await productService.getName()
        setProductNames(resName.data)
        // console.log(resName)
        console.log('stock', res.data.items)
        setData(res.data.items)
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

  const [open, setOpen] = useState(false)
  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const handleAdd = async (values) => {
    const stockReceiptData = {
      entryDate: values.entryDate ? values.entryDate.format('YYYY-MM-DD') : '',
      note: values.note || '',
      stockReceiptProducts: values.items.map((item) => ({
        productId: productNames.find((product) => product.name === item.name)?.id,
        quantity: item.quantity,
        originPrice: item.originPrice,
      })),
    }

    try {
      const res = await stockService.addStock(stockReceiptData)
      //   console.log(r)
      setData((prevData) => [res.data, ...prevData])

      form.resetFields()
      setOpen(false)
    } catch (error) {
      showError(error)
    }
  }

  const openStockDetail = async (id) => {
    setIsModalOpen(true)
    try {
      //   setOrderLoading(true)
      const res = await stockService.getStockId(id)
      console.log('std', res)
      setStockDetails(res.data)
    } catch (error) {
      showError(error)
    } finally {
      //   setOrderLoading(false)
    }
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Drawer width={500} title="Thêm phiếu nhập" onClose={onClose} open={open}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            items: [{ name: undefined, quantity: undefined, originPrice: undefined }],
          }}
        >
          <Form.Item
            label="Ngày nhập"
            rules={[
              {
                required: true,
                message: 'Tên sản phẩm không để trống',
              },
            ]}
            name="entryDate"
          >
            <DatePicker placeholder="Ngày lập phiếu" size="large" onChange={onChange} />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea
              showCount
              maxLength={200}
              placeholder="...."
              style={{ height: 70, resize: 'none' }}
            />
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: 'flex',
                  rowGap: 16,
                  flexDirection: 'column',
                }}
              >
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Phiếu nhập ${field.name + 1}`}
                    className="bg-gray-50 drop-shadow-md"
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    }
                  >
                    <Form.Item
                      label="Tên sản phẩm"
                      rules={[
                        {
                          required: true,
                          message: 'Tên sản phẩm không để trống',
                        },
                      ]}
                      name={[field.name, 'name']}
                    >
                      <Select placeholder="Chọn sản phẩm">
                        {productNames.map((product) => (
                          <Select.Option key={product.id} value={product.name}>
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        label="Số lượng"
                        rules={[
                          {
                            required: true,
                            message: 'Số lượng không để trống',
                          },
                        ]}
                        name={[field.name, 'quantity']}
                      >
                        <InputNumber className="w-full" min={0} />
                      </Form.Item>
                      <Form.Item
                        label="Giá nhập"
                        rules={[
                          {
                            required: true,
                            message: 'Giá nhập là bắt buộc',
                          },
                        ]}
                        name={[field.name, 'originPrice']}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  </Card>
                ))}
                <div className="flex justify-between space-x-3">
                  <Button size="large" type="dashed" onClick={() => add()} block>
                    + Thêm phiếu nhập
                  </Button>
                  <Button type="primary" danger size="large" htmlType="submit">
                    Lưu
                  </Button>
                </div>
              </div>
            )}
          </Form.List>
        </Form>
      </Drawer>
      <Modal
        title="Chi tiết phiếu nhập"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="p-10"
        width={700}
        footer={(_, { OkBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Divider />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={stockDetails}
          renderItem={(item) => (
            <List.Item style={{ padding: 0 }} key={item.productId}>
              <List.Item.Meta
                title={
                  <div>
                    <Tag color="magenta" size="large">
                      Mã sản phẩm #{item.productId}
                    </Tag>
                    <div className="pt-2">{item.productName}</div>
                  </div>
                }
                description={
                  <>
                    {/* <div> Số lượng nhập kho :{item.quantity}</div>
                    <div>Giá nhập : {formatVND(item.originPrice)}</div> */}
                    <div>
                      {item.quantity} x {formatVND(item.originPrice)}
                    </div>
                    {/* <div>
                      Tổng tiền: <b>{formatVND(item.originPrice * item.quantity)}</b>
                    </div> */}
                  </>
                }
              />
            </List.Item>
          )}
        />
        <Divider />
        {/* <div className="text-right text-lg">
          Tổng giá trị phiếu nhập:
          <span className="font-serif text-3xl text-red-700 px-4">
            {formatVND(
              stockDetails.reduce((acc, item) => acc + item.quantity * item.originPrice, 0),
            )}
          </span>
        </div> */}
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center">
            <Input.Search
              loading={searchLoading}
              className="w-1/3"
              size="large"
              allowClear
              onSearch={(key) => handleSearch(key)}
              onChange={(e) => e.target.value === '' && setSearch('')}
            />
            <Button size="large" type="primary" onClick={showDrawer}>
              <PlusOutlined /> Phiếu nhập
            </Button>
          </div>
          <Table
            pagination={false}
            loading={isLoading}
            columns={columns(openStockDetail)}
            dataSource={data}
            rowKey={(record) => record.id}
            className="overflow-x-auto"
          />
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
    </>
  )
}

export default StockReceipt
