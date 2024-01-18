import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCardTitle, CCol, CImage, CRow } from '@coreui/react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import InfoTable from 'src/components/tables/InfoTable'
import employeeService from 'src/api/services/employeeService'
import FloatingInputRow from 'src/components/rows/FloatingInputRow'
import numeral from 'numeral'

const EmployeeDetails = () => {
  const employeeApi = employeeService()
  const { id } = useParams()
  const [employee, setEmployee] = useState()

  const [payrollData, setPayrollData] = useState([])
  const [payrollColumns, setPayrollColumns] = useState([])

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const response = await employeeApi.getEmployeeDetail(id)
        setEmployee(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getEmployee()
  }, [id])

  useEffect(() => {
    const setPayrollsRecord = () => {
      setPayrollData(employee.payrolls)
      setPayrollColumns([
        {
          key: 'employee_payroll_id',
          title: 'ID',
        },
        {
          key: 'employee_payroll_month',
          title: 'Tháng',
          render: (_, { employee_payroll_month, employee_payroll_year }) => (
            <>
              Tháng {employee_payroll_month}, {employee_payroll_year}
            </>
          ),
        },
        {
          key: 'payroll_amount',
          title: 'Lương',
          render: (_, { payroll_amount }) => <>{numeral(payroll_amount).format('0,0₫')}</>,
        },
        {
          key: 'date_of_payment',
          title: 'Ngày trả lương',
          render: (_, { date_of_payment }) => (
            <>{format(new Date(date_of_payment), 'dd/MM/yyyy')}</>
          ),
        },
        {
          key: 'payroll_start_date',
          title: 'Từ ngày',
          render: (_, { payroll_start_date }) => (
            <>{format(new Date(payroll_start_date), 'dd/MM/yyyy')}</>
          ),
        },
        {
          key: 'payroll_end_date',
          title: 'Đến ngày',
          render: (_, { payroll_end_date }) => (
            <>{format(new Date(payroll_end_date), 'dd/MM/yyyy')}</>
          ),
        },
        {
          key: 'payroll_status',
          title: 'Trạng thái',
        },
      ])
    }

    if (employee && employee?.payrolls.length > 0) {
      setPayrollsRecord()
    }
  }, [employee])

  return (
    <>
      {employee && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-3">
                  <h4>Hồ sơ nhân viên #{employee.employee_id}</h4>
                </div>
                <CRow className="align-items-md-stretch">
                  <CCol md={4}>
                    <CRow>
                      <CCol md={12} className="mb-3">
                        <div className="h-100 p-3 text-black bg-white rounded-3 border border-2 border-light">
                          <CImage fluid src={employee.image_url} rounded />
                          <h5 className="mt-3">Thông tin cá nhân</h5>
                          <FloatingInputRow label="Họ và tên" value={employee.employee_full_name} />
                          <FloatingInputRow label="Giới tính" value={employee.employee_gender} />
                          <FloatingInputRow
                            label="Ngày sinh"
                            value={format(new Date(employee.employee_date_of_birth), 'dd/MM/yyyy')}
                          />

                          <FloatingInputRow label="Dân tộc" value={employee.employee_ethnicity} />
                          <FloatingInputRow label="Tôn giáo" value={employee.employee_religion} />
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={8}>
                    <div className="h-100 p-3 text-black bg-white rounded-3 border border-2 border-light">
                      <div>
                        <h5>Thông tin liên lạc</h5>
                        <CRow>
                          <CCol md={12}>
                            <FloatingInputRow label="Địa chỉ" value={employee.address} />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Số điện thoại"
                              value={employee.employee_phone_number}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Địa chỉ email"
                              value={employee.employee_mail_address}
                            />
                          </CCol>
                        </CRow>
                      </div>
                      <div className="mt-3">
                        <h5>Thông tin hợp đồng</h5>
                        <CRow>
                          <CCol md={6}>
                            <FloatingInputRow label="Công việc" value={employee.position} />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Lương cơ bản"
                              value={numeral(employee.salary).format('0,0₫') + '(VND)'}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Ngày bắt đầu"
                              value={format(new Date(employee.hire_date), 'dd/MM/yyyy')}
                            />
                          </CCol>
                          <CCol md={6}>
                            <FloatingInputRow
                              label="Ngày kết thúc"
                              value={
                                employee.end_date
                                  ? format(new Date(employee?.end_date), 'dd/MM/yyyy')
                                  : ''
                              }
                            />
                          </CCol>
                        </CRow>
                      </div>
                      <div className="mt-3">
                        <h5>Thông tin Bảng lương</h5>
                        {payrollData?.length > 0 && (
                          <InfoTable
                            nowrapHeaderCells={true}
                            data={payrollData}
                            columns={payrollColumns}
                          ></InfoTable>
                        )}
                      </div>
                      {/* <InfoRow label="Địa chỉ" value={employee.employee_address} />
                      <InfoRow label="Số điện thoại" value={employee.employee_phone_number} />
                      <InfoRow label="Địa chỉ email" value={employee.employee_mail_address} /> */}
                    </div>
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

export default EmployeeDetails
