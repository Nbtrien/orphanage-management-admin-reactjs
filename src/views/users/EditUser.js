import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CTable,
  CTableBody,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import userService from 'src/api/services/userService'
import FormInput from 'src/components/forms/FormInput'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { isEmail, isStrongPassword } from 'validator'

const EditUser = () => {
  const userApi = userService()
  const { id } = useParams()
  const [user, setUser] = useState()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [roleSelected, setRoleSelected] = useState([])
  const [roles, setRoles] = useState([])

  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [emailInvalid, setEmailInvalid] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  const [usernameInvalid, setUsernameInvalid] = useState(false)
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('')

  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const [formValid, setFormValid] = useState(false)

  const [done, setDone] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await userApi.getUserDetail(id)
        const result = response.result
        setUser(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserDetail()
  }, [id])

  useEffect(() => {
    if (user) {
      setEmail(user.user_mail_address)
      setUsername(user.user_name)

      setRoleSelected(
        user.roles.map((role) => ({
          name: role.role_title,
          id: role.role_id,
        })),
      )
    }
  }, [user])

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await userApi.getAllRoles()
        const result = response.result
        setRoles(result)
      } catch (error) {
        console.log(error)
      }
    }
    getRoles()
  }, [])

  useEffect(() => {
    setFormValid(
      email &&
        username &&
        roleSelected.length &&
        !emailInvalid &&
        !usernameInvalid &&
        !passwordInvalid,
    )
  }, [roleSelected, emailInvalid, usernameInvalid, passwordInvalid])

  const handleEmailChange = (event) => {
    const emailValue = event.target.value
    setEmail(emailValue)

    if (!isEmail(emailValue)) {
      setEmailInvalid(true)
      setEmailErrorMessage('Email không hợp lệ')
    } else {
      setEmailInvalid(false)
      setEmailErrorMessage('')
    }
  }

  const handleUsernameChange = (event) => {
    const usernameValue = event.target.value
    setUsername(usernameValue)

    if (usernameValue.length < 4 || usernameValue.length > 20) {
      setUsernameInvalid(true)
      setUsernameErrorMessage('Tên người dùng phải có từ 4 đến 20 ký tự')
    } else {
      setUsernameInvalid(false)
      setUsernameErrorMessage('')
    }
  }

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value
    setPassword(passwordValue)

    if (passwordValue && !isStrongPassword(passwordValue)) {
      setPasswordInvalid(true)
      setPasswordErrorMessage('Mật khẩu quá yếu')
    } else {
      setPasswordInvalid(false)
      setPasswordErrorMessage('')
    }
  }

  const handleRoleSelect = (selectedList, selectedItem) => {
    setRoleSelected(selectedList)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    const data = {
      user_name: username,
      user_mail_address: email,
      roles_id: roleSelected.map((role) => role.id),
    }
    if (password) {
      data.password = password
    }
    try {
      const response = await userApi.updateUser(id, JSON.stringify(data))
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã sửa thành công',
      }))
      setLoadingModalVisible(false)
      setSuccessModalVisible(true)
      setDone(true)
      setUser(response.result)
    } catch (e) {
      if (e?.status === 409) {
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: e?.error?.message,
        }))
        setLoadingModalVisible(false)
        setErrorModalVisible(true)
      }
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/users/' + id)
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      id: 'inputUsername',
      label: 'Tên người dùng*',
      value: username,
      onChange: handleUsernameChange,
      invalid: usernameInvalid,
      errorMessage: usernameErrorMessage,
    },
    {
      type: 'email',
      id: 'inputEmail',
      label: 'Địa chỉ Email*',
      value: email,
      onChange: handleEmailChange,
      invalid: emailInvalid,
      errorMessage: emailErrorMessage,
    },

    {
      type: 'password',
      id: 'inputPassword',
      label: 'Mật khẩu*',
      value: password,
      onChange: handlePasswordChange,
      invalid: passwordInvalid,
      errorMessage: passwordErrorMessage,
    },
    {
      type: 'multiselect',
      id: 'inputRoles',
      label: 'Vai trò*',
      onChange: handleRoleSelect,
      value: roleSelected,
      options: roles.map((role) => ({
        name: role.role_title,
        id: role.role_id,
      })),
    },
  ]

  return (
    <>
      {user && (
        <>
          <SuccessModal
            modalMessage={successModalMessage}
            isVisible={successModalVisible}
            setVisible={setSuccessModalVisible}
          ></SuccessModal>
          <ErrorModal
            modalMessage={errorModalMessage}
            isVisible={errormodalVisible}
            setVisible={setErrorModalVisible}
          ></ErrorModal>
          <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody>
                  <div className="form-header-custom mb-4">
                    <h4>Sửa tài khoản</h4>
                  </div>
                  <div className="mb-3">
                    <NavLink to="../users/management">
                      <CButton className="form-table-btn">về trang danh sách</CButton>
                    </NavLink>
                  </div>
                  <CForm>
                    <CTable
                      responsive
                      bordered
                      className="form-table overflow-hidden table-border-2"
                    >
                      <CTableBody>
                        {inputs.map((input, index) => (
                          <FormInputDataCell key={index} {...input} />
                        ))}
                      </CTableBody>
                    </CTable>
                    <div className="d-flex justify-content-end">
                      <CButton
                        className="form-table-btn"
                        onClick={handleSubmit}
                        disabled={!formValid}
                      >
                        Lưu
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default EditUser
