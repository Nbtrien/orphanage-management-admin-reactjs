import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import donationService from 'src/api/services/donationService'
import familyService from 'src/api/services/familyService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateDonationPurpose = () => {
  const donationApi = donationService()
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    is_active: 1,
  })

  const [formValidate, setFormValidate] = useState({
    purpose: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên chiến dịch',
    },
    description: {
      invalid: false,
      description: 'Vui lòng nhập mô tả',
    },
    is_active: {
      invalid: false,
      description: 'Vui lòng chọn',
    },
  })

  const [formValid, setFormValid] = useState(false)

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
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let isValid = formData.purpose && formData.description

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    try {
      await donationApi.addNewDonationPurpose(JSON.stringify(formData))
      setLoadingModalVisible(false)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thêm thành công',
      }))
      setSuccessModalVisible(true)
      setDone(true)
    } catch (e) {
      console.log(e)
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/donations/programs/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      id: 'purpose',
      name: 'purpose',
      label: 'Tên chiến dịch*',
      value: formData.purpose,
      onChange: handleInputChange,
      invalid: formValidate.purpose.invalid,
      errorMessage: formValidate.purpose.errorMessage,
    },
    {
      type: 'textarea',
      id: 'description',
      name: 'description',
      label: 'Mô tả*',
      value: formData.description,
      onChange: handleInputChange,
      invalid: formValidate.description.invalid,
      errorMessage: formValidate.description.errorMessage,
    },
    {
      type: 'radio',
      id: 'is_active',
      name: 'is_active',
      label: 'Trạng thái kêu gọi tài trợ*',
      value: formData.is_active,
      onChange: handleInputChange,
      invalid: formValidate.is_active.invalid,
      errorMessage: formValidate.is_active.errorMessage,
      options: [
        { label: 'Có', value: 1 },
        { label: 'không', value: 0 },
      ],
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
      <LoadingModal
        isVisible={loadingModalVisible}
        setVisible={setLoadingModalVisible}
      ></LoadingModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm chiến dịch tài trợ</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../donations/programs/management">
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
                    Thêm chiến dịch
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

export default CreateDonationPurpose
