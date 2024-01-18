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
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CTable,
  CTableBody,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFloating,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import employeeService from 'src/api/services/employeeService'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { PayrollStatus } from 'src/constants/EmployeeCode'

const MonthlyPayrollManagement = () => {
  const employeeApi = employeeService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [deleteCount, setDeleteCount] = useState(0)

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })

  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: 'start_date',
    sortType: 'desc',
    page: 1,
  })

  const [searchCriteria, setSearchCriteria] = useState({
    status: '',
    fromDate: '',
    toDate: '',
  })
  const [isSearching, setIsSearching] = useState(0)

  useEffect(() => {
    // const date = moment()
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    // Fetch payrolls data
    const fetchPayrolls = async () => {
      try {
        searchCriteria.status && (params.status = searchCriteria.status)
        searchCriteria.fromDate && (params.fromDate = searchCriteria.fromDate)
        searchCriteria.toDate && (params.toDate = searchCriteria.toDate)

        const response = await employeeApi.getMonthlyPayrolls({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPayrolls()
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'employee_payroll_id',
        title: '',
        renderColumn: () => <CFormCheck id="checkboxNoLabel" aria-label="..." />,
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
        key: 'monthly_payroll_id',
        title: 'ID',
        sortable: true,
      },
      {
        key: 'month',
        title: 'Tháng',
        sortable: true,
        render: (_, { month, year }) => (
          <>
            Tháng {month}, {year}
          </>
        ),
      },
      {
        key: 'start_date',
        title: 'Từ ngày',
        sortable: true,
        render: (_, { start_date }) => <>{format(new Date(start_date), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'end_date',
        title: 'Đến ngày',
        sortable: true,
        render: (_, { end_date }) => <>{format(new Date(end_date), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'payroll_status',
        title: 'Trạng thái',
        sortable: true,
      },
      {
        key: 'monthly_payroll_id',
        title: '',
        width: 200,
        render: (_, { monthly_payroll_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  to={`../monthly-payrolls/${monthly_payroll_id}`}
                >
                  <CDropdownItem>Xem chi tiết</CDropdownItem>
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
      if (sortConfig.key == 'month') {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: 'start_date',
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

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
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

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
    setReRender(!isReRender)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage)
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    })
  }

  const handleSearchBtnClick = (event) => {
    event.preventDefault()
    setPage(1)
    setIsSearching((preIsSearching) => preIsSearching + 1)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Bảng lương</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        value={searchCriteria.status}
                        name="status"
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        <option value={PayrollStatus.pending.code}>Bản thảo</option>
                        <option value={PayrollStatus.approved.code}>Đã xác nhận</option>
                        <option value={PayrollStatus.done.code}>Đã hoàn thành</option>
                        <option value={PayrollStatus.canceled.code}>Đã hủy</option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="date"
                        name="fromDate"
                        min={0}
                        value={searchCriteria.fromDate}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Từ ngày
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="date"
                        name="toDate"
                        value={searchCriteria.toDate}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Đến ngày
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                </CRow>
                <CRow className="justify-content-end mt-3">
                  <CCol xl={2} lg={3} md={3} sm={4} xs={12} className="mt-1">
                    <CButton
                      type="submit"
                      color="primary"
                      className="main-btn w-100"
                      onClick={handleSearchBtnClick}
                    >
                      Tìm kiếm
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="body-btn-group mb-2">
                <CRow className="justify-content-between">
                  <CCol lg={6} md={7} sm={12}>
                    <CCol xl={3} lg={4} md={6} sm={6} xs={12} className="mb-2"></CCol>
                  </CCol>
                  <CCol lg={6} md={5} sm={12}>
                    <CRow className="justify-content-end">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <NavLink to={'../monthly-payrolls/create'}>
                          <CButton
                            type="submit"
                            color="primary"
                            className="main-btn w-100 btn-content"
                          >
                            Thêm mới
                          </CButton>
                        </NavLink>
                      </CCol>
                      <CCol xl={3} lg={4} md={6} sm={6} xs={12} className="mb-2">
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100 btn-content"
                          onClick={() => setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)}
                        >
                          Tải lại
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <CTable
                striped
                bordered
                borderColor="light"
                align="middle"
                className="mb-3 border table-border-custom "
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

export default MonthlyPayrollManagement
