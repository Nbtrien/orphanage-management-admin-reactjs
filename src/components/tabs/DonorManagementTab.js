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
  CFormLabel,
  CFormFloating,
  CFormInput,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { FaFileExport, FaUndoAlt } from 'react-icons/fa'
import donationService from 'src/api/services/donationService'
import numeral from 'numeral'
import publicService from 'src/api/services/publicService'
import DonorDetailModal from '../modals/DonorDetailModal'
import FileSaver from 'file-saver'
import ErrorModal from '../modals/ErrorModal'

const DonorManagementTab = () => {
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

  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  })
  const [isSearching, setIsSearching] = useState(1)

  const [donorDetailVisible, setDonorDetailVisible] = useState(false)
  const [donorDetailId, setDonorDetailId] = useState(null)
  const [downloadingState, setDownloadingState] = useState(false)
  const [errormodalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({
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
    const getDonations = async () => {
      try {
        const response = await donationApi.fetchDonors({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchCriteria.name && (params.name = searchCriteria.name)
      searchCriteria.email && (params.email = searchCriteria.email)
      searchCriteria.phoneNumber && (params.phoneNumber = searchCriteria.phoneNumber)
    }
    getDonations()
  }, [page, pagination, isSearching, changeCount])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'donor_id',
        title: '',
        render: (_, { donor_id }) => (
          <CFormCheck
            checked={checkedState[donor_id]}
            id="checkboxNoLabel"
            value={donor_id}
            aria-label="..."
            onChange={() => handleIdCBChange(donor_id)}
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
        key: 'donor_id',
        title: 'ID',
        sortable: true,
        render: (_, { donor_id }) => <>#{donor_id} </>,
      },

      {
        key: 'donor_full_name',
        title: 'Họ và tên',
        sortable: true,
      },
      {
        key: 'donor_date_of_birth',
        title: 'Ngày sinh',
        sortable: true,
        render: (_, { donor_date_of_birth }) => (
          <>{format(new Date(donor_date_of_birth), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'donor_mail_address',
        title: 'Địa chỉ email',
        sortable: true,
      },
      {
        key: 'donor_phone_number',
        title: 'Số điện thoại',
        sortable: true,
      },
      {
        key: 'stats',
        title: 'Số lượt tài trợ',
        sortable: true,
        render: (_, { stats }) => <>{stats?.count}</>,
      },
      {
        key: 'stats',
        title: 'Số tiền tài trợ',
        sortable: true,
        render: (_, { stats }) => (
          <span className="text-nowrap">{numeral(stats?.amount).format('0,0₫')} VND</span>
        ),
      },
      {
        key: 'donor_id',
        title: '',
        width: 200,
        render: (_, { donor_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => {
                    setDonorDetailId(donor_id)
                    setDonorDetailVisible(true)
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
    if (!searchCriteria.name && !searchCriteria.email && !searchCriteria.phoneNumber) {
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
      const response = await donationApi.exportDonorsToExcel()
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const currentDate = new Date()
      const formattedDate = format(currentDate, 'yyyyMMddHHmmss')
      const fileName = `donors-${formattedDate}.xlsx`

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
      <DonorDetailModal
        isVisible={donorDetailVisible}
        setVisible={setDonorDetailVisible}
        donorId={donorDetailId}
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
              <div className="header-title-custom">Danh sách nhà tài trợ</div>
              <div className="header-search-area">
                <CRow>
                  <CCol className="">
                    <CRow md={10}>
                      <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                        <CFormFloating>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="name"
                            value={searchCriteria.name}
                            onChange={handleSearchChange}
                          />
                          <CFormLabel
                            htmlFor="inputSearch"
                            className="label-floating-custom text-truncate"
                          >
                            Tìm kiếm tên
                          </CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                        <CFormFloating>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="email"
                            value={searchCriteria.email}
                            onChange={handleSearchChange}
                          />
                          <CFormLabel
                            htmlFor="inputSearch"
                            className="label-floating-custom text-truncate"
                          >
                            Tìm kiếm địa chỉ email
                          </CFormLabel>
                        </CFormFloating>
                      </CCol>
                      <CCol xl={4} lg={4} md={4} sm={6} xs={12} className="mt-1">
                        <CFormFloating>
                          <CFormInput
                            size="sm"
                            type="text"
                            name="phoneNumber"
                            value={searchCriteria.phoneNumber}
                            onChange={handleSearchChange}
                          />
                          <CFormLabel
                            htmlFor="inputSearch"
                            className="label-floating-custom text-truncate"
                          >
                            Tìm kiếm theo số điện thoại
                          </CFormLabel>
                        </CFormFloating>
                      </CCol>
                    </CRow>
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

export default DonorManagementTab
