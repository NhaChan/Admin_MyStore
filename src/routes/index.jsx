import { Fragment } from 'react'
import Home from '../pages/Home'
import DefaultLayout from '../components/Layout/DefaultLayout'
import { Navigate, Route } from 'react-router-dom'
import Products from '../pages/Products'
import {
  ContainerOutlined,
  PieChartOutlined,
  ProfileOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import Users from '../pages/Users'
import Brands from '../pages/Brands'
import Login from '../pages/Login'
import Category from '../pages/Category'
import ProductAdd from '../pages/Products/ProductAdd'
import ProductDetail from '../pages/Products/ProductDetail'
import Order from '../pages/Orders'
import OrderDetail from '../pages/Orders/OrderDetail'
import StockReceipt from '../pages/StockReceipt'
import { BsHouseAdd } from 'react-icons/bs'
import { FcStatistics } from 'react-icons/fc'
import StatisticProduct from '../pages/StatisticProduct'
import { MdRateReview } from 'react-icons/md'
import Review from '../pages/Review'
import LogHistory from '../pages/LogHistory'
import { FaHistory } from 'react-icons/fa'

export const navigateItems = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  { key: '/statistic', icon: <FcStatistics />, label: 'Thống kê sản phẩm' },
  { key: '/products', icon: <ReadOutlined />, label: 'Sản phẩm' },
  { key: '/users', icon: <UserOutlined />, label: 'Người dùng' },
  {
    key: '1',
    label: 'Quản lý chung',
    icon: <ProfileOutlined />,
    children: [
      { key: '/brands', label: 'Thương hiệu' },
      { key: '/categories', label: 'Danh mục' },
    ],
  },
  { key: '/orders', icon: <ContainerOutlined />, label: 'Đơn đặt hàng' },
  { key: '/stock', icon: <BsHouseAdd />, label: 'Phiếu nhập' },
  { key: '/review', icon: <MdRateReview />, label: 'Đánh giá' },
  { key: '/history', icon: <FaHistory />, label: 'Lịch sử' },
]

export const navigateCSKH = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  {
    key: '1',
    label: 'Quản lý chung',
    icon: <ProfileOutlined />,
    children: [
      { key: '/brands', label: 'Thương hiệu' },
      { key: '/categories', label: 'Danh mục' },
    ],
  },
  { key: '/orders', icon: <ContainerOutlined />, label: 'Đơn đặt hàng' },
]

export const navigateStatist = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  { key: '/statistic', icon: <FcStatistics />, label: 'Thống kê sản phẩm' },
  { key: '/products', icon: <ReadOutlined />, label: 'Sản phẩm' },
  { key: '/orders', icon: <ContainerOutlined />, label: 'Đơn đặt hàng' },
  { key: '/stock', icon: <BsHouseAdd />, label: 'Phiếu nhập' },
]

export const navigateWarehouse = [
  { key: '/home', icon: <PieChartOutlined />, label: 'Thống kê' },
  { key: '/products', icon: <ReadOutlined />, label: 'Sản phẩm' },
  { key: '/stock', icon: <BsHouseAdd />, label: 'Phiếu nhập' },
]

export const publicRoutes = [{ path: '/', component: Login, Layout: null }]

export const privateRoutes = [
  { path: '/home', component: Home },
  { path: '/statistic', component: StatisticProduct },
  { path: '/users', component: Users },
  { path: '/products', component: Products },
  { path: '/add-products', component: ProductAdd },
  { path: '/product-detail/:id', component: ProductDetail },
  { path: '/brands', component: Brands },
  { path: '/categories', component: Category },
  { path: '/orders', component: Order },
  { path: '/order-detail/:id', component: OrderDetail },
  { path: '/stock', component: StockReceipt },
  { path: '/review', component: Review },
  { path: '/history', component: LogHistory },
]

export const StatistRoutes = [
  { path: '/home', component: Home },
  { path: '/statistic', component: StatisticProduct },
  { path: '/products', component: Products },
  { path: '/product-detail/:id', component: ProductDetail },
  { path: '/orders', component: Order },
  { path: '/order-detail/:id', component: OrderDetail },
  { path: '/stock', component: StockReceipt },
]

export const WarehouserRoutes = [
  { path: '/home', component: Home },
  { path: '/products', component: Products },
  { path: '/add-products', component: ProductAdd },
  { path: '/product-detail/:id', component: ProductDetail },
  { path: '/stock', component: StockReceipt },
]

export const CSKHRoutes = [
  { path: '/home', component: Home },
  { path: '/brands', component: Brands },
  { path: '/categories', component: Category },
  { path: '/orders', component: Order },
  { path: '/order-detail/:id', component: OrderDetail },
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

export const statistRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return StatistRoutes.map((route, index) => {
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

export const warehouserRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return WarehouserRoutes.map((route, index) => {
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
export const cSKHRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return CSKHRoutes.map((route, index) => {
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
