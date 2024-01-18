import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import validator from 'validator'
import familyService from 'src/api/services/familyService'

const CreateFamilyCondition = () => {
  const familyApi = familyService()
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

  const [condition, setCondition] = useState({
    age_from: '',
    age_to: '',
    min_number_of_children: '',
    max_number_of_children: '',
  })
  const [formValidate, setFormValidate] = useState({
    age_from: {
      invalid: false,
      errorMessage: 'Vui lòng nhập độ tuổi tối thiểu',
    },
    age_to: {
      invalid: false,
      errorMessage: 'Vui lòng nhập độ tuổi tối đa',
    },
    min_number_of_children: {
      invalid: false,
      errorMessage: 'Vui lòng nhập số trẻ tối thiểu',
    },
    max_number_of_children: {
      invalid: false,
      errorMessage: 'Vui lòng nhập số trẻ tối đa',
    },
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setCondition({
      ...condition,
      [name]: value,
    })

    let isFieldValid = validator.isEmpty(value)
    const numericValue = parseFloat(value)
    switch (name) {
      case 'age_from':
        numericValue < 0 || (numericValue > condition.age_to && (isFieldValid = true))
        break
      case 'age_to':
        numericValue < 0 || (numericValue < condition.age_from && (isFieldValid = true))
        break
      case 'min_number_of_children':
        numericValue < 0 ||
          (numericValue > condition.max_number_of_children && (isFieldValid = true))
        break
      case 'max_number_of_children':
        numericValue < 0 ||
          (numericValue < condition.min_number_of_children && (isFieldValid = true))
        break
      default:
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    try {
      await familyApi.addNewConditions(JSON.stringify(condition))
      setLoadingModalVisible(false)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thêm thành công',
      }))
      setSuccessModalVisible(true)
      setDone(true)
    } catch (e) {
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: e?.error?.message,
      }))
      setErrorModalVisible(true)
    }
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/families/conditions/management')
  }, [done, successModalVisible])

  return (
    <>
      <LoadingModal
        isVisible={loadingModalVisible}
        setVisible={setLoadingModalVisible}
      ></LoadingModal>
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm tiêu chuẩn gia đình</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../families/conditions/management">
                  <CButton className="form-table-btn">về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Độ tuổi quy định*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CRow className="justify-content-between">
                          <CCol>
                            <CFormFloating>
                              <CFormInput
                                size="sm"
                                type="number"
                                name="age_from"
                                value={condition.age_from}
                                onChange={handleInputChange}
                                invalid={formValidate.age_from.invalid}
                              />
                              <CFormLabel
                                htmlFor="inputSearch"
                                className="label-floating-custom text-truncate"
                              >
                                Độ tuổi tối thiểu
                              </CFormLabel>
                            </CFormFloating>
                          </CCol>
                          <CCol
                            md={1}
                            className="d-flex justify-content-center align-items-center font-lg"
                          >
                            -
                          </CCol>
                          <CCol>
                            <CFormFloating>
                              <CFormInput
                                size="sm"
                                type="number"
                                name="age_to"
                                value={condition.age_to}
                                onChange={handleInputChange}
                                invalid={formValidate.age_to.invalid}
                              />
                              <CFormLabel
                                htmlFor="inputSearch"
                                className="label-floating-custom text-truncate"
                              >
                                Độ tuổi tối đa
                              </CFormLabel>
                            </CFormFloating>
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Số trẻ quy định*</CTableDataCell>
                      <CTableDataCell>
                        <CRow className="justify-content-between">
                          <CCol>
                            <CFormFloating>
                              <CFormInput
                                size="sm"
                                type="number"
                                name="min_number_of_children"
                                value={condition.min_number_of_children}
                                invalid={formValidate.min_number_of_children.invalid}
                                onChange={handleInputChange}
                              />
                              <CFormLabel
                                htmlFor="inputSearch"
                                className="label-floating-custom text-truncate"
                              >
                                Số trẻ tối thiểu
                              </CFormLabel>
                            </CFormFloating>
                          </CCol>
                          <CCol
                            md={1}
                            className="d-flex justify-content-center align-items-center font-lg"
                          >
                            -
                          </CCol>
                          <CCol>
                            <CFormFloating>
                              <CFormInput
                                size="sm"
                                type="number"
                                name="max_number_of_children"
                                value={condition.max_number_of_children}
                                invalid={formValidate.max_number_of_children.invalid}
                                onChange={handleInputChange}
                              />
                              <CFormLabel
                                htmlFor="inputSearch"
                                className="label-floating-custom text-truncate"
                              >
                                Số trẻ tối đa
                              </CFormLabel>
                            </CFormFloating>
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit}>
                    Thêm
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

export default CreateFamilyCondition
