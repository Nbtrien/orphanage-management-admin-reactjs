import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCol,
  CFormCheck,
  CRow,
  CPagination,
  CPaginationItem,
  CCardBody,
  CImage,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButtonGroup,
  CFormFloating,
} from '@coreui/react'
import BorderedTable from 'src/components/tables/BorderedTable'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { Limits, Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import employeeService from 'src/api/services/employeeService'
import moment from 'moment'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { PayrollStatus } from 'src/constants/EmployeeCode'

const PayrollHistory = () => {
  const employeeApi = employeeService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [deleteCount, setDeleteCount] = useState(0)

  const [confirmAction, setConfirmAction] = useState(null)

  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [confirmModalMessage, setConfirmModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })

  const [searchKey, setSearchKey] = useState('')
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })

  const [currentDate, setCurrentDate] = useState('')
  const [currentMonth, setCurrentMonth] = useState('')
  const [currentYear, setCurrentYear] = useState('')

  const startYear = 2000

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState('')

  useEffect(() => {
    const date = moment()
    setCurrentDate(date.format('YYYY-MM-DD'))
    setCurrentMonth(date.format('MM'))
    setCurrentYear(date.format('YYYY'))
  }, [])

  useEffect(() => {
    // const date = moment()
    const params = {
      month: currentMonth,
      year: currentYear,
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    if (searchKey) {
      params.search = searchKey
    }
    // Fetch payrolls data
    const fetchPayrolls = async () => {
      try {
        const response = await employeeApi.getEmployeePayrolls({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (currentMonth && currentYear) {
      fetchPayrolls()
    }
  }, [deleteCount, page, pagination, searchKey, currentMonth, currentYear])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'employee_payroll_id',
        title: '',
        render: (_, { employee_payroll_id }) => (
          <CFormCheck
            checked={checkedState[employee_payroll_id]}
            id="checkboxNoLabel"
            value={employee_payroll_id}
            aria-label="..."
            onChange={() => handleIdCBChange(employee_payroll_id)}
          />
        ),
      },
      {
        key: 'employee_payroll_id',
        title: 'Id',
        sortable: true,
      },
      {
        key: 'employee_full_name',
        title: 'Nhân viên',
        // sortable: true,
      },
      {
        key: 'employee_id',
        title: 'ID Nhân viên',
        sortable: true,
      },
      //   {
      //     key: 'employee_mail_address',
      //     title: 'Địa chỉ email',
      //     sortable: true,
      //   },
      {
        key: 'payroll_amount',
        title: 'Lương',
        sortable: true,
      },
      {
        key: 'payroll_start_date',
        title: 'Từ ngày',
        sortable: true,
      },
      {
        key: 'payroll_end_date',
        title: 'Đến ngày',
        sortable: true,
      },
      {
        key: 'payroll_status',
        title: 'Trạng thái',
        sortable: true,
      },
      {
        key: 'employee_payroll_id',
        title: '',
        width: 200,
        render: (_, { employee_payroll_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`./${employee_payroll_id}`}>
                  <CDropdownItem>Xem</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to={`./${employee_payroll_id}/edit`}>
                  <CDropdownItem>Sửa</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => handleDeleteBtnClick(employee_payroll_id)}
                >
                  <CDropdownItem>Xóa</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]
    setColumns(columns1)
  }, [checkedState, isReRender])

  useEffect(() => {
    const states = {}
    data.forEach((d) => {
      states[d.employee_id] = false
    })
    setCheckedState(states)
  }, [data])

  useEffect(() => {
    // Update the pagination configuration based on the sortConfig values
    if (sortConfig.key) {
      if (
        sortConfig.key == 'employee_full_name' ||
        sortConfig.key == 'employee_mail_address' ||
        sortConfig.key == 'employee_id'
      ) {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: 'employee',
          sortType: sortConfig.direction,
        }))
      } else {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: sortConfig.key,
          sortType: sortConfig.direction,
        }))
      }
    }
  }, [sortConfig])

  const deleteEmployee = async (params) => {
    try {
      // Call the API to delete employee with the provided parameters
      await employeeApi.deleteEmployees({ params })
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã xoá thành công',
      }))
      setSuccessModalVisible(true)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Xoá không thành công',
      }))
      setErrorModalVisible(true)
    }
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  // Handle delete all when click delete all
  const handleDeleteAll = () => {
    // Get the selected IDs
    let ids = []
    for (const key in checkedState) {
      if (checkedState[key]) {
        ids.push(key)
      }
    }
    setConfirmModalVisible(false)
    const params = {
      ids: ids.join(','),
    }
    deleteEmployee(params)
  }

  // Handle delete one when click delete one
  const handleDeleteOne = (id) => {
    setConfirmModalVisible(false)
    const params = {
      ids: id,
    }
    deleteEmployee(params)
  }

  const handleConfirmBtnClick = () => {
    if (confirmAction) {
      confirmAction()
    }
  }

  //Updates the sortConfig when a column header is clicked
  const handleSortClick = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        setSortConfig((prevSortConfig) => ({
          ...prevSortConfig,
          key: key,
          direction: 'desc',
        }))
      } else {
        setSortConfig((prevSortConfig) => ({
          ...prevSortConfig,
          key: key,
          direction: 'asc',
        }))
      }
    } else {
      setSortConfig((prevSortConfig) => ({
        ...prevSortConfig,
        key: key,
        direction: 'asc',
      }))
    }
  }

  const handleDeleteBtnClick = (id) => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận xóa',
      modalContent: 'Bạn muốn xóa mục đã chọn!',
    }))
    setConfirmAction(() => () => handleDeleteOne(id))
    setConfirmModalVisible(true)
  }

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
    setReRender(!isReRender)
  }

  const handleSelectAllClick = () => {
    for (var key in checkedState) {
      checkedState[key] = true
    }
    setReRender(!isReRender)
  }

  const handleDeselectAllClick = () => {
    for (var key in checkedState) {
      checkedState[key] = false
    }
    setReRender(!isReRender)
  }

  const handleDeleteAllClick = () => {
    let isAnySelect = false
    for (var key in checkedState) {
      if (checkedState[key]) isAnySelect = true
    }
    if (isAnySelect) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận xóa',
        modalContent: 'Bạn muốn xóa các mục đã chọn!',
      }))
      setConfirmAction(() => handleDeleteAll)
      setConfirmModalVisible(true)
    } else {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Vui lòng chọn mục muốn xóa',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleLimitChange = (value) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      limit: value,
      page: 1,
    }))
    setPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchKey(value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage)
    }
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const renderYearOptions = () => {
    const options = []
    for (let year = currentYear; year >= startYear; year--) {
      options.push(
        <option key={year} value={year}>
          {year}
        </option>,
      )
    }
    return options
  }

  return (
    <>
      <ConfirmModal
        modalMessage={confirmModalMessage}
        isVisible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        handleConfirmBtnClick={handleConfirmBtnClick}
      ></ConfirmModal>
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      ></ErrorModal>
      <SuccessModal
        modalMessage={successModalMessage}
        isVisible={successModalVisible}
        setVisible={setSuccessModalVisible}
      ></SuccessModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Lịch sử trả lương</strong>
            </CCardHeader>
            <CCardBody>
              {/* <BorderedTable
                nowrapHeaderCells={true}
                data={data}
                columns={columns}
                onSortClick={handleSortClick}
                sortConfig={sortConfig}
                handleSelectAllClick={handleSelectAllClick}
                handleDeleteAllClick={handleDeleteAllClick}
                handleDeselectAllClick={handleDeselectAllClick}
                handleLimitChange={handleLimitChange}
                handleSearchChange={handleSearchChange}
              /> */}
              <CRow>
                <CCol md={3} sm={3} xs={3} className="col-form-label">
                  <CFormFloating className="mb-3">
                    <CFormSelect
                      defaultValue={Pagination.limit}
                      className="col-form-label custom-select-floating"
                      aria-label="Large select example"
                    >
                      <option></option>
                      <option value={PayrollStatus.pending}>Bản thảo</option>
                      <option value={PayrollStatus.approved}>Đã xác nhận</option>
                      <option value={PayrollStatus.done}>Đã hoàn thành</option>
                      <option value={PayrollStatus.canceled}>Đã hủy</option>
                    </CFormSelect>
                    <CFormLabel htmlFor="inputStatus">Trạng thái</CFormLabel>
                  </CFormFloating>
                </CCol>
                <CCol md={2} sm={2} xs={2} className="col-form-label">
                  {/* <CFormFloating className="mb-3">
                    <CFormInput type="date" id="inputFromDate" />
                    <CFormLabel htmlFor="inputFromDate">Từ ngày</CFormLabel>
                  </CFormFloating> */}

                  <CFormFloating className="mb-3">
                    <CFormSelect
                      className="col-form-label custom-select-floating"
                      aria-label="Large select example"
                    >
                      <option></option>
                      {[...Array(12)].map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormLabel htmlFor="inputMonth">Chọn tháng</CFormLabel>
                  </CFormFloating>
                </CCol>
                <CCol md={2} sm={2} xs={2} className="col-form-label">
                  <CFormFloating className="mb-3">
                    <CFormSelect
                      className="col-form-label custom-select-floating"
                      aria-label="Large select example"
                      value={selectedYear}
                      onChange={handleYearChange}
                    >
                      <option></option>
                      {renderYearOptions()}
                    </CFormSelect>
                    <CFormLabel htmlFor="inputYear">Chọn năm</CFormLabel>
                  </CFormFloating>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} sm={12} md={4} lg={6} xl={2} className="mb-1">
                  <CForm>
                    <CRow>
                      <CFormLabel
                        htmlFor="inputEmail3"
                        className="col-sm-3 col-md-4 col-3  col-form-label text-nowrap"
                      >
                        Hiển thị
                      </CFormLabel>
                      <CCol md={8} sm={9} xs={9}>
                        <CFormSelect
                          defaultValue={Pagination.limit}
                          className="col-form-label"
                          size="sm"
                          aria-label="Large select example"
                          onChange={(e) => handleLimitChange(e.target.value)}
                        >
                          {Limits.map((limit, key) => (
                            <option value={limit} key={key}>
                              {limit}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCol>
              </CRow>
              <CTable
                striped
                borderColor="grey"
                align="middle"
                className="mb-3 border"
                hover
                responsive
              >
                <TableHeader
                  columns={columns}
                  onSortClick={handleSortClick}
                  sortConfig={sortConfig}
                  nowrapHeaderCells={true}
                />
                <CTableBody>
                  <TableRow data={data} columns={columns} />
                </CTableBody>
              </CTable>
              <CPagination className="justify-content-end">
                <CPaginationItem
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>
                {pageNumbers.map((pageNumber) => (
                  <CPaginationItem
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={page === totalPage}
                  onClick={() => handlePageChange(page + 1)}
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default PayrollHistory
