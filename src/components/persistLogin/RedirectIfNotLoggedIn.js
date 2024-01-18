import { Navigate, Outlet } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'
import React from 'react'
import PropTypes from 'prop-types'

const RedirectIfNotLoggedIn = ({ children }) => {
  const { auth } = useAuth()

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
RedirectIfNotLoggedIn.propTypes = {
  children: PropTypes.node,
}
export default RedirectIfNotLoggedIn
