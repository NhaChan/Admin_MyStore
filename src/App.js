import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { generatePrivateRoutes, generatePublicRoutes } from './routes'
import NotFound from './components/NotFound'
import { createContext, useContext, useEffect, useReducer } from 'react'
import authService from './services/authService'
import { initialState, reducer } from './services/authReducer'

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
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Routes>
          {generatePublicRoutes(state.isAuthenticated)}
          {state.roles?.includes('Admin') && generatePrivateRoutes(state.isAuthenticated)}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
