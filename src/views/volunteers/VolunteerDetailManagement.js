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
  CFormTextarea,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink, useParams } from 'react-router-dom'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import volunteerService from 'src/api/services/volunteerService'
import { EventApplyState, EventState } from 'src/constants/VolunteerCode'
import moment from 'moment'
import HeaderSubContentCard from 'src/components/cards/HeaderSubContentCard'
import ApplicationStatus from 'src/constants/ApplicationStatus'

const VolunteerDetailManagement = () => {
  const { id } = useParams()
  const volunteerApi = volunteerService()
  const [eventDetail, setEventDetail] = useState(null)
  const [volunteer, setVolunteer] = useState(null)
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])

  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: '',
    sortType: '',
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

  const [isSearching, setIsSearching] = useState(0)
  const [searchCriteria, setSearchCriteria] = useState({
    applicationStatus: '',
    eventState: '',
    keyword: '',
  })

  useEffect(() => {
    const getVolunteer = async () => {
      console.log(id)
      try {
        const response = await volunteerApi.getVolunteerDetail(id)
        setVolunteer(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    id && getVolunteer()
  }, [id, deleteCount])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
    }
    pagination.sortType && (params.sortType = pagination.sortType)
    pagination.sortColumn && (params.sortColumn = pagination.sortColumn)
    const getEvents = async () => {
      const response = await volunteerApi.getEventsByVolunteerId(id, { params })
      const result = response.result

      setData(result.records)
      setPage(result.page)
      setTotalPage(result.totalPage)
    }

    const searchEvents = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.applicationStatus &&
          (params.applicationStatus = searchCriteria.applicationStatus)
        searchCriteria.eventState && (params.eventState = searchCriteria.eventState)

        const response = await volunteerApi.getEventsByVolunteerId(id, { params })
        const result = response.result
        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (volunteer) {
      if (isSearching) {
        searchEvents()
      } else {
        getEvents()
      }
    }
  }, [volunteer, deleteCount, page, pagination, isSearching])

  useEffect(() => {
    const columns1 = [
      {
        key: 'event_id',
        title: '',
        render: (_, { event_id }) => (
          <CFormCheck
            checked={checkedState[event_id]}
            id="checkboxNoLabel"
            value={event_id}
            aria-label="..."
            onChange={() => handleIdCBChange(event_id)}
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
        key: 'event_id',
        title: 'ID',
        sortable: true,
        render: (_, { event_id }) => <>#{event_id}</>,
      },
      {
        key: 'title',
        title: 'Sự kiện',
      },
      {
        key: 'event_start_date',
        title: 'Thời gian diễn ra',
        sortable: true,
        render: (_, { event_start_date, event_end_date }) => (
          <div>
            {moment(event_start_date).format('DD/MM/YYYY hh:mm')} ~{' '}
            {moment(event_end_date).format('DD/MM/YYYY hh:mm')}
          </div>
        ),
      },
      {
        key: 'event_status',
        title: 'Trạng thái sự kiện',
      },
      {
        key: 'event_maximum_participant',
        title: 'Số lượng tình nguyện viên',
        render: (
          _,
          { event_maximum_participant, application_count, approved_application_count },
        ) => (
          <div className="d-flex flex-column gap-1">
            <div>Số lượng cần tuyển: {event_maximum_participant}</div>
            <div>Số lượng đơn ứng tuyển: {application_count}</div>
            <div>Số lượng đã xác nhận: {approved_application_count}</div>
          </div>
        ),
      },
      {
        key: 'apply_status',
        title: 'Trạng thái đăng ký',
        render: (_, { apply_status }) => <i>{apply_status}</i>,
      },
      {
        key: 'event_id',
        title: '',
        width: 200,
        render: (_, { event_id, event_state, application_status }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate">
                  <CDropdownItem>Quản lý sự kiện</CDropdownItem>
                </NavLink>
                {application_status === EventApplyState.pending.code &&
                (event_state === EventState.inProgress.code ||
                  event_state === EventState.notOccurred.code) ? (
                  <>
                    <NavLink
                      className="text-nodecorate"
                      onClick={() => handleApproveItemBtnClick(event_id)}
                    >
                      <CDropdownItem>Xác nhận đơn đăng ký</CDropdownItem>
                    </NavLink>
                    <NavLink
                      className="text-nodecorate"
                      onClick={() => handleDeclinedItemBtnClick(event_id)}
                    >
                      <CDropdownItem>Từ chối đơn đăng ký</CDropdownItem>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="text-nodecorate dropdown-item-disabled"
                      onClick={handleDisabledClick}
                    >
                      <CDropdownItem>Xác nhận đơn đăng ký</CDropdownItem>
                    </NavLink>
                    <NavLink
                      className="text-nodecorate dropdown-item-disabled"
                      onClick={handleDisabledClick}
                    >
                      <CDropdownItem>Từ chối đơn đăng ký</CDropdownItem>
                    </NavLink>
                  </>
                )}
                {application_status === EventApplyState.approved.code ? (
                  <>
                    <NavLink
                      className="text-nodecorate"
                      onClick={() => handleNotAttendedBtnClick(event_id)}
                    >
                      <CDropdownItem>Xác nhận không tham gia</CDropdownItem>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="text-nodecorate dropdown-item-disabled"
                      onClick={handleDisabledClick}
                    >
                      <CDropdownItem>Xác nhận không tham gia</CDropdownItem>
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
  }, [checkedState, isReRender, checkAllState])

  useEffect(() => {
    const states = {}
    data.forEach((d) => {
      states[d.event_id] = false
    })
    setCheckedState(states)
  }, [data])

  const handleApproveApplications = async (params) => {
    try {
      await volunteerApi.approveEventApplications(id, params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent:
          'Xác nhận thành thành công. Hệ thống đã gửi email thông báo đến tình nguyện viên.',
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

  const handleDeclineApplications = async (params) => {
    try {
      await volunteerApi.declineEventApplications(id, params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent:
          'Từ chối thành thành công. Hệ thống đã gửi email thông báo đến tình nguyện viên.',
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

  const handleNotAttendedApplications = async (params) => {
    try {
      await volunteerApi.updateEventApplication(id, params, EventApplyState.notAttended.code)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Xác nhận tình nguyện viên không tham gia thành công.',
      }))
      setSuccessModalVisible(true)
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

  const handleApproveItemBtnClick = (id) => {
    const params = {
      ids: id,
    }
    handleApproveApplications(params)
  }

  const handleDeclinedItemBtnClick = (id) => {
    const params = {
      ids: id,
    }
    handleDeclineApplications(params)
  }

  const handleApproveParams = () => {
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
    handleApproveApplications(params)
  }

  const handleDeclineParams = () => {
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
    handleDeclineApplications(params)
  }

  const handleNotAttendedParams = (id) => {
    setConfirmModalVisible(false)
    handleNotAttendedApplications(id)
  }

  const handleNotAttendedBtnClick = (id) => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Xác nhận tình nguyện viên không tham gia!',
    }))
    setConfirmAction(() => () => handleNotAttendedParams(id))
    setConfirmModalVisible(true)
  }

  const handleApproveBtnClick = () => {
    let isAnySelect = false
    for (var key in checkedState) {
      if (checkedState[key]) isAnySelect = true
    }
    if (isAnySelect) {
      for (var key1 in checkedState) {
        if (checkedState[key1]) {
          const findedData = data.find((d) => d.event_id == key1)
          if (findedData.application_status !== EventApplyState.pending.code) {
            setErrorModalMessage((prevModalError) => ({
              ...prevModalError,
              modalTile: 'Lỗi',
              modalContent: 'Vui lòng chọn đơn đăng ký hợp lệ.',
            }))
            setErrorModalVisible(true)
            return
          }
        }
      }
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Xác nhận các đơn đăng ký đã chọn!',
      }))
      setConfirmAction(() => handleApproveParams)
      setConfirmModalVisible(true)
    } else {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Vui lòng chọn mục muốn thao tác.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleDeclineBtnClick = () => {
    let isAnySelect = false
    for (var key in checkedState) {
      if (checkedState[key]) isAnySelect = true
    }
    if (isAnySelect) {
      for (var key1 in checkedState) {
        if (checkedState[key1]) {
          const findedData = data.find((d) => d.event_id == key1)
          if (findedData.application_status !== EventApplyState.pending.code) {
            setErrorModalMessage((prevModalError) => ({
              ...prevModalError,
              modalTile: 'Lỗi',
              modalContent: 'Vui lòng chọn đơn đăng ký hợp lệ.',
            }))
            setErrorModalVisible(true)
            return
          }
        }
      }
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận xóa',
        modalContent: 'Từ chối các đơn đăng ký đã chọn!',
      }))
      setConfirmAction(() => handleDeclineParams)
      setConfirmModalVisible(true)
    } else {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Vui lòng chọn mục muốn thao tác.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleDisabledClick = (event) => {
    event.preventDefault()
  }

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
      !searchCriteria.applicationStatus &&
      !searchCriteria.eventState
    ) {
      setPage(1)
      setIsSearching(0)
    } else {
      setPage(1)
      setIsSearching((preIsSearching) => preIsSearching + 1)
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">
                Quản lý đơn đăng ký tình nguyện viên #{volunteer?.volunteer_id}
              </div>
              <div className="header-title-sub-custom mt-1"></div>
              <div className="header-search-area">
                <CRow>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard label="Họ và tên" content={volunteer?.full_name} />
                  </CCol>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard label="Giới tính" content={volunteer?.gender} />
                  </CCol>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard
                      label="Ngày sinh"
                      content={moment(volunteer?.date_of_birth).format('DD/MM/YYYY')}
                    />
                  </CCol>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard label="Địa chỉ email" content={volunteer?.mail_address} />
                  </CCol>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard label="Số điện thoại" content={volunteer?.phone_number} />
                  </CCol>
                  <CCol md={6} sm={6} xs={12} className="mt-1 ">
                    <HeaderSubContentCard
                      label="Trạng thái thành viên"
                      content={volunteer?.is_member ? 'Đã đăng ký' : 'Chưa đăng ký'}
                    />
                  </CCol>
                  <CCol md={12} sm={12} xs={12} className="mt-1 ">
                    <CRow className="header-content-custom">
                      <CCol className="header-content-left" lg={2}>
                        Tiểu sử
                      </CCol>
                      <CCol className="header-content-right" lg={10}>
                        <CFormTextarea value={volunteer?.biography} readOnly />
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </div>
              <div className="header-search-area">
                <CRow>
                  <CCol md={4} sm={4} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="eventState"
                        value={searchCriteria.eventState}
                        onChange={handleSearchChange}
                      >
                        <option selected value={null}></option>
                        <option value={EventState.occurred.code}>
                          {EventState.occurred.display}
                        </option>
                        <option value={EventState.inProgress.code}>
                          {EventState.inProgress.display}
                        </option>
                        <option value={EventState.notOccurred.code}>
                          {EventState.notOccurred.display}
                        </option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái sự kiện</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol md={4} sm={4} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="applicationStatus"
                        value={searchCriteria.applicationStatus}
                        onChange={handleSearchChange}
                      >
                        <option value={null} selected></option>
                        <option value={EventApplyState.pending.code}>
                          {EventApplyState.pending.display}
                        </option>
                        <option value={EventApplyState.approved.code}>
                          {EventApplyState.approved.display}
                        </option>
                        <option value={EventApplyState.declined.code}>
                          {EventApplyState.declined.display}
                        </option>
                        <option value={EventApplyState.attended.code}>
                          {EventApplyState.attended.display}
                        </option>
                        <option value={EventApplyState.notAttended.code}>
                          {EventApplyState.notAttended.display}
                        </option>
                        <option value={EventApplyState.canceled.code}>
                          {EventApplyState.canceled.display}
                        </option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái đăng ký</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol md={4} sm={4} xs={12} className="mt-1">
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
                  <CCol lg={2} md={3} sm={4} xs={12} className="mb-2">
                    <CButton
                      type="submit"
                      color="primary"
                      className="main-btn w-100"
                      onClick={handleApproveBtnClick}
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
                  <CCol lg={8} md={6} sm={4}>
                    <CRow className="justify-content-end gap-2">
                      <CCol xl={2} lg={3} md={5} sm={12} xs={12}>
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

export default VolunteerDetailManagement
