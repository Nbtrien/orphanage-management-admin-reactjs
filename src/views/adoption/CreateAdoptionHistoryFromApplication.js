import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import fileService from 'src/api/services/fileService'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import adoptionService from 'src/api/services/adoptionService'
import { format } from 'date-fns'

const CreateAdoptionHistoryFromPplication = () => {
  const { id } = useParams()
  const fileApi = fileService()
  const adoptionApi = adoptionService()
  const [application, setApplication] = useState(null)

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

  const [formData, setFormData] = useState({
    children_id: '',
    adoption_date: '',
    description: '',
    document_file_path: '',
  })

  const [documentFile, setDocumentFile] = useState([])

  const [formValidate, setFormValidate] = useState({
    children_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn trẻ',
    },
    adoption_date: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày nhận nuôi',
    },
    description: {
      invalid: false,
      errorMessage: 'Vui lòng nhập chi tiết',
    },
    document: {
      invalid: false,
      errorMessage: 'Vui lòng chọn giấy tờ',
    },
  })
  const [formValid, setFormValid] = useState(false)

  const [children, setChildren] = useState([])
  const [isReset, setIsReset] = useState(0)

  useEffect(() => {
    const getChildren = async () => {
      try {
        const response = await adoptionApi.getChildrenForHistory()
        setChildren(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    const getApplication = async () => {
      try {
        const response = await adoptionApi.getApplicationForCreateHistory(id)
        setApplication(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    id && getApplication() && getChildren()
  }, [id])

  useEffect(() => {
    // setFormValid(applicantValid && spouseValid && reason)
    setFormValid(true)
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

  const handleDocumentChange = (event) => {
    const file = event.target.files[0]
    setDocumentFile(file)
    if (file && file.size > 10 * 1024 * 1024) {
      setFormValidate({
        ...formValidate,
        document: {
          ...formValidate.document,
          invalid: true,
          errorMessage: 'Kích thước tệp không được vượt quá 10MB.',
        },
      })
    } else {
      setFormValidate({
        ...formValidate,
        document: {
          ...formValidate.image,
          invalid: false,
        },
      })
    }
  }

  const uploadToS3 = async (presignedUrl, file) => {
    const binaryData = await fileToBinary(file)
    try {
      await axios.put(presignedUrl, binaryData, {
        headers: {
          'Content-Type': file.type,
        },
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  const handleUploadDocument = async () => {
    try {
      const response = await fileApi.getPresignedUrl(documentFile.name, 'applications')
      const result = response.result
      try {
        await uploadToS3(result.presigned_url, documentFile)
        formData.document_file_path = result?.file_name
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (await handleUploadDocument()) {
      try {
        await adoptionApi.createAdoptionHistoryFromApplication(id, JSON.stringify(formData))
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
          modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
      }
    } else {
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
      (window.location.href = 'http://localhost:3000/admin/adoption-history/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'select',
      label: 'Chọn trẻ được nhận nuôi*',
      id: 'children_id',
      name: 'children_id',
      value: formData.children_id,
      onChange: handleInputChange,
      options: children.map((child) => ({
        label: '#' + child.children_id + ' ' + child.children_full_name,
        value: child.children_id,
      })),
      invalid: formValidate.children_id.invalid,
      errorMessage: formValidate.children_id.errorMessage,
    },
    {
      type: 'date',
      id: 'adoption_date',
      name: 'adoption_date',
      label: 'Ngày nhận nuôi*',
      value: formData.adoption_date,
      onChange: handleInputChange,
      invalid: formValidate.adoption_date.invalid,
      errorMessage: formValidate.adoption_date.errorMessage,
    },
    {
      type: 'textarea',
      id: 'description',
      name: 'description',
      label: 'Chi tiết*',
      value: formData.description,
      onChange: handleInputChange,
      rows: 4,
      invalid: formValidate.description.invalid,
      errorMessage: formValidate.description.errorMessage,
    },
    {
      type: 'file',
      id: 'file',
      label: 'Giấy xác nhận nhận nuôi*',
      onChange: handleDocumentChange,
      invalid: formValidate.document.invalid,
      errorMessage: formValidate.document.errorMessage,
    },
  ]

  return (
    <>
      <LoadingModal isVisible={loadingModalVisible} setVisible={setLoadingModalVisible} />
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <div className="form-header-custom mb-4">
                <h4>Thêm lịch sử nhận nuôi</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../adoption-history/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
                </NavLink>
              </div>
              {application && (
                <CForm>
                  <h5>Thông tin đơn đăng ký</h5>
                  <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                    <CTableBody>
                      <CTableRow>
                        <CTableDataCell className="form-table-label">Ngày đăng ký</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            value={format(new Date(application.date_of_application), 'dd/MM/yyyy')}
                            placeholder="Ngày đăng ký"
                            readOnly
                          />
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableDataCell className="form-table-label">
                          Họ và tên người đăng ký
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            value={application.applicant_full_name}
                            placeholder="Họ và tên người đăng ký"
                            readOnly
                          />
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                  <h5 className="mt-3">Thông tin nhận nuôi</h5>
                  <CTable responsive bordered className="form-table overflow-hidden table-border-2">
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
                      Thêm
                    </CButton>
                  </div>
                </CForm>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateAdoptionHistoryFromPplication
