import React, { useEffect, useState } from 'react'
import { Form, Input, Table } from 'antd'
import categoryService from '../../services/categoryService'

const Category = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Category name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(),
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    categoryService
      .getAllCategory()
      .then((res) => {
        console.log(res.data)
        setData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <div className="h-fit md:col-span-2 bg-white rounded-lg drop-shadow">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          className="overflow-x-auto"
        />
      </div>
      <div className="h-fit bg-white rounded-lg drop-shadow">
        <div className="text-xl text-center p-4">Category</div>
        <Form className="px-4 grid grid-cols-3 gap-2">
          <label htmlFor="name">Category name:</label>
          <Form.Item name="name" className="col-span-2">
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Category
