import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import employeeService from 'src/api/services/employeeService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreatePosition = () => {
  const employeeApi = employeeService()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [formValidate, setFormValidate] = useState({
    title: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    description: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
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

  useEffect(() => {
    let isValid = formData.title && formData.description

    if (isValid) {
      for (const fieldName of Object.keys(formValidate)) {
        if (formValidate[fieldName].invalid) {
          isValid = false
          break
        }
      }
    }

    setFormValid(isValid)
  }, [formData, formValidate])
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
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    try {
      await employeeApi.createPosition(JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/positions/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Công việc*',
      id: 'title',
      name: 'title',
      value: formData.title,
      onChange: handleInputChange,
      invalid: formValidate.title.invalid,
      errorMessage: formValidate.title.errorMessage,
    },
    {
      type: 'textarea',
      label: 'Mô tả*',
      id: 'description',
      name: 'description',
      value: formData.description,
      onChange: handleInputChange,
      invalid: formValidate.description.invalid,
      errorMessage: formValidate.description.errorMessage,
      rows: 3,
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
                <h4>Thêm công việc</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../positions/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
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
                    Thêm công việc
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

export default CreatePosition
