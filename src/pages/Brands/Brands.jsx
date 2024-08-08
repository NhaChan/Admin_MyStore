import React, { useEffect, useState } from 'react'
import { Form, Image, Input, Table, Upload } from 'antd'
import brandService from '../../services/brandService'
import { toImageLink } from '../../services/common'

const UserBot = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])

  const columns = [
    {
      title: 'Brand name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(),
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      render: (value) => <Image src={toImageLink(value)} />,
    },
  ]

  useEffect(() => {
    setIsLoading(true)
    brandService
      .getBrands()
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
        <div className="text-xl text-center p-4">Brands</div>
        <Form className="px-4 grid grid-cols-3 gap-2">
          <label htmlFor="name">Brand name:</label>
          <Form.Item name="name" className="col-span-2">
            <Input />
          </Form.Item>
          <label>Image:</label>
          <Form.Item name="imageUrl">
            <Upload></Upload>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default UserBot
