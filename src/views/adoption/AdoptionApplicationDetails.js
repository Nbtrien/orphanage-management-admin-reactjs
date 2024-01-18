import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CImage,
  CRow,
} from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import FloatingInputRow from 'src/components/rows/FloatingInputRow'
import adoptionService from 'src/api/services/adoptionService'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ApplicationStatus from 'src/constants/ApplicationStatus'

const AdoptionApplicationDetails = () => {
  const { id } = useParams()
  const adoptionApi = adoptionService()
  const [application, setApplication] = useState(null)
  const [applicant, setApplicant] = useState(null)
  const [reRender, setReRender] = useState(false)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [confirmModalMessage, setConfirmModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [loadingModalVisible, setLoadingModalVisible] = useState(false)

  const [confirmAction, setConfirmAction] = useState()

  useEffect(() => {
    const getApplicationDetails = async () => {
      try {
        const response = await adoptionApi.getAdoptionApplicationDetails(id)
        const result = response.result

        setApplication(result)
        setApplicant(result.applicant)
      } catch (error) {
        console.log(error)
      }
    }
    getApplicationDetails()
  }, [id, reRender])

  const handleConfirmBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận đơn đăng ký này!',
      modalContent:
        'Bạn muốn xác nhận đơn đăng ký này. Hành động này sẽ bao gồm gửi email thông báo đến người đăng ký cùng với danh sách trẻ em đang chờ được nhận nuôi.',
    }))
    setConfirmAction(() => handleConfirmApplication)
    setConfirmModalVisible(true)
  }

  const handleDeclineBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Từ chối đơn đăng ký này!',
      modalContent:
        'Bạn muốn từ chối đơn đăng ký này. Hành động này sẽ bao gồm gửi email thông báo đến người đăng ký.',
    }))
    setConfirmAction(() => handleDeclineApplication)
    setConfirmModalVisible(true)
  }

  const handleConfirmApplication = async () => {
    setConfirmModalVisible(false)
    setLoadingModalVisible(true)

    try {
      await adoptionApi.confirmAdoptionApplication(id)
      setLoadingModalVisible(false)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã xác nhận thành công',
      }))
      setSuccessModalVisible(true)
      setReRender(!reRender)
    } catch (error) {
      console.log(error)
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleDeclineApplication = async () => {
    setConfirmModalVisible(false)
    setLoadingModalVisible(true)

    try {
      await adoptionApi.declineAdoptionApplication(id)
      setLoadingModalVisible(false)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã từ chối thành công',
      }))
      setSuccessModalVisible(true)
      setReRender(!reRender)
    } catch (error) {
      console.log(error)
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  return (
    <>
      <ConfirmModal
        modalMessage={confirmModalMessage}
        isVisible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        handleConfirmBtnClick={confirmAction}
      ></ConfirmModal>
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
      <LoadingModal
        isVisible={loadingModalVisible}
        setVisible={setLoadingModalVisible}
      ></LoadingModal>
      {application && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-3">
                  <h4>Đơn đăng ký nhận thông tin trẻ chờ nhận nuôi</h4>
                </div>
                <div className="body-btn-group mb-2">
                  <CRow className="justify-content-start">
                    {application.application_status == ApplicationStatus.pending.display ? (
                      <>
                        <CCol xl={2} lg={4} md={6} sm={6} xs={12} className="mb-2">
                          <CButton
                            type="submit"
                            color="primary"
                            className="main-btn w-100 btn-content"
                            onClick={handleConfirmBtnClick}
                          >
                            Xác nhận
                          </CButton>
                        </CCol>
                        <CCol xl={2} lg={4} md={6} sm={6} xs={12} className="mb-2">
                          <CButton
                            type="submit"
                            color="primary"
                            className="main-btn w-100 btn-content"
                            onClick={handleDeclineBtnClick}
                          >
                            Từ chối
                          </CButton>
                        </CCol>
                      </>
                    ) : (
                      application.application_status == ApplicationStatus.approved.display && (
                        <>
                          <CCol lg={3} md={6} sm={6} xs={12} className="mb-2">
                            <NavLink to={`../adoption-applications/${id}/adoption-history/create`}>
                              <CButton
                                type="submit"
                                color="primary"
                                className="main-btn w-100 btn-content"
                                // onClick={handleConfirmBtnClick}
                              >
                                Xác nhận hoàn thành nhận nuôi
                              </CButton>
                            </NavLink>
                          </CCol>
                        </>
                      )
                    )}
                  </CRow>
                </div>
                <CRow className="align-items-md-stretch">
                  <CCol md={12}>
                    <CRow>
                      <CCol md={12}>
                        <div className="form-header-sub-custom mb-3">
                          <h5>Thông tin người đăng ký</h5>
                        </div>
                      </CCol>
                      <CCol md={applicant.spouse ? 6 : 12} className="mb-3">
                        <h5 className="p-1">
                          {applicant.applicant_gender == 'Nam' ? 'Ông' : 'Bà'}
                        </h5>
                        <CRow>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Họ, chữ đệm, tên"
                              value={applicant.applicant_full_name}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Ngày, tháng, năm sinh"
                              value={format(
                                new Date(applicant.applicant_date_of_birth),
                                'dd/MM/yyyy',
                              )}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Quốc tịch"
                              value={applicant.applicant_nationality}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Dân tộc"
                              value={applicant.applicant_ethnicity}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Tôn giáo"
                              value={applicant.applicant_religion}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Tình trạng hôn nhân"
                              value={applicant.applicant_marital_status}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Địa chỉ email"
                              value={applicant.applicant_mail_address}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Số điện thoại"
                              value={applicant.applicant_phone_number}
                            />
                          </CCol>
                          <CCol md={12}>
                            <FloatingInputRow label="Địa chỉ liên hệ" value={applicant.address} />
                          </CCol>
                          <CCol md={12}>
                            <FloatingInputRow
                              label="Số căn cước công dân"
                              value={applicant.citizen_id_number}
                            />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel>Ảnh CCCD mặt trước</CFormLabel>
                            <CImage className="w-100" src={applicant.citizen_id_front_image_url} />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel>Ảnh CCCD mặt sau</CFormLabel>
                            <CImage className="w-100" src={applicant.citizen_id_back_image_url} />
                          </CCol>
                        </CRow>
                      </CCol>
                      {applicant.spouse && (
                        <>
                          <CCol md={6} className="mb-3">
                            <h5 className="p-1">
                              {applicant.spouse.spouse_gender == 'Nam' ? 'Ông' : 'Bà'}
                            </h5>
                            <CRow>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Họ, chữ đệm, tên"
                                  value={applicant.spouse.spouse_full_name}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Ngày, tháng, năm sinh"
                                  value={format(
                                    new Date(applicant.spouse.spouse_date_of_birth),
                                    'dd/MM/yyyy',
                                  )}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Quốc tịch"
                                  value={applicant.spouse.spouse_nationality}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Dân tộc"
                                  value={applicant.spouse.spouse_ethnicity}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Tôn giáo"
                                  value={applicant.spouse.spouse_religion}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Tình trạng hôn nhân"
                                  value={applicant.applicant_marital_status}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Địa chỉ email"
                                  value={applicant.spouse.spouse_mail_address}
                                />
                              </CCol>
                              <CCol md={6}>
                                <FloatingInputRow
                                  label="Số điện thoại"
                                  value={applicant.spouse.spouse_phone_number}
                                />
                              </CCol>
                              <CCol md={12}>
                                <FloatingInputRow
                                  label="Địa chỉ liên hệ"
                                  value={applicant.spouse.address}
                                />
                              </CCol>
                              <CCol md={12}>
                                <FloatingInputRow
                                  label="Số căn cước công dân"
                                  value={applicant.spouse.citizen_id_number}
                                />
                              </CCol>
                            </CRow>
                          </CCol>
                        </>
                      )}
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow>
                      <CCol md={12}>
                        <div className="form-header-sub-custom mb-3">
                          <h5>Thông tin đơn đăng ký</h5>
                        </div>
                      </CCol>
                      <CCol md={8}>
                        <CFormFloating className="mb-2">
                          <CFormTextarea
                            className="bg-light border-light form-control-readonly-custom scrollbar-custom"
                            size="md"
                            type="text"
                            value={application.reason}
                            readOnly
                          />
                          <CFormLabel className="label-floating-custom">Lý do</CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol md={2}>
                        <FloatingInputRow
                          label="Ngày đăng ký"
                          value={format(new Date(application.date_of_application), 'dd/MM/yyyy')}
                        />
                      </CCol>
                      <CCol md={2}>
                        <FloatingInputRow
                          label="Hạn xử lý"
                          value={format(new Date(application.deadline_date), 'dd/MM/yyyy')}
                        />
                      </CCol>
                      <CCol md={3}>
                        <FloatingInputRow
                          label="Trạng thái xử lý"
                          value={application.application_status}
                        />
                      </CCol>
                      <CCol md={3}>
                        <CFormFloating>
                          <CFormInput
                            className={
                              !application.is_sent_notification_email
                                ? 'bg-light border-light form-control-readonly-custom cursor-pointer'
                                : 'bg-light border-light form-control-readonly-custom'
                            }
                            size="md"
                            type="text"
                            value={
                              application.is_sent_notification_email
                                ? 'Đã gửi email'
                                : 'Chưa gửi email'
                            }
                            readOnly
                            onClick={() =>
                              !application.is_sent_notification_email ? alert('ok') : null
                            }
                          />

                          <CFormLabel className="label-floating-custom">
                            Trạng thái gửi mail thông báo
                          </CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol md={3}>
                        <CFormFloating className="mb-2">
                          <CFormInput
                            className={
                              ApplicationStatus.approved.display ==
                                application.application_status && !application.is_sent_detail_email
                                ? 'bg-light border-light form-control-readonly-custom cursor-pointer'
                                : 'bg-light border-light form-control-readonly-custom'
                            }
                            size="md"
                            type="text"
                            value={
                              application.is_sent_detail_email
                                ? 'Đã gửi email'
                                : ApplicationStatus.approved.display ==
                                  application.application_status
                                ? 'Chưa gửi email (Nhấn để gửi)'
                                : 'Chưa gửi email'
                            }
                            readOnly
                            onClick={() =>
                              ApplicationStatus.approved.display ==
                                application.application_status && !application.is_sent_detail_email
                                ? alert('ok')
                                : null
                            }
                          />
                          <CFormLabel className="label-floating-custom">
                            Trạng thái gửi mail xác nhận
                          </CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol md={3}>
                        <FloatingInputRow
                          label="Trạng thái nhận nuôi"
                          value={'Đơn đăng ký này chưa hoàn thành nhận nuôi'}
                        />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default AdoptionApplicationDetails
