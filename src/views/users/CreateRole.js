import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import userService from 'src/api/services/userService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateRole = () => {
  const userApi = userService()

  const [formData, setFormData] = useState({
    role_title: '',
    role_description: '',
    permissions_id: [],
  })
  const [permissionsSelected, setPermissionsSelected] = useState([])
  const [formValidate, setFormValidate] = useState({
    role_title: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên vai trò.',
    },
    role_description: {
      invalid: false,
      errorMessage: 'Vui lòng nhập mô tả.',
    },
    permissions_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn quyền.',
    },
  })

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

  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await userApi.getAllPermissions()
        setPermissions(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getPermissions()
  }, [])

  useEffect(() => {
    let isValid = formData.role_title && formData.role_description && permissionsSelected.length

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [formData, formValidate, permissionsSelected])
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })

    let isFieldValid = validator.isEmpty(value)
    setFormValidate({
      ...formValidate,
      [name]: {
        ...formValidate[name],
        invalid: isFieldValid,
      },
    })
  }

  const handlePermissionSelect = (selectedList, selectedItem) => {
    setPermissionsSelected(selectedList)
    if (selectedList.length === 0) {
      setFormValidate({
        ...formValidate,
        permissions_id: {
          ...formValidate.permissions_id,
          invalid: true,
        },
      })
    } else {
      setFormValidate({
        ...formValidate,
        permissions_id: {
          ...formValidate.permissions_id,
          invalid: false,
        },
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    formData.permissions_id = permissionsSelected.map((permission) => permission.id)
    try {
      await userApi.createRole(JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/roles/management')
  }, [done, successModalVisible])
  const inputs = [
    {
      type: 'text',
      label: 'Vai trò*',
      id: 'role_title',
      name: 'role_title',
      value: formData.role_title,
      onChange: handleInputChange,
      invalid: formValidate.role_title.invalid,
      errorMessage: formValidate.role_title.errorMessage,
    },
    {
      type: 'text',
      label: 'Mô tả*',
      id: 'role_description',
      name: 'role_description',
      value: formData.role_description,
      onChange: handleInputChange,
      invalid: formValidate.role_description.invalid,
      errorMessage: formValidate.role_description.errorMessage,
    },
    {
      type: 'multiselect',
      id: 'permssion_id',
      name: 'permssion_id',
      label: 'Quyền*',
      onChange: handlePermissionSelect,
      value: permissionsSelected,
      invalid: formValidate.permissions_id.invalid,
      errorMessage: formValidate.permissions_id.errorMessage,
      options: permissions.map((permission) => ({
        name: permission.permission_title,
        id: permission.permission_id,
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
                <h4>Thêm vai trò</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../roles/management">
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

export default CreateRole
