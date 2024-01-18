import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons'
import authApi from 'src/api/services/authApi'
import useAuth from 'src/hooks/useAuth'
import ErrorModal from 'src/components/modals/ErrorModal'

const Login = () => {
  const { auth, setAuth, setIsUnexpired } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const handleLoginBtnClick = async (event) => {
    event.preventDefault()
    const data = {
      email: email,
      password: password,
    }
    try {
      const response = await authApi.login(JSON.stringify(data))
      const result = response.result

      const userId = result?.user_id
      const accessToken = result?.access_token
      const roles = result?.roles

      localStorage.setItem('user_id', userId)
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('roles', roles)

      setAuth({ userId, accessToken, roles })
      setIsUnexpired(true)

      window.location.href = 'http://localhost:3000/admin/'
    } catch (e) {
      console.log(e)
      if (e.status === 422) {
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Tên đăng nhập hoặc mật khẩu không đúng',
        }))
        setErrorModalVisible(true)
      } else {
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Đã có lỗi xảy ra vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
      }
    }
  }

  if (auth?.accessToken) {
    return <Navigate to="../" replace />
  }

  return (
    <>
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      />
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>ĐĂNG NHẬP</h1>
                      <p className="text-medium-emphasis">Đăng nhập vào hệ thống quản lý</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          id="email"
                          placeholder="Địa chỉ email"
                          onChange={(e) => setEmail(e.target.value)}
                          invalid
                          required
                        />
                        <CFormFeedback valid>Please provide a valid city.</CFormFeedback>
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="password"
                          type="password"
                          placeholder="Mật khẩu"
                          onChange={(e) => setPassword(e.target.value)}
                          invalid
                          required
                        />
                        <CFormFeedback valid>Please provide a valid city.</CFormFeedback>
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={handleLoginBtnClick}>
                            Đăng nhập
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0">
                            Quên mật khẩu?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Website trại trẻ</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                      <Link to="#">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Trang chủ
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
