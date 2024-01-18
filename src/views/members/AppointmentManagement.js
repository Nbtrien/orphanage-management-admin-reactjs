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
  CTableBody,
  CTable,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFloating,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import volunteerService from 'src/api/services/volunteerService'
import { EventState } from 'src/constants/VolunteerCode'
import moment from 'moment'
import accountService from 'src/api/services/accountService'
import AppointmentStatus from 'src/constants/AppointmentStatus'

const AppointmentManagement = () => {
  const volunteerApi = volunteerService()
  const accountApi = accountService()
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])

  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })

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

  const [isSearching, setIsSearching] = useState(1)
  const [searchCriteria, setSearchCriteria] = useState({
    status: AppointmentStatus.pending.code,
    keyword: '',
    fromDate: '',
    toDate: '',
  })

  const [currentStatus, setCurrentStatus] = useState(AppointmentStatus.pending.code)

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    const getAppointments = async () => {
      try {
        const response = await accountApi.fetchAppointment({ params })
        const result = response.result
        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    const searchAppointment = async () => {
      try {
        console.log(deleteCount)
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.status !== null && (params.status = searchCriteria.status)
        searchCriteria.fromDate && (params.fromDate = searchCriteria.fromDate)
        searchCriteria.toDate && (params.toDate = searchCriteria.toDate)

        const response = await accountApi.fetchAppointment({ params })
        const result = response.result
        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
        setCurrentStatus(searchCriteria.status)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchAppointment()
    } else {
      getAppointments()
    }
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    const columns1 = [
      {
        key: 'appointment_id',
        title: '',
        render: (_, { appointment_id }) => (
          <CFormCheck
            checked={checkedState[appointment_id]}
            id="checkboxNoLabel"
            value={appointment_id}
            aria-label="..."
            onChange={() => handleIdCBChange(appointment_id)}
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
        key: 'appointment_id',
        title: 'ID',
        sortable: true,
        render: (_, { appointment_id }) => <>#{appointment_id}</>,
      },
      {
        key: 'applicant_full_name',
        title: 'Họ và tên',
        render: (_, { applicant_full_name, account_id }) => <>{applicant_full_name}</>,
      },
      {
        key: 'applicant_mail_address',
        title: 'Địa chỉ email',
      },
      {
        key: 'create_date_time',
        title: 'Thời gian đăng ký',
        render: (_, { create_date_time }) => (
          <div>{moment(create_date_time).format('DD/MM/YYYY hh:mm')}</div>
        ),
      },
      {
        key: 'appointment_start_date_time',
        title: 'Thời gian hẹn',
        sortable: true,
        render: (_, { appointment_start_date_time, appointment_end_date_time }) => (
          <div>
            {moment(appointment_start_date_time).format('DD/MM/YYYY hh:mm')} ~{' '}
            {moment(appointment_end_date_time).format('DD/MM/YYYY hh:mm')}
          </div>
        ),
      },
      {
        key: 'attendees',
        title: 'Số lượng đăng ký',
      },
      {
        key: 'appointment_reason',
        title: 'Chi tiết',
      },
      {
        key: 'status',
        title: 'Trạng thái',
      },
      {
        key: 'appointment_id',
        title: '',
        width: 200,
        render: (_, { appointment_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to="#">
                  <CDropdownItem>Xem chi tiết</CDropdownItem>
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
      states[d.appointment_id] = false
    })
    setCheckedState(states)
    checkAllState && setCheckAllState(false)
  }, [data])

  const handleConfirmBtnClick = () => {
    if (confirmAction) {
      confirmAction()
    }
  }

  const handleCheckAllClick = () => {
    if (checkAllState) {
      for (var key in checkedState) {
        checkedState[key] = false
      }
    } else {
      for (var key in checkedState) {
        checkedState[key] = true
      }
    }
    setCheckAllState(!checkAllState)
  }

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
    setReRender(!isReRender)
  }

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

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
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

  const handleSearchBtnClick = async (event) => {
    event.preventDefault()
    if (
      !searchCriteria.keyword &&
      !searchCriteria.status &&
      !searchCriteria.fromDate &&
      !searchCriteria.toDate
    ) {
      setPage(1)
      setIsSearching(0)
    } else {
      setPage(1)
      setIsSearching((preIsSearching) => preIsSearching + 1)
    }
  }

  const handleApproveAppointment = async (params) => {
    try {
      await accountApi.approveAppointment(params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Xác nhận thành công. Hệ thống đã gửi email thông báo đến người đăng ký.',
      }))
      setSuccessModalVisible(true)
      checkAllState && setCheckAllState(false)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleDeclineAppointment = async (params) => {
    try {
      await accountApi.declineAppointment(params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent:
          'Từ chối thành thành công. Hệ thống đã gửi email thông báo đến người đăng ký.',
      }))
      setSuccessModalVisible(true)
      checkAllState && setCheckAllState(false)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleApproveNoShow = async (params) => {
    try {
      await accountApi.updateAppointmentStatus(AppointmentStatus.noShow.code, params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Xác nhận không thăm thành công.',
      }))
      setSuccessModalVisible(true)
      checkAllState && setCheckAllState(false)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleCompleteAppointment = async (params) => {
    try {
      await accountApi.updateAppointmentStatus(AppointmentStatus.completed.code, params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Xác nhận đã hoàn thành thành công.',
      }))
      setSuccessModalVisible(true)
      checkAllState && setCheckAllState(false)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleParams = (handleFuntion) => {
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
    handleFuntion(params)
  }

  const handleApprovedBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Xác nhận lịch hẹn!',
    }))
    setConfirmAction(() => () => handleParams(handleApproveAppointment))
    setConfirmModalVisible(true)
  }

  const handleDeclineBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Xác nhận từ chối lịch hẹn!',
    }))
    setConfirmAction(() => () => handleParams(handleDeclineAppointment))
    setConfirmModalVisible(true)
  }

  const handleNoShowBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Xác nhận không tham gia!',
    }))
    setConfirmAction(() => () => handleParams(handleApproveNoShow))
    setConfirmModalVisible(true)
  }

  const handleCompleteBtnClick = () => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Xác nhận đã hoàn thành!',
    }))
    setConfirmAction(() => () => handleParams(handleCompleteAppointment))
    setConfirmModalVisible(true)
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
              <div className="header-title-custom">Quản lý lịch hẹn</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="status"
                        value={searchCriteria.status}
                        onChange={handleSearchChange}
                      >
                        {Object.values(AppointmentStatus).map((status) => (
                          <option key={status.code} value={status.code}>
                            {status.display}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái sự kiện</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="date"
                        name="fromDate"
                        value={searchCriteria.fromDate}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Từ ngày
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
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
                  <CCol lg={10} md={9} sm={8}>
                    <CRow className="justify-content-start gap-2">
                      {currentStatus == AppointmentStatus.pending.code ? (
                        <>
                          <CCol lg={2} md={3} sm={4} xs={12} className="mb-2">
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100"
                              onClick={handleApprovedBtnClick}
                            >
                              Xác nhận
                            </CButton>
                          </CCol>
                          <CCol lg={2} md={3} sm={4} xs={12} className="mb-2">
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100"
                              onClick={handleDeclineBtnClick}
                            >
                              Từ chối
                            </CButton>
                          </CCol>
                        </>
                      ) : currentStatus == AppointmentStatus.approved.code ? (
                        <>
                          <CCol lg={3} md={3} sm={4} xs={12} className="mb-2">
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100"
                              onClick={handleNoShowBtnClick}
                            >
                              Xác nhận không đến thăm
                            </CButton>
                          </CCol>
                          <CCol lg={3} md={3} sm={4} xs={12} className="mb-2">
                            <CButton
                              type="submit"
                              color="primary"
                              className="main-btn w-100"
                              onClick={handleCompleteBtnClick}
                            >
                              Xác nhận đã hoàn thành
                            </CButton>
                          </CCol>
                        </>
                      ) : (
                        <></>
                      )}
                    </CRow>
                  </CCol>
                  <CCol lg={2} md={3} sm={4} xs={12} className="mb-2">
                    <CButton
                      type="submit"
                      color="primary"
                      className="main-btn w-100"
                      onClick={() => setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)}
                    >
                      Tải lại
                    </CButton>
                  </CCol>
                  {/* <CCol lg={10} md={9} sm={8}>
                    <CRow className="justify-content-end gap-2">
                      <CCol xl={3} lg={3} md={4} sm={6} xs={12}>
                        <NavLink to="../volunteers/events/create">
                          <CButton type="submit" color="primary" className="main-btn w-100">
                            Thêm mới
                          </CButton>
                        </NavLink>
                      </CCol>
                      <CCol xl={3} lg={3} md={4} sm={5} xs={12}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100"
                          onClick={() => setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)}
                        >
                          Tải lại
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol> */}
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

export default AppointmentManagement
