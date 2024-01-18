import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import employeeService from 'src/api/services/employeeService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateMonthlyPayroll = () => {
  const employeeApi = employeeService()

  const [formData, setFormData] = useState({
    month: '',
    year: '',
  })
  const [formValidate, setFormValidate] = useState({
    month: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    year: {
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
    let isValid = formData.month && formData.year

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
      await employeeApi.createMonthlyPayroll(JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/monthly-payrolls/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'number',
      label: 'Nhập tháng*',
      id: 'month',
      name: 'month',
      value: formData.month,
      onChange: handleInputChange,
      invalid: formValidate.month.invalid,
      errorMessage: formValidate.month.errorMessage,
    },
    {
      type: 'number',
      label: 'Nhập năm*',
      id: 'year',
      name: 'year',
      value: formData.year,
      onChange: handleInputChange,
      invalid: formValidate.year.invalid,
      errorMessage: formValidate.year.errorMessage,
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
                <h4>Thêm bảng lương</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../monthly-payrolls/management">
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
                    Thêm bảng lương
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

export default CreateMonthlyPayroll
