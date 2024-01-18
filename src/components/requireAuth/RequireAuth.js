import { Navigate, Outlet } from 'react-router-dom'
import React from 'react'
import useAuth from 'src/hooks/useAuth'

const RequireAuth = ({}) => {
  const { auth } = useAuth
  if (auth?.accessToken) {
    return <Outlet />
  } else {
    return <Navigate to="/login" />
  }
  // if (allowedRoles) {
  //   if (allowedRoles?.includes(auth?.roles)) {
  //     return <Outlet />;
  //   } else {
  //     return <Navigate to="/auth/login" />;
  //   }
  // } else {
  //   if (auth?.userName) {
  //     return <Outlet />;
  //   } else {
  //     return <Navigate to="/auth/login" />;
  //   }
  // }
}

export default RequireAuth
