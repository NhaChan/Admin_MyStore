import { Fragment } from 'react'
import Home from '../pages/Home'
import DefaultLayout from '../components/Layout/DefaultLayout'
import { Route } from 'react-router-dom'
import Products from '../pages/Products'
import { DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import Users from '../pages/Users'
import Brands from '../pages/Brands'
import Login from '../pages/Login'
import Category from '../pages/Category'

export const navigateItems = [
  { key: '/', icon: <PieChartOutlined />, label: 'Home' },
  { key: '/users', icon: <UserOutlined />, label: 'Users' },
  { key: '/products', icon: <DesktopOutlined />, label: 'Products' },
  {
    key: '1',
    label: 'Products Type',
    icon: <TeamOutlined />,
    children: [
      { key: '/brands', label: 'Brands' },
      { key: '/categories', label: 'Categories' },
    ],
  },
  { key: '/suppliers', icon: <UserOutlined />, label: 'Suppliers' },
  { key: '/orders', icon: <UserOutlined />, label: 'Orders' },
  { key: '/staffs', icon: <UserOutlined />, label: 'Staffs' },
  { key: '/comments', icon: <UserOutlined />, label: 'Comments' },
]

export const publicRoutes = [
  { path: '/', component: Home },
  { path: '/users', component: Users },
  { path: '/products', component: Products },
  { path: '/brands', component: Brands },
  { path: '/categories', component: Category },
  { path: '/suppliers', component: Users },
  { path: '/orders', component: Users },
  { path: '/staffs', component: Users },
  { path: '/comments', component: Users },
  { path: '/login', component: Login, Layout: null },
]

const GenerateRoutes = (route) => {
  return route.map((route, index) => {
    const Page = route.component
    let Layout = DefaultLayout

    if (route.Layout) {
      Layout = route.Layout
    } else if (route.Layout === null) {
      Layout = Fragment
    }
    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      />
    )
  })
}
export default GenerateRoutes
