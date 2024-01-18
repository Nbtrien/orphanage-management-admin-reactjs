import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import JoditEditor from 'jodit-react'
import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import donationService from 'src/api/services/donationService'
import fileService from 'src/api/services/fileService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateDonationPurposeformData = () => {
  const { id } = useParams()
  const donationApi = donationService()
  const fileApi = fileService()
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
  const [isUpdate, setIsUpdate] = useState(false)

  const editor = useRef('')
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    image_file_name: null,
    image_file_path: '',
    banner_image_file_path: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [bannerImageFile, setbannerImageFile] = useState(null)
  const [formValidate, setFormValidate] = useState({
    title: {
      invalid: false,
      errorMessage: 'Vui lòng điền tiêu đề',
    },
    summary: {
      invalid: false,
      errorMessage: 'Vui lòng điền tóm tắt nội dung',
    },
    content: {
      invalid: false,
      errorMessage: 'Vui lòng điền nội dung',
    },
    image: {
      invalid: false,
      errorMessage: 'Vui lòng chọn ảnh',
    },
    bannerImage: {
      invalid: false,
      errorMessage: 'Vui lòng chọn ảnh',
    },
  })
  const [formValid, setFormValid] = useState(false)
  const config = {
    readonly: false,
    placeholder: 'Nhập nội dung bài viết',
    minHeight: 300,
  }
  useEffect(() => {
    const getDonationPurpose = async () => {
      try {
        const response = await donationApi.getDonationPostUpdateInfo(id)
        setFormData(response.result)
        if (response.result?.donation_purpose_post_id) {
          setIsUpdate(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    id && getDonationPurpose()
  }, [id])

  useEffect(() => {
    let isValid = formData.title && formData.summary && formData.content

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

  const handleContentChange = (content) => {
    formData.content = content
  }

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

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(file)
  }

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0]
    setbannerImageFile(file)
  }

  const validateImage = () => {
    if (!imageFile) {
      setFormValidate({
        ...formValidate,
        image: {
          ...formValidate.image,
          invalid: true,
        },
      })
      return false
    }
    if (!bannerImageFile) {
      setFormValidate({
        ...formValidate,
        bannerImage: {
          ...formValidate.bannerImage,
          invalid: true,
        },
      })
      return false
    }
    return true
  }

  const handleUploadImage = async () => {
    try {
      const response = await fileApi.getPresignedUrl(imageFile.name, 'images')
      if (response.status === 200) {
        const result = response.result
        let presignedUrl = result.presigned_url
        const binaryData = await fileToBinary(imageFile)
        try {
          await axios.put(presignedUrl, binaryData, {
            headers: {
              'Content-Type': imageFile.type,
            },
          })
          formData.image_file_name = result?.file_name
          formData.image_file_path = result?.file_path
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

  const handleUploadBannerImage = async () => {
    try {
      const response = await fileApi.getPresignedUrl(bannerImageFile.name, 'images')
      if (response.status === 200) {
        const result = response.result
        let presignedUrl = result.presigned_url
        const binaryData = await fileToBinary(bannerImageFile)
        try {
          await axios.put(presignedUrl, binaryData, {
            headers: {
              'Content-Type': bannerImageFile.type,
            },
          })
          formData.banner_image_file_path = result?.file_path
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    if (!isUpdate) {
      if (!validateImage()) {
        setLoadingModalVisible(false)
        console.log('loi validate')
        return
      }
    }
    if (imageFile) {
      if (!(await handleUploadImage())) {
        setLoadingModalVisible(false)
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
        return
      }
    }
    if (bannerImageFile) {
      if (!(await handleUploadBannerImage())) {
        setLoadingModalVisible(false)
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
        return
      }
    }
    try {
      await donationApi.addNewDonationPurposePost(id, JSON.stringify(formData))
      setLoadingModalVisible(false)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã cập nhật thành công',
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
  }

  useEffect(() => {
    done &&
      !successModalVisible &&
      (window.location.href = 'http://localhost:3000/admin/donations/programs/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Chiến dịch tài trợ',
      value: formData?.purpose,
    },
    {
      type: 'text',
      id: 'title',
      name: 'title',
      label: 'Nhập tiêu đề*',
      value: formData.title,
      onChange: handleInputChange,
      invalid: formValidate.title.invalid,
      errorMessage: formValidate.title.errorMessage,
    },
    {
      type: 'file',
      name: 'image',
      label: 'Thêm ảnh*',
      onChange: handleImageChange,
      invalid: formValidate.image.invalid,
      errorMessage: formValidate.image.errorMessage,
    },
    {
      type: 'file',
      name: 'banner_image',
      label: 'Thêm ảnh bìa*',
      onChange: handleBannerImageChange,
      invalid: formValidate.bannerImage.invalid,
      errorMessage: formValidate.bannerImage.errorMessage,
    },
    {
      type: 'textarea',
      id: 'summary',
      name: 'summary',
      label: 'Nhập tóm tắt nội dung*',
      value: formData.summary,
      onChange: handleInputChange,
      invalid: formValidate.summary.invalid,
      errorMessage: formValidate.summary.errorMessage,
      rows: 4,
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
                <h4>Thêm bài viết cho chiến dịch tài trợ</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../donations/programs/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
                </NavLink>
              </div>
              {formData?.donation_purpose_id && (
                <>
                  <CForm>
                    <CTable
                      responsive
                      bordered
                      className="form-table overflow-hidden table-border-2"
                    >
                      <CTableBody>
                        {inputs.map((input, index) => (
                          <FormInputDataCell key={index} {...input} />
                        ))}
                        <CTableRow>
                          <CTableDataCell className="form-table-label">
                            Nhập nội dung bài viết
                          </CTableDataCell>
                          <CTableDataCell>
                            <JoditEditor
                              id="editor"
                              value={formData.content}
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
                      <CButton
                        className="form-table-btn"
                        onClick={handleSubmit}
                        disabled={!formValid}
                      >
                        Cập nhật
                      </CButton>
                    </div>
                  </CForm>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default CreateDonationPurposeformData
