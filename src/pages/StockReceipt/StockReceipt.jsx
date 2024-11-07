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
  Modal,
  Pagination,
  Select,
  Table,
} from 'antd'
import {
  formatDate,
  formatDateTime,
  formattedDayJs,
  formatVND,
  showError,
} from '../../services/commonService'
import productService from '../../services/products/productService'
import TextArea from 'antd/es/input/TextArea'
import { FaRegEye } from 'react-icons/fa'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'

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
  const [stocktId, setStockId] = useState(null)
  // const [stockDetails, setStockDetails] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [total, setTotal] = useState(0)

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
      title: 'Người lập phiếu',
      dataIndex: 'userName',
      // sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Ngày tạo phiếu',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Ngày nhập hàng',
      dataIndex: 'entryDate',
      sorter: (a, b) => new Date(a.entryDate) - new Date(b.entryDate),
      render: (value) => value !== null && formatDate(value),
    },
    {
      title: 'Tổng giá nhập',
      dataIndex: 'total',
      render: (value) => value !== null && formatVND(value),
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
        // console.log('stock', res.data)
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

  const handleAdd = async (values) => {
    const stockReceiptData = {
      entryDate: values.entryDate ? values.entryDate.format('YYYY-MM-DD') : '',
      note: values.note || '',
      total: values.total,
      stockReceiptProducts: values.items.map((item) => ({
        productId: productNames.find((product) => product.name === item.name)?.id,
        quantity: item.quantity,
        originPrice: item.originPrice,
      })),
    }
    // console.log(stockReceiptData)
    try {
      const res = await stockService.addStock(stockReceiptData)
      // console.log(res)
      setData((prevData) => [res.data, ...prevData])

      form.resetFields()
      setOpen(false)
    } catch (error) {
      showError(error)
    }
  }

  const openStockDetail = async (id) => {
    form.resetFields()
    setIsModalOpen(true)
    const stockInfo = data.find((item) => item.id === id)
    // console.log('stockInfo', stockInfo)
    if (stockInfo) {
      setStockId({
        id: stockInfo.id,
        entryDate: formattedDayJs(stockInfo.entryDate),
        createdAt: formattedDayJs(stockInfo.createdAt),
        note: stockInfo.note,
        total: stockInfo.total || 0,
      })
      form.setFieldsValue({
        ...stockInfo,
        createdAt: stockInfo.createdAt ? dayjs(stockInfo.createdAt) : null,
        entryDate: stockInfo.entryDate ? dayjs(stockInfo.entryDate) : null,
      })
    }
    try {
      //   setOrderLoading(true)
      const res = await stockService.getStockId(id)
      // console.log('std', res)
      // setStockDetails(res.data)
      form.setFieldsValue({
        stockDetails: res.data,
      })
    } catch (error) {
      showError(error)
    } finally {
      //   setOrderLoading(false)
    }
  }

  const handleUpdate = async (values) => {
    const stockReceiptData = {
      id: stocktId.id,
      entryDate: values.entryDate ? values.entryDate.format('YYYY-MM-DD') : '',
      note: values.note || '',
      total: values.total,
      stockReceiptProducts: values.stockDetails.map((item) => ({
        productId: productNames.find((product) => product.name === item.productName)?.id,
        quantity: item.quantity,
        originPrice: item.originPrice,
      })),
    }
    console.log(stockReceiptData)
    try {
      const res = await stockService.updateStock(stockReceiptData.id, stockReceiptData)
      console.log(res)
      setData((prevData) => [res.data, ...prevData])
      form.resetFields()
      setIsModalOpen(false)
    } catch (error) {
      showError(error)
    }
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setStockId(null)
    // setStockDetails(null)
  }

  const onValuesChange = (_, allValues) => {
    const total = (allValues.items || allValues.stockDetails || []).reduce((sum, item) => {
      const itemTotal = item?.quantity && item?.originPrice ? item.quantity * item.originPrice : 0
      return sum + itemTotal
    }, 0)

    form.setFieldsValue({ total })
    setTotal(total)
    console.log(total)
  }

  return (
    <>
      <Drawer width={500} title="Thêm phiếu nhập" onClose={onClose} open={open}>
        <Form
          onValuesChange={onValuesChange}
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          initialValues={{
            items: [{ name: undefined, quantity: undefined, originPrice: undefined }],
          }}
        >
          <div className="flex justify-between space-x-4">
            <Form.Item
              label="Ngày nhập"
              rules={[
                {
                  required: true,
                  message: 'Ngày nhập hàng không được để trống',
                },
              ]}
              name="entryDate"
            >
              <DatePicker
                placeholder="Ngày lập phiếu"
                size="large"
                disabledDate={(current) => current && current.valueOf() > Date.now()}
              />
            </Form.Item>
            <Form.Item label="Tổng giá trị" name="total">
              <Input size="large" disabled />
            </Form.Item>
          </div>
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
                      <Select
                        placeholder="Chọn sản phẩm"
                        optionFilterProp="label"
                        showSearch={true}
                      >
                        {productNames.map((product) => (
                          <Select.Option key={product.id} value={product.name} label={product.name}>
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
        className="p-10 modal-body"
        width={600}
        footer={false}
        maskClosable={false}
        centered
      >
        <Form
          onValuesChange={onValuesChange}
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            // ...stocktId,
            // createdAt: stocktId?.createdAt ? dayjs(stocktId.createdAt) : null,
            // entryDate: stocktId?.entryDate ? dayjs(stocktId.entryDate) : null,
            items: [{ name: undefined, quantity: undefined, originPrice: undefined }],
          }}
        >
          <div className="flex justify-between items-center space-x-4">
            <Form.Item
              label="Ngày nhập hàng"
              rules={[
                {
                  required: true,
                  message: 'Ngày nhập hàng không được để trống',
                },
              ]}
              name="entryDate"
            >
              <DatePicker
                placeholder="Ngày lập phiếu"
                size="large"
                //defaultValue={stocktId?.entryDate ? formattedDayJs(stocktId.entryDate) : null}
                disabledDate={(current) => current && current.valueOf() > Date.now()}
              />
            </Form.Item>
            <Form.Item label="Tổng giá trị" name="total">
              <Input size="large" className="border-0" readOnly value={total} />
            </Form.Item>
            <Form.Item label="Ngày tạo phiếu" name="createdAt">
              <DatePicker
                locale={locale}
                placeholder="Ngày tạo phiếu"
                disabled
                //defaultValue={stocktId?.createdAt ? formattedDayJs(stocktId.createdAt) : null}
              />
            </Form.Item>
          </div>
          <Form.Item label="Ghi chú" name="note">
            <TextArea
              showCount
              maxLength={200}
              placeholder="...."
              style={{ height: 70, resize: 'none' }}
              value={stocktId?.note}
            />
          </Form.Item>
          <Form.List name="stockDetails">
            {(fields) =>
              fields.map((field) => (
                <>
                  <Card
                    key={field.key}
                    size="small"
                    title={`Sản phẩm ${field.key + 1}`}
                    className="bg-gray-50 drop-shadow-md"
                  >
                    <Form.Item
                      fieldKey={[field.fieldKey, 'productName']}
                      label="Tên sản phẩm"
                      name={[field.name, 'productName']}
                    >
                      <Input disabled />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        fieldKey={[field.fieldKey, 'quantity']}
                        label="Số lượng"
                        name={[field.name, 'quantity']}
                      >
                        <InputNumber className="w-full" />
                      </Form.Item>
                      <Form.Item
                        fieldKey={[field.fieldKey, 'originPrice']}
                        label="Giá nhập"
                        name={[field.name, 'originPrice']}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  </Card>
                  <Divider className="my-[0.5rem] border-0" />
                </>
              ))
            }
          </Form.List>
          <div>
            <Button type="primary" className="w-full" danger size="large" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center">
            <Input.Search
              loading={searchLoading}
              className="w-1/3"
              size="large"
              placeholder='Mã phiếu nhập...'
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
