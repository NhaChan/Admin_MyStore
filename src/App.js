import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import {
  cSKHRoutes,
  generatePrivateRoutes,
  generatePublicRoutes,
  statistRoutes,
  warehouserRoutes,
} from './routes'
import NotFound from './components/NotFound'
import { createContext, useContext, useReducer } from 'react'
import { initialState, reducer } from './services/authReducer'
import { App as AntdApp } from 'antd'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  // useEffect(() => {
  //   if (state.isAuthenticated) {
  //     const user = authService.getCurrentUser()

  //     const data = { refresh_token: user.refresh_token }
  //     authService.refreshToken(data).then((res) => authService.setUserToken(res.data?.access_token))
  //     setInterval(
  //       () =>
  //         authService
  //           .refreshToken(data)
  //           .then((res) => authService.setUserToken(res.data?.access_token)),
  //       300000,
  //     )
  //   }
  // }, [state.isAuthenticated])

  return (
    <AntdApp>
      <AuthContext.Provider value={{ state, dispatch }}>
        <Router>
          <Routes>
            {generatePublicRoutes(state.isAuthenticated)}
            {state.roles?.includes('Admin') && generatePrivateRoutes(state.isAuthenticated)}
            {state.roles?.includes('Statist') && statistRoutes(state.isAuthenticated)}
            {state.roles?.includes('Warehouser') && warehouserRoutes(state.isAuthenticated)}
            {state.roles?.includes('CSKH') && cSKHRoutes(state.isAuthenticated)}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </AntdApp>
  )
}

export default App
