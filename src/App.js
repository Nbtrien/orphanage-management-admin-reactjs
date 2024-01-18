import React, { Component, Suspense } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './scss/style.scss'
import PersistLogin from './components/persistLogin/PersistLogin'
import RedirectIfNotLoggedIn from './components/persistLogin/RedirectIfNotLoggedIn'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/authentication/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <BrowserRouter basename="/admin">
        <Suspense fallback={loading}>
          <Routes>
            <Route element={<PersistLogin />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<RedirectIfNotLoggedIn />}>
                <Route path="*" element={<DefaultLayout />} />
              </Route>
            </Route>
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    )
  }
}

export default App
