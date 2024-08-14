// import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { Flex, Menu } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { useLocation, useNavigate } from 'react-router-dom'
import { BankTwoTone } from '@ant-design/icons'
import { navigateItems } from '../../../routes'


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const [navItems, setNaviItems] = useState(navigateItems)
  const location = useLocation()

  const regex = location.pathname.match(/^\/[^/]+/)?.at(0) ?? '/'
  const [navSelected, setNavSelected] = useState(regex)

  const handleMenuClick = ({ key }) => navigate(key)

  //Cuộn về đầu trang sau khi render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useLayoutEffect(() => {
    setNaviItems(navigateItems)
    setNavSelected(regex)
  }, [regex])

  return (
    <>
      <Sider
        className="h-screen top-0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: 'sticky' }}
      >
        <Flex className="text-center justify-center text-2xl p-10">
          <BankTwoTone />
        </Flex>
        <Menu
          theme="dark"
          defaultSelectedKeys={[navSelected]}
          selectedKeys={navSelected}
          mode="inline"
          items={navItems}
          onClick={handleMenuClick}
        />
      </Sider>
    </>
  )
}

export default Sidebar
