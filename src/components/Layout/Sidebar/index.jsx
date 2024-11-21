// import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { Menu, notification } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navigateCSKH, navigateItems, navigateStatist, navigateWarehouse } from '../../../routes'
import authService from '../../../services/authService'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const [navItems, setNaviItems] = useState(navigateItems)
  const location = useLocation()
  const [roles, setRoles] = useState([])

  const regex = location.pathname.match(/^\/[^/]+/)?.at(0) ?? '/'
  const [navSelected, setNavSelected] = useState(regex)

  const handleMenuClick = ({ key }) => navigate(key)

  //Cuộn về đầu trang sau khi render
  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchData = async () => {
      try {
        const res = await authService.getRole()
        setRoles(res || [])
      } catch (error) {
        notification.error({ message: 'Không có quyền' })
      }
    }
    fetchData()
  }, [])

  useLayoutEffect(() => {
    let combinedNavigation = []

    if (roles.includes('Admin')) {
      combinedNavigation = [...combinedNavigation, ...navigateItems]
    }
    if (roles.includes('CSKH')) {
      combinedNavigation = [...combinedNavigation, ...navigateCSKH]
    }
    if (roles.includes('Statist')) {
      combinedNavigation = [...combinedNavigation, ...navigateStatist]
    }
    if (roles.includes('Warehouser')) {
      combinedNavigation = [...combinedNavigation, ...navigateWarehouse]
    }

    const uniqueNavigation = Array.from(new Set(combinedNavigation.map((item) => item.key))).map(
      (key) => combinedNavigation.find((item) => item.key === key),
    )

    setNaviItems(uniqueNavigation)

    // if (roles.includes('Admin')) {
    //   setNaviItems(navigateItems)
    // } else if (roles.includes('CSKH')) {
    //   setNaviItems(navigateCSKH)
    // } else if (roles.includes('Statist')) {
    //   setNaviItems(navigateStatist)
    // } else if (roles.includes('Warehouser')) {
    //   setNaviItems(navigateWarehouse)
    // }

    setNavSelected(regex)
  }, [regex, roles])

  return (
    <>
      <Sider
        className="h-screen top-0"
        collapsible
        breakpoint="md"
        onBreakpoint={() => setCollapsed(false)}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: 'sticky' }}
      >
        <div>
          <Link to="/home">
            <img src="/logo.png" alt="logo" className="w-52 mx-auto" />
          </Link>
        </div>
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
