import React, { useEffect, useState } from 'react'
import logService from '../../services/logService'
import { HomeTwoTone } from '@ant-design/icons'
import { formatDate, formatDateTime, formatVND, showError } from '../../services/commonService'
import { Button, Divider, Input, List, Modal, Pagination, Table, Tag } from 'antd'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import { FaRegEye } from 'react-icons/fa'

const LogHistory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [logId, setLogId] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const breadcrumb = [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      title: 'Lịch sử nhập hàng',
    },
  ]

  const columns = (openStockDetail) => [
    {
      title: 'Ngày cập nhật phiếu nhập',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Ngày lập phiếu nhập hàng',
      dataIndex: 'entryDate',
      sorter: (a, b) => new Date(a.entryDate) - new Date(b.entryDate),
      render: (value) => value !== null && formatDate(value),
    },
    {
      title: 'Mã phiếu nhập',
      dataIndex: 'stockReceiptId',
      sorter: (a, b) => a.id - b.id,
      render: (value) => <span>#{value}</span>,
    },
    {
      title: 'Người lập phiếu',
      dataIndex: 'userName',
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

  // const handleSearch = (key) => key && key !== search && setSearch(key)
  const handleSearch = (key) => {
    if (key && key !== search) {
      setSearch(key)
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      search ? setSearchLoading(true) : setIsLoading(true)
      try {
        const res = await logService.getAllLog(currentPage, currentPageSize, search)
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

  const openStockDetail = async (id) => {
    setIsModalOpen(true)
    try {
      const res = await logService.getLogId(id)
      //   console.log('std', res)
      setLogId(res.data)
    } catch (error) {
      showError(error)
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
      <Modal
        title="Chi tiết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="p-10"
        width={700}
        footer={false}
      >
        <Divider />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={logId}
          renderItem={(item) => (
            <List.Item style={{ padding: 0 }} key={item.id}>
              <List.Item.Meta
                title={
                  <div>
                    <Tag color="magenta" size="large">
                      Mã sản phẩm #{item.logId}
                    </Tag>
                    <div className="pt-2">{item.productName}</div>
                  </div>
                }
                description={
                  <div>
                    {item.quantity} x {formatVND(item.originPrice)}
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <Divider />
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
          <div className="w-full flex justify-between items-center">
            <Input.Search
              loading={searchLoading}
              className="w-1/3"
              size="large"
              placeholder="Tìm mã phiếu nhập..."
              allowClear
              onSearch={(key) => handleSearch(key)}
              onChange={(e) => e.target.value === '' && setSearch('')}
            />
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
            // defaultCurrent={currentPage}
            current={currentPage}
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

export default LogHistory
