import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormFeedback,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import JoditEditor from 'jodit-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import articleService from 'src/api/services/articleService'
import contentService from 'src/api/services/contentService'
import fileService from 'src/api/services/fileService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateFaqQuestion = () => {
  const editor = useRef(null)
  const contentApi = contentService()

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  })
  const [formValidate, setFormValidate] = useState({
    question: {
      invalid: false,
      errorMessage: 'Vui lòng nhập câu hỏi.',
    },
    answer: {
      invalid: false,
      errorMessage: 'Vui lòng nhập câu trả lời.',
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
    let isValid = formData.question && formData.answer

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

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Tạo câu trả lời',
      minHeight: 300,
    }),
    [],
  )
  const handleContentChange = (content) => {
    formData.answer = content

    let isFieldValid = validator.isEmpty(content)
    setFormValidate({
      ...formValidate,
      answer: {
        ...formValidate.answer,
        invalid: isFieldValid,
      },
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    try {
      await contentApi.addFaq(JSON.stringify(formData))
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
      (window.location.href = 'http://localhost:3000/admin/content/faq/management')
  }, [done, successModalVisible])

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
                <h4>Thêm câu hỏi thường gặp (FAQs)</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../content/faq/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Câu hỏi*</CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="question"
                          value={formData.question}
                          rows={3}
                          onChange={handleInputChange}
                          placeholder="Câu hỏi"
                          invalid={formValidate.question.invalid}
                        />
                        <CFormFeedback invalid>{formValidate.question.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Câu trả lời*</CTableDataCell>
                      <CTableDataCell>
                        <JoditEditor
                          id="editor"
                          ref={editor}
                          config={config}
                          onChange={(newContent) => {
                            handleContentChange(newContent)
                          }}
                        />
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

export default CreateFaqQuestion
