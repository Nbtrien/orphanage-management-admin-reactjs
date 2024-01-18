import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import numeral from 'numeral'

const CalPayrollModal = ({
  isVisible,
  setVisible,
  handlePayrollSaveBtnClick,
  handlePayrollConfirmBtnClick,
  payroll,
}) => {
  const [newPayroll, setNewPayroll] = useState(payroll)
  useEffect(() => {
    setNewPayroll(payroll)
    setCalculatedSalary(payroll?.payroll_amount)
  }, [payroll])

  const [calculatedSalary, setCalculatedSalary] = useState('')
  const [totalWorkingHours, setTotalWorkingHours] = useState()

  useEffect(() => {
    const year = payroll?.employee_payroll_year
    const month = payroll?.employee_payroll_month
    const firstDay = new Date(year, month - 1, 1) // Ngày đầu tiên trong tháng
    const lastDay = new Date(year, month, 0) // Ngày cuối cùng trong tháng
    let totalWorkingDays = 0

    // Duyệt qua từng ngày trong tháng
    for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
      const dayOfWeek = day.getDay() // Lấy ngày trong tuần (0 - Chủ Nhật, 1 - Thứ 2, ..., 6 - Thứ 7)

      // Kiểm tra nếu ngày làm việc (từ thứ 2 đến thứ 6)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        totalWorkingDays++
      }
    }
    setTotalWorkingHours(totalWorkingDays * 8)
  }, [payroll])

  const handleChangeInputFromDate = (event) => {
    setNewPayroll({
      ...newPayroll,
      payroll_start_date: event.target.value,
    })
  }

  const handleChangeInputEndDate = (event) => {
    setNewPayroll({
      ...newPayroll,
      payroll_end_date: event.target.value,
    })
  }

  const handleChangeInputBasicSalary = (event) => {
    const value = event.target.value
    setNewPayroll({
      ...newPayroll,
      payroll_salary: value,
    })
    setCalculatedSalary(((newPayroll.working_hours * value) / totalWorkingHours).toFixed(3))
  }

  const handleChangeInputWorkingHours = (event) => {
    const value = event.target.value
    setNewPayroll({
      ...newPayroll,
      working_hours: value,
    })
    setCalculatedSalary(((newPayroll.payroll_salary * value) / totalWorkingHours).toFixed(3))
  }

  useEffect(() => {
    setNewPayroll({
      ...newPayroll,
      payroll_amount: calculatedSalary,
    })
  }, [calculatedSalary])

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Tính lương nhân viên</div>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CTable responsive bordered className="form-table overflow-hidden table-border-2">
            <CTableBody>
              <CTableRow>
                <CTableDataCell className="form-table-label">ID Nhân viên</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="text"
                    id="inputID"
                    value={'#' + newPayroll?.employee_id}
                    readOnly
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Nhân viên</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="md"
                    type="text"
                    id="inputName"
                    value={newPayroll?.employee_full_name}
                    readOnly
                  />
                </CTableDataCell>
              </CTableRow>

              <CTableRow>
                <CTableDataCell className="form-table-label">Từ ngày*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="date"
                    id="inputFromDate"
                    value={newPayroll?.payroll_start_date}
                    onChange={handleChangeInputFromDate}
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Đến ngày*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="date"
                    id="payroll_end_date"
                    value={newPayroll?.payroll_end_date}
                    onChange={handleChangeInputEndDate}
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Lương cơ bản</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="number"
                    id="payroll_end_date"
                    value={newPayroll?.payroll_salary}
                    onChange={handleChangeInputBasicSalary}
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Số giờ làm việc*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="number"
                    id="payroll_end_date"
                    value={newPayroll?.working_hours}
                    onChange={handleChangeInputWorkingHours}
                  />
                </CTableDataCell>
              </CTableRow>
              <CTableRow>
                <CTableDataCell className="form-table-label">Lương đã tính (VND)*</CTableDataCell>
                <CTableDataCell>
                  <CFormInput
                    size="sm"
                    type="text"
                    id="payroll_amount"
                    value={numeral(calculatedSalary).format('0,0₫') + ' VND'}
                    readOnly
                  />
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CForm>
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton color="secondary" onClick={() => handlePayrollSaveBtnClick(newPayroll)}>
          Lưu
        </CButton>
        <CButton color="primary" onClick={() => handlePayrollConfirmBtnClick(newPayroll)}>
          Xác nhận
        </CButton>
        <CButton color="danger" onClick={() => setVisible(false)}>
          Hủy bỏ
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

CalPayrollModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  handlePayrollSaveBtnClick: PropTypes.func,
  handlePayrollConfirmBtnClick: PropTypes.func,
  modalMessage: PropTypes.shape({
    modalTile: PropTypes.string,
    modalContent: PropTypes.node,
  }),
  payroll: PropTypes.shape({
    employee_full_name: PropTypes.string,
    employee_id: PropTypes.number,
    payroll_start_date: PropTypes.string,
    payroll_end_date: PropTypes.string,
    employee_payroll_year: PropTypes.number,
    employee_payroll_month: PropTypes.number,
    working_hours: PropTypes.number,
    payroll_amount: PropTypes.number,
  }),
}

export default CalPayrollModal
