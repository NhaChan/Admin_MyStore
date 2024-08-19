import React, { useEffect, useState } from 'react'
import { Button, Flex, Image, notification, Popconfirm, Table } from 'antd'
import { formatVND, showError, toImageLink } from '../../services/commonService'
import productService from '../../services/products/productService'
import { Link } from 'react-router-dom'
import { DeleteTwoTone } from '@ant-design/icons'

const Products = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [loadingDelete, setLoadingDelete] = useState(false)

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      render: (value) => <Image rootClassName="w-20 h-20" src={toImageLink(value)} />,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (value) => formatVND(value),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quanlity',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
    },
    {
      title: 'Thực hiện',
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Link to={`/product-detail/${record.id}`}>
            <Button>Chi tiết</Button>
          </Link>
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
        const res = await productService.getAll()
        // console.log('product', res.data)
        setData(res.data.items)
      } catch (error) {
        showError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    setLoadingDelete(true)
    try {
      await productService.deleteProduct(id)
      const newData = data.filter((item) => !(item.id === id))
      setData(newData)
      notification.success({
        message: 'Xóa thành công',
      })
    } catch (error) {
      showError(error)
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <>
      <Link to="/add-products">
        <Button className="p-4 mb-4" type="primary">
          Thêm sản phẩm
        </Button>
      </Link>
      <Table
        showSorterTooltip={false}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        className="overflow-x-auto"
      />
    </>
  )
}

export default Products
