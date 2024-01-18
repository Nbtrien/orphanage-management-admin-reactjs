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
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import donationService from 'src/api/services/donationService'
import numeral from 'numeral'
import publicService from 'src/api/services/publicService'
import DonationDetailModal from '../modals/DonationDetailModal'
import FileSaver from 'file-saver'
import ErrorModal from '../modals/ErrorModal'

const DonationHistoryTab = () => {
  const donationApi = donationService()
  const publicApi = publicService()
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
  const [changeCount, setChangeCount] = useState(0)
  const [checkedState, setCheckedState] = useState({})
  const [reRenderCount, setReRenderCount] = useState(0)
  const [checkAllState, setCheckAllState] = useState(false)
  const [purposes, setPurposes] = useState([])

  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    purposeId: '',
    fromDate: '',
    toDate: '',
  })
  const [isSearching, setIsSearching] = useState(1)

  const [donationDetailVisible, setDonationDetailVisible] = useState(false)
  const [donationDeailId, setDonationDetailId] = useState(null)
  const [downloadingState, setDownloadingState] = useState(false)
  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
    modalTile: '',
    modalContent: '',
  })

  useEffect(() => {
    const getDonationPurposes = async () => {
      try {
        const response = await publicApi.getDonationPurposes()
        const result = response.result
        setPurposes(result)
      } catch (error) {
        console.log(error)
      }
    }
    getDonationPurposes()
  }, [])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    const getDonations = async () => {
      try {
        const response = await donationApi.fetchDonations({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
      searchCriteria.purposeId && (params.purposeId = searchCriteria.purposeId)
      searchCriteria.fromDate && (params.fromDate = searchCriteria.fromDate)
      searchCriteria.toDate && (params.toDate = searchCriteria.toDate)
    }
    getDonations()
  }, [page, pagination, isSearching, changeCount])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'donation_id',
        title: '',
        render: (_, { donation_id }) => (
          <CFormCheck
            checked={checkedState[donation_id]}
            id="checkboxNoLabel"
            value={donation_id}
            aria-label="..."
            onChange={() => handleIdCBChange(donation_id)}
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
        key: 'donation_id',
        title: 'ID',
        sortable: true,
        render: (_, { donation_id }) => <>#{donation_id} </>,
      },

      {
        key: 'donor_name',
        title: 'Người tài trợ',
        sortable: true,
      },
      {
        key: 'amount',
        title: 'Số tiền',
        sortable: true,
        render: (_, { amount }) => (
          <span className="text-nowrap">{numeral(amount).format('0,0₫')} VND</span>
        ),
      },
      {
        key: 'donation_time',
        title: 'Ngày tài trợ',
        sortable: true,
        render: (_, { donation_time }) => <>{format(new Date(donation_time), 'dd/MM/yyyy')}</>,
      },

      {
        key: 'purpose',
        title: 'Chiến dịch tài trợ',
        sortable: true,
        render: (_, { purpose }) => <>{purpose?.purpose}</>,
      },
      {
        key: 'donation_message',
        title: 'Lời nhắn',
        sortable: true,
      },
      {
        key: 'donation_id',
        title: '',
        width: 200,
        render: (_, { donation_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => {
                    setDonationDetailId(donation_id)
                    setDonationDetailVisible(true)
                  }}
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
  }, [checkedState, reRenderCount, checkAllState])

  useEffect(() => {
    // Update the pagination configuration based on the sortConfig values
    if (sortConfig.key) {
      if (sortConfig.key == 'donor_name') {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: 'donor',
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
      for (var key1 in checkedState) {
        checkedState[key1] = true
      }
    }
    setCheckAllState(!checkAllState)
  }

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
    if (
      !searchCriteria.keyword &&
      !searchCriteria.purposeId &&
      !searchCriteria.fromDate &&
      !searchCriteria.toDate
    ) {
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

  const handleExportBtnClick = async () => {
    setDownloadingState(true)
    try {
      const response = await donationApi.exportDonationsToExcel()
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const currentDate = new Date()
      const formattedDate = format(currentDate, 'yyyyMMddHHmmss')
      const fileName = `donations-${formattedDate}.xlsx`

      FileSaver.saveAs(blob, fileName)
      setDownloadingState(false)
    } catch (error) {
      console.log(error)
      setDownloadingState(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }
  return (
    <>
      <DonationDetailModal
        isVisible={donationDetailVisible}
        setVisible={setDonationDetailVisible}
        donationId={donationDeailId}
      />
      <ErrorModal
        modalMessage={errorModalMessage}
        isVisible={errormodalVisible}
        setVisible={setErrorModalVisible}
      ></ErrorModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Lịch sử tài trợ</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="purposeId"
                        value={searchCriteria.purposeId}
                        onChange={handleSearchChange}
                      >
                        <option selected></option>
                        {purposes.length > 0 &&
                          purposes.map((purp, index) => (
                            <option value={purp.donation_purpose_id} key={index}>
                              {purp.purpose}
                            </option>
                          ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Chiến dịch tài trợ</CFormLabel>
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
                        Từ ngày tài trợ
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
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100 btn-content"
                          onClick={handleExportBtnClick}
                          disabled={downloadingState}
                        >
                          Xuất excel
                        </CButton>
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

export default DonationHistoryTab
