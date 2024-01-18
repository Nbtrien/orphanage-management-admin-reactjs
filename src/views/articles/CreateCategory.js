import { CButton, CCard, CCardBody, CCol, CForm, CRow, CTable, CTableBody } from '@coreui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import articleService from 'src/api/services/articleService'
import fileService from 'src/api/services/fileService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'

const CreateCategory = () => {
  const articleApi = articleService()
  const fileApi = fileService()

  const [formData, setFormData] = useState({
    category_name: '',
    category_slug: '',
    category_summary: '',
    image_file_path: '',
  })
  const [imageFile, setImageFile] = useState('')
  const [formValidate, setFormValidate] = useState({
    category_name: {
      invalid: false,
      errorMessage: 'Vui lòng nhập danh mục.',
    },
    category_slug: {
      invalid: false,
      errorMessage: 'Vui lòng nhập đường dẫn.',
    },
    category_summary: {
      invalid: false,
      errorMessage: 'Vui lòng nhập mô tả.',
    },
    image: {
      invalid: false,
      errorMessage: 'Vui lòng chọn ảnh.',
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
    let isValid = formData.category_name && formData.category_slug

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

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    setImageFile(file)
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

  const handleUploadImage = async () => {
    try {
      const response = await fileApi.getPresignedUrl(imageFile.name, 'images')
      const result = response.result
      try {
        await uploadToS3(result.presigned_url, imageFile)
        formData.image_file_path = result.file_path
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingModalVisible(true)
    if (await handleUploadImage()) {
      try {
        await articleApi.addNewCategory(JSON.stringify(formData))
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
    } else {
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
      (window.location.href = 'http://localhost:3000/admin/articles/management')
  }, [done, successModalVisible])

  const inputs = [
    {
      type: 'text',
      label: 'Tên danh mục*',
      id: 'category_name',
      name: 'category_name',
      value: formData.category_name,
      onChange: handleInputChange,
      invalid: formValidate.category_name.invalid,
      errorMessage: formValidate.category_name.errorMessage,
    },
    {
      type: 'text',
      label: 'Đường dẫn*',
      id: 'category_slug',
      name: 'category_slug',
      value: formData.category_slug,
      onChange: handleInputChange,
      invalid: formValidate.category_slug.invalid,
      errorMessage: formValidate.category_slug.errorMessage,
    },
    {
      type: 'textarea',
      label: 'Tóm tắt*',
      id: 'category_summary',
      name: 'category_summary',
      value: formData.category_summary,
      onChange: handleInputChange,
      invalid: formValidate.category_summary.invalid,
      errorMessage: formValidate.category_summary.errorMessage,
      rows: 3,
    },
    {
      type: 'file',
      label: 'Chọn ảnh*',
      id: 'image',
      name: 'image',
      onChange: handleImageChange,
      invalid: formValidate.image.invalid,
      errorMessage: formValidate.image.errorMessage,
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
                <h4>Thêm danh mục bài viết</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../articles/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
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
                    Thêm danh mục
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

export default CreateCategory
