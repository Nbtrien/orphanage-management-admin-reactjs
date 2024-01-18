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
  CButtonGroup,
  CFormFloating,
} from '@coreui/react'
import { Limits, Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import employeeService from 'src/api/services/employeeService'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { PayrollStatus } from 'src/constants/EmployeeCode'
import CalPayrollModal from 'src/components/modals/CalPayrollModal'
import numeral from 'numeral'

const PayrollManagement = () => {
  const employeeApi = employeeService()

  const { id } = useParams()
  const [monthlyPayroll, setMonthlyPayroll] = useState()
  const [employeePayrolls, setEmployeePayrolls] = useState([])

  const [calPayrollModalVisible, setCalPayrollModalVisible] = useState(false)
  const [currentPayroll, setCurrentPayroll] = useState()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [deleteCount, setDeleteCount] = useState(0)
  const [changeCount, setChangeCount] = useState(0)

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

  useEffect(() => {
    // const date = moment()
    const params = {
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
        const response = await employeeApi.getMonthlyPayrollDetail(id, { params })
        const result = response.result

        setMonthlyPayroll(result)
        setEmployeePayrolls(result.employee_payrolls)

        setData(result.employee_payrolls.records)
        setPage(result.employee_payrolls.page)
        setTotalPage(result.employee_payrolls.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPayrolls()
  }, [deleteCount, page, pagination, searchKey, changeCount])

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
        renderColumn: () => <CFormCheck id="checkboxNoLabel" aria-label="..." />,
      },
      {
        key: 'employee_payroll_id',
        title: 'ID',
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
      {
        key: 'working_hours',
        title: 'Số giờ làm',
        sortable: true,
      },
      {
        key: 'payroll_amount',
        title: 'Lương đã tính (VND)',
        sortable: true,
        render: (_, { payroll_amount }) => <>{numeral(payroll_amount).format('0,0₫')}</>,
      },
      {
        key: 'payroll_start_date',
        title: 'Từ ngày',
        sortable: true,
        render: (_, { payroll_start_date }) => (
          <>{format(new Date(payroll_start_date), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'payroll_end_date',
        title: 'Đến ngày',
        sortable: true,

        render: (_, { payroll_end_date }) => (
          <>{format(new Date(payroll_end_date), 'dd/MM/yyyy')}</>
        ),
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
        render: (_, { employee_payroll_id, payroll_status }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                {(payroll_status == PayrollStatus.pending.display ||
                  payroll_status == PayrollStatus.approved.display) && (
                  <>
                    <NavLink
                      className="text-nodecorate"
                      onClick={() => handleCalPayrollClick(employee_payroll_id)}
                    >
                      <CDropdownItem>Tính lương</CDropdownItem>
                    </NavLink>
                  </>
                )}
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

  const handleCalPayrollClick = (id) => {
    const employeePayroll = data.find((payroll) => payroll.employee_payroll_id === id)
    setCurrentPayroll(employeePayroll)
    setCalPayrollModalVisible(true)
    console.log(employeePayroll)
  }

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

  const handlePayrollSaveBtnClick = async (changedPayroll) => {
    console.log(changedPayroll)
    try {
      await employeeApi.updateEmployeePayroll(changedPayroll.employee_payroll_id, changedPayroll)
      setCalPayrollModalVisible(false)
      setCurrentPayroll(null)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePayrollConfirmBtnClick = async (changedPayroll) => {
    changedPayroll.payroll_status = PayrollStatus.approved.display

    try {
      await employeeApi.updateEmployeePayroll(changedPayroll.employee_payroll_id, changedPayroll)
      setCalPayrollModalVisible(false)
      setCurrentPayroll(null)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmAllBtnClick = async () => {
    const hasDraftPayroll = data.some(
      (item) => item.payroll_status === PayrollStatus.pending.display,
    )
    if (hasDraftPayroll) {
      setErrorModalMessage({
        modalTile: 'Lỗi',
        modalContent: 'Hãy xác nhận toàn bộ lương nhân viên!',
      })
      setErrorModalVisible(true)
    } else {
      monthlyPayroll.payroll_status = PayrollStatus.approved.display
      try {
        await employeeApi.updateMonthlyPayroll(monthlyPayroll.monthly_payroll_id, monthlyPayroll)
        setChangeCount((prevChangeCount) => prevChangeCount + 1)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleConfirmDoneAllBtnClick = async () => {
    try {
      await employeeApi.confirmMonthlyPayroll(id)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
      console.log(error)
    }
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
      <CalPayrollModal
        payroll={currentPayroll}
        isVisible={calPayrollModalVisible}
        setVisible={setCalPayrollModalVisible}
        handlePayrollSaveBtnClick={handlePayrollSaveBtnClick}
        handlePayrollConfirmBtnClick={handlePayrollConfirmBtnClick}
      ></CalPayrollModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">
                Bảng lương Tháng {monthlyPayroll?.month} Năm {monthlyPayroll?.year}
              </div>
              <div className="header-search-area">
                <CRow className="d-flex  justify-content-between">
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        defaultValue={Pagination.limit}
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        id="inputLimit"
                        onChange={(e) => handleLimitChange(e.target.value)}
                      >
                        {Limits.map((limit, key) => (
                          <option value={limit} key={key}>
                            {limit}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputLimit">Hiển thị</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
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
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormInput
                        size="sm"
                        type="text"
                        name="keyword"
                        onChange={(e) => {
                          handleSearchChange(e.target.value)
                        }}
                      />
                      <CFormLabel
                        htmlFor="inputSearch"
                        className="label-floating-custom text-truncate"
                      >
                        Tìm kiếm theo tên,ID ,,,
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
                      // onClick={handleSearchBtnClick}
                    >
                      Tìm kiếm
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CCardHeader>
            <CCardBody>
              {/* <CRow className="d-flex  justify-content-between">
                <CCol md={3} sm={3} xs={3} className="col-form-label">
                  <CFormFloating>
                    <CFormSelect
                      defaultValue={Pagination.limit}
                      className="col-form-label custom-select-floating"
                      aria-label="Large select example"
                      id="inputLimit"
                      onChange={(e) => handleLimitChange(e.target.value)}
                    >
                      {Limits.map((limit, key) => (
                        <option value={limit} key={key}>
                          {limit}
                        </option>
                      ))}
                    </CFormSelect>
                    <CFormLabel htmlFor="inputLimit">Hiển thị</CFormLabel>
                  </CFormFloating>
                </CCol>

                <CCol md={3} sm={3} xs={3} className="col-form-label">
                  <CFormFloating>
                    <CFormSelect
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
                <CCol md={3} sm={3} xs={3} className="col-form-label">
                  <CFormFloating>
                    <CFormInput
                      size="sm"
                      type="text"
                      id="inputSearch"
                      onChange={(e) => {
                        handleSearchChange(e.target.value)
                      }}
                      placeholder="Tìm kiếm"
                    />
                    <CFormLabel htmlFor="inputSearch">Tìm kiếm</CFormLabel>
                  </CFormFloating>
                </CCol>
                <CCol md={3} sm={3} xs={3} className="col-form-label">
                  <CButtonGroup className="d-flex flex-wrap gap-2 h-100">
                    {monthlyPayroll?.payroll_status == PayrollStatus.pending.display ? (
                      <>
                        <CButton
                          color="secondary"
                          shape="rounded-2"
                          onClick={handleConfirmAllBtnClick}
                        >
                          Xác nhận bảng lương này
                        </CButton>
                      </>
                    ) : monthlyPayroll?.payroll_status == PayrollStatus.approved.display ? (
                      <>
                        <CButton
                          color="primary"
                          shape="rounded-2"
                          onClick={handleConfirmDoneAllBtnClick}
                        >
                          Xác nhận đã hoàn thành
                        </CButton>
                      </>
                    ) : (
                      <></>
                    )}
                  </CButtonGroup>
                </CCol>
              </CRow> */}
              <div className="body-btn-group mb-2">
                <CRow className="justify-content-between">
                  <CCol lg={6} md={7} sm={5}>
                    <CCol xl={3} lg={4} md={6} sm={10} xs={12} className="mb-2">
                      <CButton
                        type="submit"
                        color="primary"
                        className="main-btn w-100 btn-content"
                        // onClick={handleDeleteAllClick}
                      >
                        Xóa bỏ
                      </CButton>
                    </CCol>
                  </CCol>
                  <CCol lg={6} md={5} sm={7}>
                    <CRow className="justify-content-end">
                      <CCol xl={6} lg={8} md={12} sm={10} xs={12} className="mb-2">
                        {monthlyPayroll?.payroll_status == PayrollStatus.pending.display ? (
                          <>
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100 btn-content"
                              onClick={handleConfirmAllBtnClick}
                            >
                              Xác nhận bảng lương này
                            </CButton>
                          </>
                        ) : monthlyPayroll?.payroll_status == PayrollStatus.approved.display ? (
                          <>
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100 btn-content"
                              onClick={handleConfirmDoneAllBtnClick}
                            >
                              Xác nhận đã hoàn thành
                            </CButton>
                          </>
                        ) : (
                          <></>
                        )}
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

export default PayrollManagement
