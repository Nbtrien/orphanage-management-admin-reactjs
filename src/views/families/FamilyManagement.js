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
  CFormFloating,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import familyService from 'src/api/services/familyService'
import MotherForFamilyModal from 'src/components/modals/MotherForFamilyModal'

const FamilyManagement = () => {
  const familyApi = familyService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [deleteCount, setDeleteCount] = useState(0)

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
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: 'family_id',
    sortType: 'desc',
    page: 1,
  })
  const [familyConditions, setFamilyConditions] = useState([])
  const [isSearching, setIsSearching] = useState(0)
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    familyCondition: '',
    fromDate: '',
    toDate: '',
  })
  const [checkAllState, setCheckAllState] = useState(false)

  const [motherModalVisible, setMotherModalVisible] = useState(false)
  const [familySelected, setFamilySelected] = useState({
    familyId: null,
    familyName: '',
  })

  useEffect(() => {
    const getFamilyConditions = async () => {
      try {
        const response = await familyApi.getFamilyConditions()
        const result = response.result
        setFamilyConditions(result)
      } catch (error) {
        console.log(error)
      }
    }
    getFamilyConditions()
  }, [])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    // Fetch families data
    const fetchFamiliess = async () => {
      try {
        const response = await familyApi.getFamilies({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }
    const searchFamiliess = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.familyCondition && (params.familyCondition = searchCriteria.familyCondition)
        searchCriteria.fromDate && (params.fromDate = searchCriteria.fromDate)
        searchCriteria.toDate && (params.toDate = searchCriteria.toDate)
        const response = await familyApi.searchFamilies({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }
    if (isSearching) {
      searchFamiliess()
    } else {
      fetchFamiliess()
    }
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'family_id',
        title: '',
        render: (_, { family_id }) => (
          <CFormCheck
            checked={checkedState[family_id]}
            id="checkboxNoLabel"
            value={family_id}
            aria-label="..."
            onChange={() => handleIdCBChange(family_id)}
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
        key: 'family_id',
        title: 'ID',
        sortable: true,
        render: (_, { family_id }) => <>#{family_id}</>,
      },
      {
        key: 'family_name',
        title: 'Gia đình',
        sortable: true,
      },
      {
        key: 'mother',
        title: 'Bà mẹ',
        sortable: true,
        render: (_, { mother }) => <>{mother?.mother_name || '###'}</>,
      },

      {
        key: 'date_of_formation',
        title: 'Ngày thành lập',
        sortable: true,
        render: (_, { date_of_formation }) => (
          <>{format(new Date(date_of_formation), 'dd/MM/yyyy')}</>
        ),
      },
      {
        key: 'condition',
        title: 'Độ tuổi',
        sortable: true,
        render: (_, { condition }) => (
          <>
            {condition.age_from} - {condition.age_to}
          </>
        ),
      },
      {
        key: 'no_of_children',
        title: 'Số trẻ',
        sortable: true,
      },
      {
        key: 'family_id',
        title: '',
        width: 200,
        render: (_, { family_id, family_name, is_posted }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../families/${family_id}`}>
                  <CDropdownItem>Xem thông tin gia đình</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to={`./${family_id}/edit`}>
                  <CDropdownItem>Sửa thông tin</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => {
                    setFamilySelected({
                      familyId: family_id,
                      familyName: family_name,
                    })
                    setMotherModalVisible(true)
                  }}
                >
                  <CDropdownItem>Cập nhật thông tin bà mẹ</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  to={'../families/' + family_id + '/posts/create'}
                >
                  <CDropdownItem>Cập nhật bài viết cho gia đình</CDropdownItem>
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
      states[d.family_id] = false
    })
    setCheckedState(states)
  }, [data])

  useEffect(() => {
    // Update the pagination configuration based on the sortConfig values
    if (sortConfig.key) {
      if (sortConfig.key == 'month') {
        setPagination((prevPagination) => ({
          ...prevPagination,
          sortColumn: 'start_date',
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

  const deleteFamily = async (params) => {
    try {
      // Call the API to delete children with the provided parameters
      await familyApi.deleteFamily({ params })
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

  // Handle delete all when click delete all
  const handleDeleteAll = () => {
    setConfirmModalVisible(false)
    for (var key1 in checkedState) {
      if (checkedState[key1]) {
        const findedData = data.find((d) => d.family_id == key1)
        if (findedData.no_of_children > 0 || findedData.mother !== null) {
          setErrorModalMessage((prevModalError) => ({
            ...prevModalError,
            modalTile: 'Lỗi',
            modalContent:
              'Trẻ và bà mẹ vẫn ở trong gia đình, vui lòng xóa trẻ và bà mẹ khỏi gia đình trước khi thực hiện xóa gia đình.',
          }))
          setErrorModalVisible(true)
          return
        }
      }
    }
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
    deleteFamily(params)
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

  const handleSearchBtnClick = async (event) => {
    event.preventDefault()
    if (
      !searchCriteria.keyword &&
      !searchCriteria.familyCondition &&
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

  const handleMotherModalResult = (result) => {
    setFamilySelected({})
    setMotherModalVisible(false)
    if (result) {
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Cập nhật thành công',
      }))
      setSuccessModalVisible(true)
      setDeleteCount((prevDeleteCount) => prevDeleteCount + 1)
    } else {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Cập nhật không thành công',
      }))
      setErrorModalVisible(true)
    }
  }

  return (
    <>
      <MotherForFamilyModal
        familyId={familySelected.familyId}
        familyName={familySelected.familyName}
        isVisible={motherModalVisible}
        setVisible={setMotherModalVisible}
        handleResult={handleMotherModalResult}
      />
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
              <div className="header-title-custom">Quản lý thông tin gia đình</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="familyCondition"
                        value={searchCriteria.orphanType}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        {familyConditions.map((condition, index) => (
                          <option value={condition.family_condition_id} key={index}>
                            {condition.age_from + ' ~ ' + condition.age_to}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Độ tuổi</CFormLabel>
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
                        Từ ngày thành lập
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
                        Đến ngày thành lập
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
                    <CRow className="justify-content-start gap-2">
                      <CCol xl={4} lg={5} md={5} sm={10} xs={12}>
                        <CButton
                          type="submit"
                          color="primary"
                          className="main-btn w-100"
                          onClick={handleDeleteAllClick}
                        >
                          Xóa bỏ
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol lg={6} md={6} sm={8}>
                    <CRow className="justify-content-end gap-2">
                      <CCol xl={4} lg={5} md={6} sm={6} xs={12}>
                        <NavLink to="../families/create">
                          <CButton type="submit" color="primary" className="main-btn w-100">
                            Thêm mới
                          </CButton>
                        </NavLink>
                      </CCol>
                      <CCol xl={4} lg={5} md={5} sm={5} xs={12}>
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

export default FamilyManagement
