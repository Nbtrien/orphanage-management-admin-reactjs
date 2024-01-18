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
import fileService from 'src/api/services/fileService'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'
import { passiveSupport } from 'passive-events-support/src/utils'
import familyService from 'src/api/services/familyService'
import FormInputDataCell from 'src/components/forms/FormInputDataCell'
passiveSupport({
  debug: false,
  listeners: [
    {
      element: 'body',
      event: 'touchstart',
      prevented: true,
    },
    {
      element: 'body',
      event: 'touchend',
      prevented: true,
    },
    {
      element: 'div.jodit-source__mirror-fake',
      event: 'touchstart',
      prevented: true,
    },
    {
      element: 'div.jodit-source__mirror-fake',
      event: 'touchmove',
      prevented: true,
    },
    {
      element: 'div.jodit-source__mirror-fake',
      event: 'mousewheel',
      prevented: true,
    },
    {
      element: 'Window',
      event: 'wheel',
      prevented: true,
    },
  ],
})

const CreateFamilyformData = () => {
  const { id } = useParams()
  const familyApi = familyService()
  const [isUpdate, setIsUpdate] = useState(false)
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
  const editor = useRef('')
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    images: '',
  })
  const [imageFiles, setImageFiles] = useState([])
  const [mainImageFile, setMainImageFile] = useState(null)
  const [bannerImageFile, setBannerImageFile] = useState(null)
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
    const getFamily = async () => {
      try {
        const response = await familyApi.getFamilyPostUpdateInfo(id)
        setFormData(response.result)
        if (response.result?.family_post_id) {
          setIsUpdate(true)
        }
      } catch (error) {
        console.log(error)
      }
    }
    id && getFamily()
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
    setMainImageFile(file)
    setFormValidate({
      ...formValidate,
      image: {
        ...formValidate.image,
        invalid: false,
      },
    })
  }

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0]
    setBannerImageFile(file)
    setFormValidate({
      ...formValidate,
      bannerImage: {
        ...formValidate.bannerImage,
        invalid: false,
      },
    })
  }

  const handleFamilyImageChange = (event) => {
    const files = event.target.files
    setImageFiles(files)
  }

  const validateImages = () => {
    if (!mainImageFile) {
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

  const handleUploadToS3 = async (presignedUrl, file) => {
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

  const handleUploadImages = async () => {
    let images = []
    if (mainImageFile) {
      try {
        const response = await fileApi.getPresignedUrl(mainImageFile.name, 'images')
        if (response.status === 200) {
          const result = response.result
          let presignedUrl = result.presigned_url
          if (await handleUploadToS3(presignedUrl, mainImageFile))
            images.push({
              image_file_name: result?.file_name,
              image_file_path: result?.file_path,
              image_category: 1,
            })
        }
      } catch (error) {
        console.log(error)
        return false
      }
    }
    if (bannerImageFile) {
      try {
        const response = await fileApi.getPresignedUrl(bannerImageFile.name, 'images')
        if (response.status === 200) {
          const result = response.result
          let presignedUrl = result.presigned_url
          if (await handleUploadToS3(presignedUrl, bannerImageFile))
            images.push({
              image_file_name: result?.file_name,
              image_file_path: result?.file_path,
              image_category: 2,
            })
        }
      } catch (error) {
        console.log(error)
        return false
      }
    }
    if (imageFiles?.length) {
      for (const item of imageFiles) {
        try {
          const response = await fileApi.getPresignedUrl(item.name, 'images')
          if (response.status === 200) {
            const result = response.result
            let presignedUrl = result.presigned_url
            if (await handleUploadToS3(presignedUrl, item)) {
              images.push({
                image_file_name: result?.file_name,
                image_file_path: result?.file_path,
                image_category: 3,
              })
            }
          }
        } catch (error) {
          console.log(error)
          return false
        }
      }
    }
    formData.images = images
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isUpdate) {
      if (!validateImages()) {
        return
      }
    }
    setLoadingModalVisible(true)
    if (await handleUploadImages()) {
      try {
        await familyApi.addNewFamilyPost(id, JSON.stringify(formData))
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
          modalContent: 'Đã có lỗi xảy ra, Vui lòng thử lại sau.',
        }))
        setErrorModalVisible(true)
      }
    } else {
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, Vui lòng thử lại sau.',
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
      label: 'Gia đình',
      value: formData?.family_name,
      readOnly: true,
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
      type: 'file',
      multiple: true,
      name: 'family_images',
      label: 'Thêm ảnh gia đình*',
      onChange: handleFamilyImageChange,
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
      {formData?.family_id && (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-4">
                  <h4>Thêm bài viết cho gia đình</h4>
                </div>
                <div className="mb-3">
                  <NavLink to="../families/information">
                    <CButton className="form-table-btn">Về trang danh sách</CButton>
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default CreateFamilyformData
