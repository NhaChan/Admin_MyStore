import { DeleteTwoTone, HomeTwoTone } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import { Button, Image, notification, Pagination, Popconfirm, Rate, Select, Table } from 'antd'
import productService from '../../services/products/productService'
import { showError, toImageLink } from '../../services/commonService'
import reviewService from '../../services/reviewService'

const Review = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [reviews, setReviews] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectId, setSelectId] = useState(null)
  const [nameProduct, setNameProduct] = useState([])
  const [loadingDelete, setLoadingDelete] = useState(false)

  const breadcrumb = [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      title: 'Đánh giá của người dùng',
    },
  ]

  const columns = [
    {
      title: 'Người đánh giá',
      dataIndex: 'username',
      render: (value) => <div className="w-28">{value}</div>,
    },
    {
      title: 'Sao',
      dataIndex: 'star',
      render: (value) => (
        <div className="w-28">
          <Rate disabled allowHalf defaultValue={value} className="text-sm" />
        </div>
      ),
    },
    {
      title: 'Bình luận',
      dataIndex: 'description',
      render: (value) => <div className="w-60">{value}</div>,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imagesUrls',
      render: (imagesUrls) =>
        imagesUrls && imagesUrls.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {imagesUrls.map((url, index) => (
              <Image
                key={index}
                style={{ maxWidth: 40, minWidth: 40 }}
                src={toImageLink(url)}
                alt=""
                className="object-cover w-10 h-10 md:w-20 md:h-20"
              />
            ))}
          </div>
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    {
      title: 'Thực hiện',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title={`Xác nhận xóa bình luận này.`}
          onConfirm={() => handleDelete(record.id)}
          loading={loadingDelete}
        >
          <Button>
            <DeleteTwoTone />
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const handleSearch = (key) => key && key !== search && setSearch(key || '')

  useEffect(() => {
    const fetchName = async () => {
      search && setLoading(true)
      try {
        const res = await productService.getName(search)
        // console.log(res.data)
        setNameProduct(res.data)
        if (res.data.length > 0 && !selectId) {
          setSelectId(res.data[0].id) // Chọn sản phẩm đầu tiên
        }
      } catch (error) {
        showError(error)
      } finally {
        setLoading(false)
      }
    }
    const debounceFetch = setTimeout(() => {
      fetchName()
    }, 300)

    return () => clearTimeout(debounceFetch)
    // fetchName()
  }, [search, selectId])

  useEffect(() => {
    if (!selectId) return
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await productService.getReview(selectId, page, pageSize)
        console.log('product', res.data)
        setReviews(res.data.items)
        setTotalItems(res.data?.totalItems)
      } catch (error) {
        showError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [selectId, page, pageSize])

  const handleDelete = async (id) => {
    setLoadingDelete(true)
    try {
      await reviewService.deleteReview(id)
      const newData = reviews.filter((item) => !(item.id === id))
      setReviews(newData)
      notification.success({
        message: 'Xóa thành công',
        placement: 'top',
      })
    } catch (error) {
      showError(error)
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-4">
        <Select
          loading={loading}
          className="w-1/2"
          value={selectId}
          onChange={setSelectId}
          // optionFilterProp="label"
          onSearch={handleSearch}
          filterOption={false}
          showSearch={true}
          size="large"
          placeholder="Chọn sản phẩm để xem đánh giá"
        >
          {nameProduct.map((name) => (
            <Select.Option key={name.id} value={name.id} label={name.name}>
              {name.name}
            </Select.Option>
          ))}
        </Select>

        <Table
          pagination={false}
          loading={isLoading}
          columns={columns}
          dataSource={reviews}
          rowKey={(record) => record.id}
          className="overflow-x-auto"
        />
        <Pagination
          align="end"
          hideOnSinglePage
          showSizeChanger
          defaultCurrent={page}
          defaultPageSize={pageSize}
          total={totalItems}
          onChange={(newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          }}
        />
      </div>
    </div>
  )
}

export default Review
