import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import userService from '../../services/userService'

const UserBot = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   sorter: (a, b) => a.botTradingId - b.botTradingId,
    // },
  ]

  useEffect(() => {
    setIsLoading(true)
    userService
      .getAllUser()
      .then((res) => {
        console.log(res.data)
        setData(res.data.items)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <Table
      loading={isLoading}
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
      className="overflow-x-auto"
    />
  )
}

export default UserBot
