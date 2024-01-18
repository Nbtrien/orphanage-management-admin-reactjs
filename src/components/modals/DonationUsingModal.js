import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import numeral from 'numeral'

const DonationUsingModal = ({
  isVisible,
  setVisible,
  remainingAmount,
  donationId,
  purposeId,
  familyId,
  purpose,
  handleSaveBtnClick,
}) => {
  const [amount, setAmount] = useState('')
  const [amountInvalid, setAmountInvalid] = useState(false)
  const [amountInvalidMess, setAmountInvalidMess] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setAmount('')
      setAmountInvalid(false)
      setAmountInvalidMess('')
      setNote('')
    }
  }, [isVisible])

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (value) {
      if (value <= remainingAmount) {
        setAmount(value)
        setAmountInvalid(false)
      }
    } else {
      setAmount(value)
      setAmountInvalid(true)
      setAmountInvalidMess('*Vui lòng nhập số tiền')
    }
  }

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible()}
      size="lg"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">
          {donationId ? (
            <>Sử dụng nguồn tài trợ / Tài trợ#{donationId}</>
          ) : (
            <>Sử dụng nguồn tài trợ / {purpose}</>
          )}
        </div>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CTable responsive bordered className="form-table overflow-hidden table-border-2">
            <CTableBody>
              <CTableRow>
                <CTableDataCell className="form-table-label">Số tiền sử dụng*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="md"
                    type="text"
                    value={numeral(remainingAmount).format('0,0₫') + ' VND'}
                    readOnly
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Số tiền sử dụng*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="md"
                    type="number"
                    id="inputAmount"
                    value={amount}
                    invalid={amountInvalid}
                    onChange={handleAmountChange}
                    placeholder="Số tiền sử dụng"
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Mục đích sử dụng*</CTableDataCell>
                <CTableDataCell>
                  <CFormTextarea
                    name="summary"
                    value={note}
                    rows={4}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Mục đích sử dụng"
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton
          color="secondary"
          onClick={() => {
            handleSaveBtnClick(purposeId, amount, note, donationId, familyId)
          }}
          disabled={!amount || !note}
        >
          Lưu
        </CButton>
        <CButton color="danger" onClick={() => setVisible()}>
          Hủy bỏ
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

DonationUsingModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  remainingAmount: PropTypes.number,
  donationId: PropTypes.any,
  familyId: PropTypes.any,
  purposeId: PropTypes.number,
  purpose: PropTypes.string,
  handleSaveBtnClick: PropTypes.func,
}

export default DonationUsingModal
