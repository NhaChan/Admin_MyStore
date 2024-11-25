import { HomeTwoTone, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  InputNumber,
  notification,
  Select,
  Spin,
  Upload,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { dataValueLabel, getBase64, showError, toImageSrc } from '../../services/commonService'
import productService from '../../services/products/productService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BreadcrumbLink from '../../components/BreadcrumbLink'

const breadcrumb = (id) => [
  {
    path: '/',
    title: <HomeTwoTone />,
  },
  {
    path: '/products',
    title: 'Sản phẩm',
  },
  {
    title: `Chi tiết sản phẩm #${id}`,
  },
]

const ProductDetail = () => {
  const [fileList, setFileList] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [productAttributes, setProductAttributes] = useState({})
  const [saveLoading, setSaveLoading] = useState(false)
  const [update, setUpdate] = useState(false)
  const [form] = Form.useForm()
  const navigation = useNavigate()

  const { id } = useParams()

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }
  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await productService.fetchProductAttributes()
        Object.keys(res).forEach((key) => (res[key] = dataValueLabel(res[key])))
        // console.log(res)
        setProductAttributes(res)

        const data = await productService.getById(id)
        form.setFieldsValue(data.data)

        const files = data.data.imageUrls.map((item) => ({
          originUrl: item,
          url: toImageSrc(item),
        }))
        setFileList(files)
      } catch (error) {
        showError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, form])

  const updateProduct = async () => {
    try {
      setSaveLoading(true)
      const formData = new FormData()

      fileList.forEach((item, i) => {
        if (item.originUrl) {
          formData.append(`imageUrls[${i}]`, item.originUrl)
        } else formData.append(`images[${i}]`, item.originFileObj)
      })

      const values = form.getFieldsValue()

      const data = {
        ...values,
        description: values.description ?? '',
        quantity: values.quantity ?? 1,
      }

      delete data.imageUrls

      Object.keys(data).forEach((key) => formData.append(key, data[key]))

      await productService.updateProduct(id, formData)

      notification.success({ message: 'Cập nhật sản phẩm thành công.', placement: 'top' })
      setUpdate(false)
      form.resetFields()
      setFileList([])
      navigation(-1)
    } catch (error) {
      showError(error)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleClear = () => {
    form.resetFields()
    setFileList([])
    setUpdate(false)
  }

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb(id)} />
      <Form
        form={form}
        disabled={saveLoading}
        onValuesChange={() => setUpdate(true)}
        onFinish={updateProduct}
        layout="vertical"
        initialValues={{ quantity: 0, discount: 0 }}
        className="grid lg:grid-cols-2 gap-4 md:grid-cols-1"
      >
        <Card>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              {
                required: true,
                message: 'Tên sản phẩm không để trống',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="Giá bán:"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá sản phẩm',
                },
              ]}
            >
              <Input className="w-full" size="large" />
            </Form.Item>
            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[
                {
                  required: true,
                  message: 'Giảm giá là bắt buộc',
                },
              ]}
            >
              <InputNumber
                className="w-full"
                size="large"
                min={0}
                formatter={(value) => `${value}%`}
                parser={(value) => value?.replace('%', '')}
              />
            </Form.Item>
            <Form.Item
              label="Số lượng"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: 'Số lượng',
                },
              ]}
            >
              <InputNumber disabled className="w-full" size="large" min={0} changeOnWheel />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả:" name="description">
            <TextArea
              showCount
              maxLength={500}
              placeholder="Mô tả"
              style={{ height: 120, resize: 'none' }}
            />
          </Form.Item>
        </Card>
        <Card>
          <Form.Item
            loading={loading}
            label="Thương hiệu"
            name="brandId"
            rules={[{ required: true, message: 'Thương hiệu được yêu cầu' }]}
          >
            <Select
              className="w-full"
              size="large"
              optionFilterProp="label"
              placeholder="Chọn thương hiệu"
              options={productAttributes.brands}
            />
          </Form.Item>
          <Form.Item
            loading={loading}
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: 'Danh mục được yêu cầu' }]}
          >
            <Select
              className="w-full"
              size="large"
              optionFilterProp="label"
              placeholder="Danh mục"
              options={productAttributes.categories}
            />
          </Form.Item>
          <Form.Item
            name="imageUrls"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ảnh.',
              },
            ]}
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              accept="image/png, image/gif, image/jpeg, image/svg"
              maxCount={6}
              onChange={handleFileChange}
              multiple={true}
              onPreview={handlePreview}
            >
              {fileList.length >= 6 ? null : (
                <button type="button">
                  <PlusOutlined />
                  <div>Chọn ảnh</div>
                </button>
              )}
            </Upload>
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              className="w-full col-span-2"
              disabled={!update || saveLoading}
            >
              {saveLoading ? <Spin /> : 'Lưu'}
            </Button>
            <Link to={-1}>
              <Button size="large" className="w-full bg-gray-300 border-0" onClick={handleClear}>
                Trở về
              </Button>
            </Link>
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default ProductDetail
