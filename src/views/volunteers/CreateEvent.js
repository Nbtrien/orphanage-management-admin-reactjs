import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
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
import { passiveSupport } from 'passive-events-support/src/utils'
import volunteerService from 'src/api/services/volunteerService'
import { DateTimePicker } from '@mui/x-date-pickers'
import { parseISO } from 'date-fns'
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

const CreateEvent = () => {
  const volunteerApi = volunteerService()
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

  const [post, setPost] = useState({
    title: '',
    summary: '',
    image: {
      image_file_name: '',
      image_file_path: '',
    },
    banner_image: {
      image_file_name: '',
      image_file_path: '',
    },
    event_start_date: '',
    event_end_date: '',
    publication_start_date_time: '',
    publication_end_date_time: '',
    event_maximum_participant: '',
    event_details: [],
  })
  const [eventDetails, setEvenDetails] = useState([
    {
      id: '1',
      headline: '',
      contents: '',
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
    content: {
      invalid: false,
      errorMessage: 'Vui lòng điền nội dung',
    },
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setPost({
      ...post,
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
          post.image.image_file_name = presignedResponses[0].result.file_name
          post.image.image_file_path = presignedResponses[0].result.file_path
        }
        if (s3Reponses[1]) {
          post.banner_image.image_file_name = presignedResponses[1].result.file_name
          post.banner_image.image_file_path = presignedResponses[1].result.file_path
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
        eventDetails.map((detail) => fileApi.getPresignedUrl(detail.image.name, 'images')),
      )

      try {
        const details = []
        const s3Responses = await Promise.all(
          presignedResponses.map((response, index) =>
            uploadToS3(response.result.presigned_url, eventDetails[index].image),
          ),
        )
        s3Responses.map((s3Response, index) =>
          details.push({
            headline: eventDetails[index].headline,
            contents: eventDetails[index].contents,
            image: {
              image_file_name: presignedResponses[index].result.file_name,
              image_file_path: presignedResponses[index].result.file_path,
            },
          }),
        )
        post.event_details = details
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
        await volunteerApi.addNewEvent(JSON.stringify(post))
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
      (window.location.href = 'http://localhost:3000/admin/volunteers/events/management')
  }, [done, successModalVisible])

  const handleAddNewEventDetail = () => {
    setEvenDetails((prevInputs) => [
      ...prevInputs,
      { id: detailsCount + 1, headline: '', contents: '', image: null },
    ])
    setDetailsCount((prevDetailsCount) => prevDetailsCount + 1)
  }

  const handleRemoveEventDetail = () => {
    if (eventDetails.length > 1) {
      setEvenDetails((prevInputs) => {
        const updatedInputs = [...prevInputs]
        updatedInputs.pop()
        return updatedInputs
      })
      setDetailsCount((prevDetailsCount) => prevDetailsCount - 1)
    }
  }

  const handleDetailInputChange = (e, id) => {
    const { name, value } = e.target
    setEvenDetails((prevDetails) => {
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
    setEvenDetails((prevDetails) => {
      const updatedDetails = [...prevDetails]
      const updatedDetail = updatedDetails.find((detail) => detail.id === id)
      if (updatedDetail) {
        updatedDetail[name] = files[0]
      }
      return updatedDetails
    })
  }

  const renderFileInputs = () => {
    return eventDetails.map((element) => (
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
          <CTableDataCell rowSpan={3}></CTableDataCell>
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
                <h4>Thêm sự kiện tình nguyện</h4>
              </div>
              <div className="mb-3">
                <NavLink>
                  <CButton className="form-table-btn">về trang danh sách</CButton>
                </NavLink>
              </div>
              <CForm>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Thời gian đăng tin*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CRow className="justify-content-between">
                          <CCol>
                            <DateTimePicker
                              className="w-100"
                              label="Thời gian bắt đầu đăng tin"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(post.publication_start_date_time)}
                              orientation="landscape"
                              maxDateTime={post.publication_end_date_time}
                              onChange={(newValue) =>
                                setPost({
                                  ...post,
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
                              label="Thời gian kết thúc đăng tin"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(post.publication_end_date_time)}
                              orientation="landscape"
                              minDateTime={post.publication_start_date_time}
                              onChange={(newValue) =>
                                setPost({
                                  ...post,
                                  publication_end_date_time: newValue,
                                })
                              }
                            />
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Tên sự kiện*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          name="title"
                          value={post.title}
                          placeholder="Tên sự kiện"
                          onChange={handleInputChange}
                        />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Số lượng tình nguyện viên*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          name="event_maximum_participant"
                          value={post.event_maximum_participant}
                          placeholder="Số lượng tình nguyện viên tối đa"
                          onChange={handleInputChange}
                        />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Thời gian sự kiện*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CRow className="justify-content-between">
                          <CCol>
                            <DateTimePicker
                              className="w-100"
                              label="Thời gian bắt đầu sự kiện"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(post.event_start_date)}
                              orientation="landscape"
                              maxDateTime={post.event_end_date}
                              onChange={(newValue) =>
                                setPost({
                                  ...post,
                                  event_start_date: newValue,
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
                              label="Thời gian kết thúc sự kiện"
                              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                              value={parseISO(post.event_end_date)}
                              minDateTime={post.event_start_date}
                              orientation="landscape"
                              onChange={(newValue) =>
                                setPost({
                                  ...post,
                                  event_end_date: newValue,
                                })
                              }
                            />
                          </CCol>
                        </CRow>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">
                        Tổng quan sự kiện*
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormTextarea
                          name="summary"
                          value={post.summary}
                          rows={4}
                          onChange={handleInputChange}
                          placeholder="Tổng quan sự kiện"
                        />
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableDataCell className="form-table-label">Thêm ảnh chính*</CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="file"
                          placeholder="Ảnh chính"
                          onChange={handleMainImageChange}
                        />
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
                                    onClick={handleAddNewEventDetail}
                                  />
                                  <FaMinusCircle
                                    className={detailsCount === 1 ? '' : 'cursor-pointer'}
                                    size={25}
                                    onClick={handleRemoveEventDetail}
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
                  <CButton className="form-table-btn" onClick={handleSubmit}>
                    Thêm sự kiện
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

export default CreateEvent
