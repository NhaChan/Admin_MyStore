import React, { useEffect, useState } from 'react'
import { Button, Flex, Input, Pagination, Popconfirm, Table, Tooltip } from 'antd'
import userService from '../../services/userService'
import { formatDateTime, showError } from '../../services/commonService'
import { DeleteTwoTone, EditTwoTone, HomeTwoTone } from '@ant-design/icons'
import BreadcrumbLink from '../../components/BreadcrumbLink'

const Employee = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [search, setSearch] = useState('')

  const breadcrumb = [
    {
      path: '/',
      title: <HomeTwoTone />,
    },
    {
      title: 'Người dùng',
    },
  ]

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Quyền',
      dataIndex: 'roles',
      render: (roles) => roles.join(', '),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Thực hiện',
      render: (_, record) => (
        <Flex justify="center" align="center" className="space-x-1">
          <Tooltip title="Chỉnh sửa">
            <Button
            // onClick={() => onUpdate(record)}
            >
              <EditTwoTone />
            </Button>
          </Tooltip>
          <Popconfirm
            title={`Xác nhận xóa `}
            // onConfirm={() => handleDelete(record.id)}
            // loading={loadingDelete}
          >
            <Button>
              <DeleteTwoTone className="text-red-500" />
            </Button>
          </Popconfirm>
        </Flex>
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
    search ? setSearchLoading(true) : setIsLoading(true)
    userService
      .getAllEmployee(currentPage, currentPageSize, search)
      .then((res) => {
        // console.log(res.data)
        setData(res.data.items)
        setTotalItems(res.data?.totalItems)
      })
      .catch((err) => {
        showError(err)
      })
      .finally(() => {
        setSearchLoading(false)
        setIsLoading(false)
      })
  }, [currentPage, currentPageSize, search])

  return (
    <div className="space-y-4">
      <BreadcrumbLink breadcrumb={breadcrumb} />
      <div className="p-4 drop-shadow rounded-lg bg-white space-y-2">
        <Input.Search
          loading={searchLoading}
          className="w-1/3"
          size="large"
          allowClear
          onSearch={(key) => handleSearch(key)}
          onChange={(e) => e.target.value === '' && setSearch('')}
        />

        <Table
          pagination={false}
          loading={isLoading}
          columns={columns}
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
  )
}

export default Employee
