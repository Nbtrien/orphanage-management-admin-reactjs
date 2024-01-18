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
  CFormLabel,
  CFormSelect,
  CTable,
  CTableBody,
  CFormFloating,
  CFormInput,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import employeeService from 'src/api/services/employeeService'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'

const EmployeeManagement = () => {
  const employeeApi = employeeService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [deleteCount, setDeleteCount] = useState(0)

  const [confirmAction, setConfirmAction] = useState(null)
  const [checkAllState, setCheckAllState] = useState(false)

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

  const [positions, setPositions] = useState([])
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    positionId: '',
    minDateOfAdmission: '',
    maxDateOfAdmission: '',
  })
  const [isSearching, setIsSearching] = useState(0)

  useEffect(() => {
    // Get positions
    const getPositions = async () => {
      try {
        const response = await employeeApi.getEmployeePositions()
        const result = response.result
        setPositions(result)
      } catch (error) {
        console.log(error)
      }
    }
    getPositions()
  }, [])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    // Fetch employees data
    const fetchEmployees = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.positionId && (params.positionId = searchCriteria.positionId)
        searchCriteria.minDateOfAdmission &&
          (params.minDateOfAdmission = searchCriteria.minDateOfAdmission)
        searchCriteria.maxDateOfAdmission &&
          (params.maxDateOfAdmission = searchCriteria.maxDateOfAdmission)

        const response = await employeeApi.getEmployees({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    fetchEmployees()
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'employee_id',
        title: '',
        render: (_, { employee_id }) => (
          <CFormCheck
            checked={checkedState[employee_id]}
            id="checkboxNoLabel"
            value={employee_id}
            aria-label="..."
            onChange={() => handleIdCBChange(employee_id)}
          />
        ),
        renderColumn: () => (
          <CFormCheck
            checked={checkAllState}
            id="checkboxNoLabel"
            aria-label="..."
            onChange={handleCheckAllClick}
          />
        ),
      },
      {
        key: 'employee_id',
        title: 'ID',
        sortable: true,
        render: (_, { employee_id }) => <>#{employee_id}</>,
      },
      {
        key: 'image_url',
        title: 'Ảnh',
        render: (_, { image_url }) => (
          <>
            <div className="clearfix">
              <CImage
                align="center"
                rounded
                src={image_url}
                width={100}
                height={100}
                className="custom-img-fit"
              />
            </div>
          </>
        ),
      },
      {
        key: 'employee_full_name',
        title: 'Tên',
        sortable: true,
      },
      {
        key: 'employee_date_of_birth',
        title: 'Ngày sinh',
        sortable: true,
        render: (_, { employee_date_of_birth }) => (
          <>{format(new Date(employee_date_of_birth), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'employee_gender',
        title: 'Giới tính',
        sortable: true,
      },
      {
        key: 'position',
        title: 'Công việc',
        sortable: true,
      },
      {
        key: 'employee_phone_number',
        title: 'Số điện thoại',
        sortable: true,
      },
      {
        key: 'employee_mail_address',
        title: 'Địa chỉ email',
        sortable: true,
      },
      {
        key: 'hire_date',
        title: 'Ngày bắt đầu',
        sortable: true,
        render: (_, { hire_date }) => <>{format(new Date(hire_date), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'employee_id',
        title: '',
        width: 200,
        render: (_, { employee_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../employees/${employee_id}`}>
                  <CDropdownItem>Xem hồ sơ</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to={`../employees/${employee_id}/edit`}>
                  <CDropdownItem>Sửa thông tin</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]
    setColumns(columns1)
  }, [checkedState, isReRender, checkAllState])

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
      setPagination((prevPagination) => ({
        ...prevPagination,
        sortColumn: sortConfig.key,
        sortType: sortConfig.direction,
      }))
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

  const handleCheckAllClick = () => {
    if (checkAllState) {
      for (var key in checkedState) {
        checkedState[key] = false
      }
    } else {
      for (var key1 in checkedState) {
        checkedState[key1] = true
      }
    }
    setCheckAllState(!checkAllState)
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

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
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
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Quản lý thông tin nhân viên</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="positionId"
                        value={searchCriteria.positionId}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        {positions.map((pos, index) => (
                          <option value={pos.position_id} key={index}>
                            {pos.position_title}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Công việc</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="date"
                        name="minDateOfAdmission"
                        value={searchCriteria.minDateOfAdmission}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Từ ngày bắt đầu
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="date"
                        name="maxDateOfAdmission"
                        value={searchCriteria.maxDateOfAdmission}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Đến ngày bắt đầu
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormInput
                        size="sm"
                        type="text"
                        name="keyword"
                        value={searchCriteria.keyword}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel
                        htmlFor="inputSearch"
                        className="label-floating-custom text-truncate"
                      >
                        Tìm kiếm theo ID, tên, ...
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
                    <CCol xl={3} lg={4} md={6} sm={6} xs={12} className="mb-2">
                      <CButton
                        type="submit"
                        color="primary"
                        className="main-btn w-100 btn-content"
                        onClick={handleDeleteAllClick}
                      >
                        Xóa bỏ
                      </CButton>
                    </CCol>
                  </CCol>
                  <CCol lg={6} md={5} sm={12}>
                    <CRow className="justify-content-end">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <NavLink to={'../employees/create'}>
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

export default EmployeeManagement
