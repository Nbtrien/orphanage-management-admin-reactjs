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
  CWidgetStatsF,
  CHeaderDivider,
  CCallout,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCreditCard, cilMoney } from '@coreui/icons'
import { Limits, Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { FaDonate, FaFileExport, FaHouseUser, FaUndoAlt } from 'react-icons/fa'
import donationService from 'src/api/services/donationService'
import numeral from 'numeral'
import publicService from 'src/api/services/publicService'
import { DonationPurpose } from 'src/constants/DonationCode'
import DonationUsingModal from 'src/components/modals/DonationUsingModal'
import DonationUsingForFamilyModal from 'src/components/modals/DonationUsingForFamilyModal'
import DonationDetailModal from 'src/components/modals/DonationDetailModal'
import LoadingModal from 'src/components/modals/LoadingModal'

const DonationManagement = () => {
  const donationApi = donationService()
  const publicApi = publicService()
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
  const [loadingModalVisible, setLoadingModalVisible] = useState(false)
  const [donationUsingModalVisible, setDonationUsingModalVisible] = useState(false)
  const [donationUsingId, setDonationUsingId] = useState(null)
  const [donationUsingFamilyId, setDonationUsingFamilyId] = useState(null)
  const [availableAmount, setAvailableAmount] = useState('')

  const [donationUsingFamilyModalVisible, setDonationUsingFamilyModalVisible] = useState(false)

  const [donationDetailVisible, setDonationDetailVisible] = useState(false)
  const [donationDetailId, setDonationDetailId] = useState(null)

  const [purpose, setPurpose] = useState()
  const [purposes, setPurposes] = useState([])

  const [isSearching, setIsSearching] = useState(1)
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    status: '0',
    fromDate: '',
    toDate: '',
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

  useEffect(() => {
    const getDonationPurposes = async () => {
      try {
        const response = await publicApi.getDonationPurposes()
        const result = response.result
        setPurpose(result[0])
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
        const response = await donationApi.getDonationsUsableByPurpose(
          purpose?.donation_purpose_id,
          { params },
        )
        const result = response.result

        setData(result.records)
        setStats(result.stats)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }
    purpose?.donation_purpose_id && getDonations()
  }, [changeCount, page, pagination, isSearching, purpose])

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
        key: 'remaining_amount',
        title: 'Số tiền khả dụng',
        sortable: true,
        render: (_, { remaining_amount }) => (
          <span className="text-nowrap">{numeral(remaining_amount).format('0,0₫')} VND</span>
        ),
      },
      {
        key: 'donation_time',
        title: 'Ngày tài trợ',
        sortable: true,
        render: (_, { donation_time }) => <>{format(new Date(donation_time), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'family',
        title: 'Gia đình',
        sortable: true,
        render: (_, { family }) => <>{family?.family_name || '###'}</>,
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
        render: (_, { donation_id, remaining_amount, family }) => (
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
                <NavLink
                  className="text-nodecorate"
                  onClick={() => {
                    setDonationUsingId(donation_id)
                    setDonationUsingFamilyId(family?.family_id || null)
                    setAvailableAmount(remaining_amount)
                    setDonationUsingModalVisible(true)
                  }}
                >
                  <CDropdownItem>
                    {family?.family_id ? 'Phân bổ đến gia đình' : 'Sử dụng nguồn tài trợ'}
                  </CDropdownItem>
                </NavLink>
                {purpose?.donation_purpose_id == DonationPurpose.default.code && (
                  <NavLink
                    className="text-nodecorate"
                    onClick={() => {
                      setDonationUsingId(donation_id)
                      setAvailableAmount(remaining_amount)
                      setDonationUsingFamilyModalVisible(true)
                    }}
                  >
                    <CDropdownItem>Phân bổ đến gia đình</CDropdownItem>
                  </NavLink>
                )}
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]
    setColumns(columns1)
  }, [checkedState, reRenderCount, checkAllState, purpose])

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

  const handlePurposeChange = (e) => {
    setPurpose(purposes.find((p) => p.donation_purpose_id == e.target.value))
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
  const handleLimitChange = (value) => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      limit: value,
      page: 1,
    }))
    setPage(1)
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

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  const handleDonationUsageBtnClick = () => {
    setDonationUsingId(null)
    setAvailableAmount(stats?.remaining_amount)
    setDonationUsingModalVisible(true)
  }

  const handleAsignDonationToFamilyBtnClick = () => {
    setDonationUsingId(null)
    setAvailableAmount(stats?.remaining_amount)
    setDonationUsingFamilyModalVisible(true)
  }

  const handleCloseDonationUsingModal = () => {
    setDonationUsingModalVisible(false)
    setDonationUsingId(null)
    setDonationUsingFamilyId(null)
  }

  const handleCloseDonationUsingFamilyModal = () => {
    setDonationUsingFamilyModalVisible(false)
    setDonationUsingId(null)
  }

  const handleUsingDonation = async (purposeId, amount, note, donationId, familyId) => {
    setDonationUsingModalVisible(false)
    setDonationUsingFamilyModalVisible(false)
    setLoadingModalVisible(true)
    const requestData = {
      purpose_id: purposeId,
      amount: amount,
      note: note,
      family_id: familyId,
    }
    try {
      if (donationId) {
        await donationApi.useDonationById(donationId, JSON.stringify(requestData))
        setLoadingModalVisible(false)
      } else {
        await donationApi.useDonationByPurpose(purposeId, JSON.stringify(requestData))
        setLoadingModalVisible(false)
      }
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Sử dụng tài trợ thành công',
      }))
      setSuccessModalVisible(true)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
      console.log(error)
      setLoadingModalVisible(false)
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      }))
      setErrorModalVisible(true)
    }
  }
  return (
    <>
      <LoadingModal
        isVisible={loadingModalVisible}
        setVisible={setLoadingModalVisible}
      ></LoadingModal>
      <ConfirmModal
        modalMessage={confirmModalMessage}
        isVisible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        // handleConfirmBtnClick={handleConfirmBtnClick}
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
      <DonationUsingModal
        isVisible={donationUsingModalVisible}
        setVisible={handleCloseDonationUsingModal}
        remainingAmount={availableAmount}
        purpose={purpose?.purpose}
        purposeId={purpose?.donation_purpose_id}
        handleSaveBtnClick={handleUsingDonation}
        donationId={donationUsingId}
        familyId={donationUsingFamilyId}
      ></DonationUsingModal>
      <DonationUsingForFamilyModal
        isVisible={donationUsingFamilyModalVisible}
        setVisible={handleCloseDonationUsingFamilyModal}
        remainingAmount={availableAmount}
        purpose={purpose?.purpose}
        purposeId={purpose?.donation_purpose_id}
        handleSaveBtnClick={handleUsingDonation}
        donationId={donationUsingId}
      ></DonationUsingForFamilyModal>
      <DonationDetailModal
        isVisible={donationDetailVisible}
        setVisible={setDonationDetailVisible}
        donationId={donationDetailId}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Sử dụng nguồn tài trợ / {purpose?.purpose}</div>
              <CRow className="mt-3">
                <CCol xs={12} sm={6} lg={3} className="mb-3">
                  <div className="card widget-custom h-100">
                    <div className="card-body d-flex align-items-center false">
                      <CFormFloating className="b-0">
                        <CFormSelect
                          className="col-form-label custom-select-floating border-0"
                          aria-label="Large select example"
                          name="purpose"
                          value={purpose?.donation_purpose_id}
                          onChange={handlePurposeChange}
                        >
                          {purposes.length > 0 &&
                            purposes.map((purp, index) => (
                              <option value={purp.donation_purpose_id} key={index}>
                                {purp.purpose}
                              </option>
                            ))}
                        </CFormSelect>
                        <CFormLabel htmlFor="inputStatus">Chiến dịch tài trợ</CFormLabel>
                      </CFormFloating>
                    </div>
                  </div>
                </CCol>
                <CCol xs={12} sm={6} lg={3} className="mb-3">
                  <CWidgetStatsF
                    className="widget-custom  h-100 widget-content"
                    icon={<CIcon width={20} icon={cilMoney} size="lg" />}
                    title="Tổng số tiền tài trợ"
                    value={numeral(stats?.amount).format('0,0₫') + ' VND'}
                    color="info"
                  />
                </CCol>
                <CCol xs={12} sm={6} lg={3} className="mb-3">
                  <CWidgetStatsF
                    className="widget-custom h-100 widget-content"
                    icon={<CIcon width={20} icon={cilMoney} size="lg" />}
                    title="Số tiền đã sử dụng"
                    value={numeral(stats?.used_amount).format('0,0₫') + ' VND'}
                    color="info"
                  />
                </CCol>
                <CCol xs={12} sm={6} lg={3} className="mb-3">
                  <CWidgetStatsF
                    className="widget-custom h-100 widget-content"
                    icon={<CIcon width={20} icon={cilCreditCard} size="lg" />}
                    title="Số tiền chưa sử dụng"
                    value={numeral(stats?.remaining_amount).format('0,0₫') + ' VND'}
                    color="info"
                  />
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <div className="body-btn-group mb-2">
                <CRow className="justify-content-between">
                  <CCol lg={6} md={7} sm={12}>
                    <CRow>
                      <CCol lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100 btn-content"
                          disabled={
                            !stats?.remaining_amount ||
                            purpose.donation_purpose_id == DonationPurpose.familyDonate.code
                          }
                          onClick={handleDonationUsageBtnClick}
                          title="Sử dụng tài trợ"
                        >
                          Sử dụng tài trợ
                        </CButton>
                      </CCol>
                      <CCol lg={7} md={6} sm={6} xs={12} className="mb-2">
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100 btn-content"
                          onClick={handleAsignDonationToFamilyBtnClick}
                          disabled={
                            !stats?.remaining_amount ||
                            (purpose.donation_purpose_id != DonationPurpose.familyDonate.code &&
                              purpose.donation_purpose_id != DonationPurpose.default.code)
                          }
                        >
                          Phân bổ đến gia đình
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>

                  <CCol lg={6} md={5} sm={12}>
                    <CRow className="justify-content-end">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100 btn-content"
                          onClick={() => setChangeCount((prevChangeCount) => prevChangeCount + 1)}
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

export default DonationManagement
