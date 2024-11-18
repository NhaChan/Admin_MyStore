import React, { useEffect, useState } from 'react'
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import userService from '../../services/userService'
import { formatDateTime, showError } from '../../services/commonService'
import {
  EditTwoTone,
  HomeTwoTone,
  LockOutlined,
  PhoneOutlined,
  PlusOutlined,
  UnlockOutlined,
  UserOutlined,
} from '@ant-design/icons'
import BreadcrumbLink from '../../components/BreadcrumbLink'
import { Role } from '../../services/const'
import { TfiEmail } from 'react-icons/tfi'
import dayjs from 'dayjs'

const breadcrumb = [
  {
    path: '/',
    title: <HomeTwoTone />,
  },
  {
    title: 'Người dùng',
  },
]

const User = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPageSize, setCurrentPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [selectRole, setSelectRole] = useState('User')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  // const [loadingDelete, setLoadingDelete] = useState(false)
  const [userId, setUserId] = useState()
  const [isEditMode, setIsEditMode] = useState(false)
  const [valueLockout, setValueLockout] = useState(1)
  const [isLockoutModel, setIsLockoutModel] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLockOutLoading, setIsLockOutLoading] = useState(false)

  const dateFormat = 'YYYY-MM-DD'

  const columns = [
    {
      title: 'Người dùng',
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
    // {
    //   title: 'Quyền',
    //   dataIndex: 'roles',
    //   render: (roles) => roles.join(', '),
    // },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Cập nhật mới nhất',
      dataIndex: 'updatedAt',
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      render: (value) => value !== null && formatDateTime(value),
    },
    {
      title: 'Khóa tài khoản',
      align: 'center',
      dataIndex: 'lockoutEnd',
      filters: [
        { value: false, text: 'Hoạt động' },
        { value: true, text: 'Bị khóa' },
      ],
      onFilter: (value, record) => record.lockedOut === value,
      render: (value) => {
        if (value !== null) {
          const date = new Date(value)
          return (
            <span>
              {date.getFullYear() >= 3000 ? (
                <span className="font-bold text-red-600">Vĩnh viễn</span>
              ) : (
                formatDateTime(value)
              )}
            </span>
          )
        } else
          return (
            <Tag color="blue" key={value}>
              Hoạt động
            </Tag>
          )
      },
    },
    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => (
        <div className="inline-flex">
          {record.lockedOut ? (
            <Popconfirm title="Xác nhận mở khóa?" onConfirm={() => handleUnlock(record.id)}>
              <Button type="primary" className="flex items-center">
                <UnlockOutlined />
              </Button>
            </Popconfirm>
          ) : (
            <Tooltip title="Khóa tài khoản">
              <Button
                onClick={() => onLockOut(record)}
                danger
                type="primary"
                className="flex items-center"
              >
                <LockOutlined />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Thực hiện',
      dataIndex: 'id',
      render: (value, record) => (
        // record.roles &&
        // !record.roles.includes(Role['Admin']) && (
        <Flex justify="center" align="center" className="space-x-1">
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => openUserId(value)}>
              <EditTwoTone />
            </Button>
          </Tooltip>
          {/* <Popconfirm
            title={`Xác nhận xóa ${record.fullName || record.email}`}
            onConfirm={() => handleDelete(record.id)}
            loading={loadingDelete}
          >
            <Button>
              <DeleteTwoTone className="text-red-500" />
            </Button>
          </Popconfirm> */}
        </Flex>
      ),
      // ),
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
        const res = await userService.getAllUser(currentPage, currentPageSize, search, selectRole)
        console.log(res.data)
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
  }, [selectRole, currentPage, currentPageSize, search, isUpdate])

  const showModal = () => {
    setIsEditMode(false)
    setIsModalOpen(true)
    form.resetFields()
  }

  const handleAdd = async () => {
    setLoadingAdd(true)
    try {
      const items = form.getFieldsValue()
      // console.log(items)
      const add = await userService.addUser(items)
      // console.log(add)
      notification.success({ message: 'Thêm tài khoản thành công' })
      setIsModalOpen(false)
      form.resetFields()
      setData((prevData) => [add.data, ...prevData])
    } catch (error) {
      showError(error)
    } finally {
      setLoadingAdd(false)
    }
  }

  const openUserId = async (id) => {
    setIsEditMode(true)
    setIsModalOpen(true)
    setUserId(id)
    try {
      const res = await userService.getUserId(id)
      setUserId(res.data.id)
      form.setFieldsValue({
        fullName: res.data.fullName,
        phoneNumber: res.data.phoneNumber,
        email: res.data.email,
        roles: res.data.roles,
      })
    } catch (error) {
      showError(error)
    }
  }

  const handleUpdate = async () => {
    setLoadingUpdate(true)
    try {
      const values = await form.validateFields()
      const updatedData = {
        ...values,
        id: userId,
      }
      const res = await userService.updateUser(userId, updatedData)
      console.log(res.data)
      notification.success({ message: 'Cập nhật thông tin thành công.' })
      setData((prevData) =>
        prevData.map((item) => (item.id === userId ? { ...item, ...res.data } : item)),
      )
      form.resetFields()
    } catch (error) {
      showError(error)
    } finally {
      setIsModalOpen(false)
      setLoadingUpdate(false)
    }
  }

  const onLockoutChange = (e) => setValueLockout(e.target.value)

  const resetModel = () => {
    setValueLockout(1)
    setUserId('')
    form.resetFields()
  }

  const showModalLock = () => setIsLockoutModel(true)

  const onLockOut = (record) => {
    showModalLock(record.lockedOut)
    setUserId(record.id)
  }

  const handleOkLockout = async () => {
    try {
      valueLockout === 2 && (await form.validateFields())
      const endDate =
        valueLockout === 2 ? form.getFieldValue('endDate').format(dateFormat) : '3000-01-01'
      const data = { endDate: endDate }

      try {
        setIsLockOutLoading(true)
        await userService.lockOut(userId, data)
        setIsUpdate(!isUpdate)
        setIsLockoutModel(false)
        resetModel()
        notification.success({
          message: 'Thành công',
          description: 'Đã khóa tài khoản',
        })
      } catch (error) {
        showError(error)
      } finally {
        setIsLockOutLoading(false)
      }
    } catch (error) {}
  }

  const handleUnlock = async (id) => {
    try {
      setIsLockOutLoading(true)
      const data = { endDate: null }
      await userService.lockOut(id, data)
      setIsUpdate(!isUpdate)
      notification.success({
        message: 'Thành công',
        description: 'Đã mở tài khoản',
      })
    } catch (error) {
      showError(error)
    } finally {
      setIsLockOutLoading(false)
    }
  }

  // const handleDelete = async (id) => {
  //   setLoadingDelete(true)
  //   try {
  //     await userService.deleteUser(id)
  //     const newData = data.filter((item) => !(item.id === id))
  //     setData(newData)
  //     notification.success({ message: 'Xóa thành công' })
  //   } catch (error) {
  //     showError(error)
  //   } finally {
  //     setLoadingDelete(false)
  //   }
  // }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsLockoutModel(false)
    resetModel()
  }

  const handleRoleChange = (value) => {
    setSelectRole(value)
  }

  return (
    <>
      <Modal
        title="Khóa tài khoản"
        open={isLockoutModel}
        okType="danger"
        okButtonProps={{ loading: isLockOutLoading, type: 'primary' }}
        onOk={handleOkLockout}
        cancelButtonProps={{ disabled: isLockOutLoading }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div className="space-y-2">
          <Radio.Group onChange={onLockoutChange} value={valueLockout}>
            <Space direction="vertical">
              <Radio value={1}>Vĩnh viễn</Radio>
              <Radio value={2}>Chọn thời gian mở khóa</Radio>
              {valueLockout === 2 && (
                <Form form={form}>
                  <Form.Item
                    name="endDate"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày hết hạn' }]}
                  >
                    <DatePicker allowClear={false} minDate={dayjs(new Date().getTime())} />
                  </Form.Item>
                </Form>
              )}
            </Space>
          </Radio.Group>
        </div>
      </Modal>
      <Modal
        title={isEditMode ? 'Cập nhật thông tin dùng mới' : 'Thêm người dùng mới'}
        open={isModalOpen}
        onOk={isEditMode ? handleUpdate : handleAdd}
        onCancel={handleCancel}
        confirmLoading={isEditMode ? loadingUpdate : loadingAdd}
        maskClosable={false}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {isEditMode ? 'Cập nhật' : 'Thêm'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ roles: ['User'] }}
          onFinish={() => {
            if (isEditMode) {
              handleUpdate()
            } else {
              handleAdd()
            }
          }}
        >
          <div className="flex space-x-2">
            <Form.Item name="fullName" label="Tên">
              <Input
                prefix={<UserOutlined className="text-gray-300 mx-1" />}
                placeholder="Tên"
                size="large"
                className="text-gray-600"
              />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input
                prefix={<PhoneOutlined className="text-gray-300 mx-1" />}
                placeholder="Số điện thoại"
                size="large"
                className="text-gray-600"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input
              prefix={<TfiEmail className="text-gray-300 mx-1" />}
              placeholder="Email"
              size="large"
              className="text-gray-600"
            />
          </Form.Item>

          <Form.Item
            label={isEditMode ? 'Đổi mật khẩu mới' : 'Mật khẩu'}
            name="password"
            rules={
              !isEditMode
                ? [
                    { required: true, message: 'Vui lòng nhập mật khẩu' },
                    {
                      pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
                      message: 'Mật khẩu phải có ít nhất 8 ký tự, chữ in hoa và ký tự đặc biệt',
                    },
                  ]
                : [
                    {
                      pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/,
                      message: 'Mật khẩu phải có ít nhất 8 ký tự, chữ in hoa và ký tự đặc biệt',
                    },
                  ]
            }
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300 mx-1" />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300 mx-1" />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Quyền"
            rules={[{ required: true, message: 'Quyền là bắt buộc' }]}
          >
            <Select
              mode="multiple"
              className="rounded-none w-56"
              size="large"
              onChange={(value) => form.setFieldValue('roles', value)}
            >
              {Object.entries(Role).map(([key, roleName]) => (
                <Select.Option key={key} value={key}>
                  {roleName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div className="space-y-4">
        <BreadcrumbLink breadcrumb={breadcrumb} />
        <div className="p-4 drop-shadow rounded-lg bg-white space-y-6">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex flex-col sm:flex-row space-x-2">
              <div className="w-full">
                <Input.Search
                  loading={searchLoading}
                  placeholder="Tìm tên, số điện thoại... "
                  // className="w-full sm:w-1/3"
                  size="large"
                  allowClear
                  onSearch={(key) => handleSearch(key)}
                  onChange={(e) => e.target.value === '' && setSearch('')}
                />
              </div>
              <div className="flex">
                {/* <div className="font-bold">Chọn quyền:</div> */}
                <Select
                  className="rounded-none w-64"
                  size="large"
                  defaultValue={Role['User']}
                  onChange={handleRoleChange}
                >
                  {Object.entries(Role).map(([key, roleName]) => (
                    <Select.Option key={key} value={key}>
                      {roleName}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className=" space-x-2">
              <Button
                onClick={showModal}
                // className="rounded-none w-32 h-32"
                size="large"
                type="primary"
              >
                <PlusOutlined /> Thêm người dùng
              </Button>
            </div>
          </div>

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
    </>
  )
}

export default User
