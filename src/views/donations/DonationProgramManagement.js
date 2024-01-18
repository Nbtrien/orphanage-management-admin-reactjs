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
  CForm,
  CFormLabel,
  CFormSelect,
  CFormFloating,
  CFormInput,
} from '@coreui/react'
import { Limits, Pagination } from 'src/constants/Pagination'
import { NavLink } from 'react-router-dom'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { FaFileExport, FaUndoAlt } from 'react-icons/fa'
import donationService from 'src/api/services/donationService'
import numeral from 'numeral'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import SuccessModal from 'src/components/modals/SuccessModal'

const DonationProgramManagement = () => {
  const donationApi = donationService()

  const [donationDetailVisible, setDonationDetailVisible] = useState(false)
  const [donationDetailId, setDonationDetailId] = useState(null)
  const [purposes, setPurposes] = useState([])

  const [isSearching, setIsSearching] = useState(1)
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    isActive: '1',
  })
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [stats, setStats] = useState()

  const [changeCount, setChangeCount] = useState(0)
  const [checkedState, setCheckedState] = useState({})
  const [reRenderCount, setReRenderCount] = useState(0)
  const [checkAllState, setCheckAllState] = useState(false)

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

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    const getDonationPurpose = async () => {
      try {
        const response = await donationApi.fetchDonationPurposes({ params })
        const result = response.result

        setData(result.records)
        setStats(result.stats)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    const searchDonationPurpose = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.isActive && (params.isActive = searchCriteria.isActive)
        const response = await donationApi.fetchDonationPurposes({ params })
        const result = response.result

        setData(result.records)
        setStats(result.stats)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchDonationPurpose()
    } else {
      getDonationPurpose()
    }
  }, [changeCount, page, pagination, isSearching])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'donation_purpose_id',
        title: '',
        render: (_, { donation_purpose_id }) => (
          <CFormCheck
            checked={checkedState[donation_purpose_id]}
            id="checkboxNoLabel"
            value={donation_purpose_id}
            aria-label="..."
            onChange={() => handleIdCBChange(donation_purpose_id)}
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
        key: 'donation_purpose_id',
        title: 'ID',
        sortable: true,
        render: (_, { donation_purpose_id }) => <>#{donation_purpose_id} </>,
      },

      {
        key: 'purpose',
        title: 'Chiến dịch',
        sortable: true,
      },
      {
        key: 'description',
        title: 'Chi tiết',
        sortable: true,
      },
      {
        key: 'stats',
        title: 'Số lượt tài trợ',
        render: (_, { stats }) => <>{stats.count}</>,
      },
      {
        key: 'stats',
        title: 'Số tiền tài trợ',
        sortable: true,
        render: (_, { stats }) => (
          <span className="text-nowrap">{numeral(stats.amount).format('0,0₫')} VND</span>
        ),
      },
      {
        key: 'stats',
        title: 'Số tiền tài trợ đã sử dụng',
        render: (_, { stats }) => (
          <span className="text-nowrap">{numeral(stats.used_amount).format('0,0₫')} VND</span>
        ),
      },
      {
        key: 'is_active',
        title: 'Trạng thái kêu gọi tài trợ',
        sortable: true,
        render: (_, { donation_purpose_id, is_active }) => (
          <>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <CFormCheck
                checked={is_active}
                id="checkboxwaitingadoption"
                aria-label="..."
                onChange={() => handleChangeActiveBtnClick(donation_purpose_id, is_active)}
              />
              <span>Đang kêu gọi tài trợ</span>
            </div>
          </>
        ),
      },
      {
        key: 'donation_purpose_id',
        title: '',
        width: 200,
        render: (_, { donation_purpose_id, is_posted }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => {
                    setDonationDetailId(donation_purpose_id)
                    setDonationDetailVisible(true)
                  }}
                >
                  <CDropdownItem>Xem chi tiết</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  to={'../donations/programs/' + donation_purpose_id}
                >
                  <CDropdownItem>Cập nhật bài viết cho chiến dịch</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]
    setColumns(columns1)
  }, [checkedState, reRenderCount, checkAllState])

  const handleChangeActive = async (id) => {
    setConfirmModalVisible(false)
    try {
      await donationApi.updateDonationPurposeStatus(id)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thay đổi trạng thái thành công',
      }))
      setSuccessModalVisible(true)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
      console.log(error)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleChangeActiveBtnClick = (id, isActive) => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Bạn muốn thay đổi trạng thái!',
    }))
    setConfirmAction(() => () => handleChangeActive(id))
    setConfirmModalVisible(true)
  }

  const handleConfirmBtnClick = () => {
    if (confirmAction) {
      confirmAction()
    }
  }

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
    setReRenderCount((ReRenderCount) => ReRenderCount + 1)
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
  useEffect(() => {
    // Update the pagination configuration based on the sortConfig values
    if (sortConfig.key) {
      if (sortConfig.key == 'stats') {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: 'donationPurposeId',
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    })
  }

  const handleSearchBtnClick = (event) => {
    event.preventDefault()
    if (!searchCriteria.keyword && !searchCriteria.isActive) {
      setPage(1)
      setIsSearching((preIsSearching) => preIsSearching + 1)
    } else {
      setPage(1)
      setIsSearching((preIsSearching) => preIsSearching + 1)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage)
    }
  }

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <>
      <ConfirmModal
        modalMessage={confirmModalMessage}
        isVisible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        handleConfirmBtnClick={handleConfirmBtnClick}
      />
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      />
      <SuccessModal
        modalMessage={successModalMessage}
        isVisible={successModalVisible}
        setVisible={setSuccessModalVisible}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Chiến dịch tài trợ</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="isActive"
                        value={searchCriteria.isActive}
                        onChange={handleSearchChange}
                      >
                        <option value={null} selected></option>
                        <option value={1}>Đang kêu gọi tài trợ</option>
                        <option value={0}>Tạm ngưng kêu gọi</option>
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Trạng thái kêu gọi</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput size="sm" type="date" name="fromDate" />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Từ ngày tài trợ
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput size="sm" type="date" name="toDate" />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Đến ngày tài trợ
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
                  <CCol lg={6} md={7} sm={12}></CCol>
                  <CCol lg={6} md={5} sm={12}>
                    <CRow className="justify-content-end">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <NavLink to={'../donations/programs/create'}>
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
                          onClick={() => setChangeCount((prevChangeCount) => prevChangeCount + 1)}
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

export default DonationProgramManagement
