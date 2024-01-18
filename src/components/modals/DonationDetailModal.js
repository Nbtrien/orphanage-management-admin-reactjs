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

const DonationDetailModal = ({ isVisible, setVisible, donationId }) => {
  const donationApi = donationService()
  const [donation, setDonation] = useState({})

  useEffect(() => {
    const getDonationDetail = async () => {
      try {
        const response = await donationApi.getDonationDetail(donationId)
        setDonation(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    donationId && getDonationDetail()
  }, [donationId])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible(false)}
      size="xl"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Chi tiết tài trợ #{donationId}</div>
      </CModalHeader>
      <CModalBody>
        {donationId && donation?.donation_id && (
          <>
            <CRow>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-2">Thông tin nhà tài trợ</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow label="ID" value={'#' + donation?.donor.donor_id} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Họ và tên" value={donation?.donor?.donor_full_name} />
                  </CCol>

                  <CCol md={3}>
                    <FloatingInputRow label="Giới tính" value={donation?.donor.donor_gender} />
                  </CCol>

                  <CCol md={3}>
                    <FloatingInputRow
                      label="Ngày sinh"
                      value={format(new Date(donation?.donor?.donor_date_of_birth), 'dd/MM/yyyy')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Địa chỉ email"
                      value={donation?.donor?.donor_mail_address}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số điện thoại"
                      value={donation?.donor?.donor_phone_number}
                    />
                  </CCol>
                  <CCol md={6}>
                    <FloatingInputRow label="Địa chỉ" value={donation?.donor?.address} />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-2">Thông tin tài trợ</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Thời gian tài trợ"
                      value={format(new Date(donation?.donation_time), 'dd/MM/yyyy hh:mm:ss')}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số tiền"
                      value={numeral(donation?.amount).format('0,0₫') + ' VND'}
                      VND
                    />
                  </CCol>
                  {donation?.family ? (
                    <>
                      <CCol md={3}>
                        <FloatingInputRow
                          label="Mục đích sử dụng"
                          value={donation?.purpose.purpose}
                        />
                      </CCol>
                      <CCol md={3}>
                        <FloatingInputRow
                          label="Gia đình nhận tài trợ"
                          value={donation?.family.family_name}
                        />
                      </CCol>
                    </>
                  ) : (
                    <CCol md={6}>
                      <FloatingInputRow
                        label="Mục đích sử dụng"
                        value={donation?.purpose.description}
                      />
                    </CCol>
                  )}

                  <CCol md={12}>
                    <FloatingInputRow label="Lời nhắn" value={donation?.donation_message} />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-2">Thông tin giao dịch tài trợ</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow label="Loại tài khoản/thẻ" value={donation?.card_type} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Ngân hàng GD" value={donation?.bank_code} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow label="Mã GD" value={donation?.transaction_no} />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Thời gian GD"
                      value={format(new Date(donation?.pay_date), 'dd/MM/yyyy hh:mm:ss')}
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol md={12}>
                <div className="header-title-sub-custom mb-2">Thông tin sử dụng tài trợ</div>
                <CRow>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Trạng thái sử dụng"
                      value={donation?.is_used ? 'Đã sử dụng hết' : 'Khả dụng'}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số lượt sử dụng"
                      value={donation?.donation_usages?.length}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số tiền đã sử dụng"
                      value={numeral(donation?.used_amount).format('0,0₫') + ' VND'}
                    />
                  </CCol>
                  <CCol md={3}>
                    <FloatingInputRow
                      label="Số tiền còn lại"
                      value={numeral(donation?.remaining_amount).format('0,0₫') + ' VND'}
                    />
                  </CCol>
                </CRow>
                {donation?.donation_usages.length > 0 && (
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
                              <div className="order-1">Mục đích</div>
                            </CCol>
                          </CTableHeaderCell>
                          <CTableHeaderCell>
                            <CCol className="d-flex align-items-center justify-content-between">
                              <div className="order-1">Gia đình nhận</div>
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
                        {donation?.donation_usages?.map((usage, index) => (
                          <>
                            <CTableRow key={index}>
                              <CTableDataCell>{'#' + usage?.donation_usage_id}</CTableDataCell>
                              <CTableDataCell>
                                {format(new Date(usage?.usage_time), 'dd/MM/yyyy hh:mm:ss')}
                              </CTableDataCell>
                              <CTableDataCell>
                                {numeral(usage?.amount).format('0,0₫') + ' VND'}
                              </CTableDataCell>
                              <CTableDataCell>{donation?.purpose.purpose}</CTableDataCell>
                              <CTableDataCell>{usage?.family?.family_name || '###'}</CTableDataCell>
                              <CTableDataCell>{usage?.usage_note}</CTableDataCell>
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

DonationDetailModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  donationId: PropTypes.any,
}

export default DonationDetailModal
