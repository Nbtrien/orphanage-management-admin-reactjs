import { Outlet } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import PropTypes from 'prop-types'

const PersistLogin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isUserSaved, setIsUserSaved] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const { auth, setAuth, setIsUnexpired } = useAuth()

  useEffect(() => {
    let isMounted = true

    const getLocalStorage = () => {
      try {
        const userId = localStorage.getItem('user_id')
        const accessToken = localStorage.getItem('access_token')
        const roles = localStorage.getItem('roles')

        if (userId && accessToken) {
          setAuth({ userId, accessToken, roles })
          setIsUnexpired(true)
          isMounted && setIsUserSaved(true)
        } else {
          logout()
          setIsDone(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
        isMounted && setIsReady(true)
      }
    }

    !auth?.accessToken ? getLocalStorage() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isLoading && isUserSaved) {
      setIsUnexpired(true)
      setIsReady(true)
    } else if (!isLoading && !isUserSaved) {
      setIsReady(true)
    }
  }, [isLoading])

  const logout = () => {
    localStorage.removeItem('user_id')
    localStorage.removeItem('access_token')
    localStorage.removeItem('roles')
    setAuth({})
  }

  if (!isReady) {
    return null
  }

  if (isUserSaved || isDone) {
    return <Outlet />
  }

  return null
}

PersistLogin.propTypes = {
  children: PropTypes.node,
}

export default PersistLogin
