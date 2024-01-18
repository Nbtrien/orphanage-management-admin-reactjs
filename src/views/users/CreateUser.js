import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import userService from 'src/api/services/userService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateUser = () => {
  const userApi = userService()
  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    roles_id: '',
  })
  const [roleSelected, setRoleSelected] = useState([])

  const [formValidate, setFormValidate] = useState({
    user_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên tài khoản.',
    },
    email: {
      invalid: false,
      errorMessage: 'Địa chỉ email không đúng định dạng',
    },
    password: {
      invalid: false,
      errorMessage: 'Vui lòng nhập mật khẩu mạnh.',
    },
    roles_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn vai trò.',
    },
  })
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

  const [done, setDone] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  const [formValid, setFormValid] = useState(false)

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
    let isValid = formData.user_name && formData.email && formData.password && roleSelected.length

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [formData, formValidate, roleSelected])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })

    let isFieldValid = validator.isEmpty(value)
    switch (name) {
      case 'email':
        isFieldValid = !validator.isEmail(value)
        break
      case 'password':
        isFieldValid = !validator.isStrongPassword(value)
        break
    }

    setFormValidate({
      ...formValidate,
      [name]: {
        ...formValidate[name],
        invalid: isFieldValid,
      },
    })
  }

  const handleRoleSelect = (selectedList, selectedItem) => {
    setRoleSelected(selectedList)
    if (selectedList.length === 0) {
      setFormValidate({
        ...formValidate,
        roles_id: {
          ...formValidate.roles_id,
          invalid: true,
        },
      })
    } else {
      setFormValidate({
        ...formValidate,
        roles_id: {
          ...formValidate.roles_id,
          invalid: false,
        },
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    formData.roles_id = roleSelected.map((role) => role.id)
    try {
      await userApi.createUser(JSON.stringify(formData))
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thêm thành công',
      }))
      setLoadingModalVisible(false)
      setSuccessModalVisible(true)
      setDone(true)
    } catch (e) {
      console.log(e)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setLoadingModalVisible(false)
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/users/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Tên người dùng*',
      id: 'user_name',
      name: 'user_name',
      value: formData.user_name,
      onChange: handleInputChange,
      invalid: formValidate.user_name.invalid,
      errorMessage: formValidate.user_name.errorMessage,
    },
    {
      type: 'email',
      label: 'Địa chỉ Email*',
      id: 'email',
      name: 'email',
      value: formData.email,
      onChange: handleInputChange,
      invalid: formValidate.email.invalid,
      errorMessage: formValidate.email.errorMessage,
    },
    {
      type: 'password',
      label: 'Mật khẩu*',
      id: 'password',
      name: 'password',
      value: formData.password,
      onChange: handleInputChange,
      invalid: formValidate.password.invalid,
      errorMessage: formValidate.password.errorMessage,
    },
    {
      type: 'multiselect',
      id: 'role_id',
      name: 'role_id',
      label: 'Vai trò*',
      onChange: handleRoleSelect,
      value: roleSelected,
      invalid: formValidate.roles_id.invalid,
      errorMessage: formValidate.roles_id.errorMessage,
      options: roles.map((role) => ({
        name: role.role_title,
        id: role.role_id,
      })),
    },
  ]

  return (
    <>
      <SuccessModal
        modalMessage={successModalMessage}
        isVisible={successModalVisible}
        setVisible={setSuccessModalVisible}
      />
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      />
      <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm tài khoản</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../users/management">
                  <CButton className="form-table-btn">về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    {inputs.map((input, index) => (
                      <FormInputDataCell key={index} {...input} />
                    ))}
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
                    Thêm tài khoản
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateUser
