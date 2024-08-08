import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import GenerateRoutes, { publicRoutes } from './routes'
import NotFound from './components/NotFound'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {GenerateRoutes(publicRoutes)}
          <Route path="*" element={ <NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
