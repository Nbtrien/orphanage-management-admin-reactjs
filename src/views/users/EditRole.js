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

const EditRole = () => {
  const userApi = userService()
  const { id } = useParams()
  const [role, setRole] = useState()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [permissionsSelected, setPermissionsSelected] = useState([])
  const [permissions, setPermissions] = useState([])

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

  const [titleInvalid, setTitleInvalid] = useState(false)
  const [titleErrorMessage, setTitleErrorMessage] = useState('')

  const [descriptionInvalid, setDescriptionInvalid] = useState(false)
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')

  const [formValid, setFormValid] = useState(false)

  const [done, setDone] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  useEffect(() => {
    const fetchRoleDetail = async () => {
      try {
        const response = await userApi.getRoleDetail(id)
        const result = response.result
        setRole(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRoleDetail()
  }, [id])

  useEffect(() => {
    if (role) {
      setTitle(role.role_title)
      setDescription(role.role_description)

      setPermissionsSelected(
        role.permissions.map((permission) => ({
          name: permission.permission_title,
          id: permission.permission_id,
        })),
      )
    }
  }, [role])

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await userApi.getAllPermissions()
        const result = response.result
        setPermissions(result)
      } catch (error) {
        console.log(error)
      }
    }
    getPermissions()
  }, [])

  useEffect(() => {
    setFormValid(
      title && description && permissionsSelected.length && !titleInvalid && !descriptionInvalid,
    )
  }, [permissionsSelected, titleInvalid, descriptionInvalid])

  const handleTitleChange = (event) => {
    const titleValue = event.target.value
    setTitle(titleValue)

    if (titleValue.length < 4 || titleValue.length > 20) {
      setTitleInvalid(true)
      setTitleErrorMessage('title không hợp lệ')
    } else {
      setTitleInvalid(false)
      setTitleErrorMessage('')
    }
  }

  const handleDescritionChange = (event) => {
    const descriptionValue = event.target.value
    setDescription(descriptionValue)

    if (descriptionValue.length < 4 || descriptionValue.length > 20) {
      setDescriptionInvalid(true)
      setDescriptionErrorMessage('Tên người dùng phải có từ 4 đến 20 ký tự')
    } else {
      setDescriptionInvalid(false)
      setDescriptionErrorMessage('')
    }
  }

  const handlePermissionSelect = (selectedList, selectedItem) => {
    setPermissionsSelected(selectedList)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    const data = {
      role_title: title,
      role_description: description,
      permissions_id: permissionsSelected.map((permission) => permission.id),
    }
    try {
      await userApi.updateRole(id, JSON.stringify(data))
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã sửa thành công',
      }))
      setLoadingModalVisible(false)
      setSuccessModalVisible(true)
      setDone(true)
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
      (window.location.href = 'http://localhost:3000/admin/roles/' + id)
  }, [done, successModalVisible])
  const inputs = [
    {
      type: 'text',
      id: 'inputTitle',
      label: 'Vai trò*',
      value: title,
      onChange: handleTitleChange,
      invalid: titleInvalid,
      errorMessage: titleErrorMessage,
    },
    {
      type: 'text',
      id: 'inputDescription',
      label: 'Mô tả*',
      value: description,
      onChange: handleDescritionChange,
      invalid: descriptionInvalid,
      errorMessage: descriptionErrorMessage,
    },
    {
      type: 'multiselect',
      id: 'inputPermissions',
      label: 'Quyền*',
      onChange: handlePermissionSelect,
      value: permissionsSelected,
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
                <h4>Sửa vai trò</h4>
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
                    Lưu
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

export default EditRole
