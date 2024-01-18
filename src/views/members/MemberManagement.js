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
import moment from 'moment'
import accountService from 'src/api/services/accountService'
import { findAccountStatusByCode, AccountStatus } from 'src/constants/AccountStatus'

const MemberManagement = () => {
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
  const [categories, setCategories] = useState([])

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
    keyword: '',
    accountType: '',
    accountStatus: '',
  })

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    const getAccounts = async () => {
      const response = await accountApi.fetchAccounts({ params })
      const result = response.result

      setData(result.records)
      setPage(result.page)
      setTotalPage(result.totalPage)
    }

    const searchAccounts = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.accountStatus && (params.accountStatus = searchCriteria.accountStatus)
        searchCriteria.accountType && (params.accountType = searchCriteria.accountType)

        const response = await accountApi.fetchAccounts({ params })
        const result = response.result
        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchAccounts()
    } else {
      getAccounts()
    }
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    const columns1 = [
      {
        key: 'account_id',
        title: '',
        render: (_, { account_id }) => (
          <CFormCheck
            checked={checkedState[account_id]}
            id="checkboxNoLabel"
            value={account_id}
            aria-label="..."
            onChange={() => handleIdCBChange(account_id)}
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
        key: 'account_id',
        title: 'ID',
        sortable: true,
        render: (_, { account_id }) => <>#{account_id}</>,
      },
      {
        key: 'applicant_full_name',
        title: 'Họ và tên',
        sortable: true,
      },
      {
        key: 'account_mail_address',
        title: 'Địa chỉ email',
        sortable: true,
      },
      {
        key: 'applicant_phone_number',
        title: 'Số điện thoại',
        sortable: true,
      },
      {
        key: 'register_date_time',
        title: 'Thời gian đăng ký tài khoản',
        sortable: true,
        render: (_, { register_date_time }) => (
          <div>{moment(register_date_time).format('DD/MM/YYYY hh:mm')}</div>
        ),
      },
      {
        key: 'volunteer_id',
        title: 'Trạng thái Tình nguyện viên',
        sortable: true,
        render: (_, { volunteer_id }) => (
          <>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <CFormCheck
                checked={volunteer_id}
                id="checkboxwaitingadoption"
                aria-label="..."
                onClick={(e) => {
                  e.preventDefault()
                }}
              />
              <span>Tình nguyện viên</span>
            </div>
          </>
        ),
      },
      {
        key: 'volunteer_id',
        title: 'Trạng thái Nhà tài trợ',
        sortable: true,
        render: (_, { donor_id }) => (
          <>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <CFormCheck
                checked={donor_id}
                id="checkboxwaitingadoption"
                aria-label="..."
                onClick={(e) => {
                  e.preventDefault()
                }}
              />
              <span>Nhà tài trợ</span>
            </div>
          </>
        ),
      },
      {
        key: 'account_status',
        title: 'Trạng thái tài khoản',
        sortable: true,
        render: (_, { account_status }) => {
          const foundStatus = findAccountStatusByCode(account_status)
          return (
            <>
              <i>{foundStatus.display}</i>
            </>
          )
        },
      },
      {
        key: 'account_id',
        title: '',
        width: 200,
        render: (_, { account_id, volunteer_id, donor_id, account_status }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className={
                    volunteer_id ? 'text-nodecorate' : 'text-nodecorate dropdown-item-disabled'
                  }
                  to={`../volunteers/${volunteer_id}/management`}
                >
                  <CDropdownItem>Xem lịch sử tình nguyện</CDropdownItem>
                </NavLink>
                <NavLink
                  className={
                    donor_id ? 'text-nodecorate' : 'text-nodecorate dropdown-item-disabled'
                  }
                  to="#"
                >
                  <CDropdownItem>Xem lịch sử tài trợ</CDropdownItem>
                </NavLink>
                {account_status === AccountStatus.active.code ? (
                  <>
                    <NavLink
                      className={'text-nodecorate'}
                      onClick={() =>
                        handleUpdateStatusBtnClick(account_id, AccountStatus.locked.code)
                      }
                    >
                      <CDropdownItem>Khóa tài khoản</CDropdownItem>
                    </NavLink>
                  </>
                ) : (
                  account_status === AccountStatus.locked.code && (
                    <>
                      <NavLink
                        className={'text-nodecorate'}
                        onClick={() =>
                          handleUpdateStatusBtnClick(account_id, AccountStatus.active.code)
                        }
                      >
                        <CDropdownItem>Mở khóa tài khoản</CDropdownItem>
                      </NavLink>
                    </>
                  )
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
      states[d.account_id] = false
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

  const hiddenArticles = async (id) => {
    setConfirmModalVisible(false)
    try {
      //   await articleApi.hideArticles(id)
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã ẩn bài viết thành công',
      }))
      setSuccessModalVisible(true)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      }))
      setErrorModalVisible(true)
    }
  }

  const updateAccountStatus = async (id, status) => {
    setConfirmModalVisible(false)
    try {
      await accountApi.updateAccountStatus(id, status)
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Cập nhật trạng thái thành công',
      }))
      setSuccessModalVisible(true)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } catch (error) {
      // Set error modal message and make it visible
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleUpdateStatusBtnClick = (id, status) => {
    if (status === AccountStatus.locked.code) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Bạn muốn khóa tài khoản này!',
      }))
      setConfirmAction(() => () => updateAccountStatus(id, status))
      setConfirmModalVisible(true)
    } else if (status === AccountStatus.active.code) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Bạn muốn mở khóa tài khoản này!',
      }))
      setConfirmAction(() => () => updateAccountStatus(id, status))
      setConfirmModalVisible(true)
    }
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
    if (!searchCriteria.keyword && !searchCriteria.accountStatus && !searchCriteria.accountType) {
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
              <div className="header-title-custom">Danh sách thành viên</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="accountStatus"
                        value={searchCriteria.accountStatus}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        <option value={AccountStatus.pending.code}>
                          {AccountStatus.pending.display}
                        </option>
                        <option value={AccountStatus.active.code}>
                          {AccountStatus.active.display}
                        </option>
                        <option value={AccountStatus.locked.code}>
                          {AccountStatus.locked.display}
                        </option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái tài khoản</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="accountType"
                        value={searchCriteria.accountType}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        <option value={1}>Tình nguyện viên</option>
                        <option value={2}>Nhà tài trợ</option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Loại tài khoản</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
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
                  <CCol lg={6} md={6} sm={4} xs={12}>
                    <CRow className="justify-content-start">
                      <CCol xl={4} lg={5} md={5} sm={12} xs={12} className="mb-2"></CCol>
                    </CRow>
                  </CCol>
                  <CCol lg={6} md={6} sm={8}>
                    <CRow className="justify-content-end">
                      <CCol xl={5} lg={5} md={6} sm={6} xs={12} className="mb-2"></CCol>
                      <CCol xl={4} lg={5} md={5} sm={6} xs={12} className="mb-2">
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

export default MemberManagement
