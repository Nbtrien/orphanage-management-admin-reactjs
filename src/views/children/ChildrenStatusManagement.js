import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCol,
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
  CFormCheck,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import CustomAvatar from 'src/components/rows/CustomAvatar'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import FamilyForChildrenModal from 'src/components/modals/FamilyForChildrenModal'
import { ChildrenStatus } from 'src/constants/ChildrenCode'

const ChildrenStatusManagement = () => {
  const childrenApi = childrenService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [changeCount, setChangeCount] = useState(0)

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
  const [familyModalVisible, setFamilyModalVisible] = useState(false)
  const [familyChildrenId, setFamilyChildrenId] = useState()
  const [familyChildrenName, setFamilyChildrenName] = useState()
  const [modalFamilyId, setModalFamilyId] = useState()

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })

  const [statusArr, setStatusArr] = useState([])

  const [isSearching, setIsSearching] = useState(1)
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    status: '1',
    minDateOfAdmission: '',
    maxDateOfAdmission: '',
  })

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    // Fetch children data
    const fetchChildren = async () => {
      try {
        const response = await childrenApi.getAllChildrenStatus({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    // search children data
    const searchChildren = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.status && (params.status = searchCriteria.status)
        searchCriteria.minDateOfAdmission &&
          (params.minDateOfAdmission = searchCriteria.minDateOfAdmission)
        searchCriteria.maxDateOfAdmission &&
          (params.maxDateOfAdmission = searchCriteria.maxDateOfAdmission)

        const response = await childrenApi.searchChildrenStatus({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchChildren()
    } else {
      fetchChildren()
    }
  }, [changeCount, page, pagination, isSearching])

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await childrenApi.getChildrenStatus()
        setStatusArr(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatus()
  }, [])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'children_id',
        title: '',
        render: (_, { children_id }) => (
          <CFormCheck
            checked={checkedState[children_id]}
            id="checkboxNoLabel"
            value={children_id}
            aria-label="..."
            onChange={() => handleIdCBChange(children_id)}
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
        key: 'children_id',
        title: 'ID',
        sortable: true,
        render: (_, { children_id }) => <>#{children_id}</>,
      },
      {
        key: 'children_full_name',
        title: 'Họ và tên',
        sortable: true,
        render: (_, { children_full_name, image_url }) => (
          <>
            <div className="clearfix align-content-center align-items-center d-flex justify-content-start text-nowrap">
              <CustomAvatar src={image_url} size="md" />
              {children_full_name}
            </div>
          </>
        ),
      },
      {
        key: 'children_date_of_birth',
        title: 'Ngày sinh',
        sortable: true,
        render: (_, { children_date_of_birth }) => (
          <>{format(new Date(children_date_of_birth), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'date_of_admission',
        title: 'Ngày tiếp nhận',
        sortable: true,
        render: (_, { date_of_admission }) => (
          <>{format(new Date(date_of_admission), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'family_name',
        title: 'Gia đình',
        sortable: true,
      },
      {
        key: 'mother_name',
        title: 'Bà mẹ quản lý',
        sortable: true,
      },
      {
        key: 'children_status',
        title: 'Trạng thái',
        sortable: true,
      },
      {
        key: 'is_waiting_adoption',
        title: 'Trạng thái nhận nuôi',
        sortable: true,
        render: (_, { children_id, children_status_id, is_waiting_adoption }) => (
          <>
            {children_status_id == ChildrenStatus.inCare.code ? (
              <div className="d-flex justify-content-start align-items-center gap-2">
                <CFormCheck
                  checked={is_waiting_adoption}
                  id="checkboxwaitingadoption"
                  aria-label="..."
                  onChange={() =>
                    handleChangeAwaitingAdoptionBtnClick(children_id, is_waiting_adoption)
                  }
                />
                <span>Đang chờ nhận nuôi.</span>
              </div>
            ) : (
              '###'
            )}
          </>
        ),
      },

      {
        key: 'children_id',
        title: '',
        width: 200,
        render: (
          _,
          { children_id, family_id, children_full_name, is_change_status, children_status_id },
        ) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../children/${children_id}`}>
                  <CDropdownItem>Xem hồ sơ</CDropdownItem>
                </NavLink>
                {is_change_status ? (
                  <>
                    <NavLink
                      className="text-nodecorate"
                      to={`../children/${children_id}/update-status`}
                    >
                      <CDropdownItem>Cập nhật trạng thái</CDropdownItem>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="text-nodecorate dropdown-item-disabled"
                      onClick={(event) => event.preventDefault()}
                    >
                      <CDropdownItem>Cập nhật trạng thái</CDropdownItem>
                    </NavLink>
                  </>
                )}
                {children_status_id == ChildrenStatus.inCare.code && (
                  <>
                    <NavLink
                      className="text-nodecorate"
                      to={`../adoption-history/create?childrenId=${children_id}`}
                    >
                      <CDropdownItem>Cập nhật nhận nuôi</CDropdownItem>
                    </NavLink>
                  </>
                )}

                <NavLink
                  className="text-nodecorate"
                  onClick={() =>
                    handleUpdateFamilyBtnClick(children_id, family_id, children_full_name)
                  }
                >
                  <CDropdownItem>Cập nhật gia đình</CDropdownItem>
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
      states[d.children_id] = false
    })
    setCheckedState(states)
  }, [data])

  useEffect(() => {
    // Update the pagination configuration based on the sortConfig values
    if (sortConfig.key) {
      let key = sortConfig.key
      if (sortConfig.key == 'family_name' || sortConfig.key == 'mother_name') {
        key = 'family'
      }

      setPagination((prevPagination) => ({
        ...prevPagination,
        sortColumn: key,
        sortType: sortConfig.direction,
      }))
    }
  }, [sortConfig])

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  const handleChangeAwaitingAdoptionStatus = async (childrenId, waitingStatus) => {
    setConfirmModalVisible(false)
    try {
      await childrenApi.updateAdoptionStatus(childrenId, !waitingStatus)
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

  const handleChangeAwaitingAdoptionBtnClick = (childrenId, waitingStatus) => {
    setConfirmModalMessage((prevModalMessage) => ({
      ...prevModalMessage,
      modalTile: 'Xác nhận',
      modalContent: 'Bạn muốn thay đổi trạng thái nhận nuôi!',
    }))
    setConfirmAction(() => () => handleChangeAwaitingAdoptionStatus(childrenId, waitingStatus))
    setConfirmModalVisible(true)
  }

  const handleIdCBChange = (id) => {
    let newStates = checkedState
    newStates[id] = !newStates[id]
    setCheckedState(newStates)
    setReRender(!isReRender)
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage)
    }
  }

  const handleUpdateFamilyBtnClick = (childrenId, familyId, childrenName) => {
    setFamilyChildrenId(childrenId)
    setFamilyChildrenName(childrenName)
    setModalFamilyId(familyId)
    setFamilyModalVisible(true)
  }

  const handleFamilyModalBtnCloseClick = () => {
    setFamilyChildrenId()
    setFamilyChildrenName()
    setModalFamilyId()
    setFamilyModalVisible(false)
  }
  const handleFamilyModalResult = (result) => {
    setFamilyChildrenId()
    setFamilyChildrenName()
    setModalFamilyId()
    setFamilyModalVisible(false)
    if (result) {
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Cập nhật thành công',
      }))
      setSuccessModalVisible(true)
      setChangeCount((prevCount) => prevCount + 1)
    } else {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Cập nhật không thành công',
      }))
      setErrorModalVisible(true)
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
      !searchCriteria.minDateOfAdmission &&
      !searchCriteria.maxDateOfAdmission
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
      <FamilyForChildrenModal
        childrenId={familyChildrenId}
        familyId={modalFamilyId}
        childrenName={familyChildrenName}
        isVisible={familyModalVisible}
        setVisible={handleFamilyModalBtnCloseClick}
        handleResult={handleFamilyModalResult}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Quản lý tình trạng trẻ em</div>
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
                        {statusArr.map((state, index) => (
                          <option value={state.children_status_id} key={index}>
                            {state.children_status_name}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Hoàn cảnh</CFormLabel>
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
                        Từ ngày tiếp nhận
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
                        Đến ngày tiếp nhận
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
                  <CCol lg={6} md={6} sm={4} xs={12} className="mb-2">
                    <CRow className="justify-content-start gap-2"></CRow>
                  </CCol>
                  <CCol lg={6} md={6} sm={8}>
                    <CRow className="justify-content-end gap-2">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12}>
                        <NavLink to="../children/create">
                          <CButton type="submit" color="primary" className="main-btn w-100">
                            Thêm trẻ
                          </CButton>
                        </NavLink>
                      </CCol>
                      <CCol xl={4} lg={5} md={5} sm={5} xs={12}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100"
                          onClick={() => setChangeCount((prevCount) => prevCount + 1)}
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

export default ChildrenStatusManagement
