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
  CFormSelect,
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
import publicService from 'src/api/services/publicService'

const DonationUsingForFamilyModal = ({
  isVisible,
  setVisible,
  remainingAmount,
  donationId,
  purposeId,
  purpose,
  handleSaveBtnClick,
}) => {
  const publicApi = publicService()
  const [amount, setAmount] = useState('')
  const [amountInvalid, setAmountInvalid] = useState(false)
  const [amountInvalidMess, setAmountInvalidMess] = useState('')
  const [note, setNote] = useState('')

  const [families, setFamilies] = useState([])
  const [familyId, setFamilyId] = useState('')

  useEffect(() => {
    if (!isVisible) {
      setAmount('')
      setAmountInvalid(false)
      setAmountInvalidMess('')
      setNote('')
      setFamilyId('')
    }
  }, [isVisible])

  useEffect(() => {
    const getFamilies = async () => {
      try {
        const response = await publicApi.getAllFamiliesForDonate()
        setFamilies(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getFamilies()
  }, [])

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
      size="lg"
      onClose={() => setVisible()}
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">
          Phân bổ đến gia đình {donationId && '/ Tài trợ#' + donationId}
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
                <CTableDataCell className="form-table-label">Chọn gia đình*</CTableDataCell>
                <CTableDataCell>
                  <CFormSelect
                    className="col-form-label custom-select-floating"
                    aria-label="Large select example"
                    name="purpose"
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                  >
                    {!familyId && <option disabled selected></option>}

                    {families.length > 0 &&
                      families.map((fami, index) => (
                        <option value={fami.family_id} key={index}>
                          {fami.family_name}
                        </option>
                      ))}
                  </CFormSelect>
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
          disabled={!amount || !note || !familyId}
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

DonationUsingForFamilyModal.propTypes = {
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  remainingAmount: PropTypes.number,
  donationId: PropTypes.any,
  purposeId: PropTypes.number,
  purpose: PropTypes.string,
  handleSaveBtnClick: PropTypes.func,
}

export default DonationUsingForFamilyModal
