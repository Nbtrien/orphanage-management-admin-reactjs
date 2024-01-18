import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CImage,
  CLink,
  CRow,
} from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import FloatingInputRow from 'src/components/rows/FloatingInputRow'
import adoptionService from 'src/api/services/adoptionService'
import { FaCheck, FaReply, FaTimesCircle } from 'react-icons/fa'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import SuccessModal from 'src/components/modals/SuccessModal'
import LoadingModal from 'src/components/modals/LoadingModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ApplicationStatus from 'src/constants/ApplicationStatus'
import { cilDataTransferDown } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AdoptionHistoryDetail = () => {
  const { id } = useParams()
  const adoptionApi = adoptionService()
  const [history, setHistory] = useState(null)
  const [applicant, setApplicant] = useState(null)
  const [children, setChildren] = useState(null)
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
    const getHistoryDetails = async () => {
      try {
        const response = await adoptionApi.getAdoptionHistoryDetail(id)
        const result = response.result
        setHistory(result)
        setApplicant(result.applicant)
        setChildren(result.children)
      } catch (error) {
        console.log(error)
      }
    }
    getHistoryDetails()
  }, [id, reRender])

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
      {history && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-3">
                  <h4>Lịch sử nhận nuôi</h4>
                </div>
                <CRow className="align-items-md-stretch">
                  <CCol md={12}>
                    <CRow>
                      <CCol md={12}>
                        <div className="form-header-sub-custom mb-3">
                          <h5>Thông tin người nhận nuôi</h5>
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
                          {/* <CCol md={6}>
                            <CFormLabel>Ảnh CCCD mặt trước</CFormLabel>
                            <CImage className="w-100" src={applicant.citizen_id_front_image_url} />
                          </CCol>
                          <CCol md={6}>
                            <CFormLabel>Ảnh CCCD mặt sau</CFormLabel>
                            <CImage className="w-100" src={applicant.citizen_id_back_image_url} />
                          </CCol> */}
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
                          <h5>Thông tin trẻ được nhận nuôi</h5>
                        </div>
                      </CCol>
                      <CCol md={12} className="mb-3">
                        <CRow>
                          <CCol md={4}>
                            <FloatingInputRow
                              label="Họ, chữ đệm, tên"
                              value={children.children_full_name}
                            />
                          </CCol>
                          <CCol md={2}>
                            <FloatingInputRow label="Giới tính" value={children.children_gender} />
                          </CCol>
                          <CCol md={3}>
                            <FloatingInputRow
                              label="Ngày sinh"
                              value={format(
                                new Date(children.children_date_of_birth),
                                'dd/MM/yyyy',
                              )}
                            />
                          </CCol>
                          <CCol md={3}>
                            <FloatingInputRow
                              label="Ngày tiếp nhận"
                              value={format(new Date(children.date_of_admission), 'dd/MM/yyyy')}
                            />
                          </CCol>
                          <CCol md={3}>
                            <FloatingInputRow label="Dân tộc" value={children.children_ethnicity} />
                          </CCol>
                          <CCol md={3}>
                            <FloatingInputRow label="Tôn giáo" value={children.children_religion} />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow label="Địa chỉ" value={children.address} />
                          </CCol>
                          <CCol md={5}>
                            <CFormFloating className="mb-2">
                              <CFormTextarea
                                className="bg-light border-light form-control-readonly-custom scrollbar-custom h-10"
                                size="md"
                                type="text"
                                value={children.orphan_type}
                                readOnly
                              />
                              <CFormLabel className="label-floating-custom">Kiểu mồ côi</CFormLabel>
                            </CFormFloating>
                          </CCol>
                          <CCol md={7}>
                            <CFormFloating className="mb-2">
                              <CFormTextarea
                                className="bg-light border-light form-control-readonly-custom scrollbar-custom h-10"
                                size="md"
                                type="text"
                                value={children.children_circumstance}
                                readOnly
                              />
                              <CFormLabel className="label-floating-custom">Hoàn cảnh</CFormLabel>
                            </CFormFloating>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow>
                      <CCol md={12}>
                        <div className="form-header-sub-custom mb-3">
                          <h5>Thông tin nhận nuôi</h5>
                        </div>
                      </CCol>
                      <CCol md={8}>
                        <CFormFloating className="mb-2">
                          <CFormTextarea
                            className="bg-light border-light form-control-readonly-custom scrollbar-custom"
                            size="md"
                            type="text"
                            value={history.adoption_description}
                            readOnly
                          />
                          <CFormLabel className="label-floating-custom">Chi tiết</CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol md={2}>
                        <FloatingInputRow
                          label="Ngày nhận nuôi"
                          value={format(new Date(history.adoption_date), 'dd/MM/yyyy')}
                        />
                      </CCol>
                      <CCol md={2}>
                        <div className="pb-2 h-100">
                          <CLink
                            href={history.document_url}
                            className="w-100 text-nodecorate "
                            title={'Giấy xác nhận'}
                          >
                            <CButton className="download-btn w-100 h-100">
                              <div className="download-btn-2-content">Giấy xác nhận</div>
                              <CIcon icon={cilDataTransferDown} />
                            </CButton>
                          </CLink>
                        </div>
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

export default AdoptionHistoryDetail
