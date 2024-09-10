import React, { useEffect, useState } from 'react'
import { App, Button, Flex, Form, Input, Popconfirm, Spin, Table, Tooltip } from 'antd'
import categoryService from '../../services/products/categoryService'
import { DeleteTwoTone, EditTwoTone, HomeTwoTone } from '@ant-design/icons'
import { SiCcleaner } from 'react-icons/si'
import { showError } from '../../services/commonService'
import BreadcrumbLink from '../../components/BreadcrumbLink'

const Category = () => {
  const { notification } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [form] = Form.useForm()
  const [updateID, setUpdateID] = useState('')

  const [update, setUpdate] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  const breadcrumb = [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      title: 'Danh mục',
    },
  ]

  const columns = (onUpdate, handleDelete) => [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      align: 'center',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thực hiện',
      align: 'center',
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => onUpdate(record)}>
              <EditTwoTone />
            </Button>
          </Tooltip>
          <Popconfirm
            title={`Xác nhận xóa ${record.name}`}
            onConfirm={() => handleDelete(record.id)}
            loading={loadingDelete}
          >
            <Button>
              <DeleteTwoTone />
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await categoryService.getAllCategory()
        // console.log(res.data)
        setData(res.data)
      } catch (error) {
        showError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [update])

  const handleAdd = async () => {
    setLoadingAdd(true)
    try {
      const values = await form.validateFields()
      categoryService.addCategory(values)
      notification.success({
        message: 'Thêm danh mục thành công',
      })
      setUpdate(!update)
      setIsUpdate(false)
      form.resetFields()
    } catch (error) {
      showError(error)
    } finally {
      setLoadingAdd(false)
    }
  }

  const onUpdate = (record) => {
    form.setFieldsValue(record)
    setUpdateID(record.id)
    setIsUpdate(true)
  }

  const handleUpdate = async () => {
    setLoadingUpdate(true)
    try {
      const values = await form.getFieldsValue()

      await categoryService.updateCategory(updateID, values)
      notification.success({
        message: `Cập nhật ${values.name} thành công.`,
      })
      setUpdate(!update)
      setIsUpdate(false)
      form.resetFields()
    } catch (error) {
      showError(error)
    } finally {
      setLoadingUpdate(false)
    }
  }

  const handleDelete = async (id) => {
    setLoadingDelete(true)
    try {
      await categoryService.deleteCategory(id)
      const newData = data.filter((item) => !(item.id === id))
      setData(newData)
    } catch (error) {
      showError(error)
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleClear = () => {
    setIsUpdate(false)
    form.resetFields()
  }

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
          <Table
            loading={isLoading}
            columns={columns(onUpdate, handleDelete)}
            dataSource={data}
            rowKey={(record) => record.id}
            className="overflow-x-auto"
          />
        </div>
        <div className="h-fit bg-white rounded-lg drop-shadow">
          <div className="text-xl text-center p-4">Danh mục</div>
          <Form form={form} className="px-4 grid grid-cols-3 gap-2">
            <label htmlFor="name">Tên danh mục:</label>
            <Form.Item
              name="name"
              className="col-span-2"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên danh mục.',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <div className="col-span-3 grid grid-cols-1 lg:grid-cols-5 gap-2 pb-4">
              <Button
                type="primary"
                className="lg:col-span-2"
                size="large"
                onClick={handleAdd}
                disabled={isUpdate}
              >
                {loadingAdd ? <Spin /> : 'Thêm'}
              </Button>
              <Button
                type="primary"
                className="lg:col-span-2"
                size="large"
                onClick={handleUpdate}
                disabled={!isUpdate}
              >
                {loadingUpdate ? <Spin /> : 'Cập nhật'}
              </Button>
              <Tooltip title="Làm mới">
                <Button size="large" className="" onClick={handleClear}>
                  <SiCcleaner className="text-2xl flex-shrink-0" />
                </Button>
              </Tooltip>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Category
