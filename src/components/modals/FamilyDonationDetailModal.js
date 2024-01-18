import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import numeral from 'numeral'
import { format } from 'date-fns'
import FloatingInputRow from '../rows/FloatingInputRow'
import familyService from 'src/api/services/familyService'

const FamilyDonationDetailModal = ({ isVisible, setVisible, familyId }) => {
  const familyApi = familyService()
  const [family, setFamily] = useState({})
  const [donations, setDonations] = useState([])
  const [fundingUsages, setFundingUsages] = useState([])

  useEffect(() => {
    const getFamily = async () => {
      try {
        const response = await familyApi.getFamilyDonationStatsDetail(familyId)
        setFamily(response.result)
        setDonations(response.result?.donations)
        setFundingUsages(response.result?.funding_usages)
      } catch (error) {
        console.log(error)
      }
    }
    familyId && getFamily()
  }, [familyId])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible(false)}
      size="xl"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Chi tiết tài trợ cho gia đình #{familyId}</div>
      </CModalHeader>
      <CModalBody>
        {familyId && family?.family_id && (
          <>
            <CRow>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin gia đình</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow label="ID" value={'#' + family?.family_id} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Gia đình" value={family?.family_name} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Ngày thành lập"
                      value={format(new Date(family?.date_of_formation), 'dd/MM/yyyy')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Ngày dừng hoạt động"
                      value={
                        family?.date_of_termination
                          ? format(new Date(family?.date_of_termination), 'dd/MM/yyyy')
                          : '###'
                      }
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Bà mẹ quản lý" value={family?.mother?.mother_name} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Độ tuổi"
                      value={family?.condition?.age_from + ' ~ ' + family?.condition?.age_to}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số trẻ quy định"
                      value={
                        family?.condition?.min_number_of_children +
                        ' ~ ' +
                        family?.condition?.max_number_of_children
                      }
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Số trẻ hiện tại" value={family?.no_of_children} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Số lượt tài trợ" value={family?.donation_count} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Tổng số tiền tài trợ"
                      value={numeral(family?.total_donation_amount).format('0,0₫') + ' VND'}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số lượt phân bổ tài trợ"
                      value={fundingUsages?.length}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Tổng số tiền được phân bổ"
                      value={numeral(family?.funding_amount).format('0,0₫') + ' VND'}
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin các khoản tài trợ</div>
                {donations?.length > 0 && (
                  <>
                    <CTable
                      striped
                      borderColor="grey"
                      align="middle"
                      className="mb-3 border"
                      hover
                      responsive
                    >
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">ID Tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Nhà Tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">ID Nhà Tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Thời gian</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Số tiền</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Lời nhắn</div>
                            </CCol>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {donations?.map((donation, index) => (
                          <>
                            <CTableRow key={index}>
                              <CTableDataCell>{'#' + donation?.donation_id}</CTableDataCell>
                              <CTableDataCell>{donation?.donor_name}</CTableDataCell>
                              <CTableDataCell>{'#' + donation?.donor_id}</CTableDataCell>
                              <CTableDataCell>
                                {format(new Date(donation?.donation_time), 'dd/MM/yyyy hh:mm:ss')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(donation?.amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
                              <CTableDataCell>{donation?.donation_message}</CTableDataCell>
                            </CTableRow>
                          </>
                        ))}
                      </CTableBody>
                    </CTable>
                  </>
                )}
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin phân bổ tài trợ</div>
                {fundingUsages?.length > 0 && (
                  <>
                    <CTable
                      striped
                      borderColor="grey"
                      align="middle"
                      className="mb-3 border"
                      hover
                      responsive
                    >
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">ID</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Thời gian</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Số tiền</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Chi tiết</div>
                            </CCol>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {fundingUsages?.map((fundingUsage, index) => (
                          <>
                            <CTableRow key={index}>
                              <CTableDataCell>
                                {'#' + fundingUsage?.funding_usage_id}
                              </CTableDataCell>
                              <CTableDataCell>
                                {format(new Date(fundingUsage?.usage_time), 'dd/MM/yyyy hh:mm:ss')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(fundingUsage?.amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
                              <CTableDataCell>{fundingUsage?.usage_note}</CTableDataCell>
                            </CTableRow>
                          </>
                        ))}
                      </CTableBody>
                    </CTable>
                  </>
                )}
              </CCol>
            </CRow>
          </>
        )}
      </CModalBody>
    </CModal>
  )
}

FamilyDonationDetailModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  familyId: PropTypes.any,
}

export default FamilyDonationDetailModal
