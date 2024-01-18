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
import donationService from 'src/api/services/donationService'
import { format } from 'date-fns'
import FloatingInputRow from '../rows/FloatingInputRow'

const FundingUsageDetailModal = ({ isVisible, setVisible, fundingUsageId }) => {
  const donationApi = donationService()
  const [fundingUsage, setFundingUsage] = useState({})

  useEffect(() => {
    const getUsageDetail = async () => {
      try {
        const response = await donationApi.getFundingUsageDetail(fundingUsageId)
        setFundingUsage(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    fundingUsageId && getUsageDetail()
  }, [fundingUsageId])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible(false)}
      size="xl"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Chi tiết khoản sử dụng #{fundingUsageId}</div>
      </CModalHeader>
      <CModalBody>
        {fundingUsageId && fundingUsage?.funding_usage_id && (
          <>
            <CRow>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin lịch sử sử dụng</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Thời gian"
                      value={format(new Date(fundingUsage?.usage_time), 'dd/MM/yyyy hh:mm:ss')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số tiền"
                      value={numeral(fundingUsage?.amount).format('0,0₫') + ' VND'}
                      VND
                    />
                  </CCol>
                  <CCol md={6}>
                    <FloatingInputRow
                      label="Mục đích sử dụng"
                      value={fundingUsage?.purpose?.description}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Gia đình nhận"
                      value={fundingUsage?.family?.family_name || '###'}
                    />
                  </CCol>
                  <CCol md={9}>
                    <FloatingInputRow label="Chi tiết" value={fundingUsage?.usage_note} />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">
                  Thông tin các khoản tài trợ được sử dụng
                </div>
                {fundingUsage?.donation_usages.length > 0 && (
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
                              <div className="order-1">ID Tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Nhà tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">ID Nhà tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Thời gian tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Số tiền tài trợ</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Số tiền sử dụng</div>
                            </CCol>
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {fundingUsage?.donation_usages?.map((usage, index) => (
                          <>
                            <CTableRow key={index}>
                              <CTableDataCell>{'#' + usage?.donation_usage_id}</CTableDataCell>
                              <CTableDataCell>{'#' + usage?.donation_id}</CTableDataCell>
                              <CTableDataCell>{usage?.donor_full_name}</CTableDataCell>
                              <CTableDataCell>{'#' + usage?.donor_id}</CTableDataCell>
                              <CTableDataCell>
                                {format(new Date(usage?.donation_time), 'dd/MM/yyyy hh:mm:ss')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(usage?.donation_amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(usage?.amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
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

FundingUsageDetailModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  fundingUsageId: PropTypes.any,
}

export default FundingUsageDetailModal
