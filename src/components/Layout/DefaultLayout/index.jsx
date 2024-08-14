import React from 'react'
import Sidebar from '../Sidebar'
import { App, Layout } from 'antd'
import Header from '../Header'
import Footer from '../Footer'
import { Content } from 'antd/es/layout/layout'

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <App notification={{ duration: 3, showProgress: true }}>
        <Layout>
          <Sidebar />
          <Layout>
            <Header />
            <Content className="m-4 p-4 drop-shadow rounded-lg bg-white">{children}</Content>
            <Footer />
          </Layout>
        </Layout>
      </App>
    </div>
  )
}

export default DefaultLayout
