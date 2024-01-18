import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
const AuthContext = createContext({})
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [isUnexpired, setIsUnexpired] = useState(false)
  return (
    <AuthContext.Provider value={{ auth, setAuth, isUnexpired, setIsUnexpired }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
export default AuthContext
