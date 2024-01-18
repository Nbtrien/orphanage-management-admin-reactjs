import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import fileService from 'src/api/services/fileService'
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
    diagnosis: '',
    prescription: '',
    medical_notes: '',
    visit_date: '',
    document_file_name: '',
    document_file_path: '',
  })
  const [documentFile, setDocumentFile] = useState()

  const [formValidate, setFormValidate] = useState({
    diagnosis: {
      invalid: false,
      errorMessage: 'Vui lòng nhập chẩn đoán',
    },
    prescription: {
      invalid: false,
      errorMessage: 'Vui lòng nhập đơn thuốc',
    },
    medical_notes: {
      invalid: false,
      errorMessage: 'Vui lòng nhập loại giấy tờ',
    },
    document_file_name: {
      invalid: false,
      errorMessage: 'Vui lòng chọn loại giấy tờ',
    },
    visit_date: {
      invalid: false,
      errorMessage: 'Vui lòng nhập ngày khám bệnh.',
    },
    document_file: {
      invalid: false,
      errorMessage: 'Vui lòng chọn tệp.',
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
      formData.diagnosis &&
      formData.prescription &&
      formData.visit_date &&
      !formValidate.diagnosis.invalid &&
      !formValidate.prescription.invalid &&
      !formValidate.visit_date.invalid

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
        await childrenApi.createMedicalRecords(childrenId, JSON.stringify(formData))
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
                <h4>Thêm lịch sử y tế</h4>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Họ và tên trẻ</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput value={childrenName} type="text" readOnly />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Chẩn đoán*</CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="diagnosis"
                          value={formData.diagnosis}
                          rows={3}
                          onChange={handleInputChange}
                          placeholder="Chẩn đoán"
                          invalid={formValidate.diagnosis.invalid}
                        />
                        <CFormFeedback invalid>{formValidate.diagnosis.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Đơn thuốc*</CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="prescription"
                          value={formData.prescription}
                          rows={3}
                          onChange={handleInputChange}
                          placeholder="Đơn thuốc"
                          invalid={formValidate.prescription.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.prescription.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Ngày khám*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          name="visit_date"
                          value={formData.visit_date}
                          type="date"
                          onChange={handleInputChange}
                          placeholder="Ngày khám"
                          invalid={formValidate.visit_date.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.visit_date.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Ghi chú y tế*</CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="medical_notes"
                          value={formData.medical_notes}
                          rows={3}
                          onChange={handleInputChange}
                          placeholder="Ghi chú y tế"
                          invalid={formValidate.medical_notes.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.medical_notes.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
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
