import { Fragment } from 'react'
import Home from '../pages/Home'
import DefaultLayout from '../components/Layout/DefaultLayout'
import { Navigate, Route } from 'react-router-dom'
import Products from '../pages/Products'
import { DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import Users from '../pages/Users'
import Brands from '../pages/Brands'
import Login from '../pages/Login'
import Category from '../pages/Category'
import ProductAdd from '../pages/Products/ProductAdd'
import ProductDetail from '../pages/Products/ProductDetail'

export const navigateItems = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  { key: '/users', icon: <UserOutlined />, label: 'Người dùng' },
  { key: '/products', icon: <DesktopOutlined />, label: 'Sản phẩm' },
  {
    key: '1',
    label: 'Sản Phẩm',
    icon: <TeamOutlined />,
    children: [
      { key: '/brands', label: 'Thương hiệu' },
      { key: '/categories', label: 'Danh mục' },
    ],
  },
  { key: '/suppliers', icon: <UserOutlined />, label: 'Nhà cung cấp' },
  { key: '/orders', icon: <UserOutlined />, label: 'Đơn đặt hàng' },
  { key: '/staffs', icon: <UserOutlined />, label: 'Nhân viên' },
  { key: '/comments', icon: <UserOutlined />, label: 'Bình luận' },
]

export const publicRoutes = [{ path: '/', component: Login, Layout: null }]

export const privateRoutes = [
  { path: '/home', component: Home },
  { path: '/users', component: Users },
  { path: '/products', component: Products },
  { path: '/add-products', component: ProductAdd },
  { path: '/product-detail/:id', component: ProductDetail },
  { path: '/brands', component: Brands },
  { path: '/categories', component: Category },
  { path: '/suppliers', component: Users },
  { path: '/orders', component: Users },
  { path: '/staffs', component: Users },
  { path: '/comments', component: Users },
]

export const generatePublicRoutes = (isAuthenticated) => {
  return publicRoutes.map((route, index) => {
    const Page = route.component
    let Layout = DefaultLayout

    if (route.Layout) {
      Layout = route.Layout
    } else if (route.Layout === null) {
      Layout = Fragment
    }
    if (isAuthenticated && route.path === '/') {
      return <Route key={index} path={route.path} element={<Navigate to="/home" />} />
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

export const generatePrivateRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return privateRoutes.map((route, index) => {
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
}
