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

const DonorDetailModal = ({ isVisible, setVisible, donorId }) => {
  const donationApi = donationService()
  const [donor, setDonor] = useState({})

  useEffect(() => {
    const getDonorDetail = async () => {
      try {
        const response = await donationApi.getDonorDetail(donorId)
        setDonor(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    donorId && getDonorDetail()
  }, [donorId])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible(false)}
      size="xl"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Chi tiết nhà tài trợ #{donorId}</div>
      </CModalHeader>
      <CModalBody>
        {donorId && donor?.donor_id && (
          <>
            <CRow>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin nhà tài trợ</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow label="ID" value={'#' + donor?.donor_id} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Họ và tên" value={donor?.donor_full_name} />
                  </CCol>

                  <CCol md={3}>
                    <FloatingInputRow label="Giới tính" value={donor.donor_gender} />
                  </CCol>

                  <CCol md={3}>
                    <FloatingInputRow
                      label="Ngày sinh"
                      value={format(new Date(donor?.donor_date_of_birth), 'dd/MM/yyyy')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Địa chỉ email" value={donor?.donor_mail_address} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Số điện thoại" value={donor?.donor_phone_number} />
                  </CCol>
                  <CCol md={6}>
                    <FloatingInputRow label="Địa chỉ" value={donor?.address} />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-3">Thông tin các khoản tài trợ</div>
                <CRow>
                  <CCol md={6}>
                    <FloatingInputRow label="Mã tra cứu tài trợ" value={donor?.donor_token} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Số lượt tài trợ" value={donor?.stats.count} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Tổng số tiền trợ"
                      value={numeral(donor?.stats.amount).format('0,0₫') + ' VND'}
                    />
                  </CCol>
                </CRow>
                {donor?.donations.length > 0 && (
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
                              <div className="order-1">Mục đích</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Gia đình nhận tài trợ</div>
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
                        {donor?.donations?.map((donation, index) => (
                          <>
                            <CTableRow key={index}>
                              <CTableDataCell>{'#' + donation?.donation_id}</CTableDataCell>
                              <CTableDataCell>
                                {format(new Date(donation?.donation_time), 'dd/MM/yyyy hh:mm:ss')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(donation?.amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
                              <CTableDataCell>{donation?.purpose?.purpose}</CTableDataCell>
                              <CTableDataCell>
                                {donation?.family?.family_name || '###'}
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
            </CRow>
          </>
        )}
      </CModalBody>
    </CModal>
  )
}

DonorDetailModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  donorId: PropTypes.any,
}

export default DonorDetailModal
