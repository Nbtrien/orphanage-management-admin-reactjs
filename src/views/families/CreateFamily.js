import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import familyService from 'src/api/services/familyService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'

const CreateFamily = () => {
  const familyApi = familyService()

  const [familyConditions, setFamilyConditions] = useState([])
  const [mothers, setMothers] = useState([])

  const [formData, setFormData] = useState({
    family_name: '',
    date_of_formation: '',
    mother_id: null,
    family_condition_id: null,
  })

  const [formValidate, setFormValidate] = useState({
    family_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên',
    },
    date_of_formation: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày thành lập',
    },
    mother_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn bà mẹ',
    },
    family_condition_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn tiêu chuẩn gia đình',
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
    // Get provinces
    const getFamilyConditions = async () => {
      try {
        const response = await familyApi.getFamilyConditions()
        const result = response.result
        setFamilyConditions(result)
      } catch (error) {
        console.log(error)
      }
    }
    // Get positions
    const getMothers = async () => {
      try {
        const response = await familyApi.getAllMothersAvailable()
        const result = response.result
        setMothers(result)
      } catch (error) {
        console.log(error)
      }
    }

    getFamilyConditions()
    getMothers()
  }, [])

  useEffect(() => {
    let isValid =
      formData.family_name &&
      formData.date_of_formation &&
      formData.mother_id &&
      formData.family_condition_id

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

  const resetForm = () => {
    setFormData({
      family_name: '',
      date_of_formation: '',
      mother_id: null,
      family_condition_id: null,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    try {
      await familyApi.createFamily(JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/families/information')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      id: 'family_name',
      name: 'family_name',
      label: 'Tên gia đình*',
      value: formData.family_name,
      onChange: handleInputChange,
      invalid: formValidate.family_name.invalid,
      errorMessage: formValidate.family_name.errorMessage,
    },
    {
      type: 'date',
      id: 'date_of_formation',
      name: 'date_of_formation',
      label: 'Ngày thành lập*',
      value: formData.date_of_formation,
      onChange: handleInputChange,
      invalid: formValidate.date_of_formation.invalid,
      errorMessage: formValidate.date_of_formation.errorMessage,
    },
    {
      type: 'select',
      id: 'mother_id',
      name: 'mother_id',
      label: 'Bà mẹ quản lý*',
      value: formData.mother_id,
      onChange: handleInputChange,
      invalid: formValidate.mother_id.invalid,
      errorMessage: formValidate.mother_id.errorMessage,
      options: mothers.map((mother) => ({
        label: 'ID: ' + mother.mother_id + ', ' + mother.mother_name,
        value: mother.mother_id,
      })),
    },
    {
      type: 'select',
      id: 'family_condition_id',
      name: 'family_condition_id',
      label: 'Tiêu chuẩn gia đình*',
      value: formData.family_condition_id,
      onChange: handleInputChange,
      invalid: formValidate.family_condition_id.invalid,
      errorMessage: formValidate.family_condition_id.errorMessage,
      options: familyConditions.map((condition) => ({
        label:
          condition.age_from +
          ' ~ ' +
          condition.age_to +
          ' Tuổi (Số trẻ: ' +
          condition.min_number_of_children +
          ' ~ ' +
          condition.max_number_of_children +
          ')',
        value: condition.family_condition_id,
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
      <LoadingModal
        isVisible={loadingModalVisible}
        setVisible={setLoadingModalVisible}
      ></LoadingModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm thông tin gia đình</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../families/information">
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
                    Thêm gia đình
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

export default CreateFamily
