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
import publicService from 'src/api/services/publicService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateWebsiteContact = () => {
  const editor = useRef(null)
  const contentApi = contentService()
  const publicApi = publicService()

  const [id, setId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    vision: '',
    mission: '',
    address: '',
    mail_address: '',
    phone_number: '',
  })
  const [formValidate, setFormValidate] = useState({
    name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    about: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    vision: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    mission: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    address: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    mail_address: {
      invalid: false,
      errorMessage: 'Vui lòng nhập trường này.',
    },
    phone_number: {
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

  const [reRender, setReRender] = useState(false)

  useEffect(() => {
    let isValid =
      formData.name &&
      formData.about &&
      formData.address &&
      formData.mail_address &&
      formData.phone_number

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
    const getWebsiteContact = async () => {
      try {
        const response = await publicApi.getWebsiteContact()
        if (response?.result) {
          setId(response?.result?.website_contact_id)
          setFormData(response?.result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getWebsiteContact()
  }, [reRender])

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
      if (id) {
        await contentApi.updateWebsiteContact(id, JSON.stringify(formData))
      } else {
        await contentApi.addWebsiteContact(JSON.stringify(formData))
      }
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Cập nhật thành công',
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
    done && !successModalVisible && setReRender(!reRender)
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Tên website*',
      id: 'name',
      name: 'name',
      value: formData.name,
      onChange: handleInputChange,
      invalid: formValidate.name.invalid,
      errorMessage: formValidate.name.errorMessage,
    },
    {
      type: 'textarea',
      label: 'Giới thiệu*',
      id: 'about',
      name: 'about',
      value: formData.about,
      onChange: handleInputChange,
      invalid: formValidate.about.invalid,
      errorMessage: formValidate.about.errorMessage,
      rows: 3,
    },
    {
      type: 'text',
      label: 'Địa chỉ*',
      id: 'address',
      name: 'address',
      value: formData.address,
      onChange: handleInputChange,
      invalid: formValidate.address.invalid,
      errorMessage: formValidate.address.errorMessage,
    },
    {
      type: 'email',
      label: 'Địa chỉ email*',
      id: 'mail_address',
      name: 'mail_address',
      value: formData.mail_address,
      onChange: handleInputChange,
      invalid: formValidate.mail_address.invalid,
      errorMessage: formValidate.mail_address.errorMessage,
    },
    {
      type: 'number',
      id: 'phone_number',
      name: 'phone_number',
      label: 'Số điện thoại*',
      value: formData.phone_number,
      onChange: handleInputChange,
      invalid: formValidate.phone_number.invalid,
      errorMessage: formValidate.phone_number.errorMessage,
    },
    {
      type: 'textarea',
      label: 'Tầm nhìn*',
      id: 'vision',
      name: 'vision',
      value: formData.vision,
      onChange: handleInputChange,
      invalid: formValidate.vision.invalid,
      errorMessage: formValidate.vision.errorMessage,
      rows: 4,
    },
    {
      type: 'textarea',
      label: 'Sứ mệnh*',
      id: 'mission',
      name: 'mission',
      value: formData.mission,
      onChange: handleInputChange,
      invalid: formValidate.mission.invalid,
      errorMessage: formValidate.mission.errorMessage,
      rows: 4,
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
                <h4>Cập nhật thông tin website</h4>
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

export default CreateWebsiteContact
