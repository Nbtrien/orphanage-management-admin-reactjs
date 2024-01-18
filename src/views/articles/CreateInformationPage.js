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
import JoditEditor from 'jodit-react'
import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import articleService from 'src/api/services/articleService'
import fileService from 'src/api/services/fileService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateInformationPage = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const pageTypeId = searchParams.get('pageType')
  const articleApi = articleService()

  const [pageType, setPageType] = useState(null)
  const [formData, setFormData] = useState({
    page_type_id: '',
    page_title: '',
    page_content: '',
  })
  const [formValidate, setFormValidate] = useState({
    page_title: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    page_title: {
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
    let isValid = formData.page_title && formData.page_content

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

  useEffect(() => {
    const getPageType = async () => {
      try {
        const resposse = await articleApi.getPageTypeDetail(pageTypeId)
        setFormData({
          ...formData,
          page_type_id: pageTypeId,
        })
        setPageType(resposse.result)
      } catch (error) {
        console.log(error)
      }
    }

    pageTypeId && getPageType()
  }, [pageTypeId])

  useEffect(() => {
    const getPage = async () => {
      try {
        const resposse = await articleApi.getInformationPageDetail(pageTypeId)
        setFormData({
          page_type_id: pageTypeId,
          page_title: resposse.result.page_title,
          page_content: resposse.result.page_content,
        })
      } catch (error) {
        console.log(error)
      }
    }

    pageType?.is_update && getPage()
  }, [pageType])

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
      placeholder: 'Tạo nội dung',
      minHeight: 500,
      value: formData.page_content || 'Initial content here', // Set initial value
    }),
    [],
  )

  const handleContentChange = (content) => {
    formData.page_content = content

    let isFieldValid = validator.isEmpty(content)
    setFormValidate({
      ...formValidate,
      page_content: {
        ...formValidate.page_content,
        invalid: isFieldValid,
      },
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(formData)
    setLoadingModalVisible(true)
    try {
      await articleApi.addNewInformationPage(JSON.stringify(formData))
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã cập nhật thành công',
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
      (window.location.href = 'http://localhost:3000/admin/content/information-page/management')
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
                <h4>Thêm trang thông tin</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../content/information-page/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Tên trang</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput value={pageType?.page_type} />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Tiêu đề trang*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          name="page_title"
                          value={formData.page_title}
                          placeholder="Tiêu đề trang*"
                          onChange={handleInputChange}
                          invalid={formValidate.page_title.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.page_title.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Nội dung*</CTableDataCell>
                      <CTableDataCell>
                        <JoditEditor
                          id="editor"
                          config={config}
                          value={formData.page_content}
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
                    Cập nhật
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

export default CreateInformationPage
