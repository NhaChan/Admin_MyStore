import { Button, Form, Input, Spin, message } from 'antd'
import React, { useState } from 'react'
import authService from '../../services/authService'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleSubmit = () => {
    setLoading(true)
    authService
      .login(form.getFieldsValue())
      .then((res) => {
        console.log(res)
        message.success('Đăng nhập thành công!')
        navigate('/')

      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <div className="flex items-center justify-center min-h-srceen">
      <div className="w-full max-w-md border-2 p-4 rounded">
        <img
          src="https://i.pinimg.com/564x/a6/7f/1c/a67f1c3af525e6044f582cc0f8e01e59.jpg"
          alt=""
          className="w-min mb-5 rounded-md"
        />
        <Form disabled={loading} form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="flex justify-center">
            <Button type="primary" htmlType="submit">
              {loading ? <Spin /> : 'Đăng nhập'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
