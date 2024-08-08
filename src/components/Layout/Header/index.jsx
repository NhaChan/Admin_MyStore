import { Avatar, Badge, Flex, Typography } from 'antd'
import React from 'react'
import { MessageOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <Flex className="bg-white p-3 text-center justify-between sticky top-0 z-30">
        <Typography.Title level={4} type="secondary">
          Hello!
        </Typography.Title>
        <Flex className=" items-center space-x-3  text-blue-600">
          <Badge count={1}>
            <MessageOutlined className="p-2 border-2 rounded-md text-lg hover:bg-gray-300" />
          </Badge>
          <Badge dot>
            <NotificationOutlined className="p-2 border-2 rounded-md text-lg  hover:bg-gray-300" />
          </Badge>
          <Link to='/login'>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
          </Link>
        </Flex>
      </Flex>
    </>
  )
}

export default Header
