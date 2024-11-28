import { Avatar, Flex, Popconfirm, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../App'
import authService from '../../../services/authService'
import authActions from '../../../services/authAction'

const Header = () => {
  const { state, dispatch } = useAuth()
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getCurrentUser()
    user ? setUsername(user.name) : setUsername('')
  }, [state.isAuthenticated])

  const handleLogout = () => {
    dispatch(authActions.LOGOUT)
    authService.logout()
    navigate('/')
  }

  return (
    <>
      <Flex className="bg-white p-3 text-center justify-between sticky top-0 z-30">
        {state.isAuthenticated && (
          <Typography.Title level={4} type="secondary">
            {username}
          </Typography.Title>
        )}
        <Flex className=" items-center space-x-3  text-blue-600">
          {/* <Link to="/chat">
            <Badge count={1}>
              <MessageOutlined className="p-2 border-2 rounded-md text-lg hover:bg-gray-300" />
            </Badge>
          </Link>
          <Badge dot>
            <NotificationOutlined className="p-2 border-2 rounded-md text-lg  hover:bg-gray-300" />
          </Badge> */}
          <Popconfirm title="Bạn có chắc muốn đăng xuất?" onConfirm={handleLogout}>
            <Avatar
              icon={<LogoutOutlined />}
              style={{ backgroundColor: '#87d068' }}
              className="cursor-pointer"
            />
          </Popconfirm>
        </Flex>
      </Flex>
    </>
  )
}

export default Header
