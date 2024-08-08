// import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { Flex, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useNavigate } from 'react-router-dom'
import { BankTwoTone } from '@ant-design/icons'
import { navigateItems } from '../../../routes'

// function getItem(label, key, icon, children) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   }
// }
// const items = [
//   getItem('Home', '1', <PieChartOutlined />),
//   getItem('Products', '2', <DesktopOutlined />),
//   getItem('User', 'sub1', <UserOutlined />, [
//     getItem('Tom', '3'),
//     getItem('Bill', '4'),
//     getItem('Alex', '5'),
//   ]),
//   getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
//   getItem('Logout', '9', <LogoutOutlined />),
// ]

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const [navItems, setNaviItems] = useState(navigateItems)

  const handleMenuClick = ({ key }) => navigate(key)

  //Cuộn về đầu trang sau khi render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    setNaviItems(navigateItems)
  }, [])

  return (
    <>
      <Sider
        className="h-screen top-0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position:'sticky'}}
      >
        <Flex className="text-center justify-center text-2xl p-10">
          <BankTwoTone />
        </Flex>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </>
  )
}

export default Sidebar
