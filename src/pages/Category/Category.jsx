import React, { useEffect, useState } from 'react'
import {
  App,
  Button,
  Flex,
  Form,
  Image,
  Input,
  Popconfirm,
  Spin,
  Table,
  Tooltip,
  Upload,
} from 'antd'
import categoryService from '../../services/products/categoryService'
import { DeleteTwoTone, EditTwoTone, HomeTwoTone, UploadOutlined } from '@ant-design/icons'
import { SiCcleaner } from 'react-icons/si'
import { showError, toImageLink, toImageSrc } from '../../services/commonService'
import BreadcrumbLink from '../../components/BreadcrumbLink'

const Category = () => {
  const { notification } = App.useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [form] = Form.useForm()
  const [updateID, setUpdateID] = useState('')

  const [update, setUpdate] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [filelist, setFileList] = useState([])

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
      title: 'Image',
      dataIndex: 'imageUrl',
      render: (value) => <Image rootClassName="w-20 h-20" src={toImageLink(value)} />,
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
        console.log(res.data)
        setCategories(res.data)
      } catch (error) {
        showError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [update])

  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleAdd = async () => {
    const values = await form.validateFields()
    // console.log(filelist)
    try {
      const formData = new FormData()
      setLoadingAdd(true)
      const data = { ...values, image: filelist[0]?.originFileObj }
      console.log(filelist)
      Object.keys(data).forEach((key) => formData.append(key, data[key]))
      const res = await categoryService.addCategory(formData)
      setCategories([...categories, res.data])
      setUpdate(!update)
      setIsUpdate(false)
      form.resetFields()
      setFileList([])
      notification.success({
        message: `Thêm thương hiệu thành công.`,
      })
    } catch (error) {
      showError(error)
    } finally {
      setLoadingAdd(false)
    }
  }

  const onUpdate = (category) => {
    form.setFieldsValue({
      ...category,
      image: [
        {
          name: category.imageUrl,
          url: category.imageUrl,
        },
      ],
    })
    setFileList([
      {
        name: category.imageUrl,
        url: toImageSrc(category.imageUrl),
      },
    ])
    setUpdateID(category.id)
    setIsUpdate(true)
  }

  const handleUpdate = async () => {
    try {
      setLoadingUpdate(true)

      const formData = new FormData()

      const data = {
        ...form.getFieldsValue(),
        image: filelist.length > 0 ? filelist[0]?.originFileObj : null,
      }
      Object.keys(data).forEach((key) => formData.append(key, data[key]))
      console.log(updateID)
      const res = await categoryService.updateCategory(updateID, formData)
      console.log(res)
      const newCategory = categories.filter((item) => item.id !== updateID)
      setCategories([...newCategory, res.data])
      console.log(newCategory)
      console.log(res.data)

      notification.success({
        message: `Thành công.`,
      })
      setUpdate(!update)
      setIsUpdate(false)
      form.resetFields()
      setFileList([])
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
      const newData = categories.filter((item) => !(item.id === id))
      setCategories(newData)
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
            dataSource={categories}
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
            <label>Hình ảnh:</label>
            <Form.Item
              name="imageUrl"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ảnh.',
                },
              ]}
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                name="file"
                beforeUpload={() => false}
                listType="picture-card"
                fileList={filelist}
                accept="image/png, image/gif, image/jpeg, image/svg"
                maxCount={1}
                onChange={handleFileChange}
              >
                {filelist.length >= 1 ? null : (
                  <button type="button">
                    <UploadOutlined />
                    <div>Chọn ảnh</div>
                  </button>
                )}
              </Upload>
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
