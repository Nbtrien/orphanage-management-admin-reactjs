import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import fileService from 'src/api/services/fileService'
import ErrorModal from 'src/components/modals/ErrorModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import { fileToBinary } from 'src/utils/fileToBinary'
import validator from 'validator'
import { DateTimePicker } from '@mui/x-date-pickers'
import { parseISO } from 'date-fns'
import articleService from 'src/api/services/articleService'
import publicService from 'src/api/services/publicService'

const CreateArticle = () => {
  const articleApi = articleService()
  const fileApi = fileService()
  const publicApi = publicService()

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

  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    article_slug: '',
    summary: '',
    publication_start_date_time: '',
    publication_end_date_time: '',
    image: {
      image_file_name: '',
      image_file_path: '',
    },
    banner_image: {
      image_file_name: '',
      image_file_path: '',
    },
    category_id: null,
    article_details: [],
  })
  const [articleDetails, setArticleDetails] = useState([
    {
      id: '1',
      headline: '',
      contents: '',
      display_type: '1',
      image: null,
    },
  ])
  const [detailsCount, setDetailsCount] = useState(1)
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
    category_id: {
      invalid: false,
      errorMessage: 'Vui lòng chọn danh mục',
    },
    article_slug: {
      invalid: false,
      errorMessage: 'Vui lòng nhập đường dẫn',
    },
    image: {
      invalid: false,
      errorMessage: 'Vui lòng chọn ảnh',
    },
    publication_start_date_time: {
      invalid: false,
      errorMessage: 'Vui lòng chọn thời gian đăng bài',
    },
  })

  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    let isValid =
      formData.title &&
      formData.article_slug &&
      formData.category_id &&
      formData.summary &&
      mainImageFile &&
      bannerImageFile

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
    const getCategories = async () => {
      try {
        const response = await publicApi.getAllArticleCategories()
        setCategories(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

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

  const handleMainImageChange = (event) => {
    const file = event.target.files[0]
    setMainImageFile(file)
  }

  const handleBannerImageChange = (event) => {
    const file = event.target.files[0]
    setBannerImageFile(file)
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
      const presignedResponses = await Promise.all([
        fileApi.getPresignedUrl(mainImageFile.name, 'images'),
        fileApi.getPresignedUrl(bannerImageFile.name, 'images'),
      ])

      try {
        const s3Reponses = await Promise.all([
          uploadToS3(presignedResponses[0].result.presigned_url, mainImageFile),
          uploadToS3(presignedResponses[1].result.presigned_url, bannerImageFile),
        ])
        if (s3Reponses[0]) {
          formData.image.image_file_name = presignedResponses[0].result.file_name
          formData.image.image_file_path = presignedResponses[0].result.file_path
        }
        if (s3Reponses[1]) {
          formData.banner_image.image_file_name = presignedResponses[1].result.file_name
          formData.banner_image.image_file_path = presignedResponses[1].result.file_path
        }
      } catch (error) {
        console.log(error)
        return false
      }
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }

  const handleUploadDetailImages = async () => {
    try {
      const presignedResponses = await Promise.all(
        articleDetails.map((detail) => fileApi.getPresignedUrl(detail.image.name, 'images')),
      )

      try {
        const details = []
        const s3Responses = await Promise.all(
          presignedResponses.map((response, index) =>
            uploadToS3(response.result.presigned_url, articleDetails[index].image),
          ),
        )
        s3Responses.map((s3Response, index) =>
          details.push({
            headline: articleDetails[index].headline,
            contents: articleDetails[index].contents,
            display_type: articleDetails[index].display_type,
            image: {
              image_file_name: presignedResponses[index].result.file_name,
              image_file_path: presignedResponses[index].result.file_path,
            },
          }),
        )
        formData.article_details = details
      } catch (error) {
        console.log(error)
        return false
      }
    } catch (e) {
      console.log(e)
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingModalVisible(true)
    if ((await handleUploadImage()) && (await handleUploadDetailImages())) {
      try {
        await articleApi.addNewArticle(JSON.stringify(formData))
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
    } else {
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
      (window.location.href = 'http://localhost:3000/admin/articles/management')
  }, [done, successModalVisible])

  const handleAddNewArticleDetail = () => {
    setArticleDetails((prevInputs) => [
      ...prevInputs,
      { id: detailsCount + 1, headline: '', contents: '', image: null },
    ])
    setDetailsCount((prevDetailsCount) => prevDetailsCount + 1)
  }

  const handleRemoveArticleDetail = () => {
    if (articleDetails.length > 1) {
      setArticleDetails((prevInputs) => {
        const updatedInputs = [...prevInputs]
        updatedInputs.pop()
        return updatedInputs
      })
      setDetailsCount((prevDetailsCount) => prevDetailsCount - 1)
    }
  }

  const handleDetailInputChange = (e, id) => {
    const { name, value } = e.target
    setArticleDetails((prevDetails) => {
      const updatedDetails = [...prevDetails]
      const updatedDetail = updatedDetails.find((detail) => detail.id === id)
      if (updatedDetail) {
        updatedDetail[name] = value
      }
      return updatedDetails
    })
  }

  const handleDetailImageChange = (e, id) => {
    const { name, files } = e.target
    setArticleDetails((prevDetails) => {
      const updatedDetails = [...prevDetails]
      const updatedDetail = updatedDetails.find((detail) => detail.id === id)
      if (updatedDetail) {
        updatedDetail[name] = files[0]
      }
      return updatedDetails
    })
  }

  const handleDisplayTypeChange = (e, id) => {
    const { name, value } = e.target
    setArticleDetails((prevDetails) => {
      const updatedDetails = [...prevDetails]
      const updatedDetail = updatedDetails.find((detail) => detail.id === id)
      if (updatedDetail) {
        updatedDetail[name] = value
      }
      return updatedDetails
    })
  }

  const renderFileInputs = () => {
    return articleDetails.map((element) => (
      <Fragment key={element.id}>
        <CTableRow>
          <CTableDataCell className="inner-form-table-label">Đề mục*</CTableDataCell>
          <CTableDataCell>
            <CFormInput
              type="text"
              name="headline"
              id={element.id + ''}
              value={element.headline}
              placeholder="Đề mục"
              onChange={(e) => handleDetailInputChange(e, element.id)}
            />
          </CTableDataCell>
          <CTableDataCell rowSpan={4}></CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell className="inner-form-table-label">Ảnh*</CTableDataCell>
          <CTableDataCell>
            <CFormInput
              type="file"
              name="image"
              onChange={(e) => handleDetailImageChange(e, element.id)}
            />
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell className="inner-form-table-label left-form-table-label">
            Vị trí ảnh*
          </CTableDataCell>
          <CTableDataCell>
            <CFormCheck
              inline
              name="display_type"
              label="Trái"
              value={1}
              checked={element.display_type == 1}
              onChange={(e) => handleDisplayTypeChange(e, element.id)}
            />
            <CFormCheck
              inline
              name="display_type"
              label="Phải"
              value={2}
              checked={element.display_type == 2}
              onChange={(e) => handleDisplayTypeChange(e, element.id)}
            />
            <CFormCheck
              inline
              name="display_type"
              label="Trên"
              value={3}
              checked={element.display_type == 3}
              onChange={(e) => handleDisplayTypeChange(e, element.id)}
            />
            <CFormCheck
              inline
              name="display_type"
              label="Dưới"
              value={4}
              checked={element.display_type == 4}
              onChange={(e) => handleDisplayTypeChange(e, element.id)}
            />
          </CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell className="inner-form-table-label left-form-table-label">
            Nội dung*
          </CTableDataCell>
          <CTableDataCell>
            <CFormTextarea
              name="contents"
              value={element.contents}
              rows={4}
              placeholder="Nội dung ..."
              onChange={(e) => handleDetailInputChange(e, element.id)}
            />
          </CTableDataCell>
        </CTableRow>
      </Fragment>
    ))
  }

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
                <h4>Thêm bài viết</h4>
              </div>
              <div className="mb-3">
                <NavLink to="../articles/management">
                  <CButton className="form-table-btn">Về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Danh mục bài viết*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          id="category_id"
                          name="category_id"
                          onChange={handleInputChange}
                          value={formData.category_id}
                          invalid={formValidate.category_id.invalid}
                        >
                          {!formData.category_id && (
                            <option disabled selected>
                              Danh mục bài viết
                            </option>
                          )}
                          {categories.map((cate, index) => (
                            <option key={index} value={cate.article_category_id}>
                              {cate.category_name}
                            </option>
                          ))}
                        </CFormSelect>
                        <CFormFeedback invalid>
                          {formValidate.category_id.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Tiêu đề bài viết*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          name="title"
                          value={formData.title}
                          placeholder="Tiêu đề bài viết"
                          onChange={handleInputChange}
                          invalid={formValidate.title.invalid}
                        />
                        <CFormFeedback invalid>{formValidate.title.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Đường dẫn bài viết*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          name="article_slug"
                          value={formData.article_slug}
                          placeholder="Đường dẫn bài viết"
                          onChange={handleInputChange}
                          invalid={formValidate.article_slug.invalid}
                        />
                        <CFormFeedback invalid>
                          {formValidate.article_slug.errorMessage}
                        </CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Thời gian đăng bài*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CRow className="justify-content-between">
                          <CCol>
                            <DateTimePicker
                              className="w-100"
                              label="Thời gian bắt đầu đăng bài"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(formData.publication_start_date_time)}
                              orientation="landscape"
                              maxDateTime={formData.publication_end_date_time}
                              onChange={(newValue) =>
                                setFormData({
                                  ...formData,
                                  publication_start_date_time: newValue,
                                })
                              }
                            />
                          </CCol>
                          <CCol
                            md={1}
                            className="d-flex justify-content-center align-items-center font-lg"
                          >
                            -
                          </CCol>
                          <CCol>
                            <DateTimePicker
                              className="w-100"
                              label="Thời gian kết thúc đăng bài"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(formData.publication_end_date_time)}
                              orientation="landscape"
                              onChange={(newValue) =>
                                setFormData({
                                  ...formData,
                                  publication_end_date_time: newValue,
                                })
                              }
                            />
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Tổng quan bài viết*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="summary"
                          value={formData.summary}
                          rows={4}
                          onChange={handleInputChange}
                          placeholder="Tổng quan bài viết"
                          invalid={formValidate.summary.invalid}
                        />
                        <CFormFeedback invalid>{formValidate.summary.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Thêm ảnh chính*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="file"
                          placeholder="Ảnh chính"
                          onChange={handleMainImageChange}
                          invalid={formValidate.image.invalid}
                        />
                        <CFormFeedback invalid>{formValidate.image.errorMessage}</CFormFeedback>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Thêm ảnh bìa*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="file"
                          placeholder="Ảnh bìa"
                          onChange={handleBannerImageChange}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="inner-form-table-label left-form-table-label">
                        Chi tiết*
                      </CTableDataCell>
                      <CTableDataCell className="p-0">
                        <CTable
                          responsive
                          bordered
                          className="form-table overflow-hidden mb-0 border-2"
                        >
                          <CTableBody>
                            {renderFileInputs()}
                            <CTableRow>
                              <CTableDataCell colSpan={2} className="border-right-0 ">
                                <div className="d-flex justify-content-end gap-2">
                                  <FaPlusCircle
                                    className="cursor-pointer"
                                    size={25}
                                    onClick={handleAddNewArticleDetail}
                                  />
                                  <FaMinusCircle
                                    className={detailsCount === 1 ? '' : 'cursor-pointer'}
                                    size={25}
                                    onClick={handleRemoveArticleDetail}
                                  />
                                </div>
                              </CTableDataCell>
                              <CTableDataCell className="border-left-0 "></CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <div className="d-flex justify-content-end">
                  <CButton className="form-table-btn" onClick={handleSubmit} disabled={!formValid}>
                    Thêm bài viết
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

export default CreateArticle
