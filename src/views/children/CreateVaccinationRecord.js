import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import fileService from 'src/api/services/fileService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateMedicalRecord = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const childrenId = searchParams.get('childrenId')
  const childrenName = searchParams.get('childrenName')

  const childrenApi = childrenService()
  const fileApi = fileService()

  const [formData, setFormData] = useState({
    vaccine_name: '',
    vaccine_type: '',
    vaccination_date: '',
    vaccination_location: '',
    vaccination_notes: '',
    document_file_name: '',
    document_file_path: '',
  })
  const [documentFile, setDocumentFile] = useState()
  const [formValidate, setFormValidate] = useState({
    vaccine_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập tên vaccine',
    },
    vaccine_type: {
      invalid: false,
      errorMessage: 'Vui lòng nhập loại vaccine',
    },
    vaccination_date: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày tiêm',
    },
    vaccination_location: {
      invalid: false,
      errorMessage: 'Vui lòng nhập nơi tiêm',
    },
    document_file_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập loại giấy tờ',
    },
  })
  const [documentFileValidate, setDocumentFileInvalid] = useState({
    invalid: false,
    errorMessage: 'Vui lòng chọn tệp.',
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
  const [done, setDone] = useState(false)
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  useEffect(() => {
    let isValid =
      formData.vaccine_name &&
      formData.vaccine_type &&
      formData.vaccination_date &&
      formData.vaccination_location &&
      !formValidate.vaccine_name.invalid &&
      !formValidate.vaccine_type.invalid &&
      !formValidate.vaccination_date.invalid &&
      !formValidate.vaccination_location.invalid

    if (
      (formData.document_file_name && !documentFile) ||
      (documentFile && !formData.document_file_name)
    ) {
      isValid = false
    }

    if (isValid && formData.document_file_name && documentFile) {
      isValid = true
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
    switch (name) {
      case 'document_file_name':
        if (documentFile) {
          if (validator.isEmpty(value)) {
            isFieldValid = true
          } else {
            isFieldValid = false
          }
        } else {
          isFieldValid = false
          if (!validator.isEmpty(value)) {
            setDocumentFileInvalid({
              invalid: true,
              errorMessage: 'Vui lòng chọn tệp',
            })
          } else {
            setDocumentFileInvalid({
              invalid: false,
              errorMessage: 'Vui lòng chọn tệp',
            })
          }
        }
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

  const handleDocumentFileChange = (event) => {
    const file = event.target.files[0]
    setDocumentFile(file)
    if (file && file.size > 10 * 1024 * 1024) {
      setDocumentFileInvalid({
        invalid: true,
        errorMessage: 'Kích thước tệp không được vượt quá 10MB.',
      })
    } else {
      setDocumentFileInvalid({
        invalid: false,
        errorMessage: '',
      })

      if (file) {
        if (!formData.document_file_name) {
          setFormValidate({
            ...formValidate,
            document_file_name: {
              ...formValidate.document_file_name,
              invalid: true,
            },
          })
        } else {
          setFormValidate({
            ...formValidate,
            document_file_name: {
              ...formValidate.document_file_name,
              invalid: false,
            },
          })
        }
      }
    }
  }

  const handleUploadFile = async () => {
    try {
      const response = await fileApi.getPresignedUrl(documentFile.name, 'files')
      if (response.status === 200) {
        const result = response.result
        let presignedUrl = result.presigned_url
        const binaryData = await fileToBinary(documentFile)
        try {
          await axios.put(presignedUrl, binaryData, {
            headers: {
              'Content-Type': documentFile.type,
            },
          })

          formData.document_file_path = result?.file_path
          return true
        } catch (err) {
          console.log(err)
          return false
        }
      }
    } catch (error) {
      console.log(error)
      return false
    }
    return false
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    if (documentFile && !(await handleUploadFile())) {
      setLoadingModalVisible(false)
      return
    } else {
      try {
        await childrenApi.createVaccinationRecords(childrenId, JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/children/' + childrenId)
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Họ và tên trẻ',
      value: childrenName,
      readOnly: true,
    },
    {
      type: 'text',
      id: 'vaccine_name',
      name: 'vaccine_name',
      label: 'Tên vaccine*',
      value: formData.vaccine_name,
      onChange: handleInputChange,
      invalid: formValidate.vaccine_name.invalid,
      errorMessage: formValidate.vaccine_name.errorMessage,
    },
    {
      label: 'Loại vaccine*',
      type: 'text',
      id: 'vaccine_type',
      name: 'vaccine_type',
      value: formData.vaccine_type,
      onChange: handleInputChange,
      invalid: formValidate.vaccine_type.invalid,
      errorMessage: formValidate.vaccine_type.errorMessage,
    },
    {
      label: 'Ngày tiêm*',
      type: 'date',
      id: 'vaccination_date',
      name: 'vaccination_date',
      value: formData.vaccination_date,
      onChange: handleInputChange,
      invalid: formValidate.vaccination_date.invalid,
      errorMessage: formValidate.vaccination_date.errorMessage,
    },
    {
      label: 'Địa điểm tiêm*',
      type: 'text',
      id: 'vaccination_location',
      name: 'vaccination_location',
      value: formData.vaccination_location,
      onChange: handleInputChange,
      invalid: formValidate.vaccination_location.invalid,
      errorMessage: formValidate.vaccination_location.errorMessage,
    },
    {
      type: 'textarea',
      label: 'Ghi chú ',
      id: 'vaccination_notes',
      name: 'vaccination_notes',
      value: formData.vaccination_notes,
      onChange: handleInputChange,
    },
  ]

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
                <h4>Thêm lịch sử tiêm chủng</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../children/information">
                  <CButton className="form-table-btn">về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    {inputs.map((input, index) => (
                      <FormInputDataCell key={index} {...input} />
                    ))}
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Giấy tờ liên quan
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          name="document_file_name"
                          value={formData.document_file_name}
                          type="text"
                          onChange={handleInputChange}
                          placeholder="Loại giấy tờ"
                          className="mb-3"
                          invalid={formValidate.document_file_name.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.document_file_name.errorMessage}
                        </CFormFeedback>

                        <CFormInput
                          name="document_file"
                          type="file"
                          onChange={handleDocumentFileChange}
                          invalid={documentFileValidate.invalid}
                        />
                        <CFormFeedback invalid>{documentFileValidate.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
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

export default CreateMedicalRecord
