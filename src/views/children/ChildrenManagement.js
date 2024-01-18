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
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFloating,
  CCardTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { Limits, Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import RelativeModal from 'src/components/modals/RelativeModal'
import CustomAvatar from 'src/components/rows/CustomAvatar'
import { FaUndoAlt } from 'react-icons/fa'

const ChildrenManagement = () => {
  const childrenApi = childrenService()

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

  const [relativeModalVisible, setRelativeModalVisible] = useState(false)
  const [relativeChildrenId, setRelativeChildrenId] = useState('')

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [isSearching, setIsSearching] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })

  const [orphanTypes, setOrphanTypes] = useState([])
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    orphanType: '',
    minAge: '',
    maxAge: '',
  })

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
      status: 1,
    }
    // Fetch children data
    const fetchChildren = async () => {
      try {
        const response = await childrenApi.getChildrens({ params })
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
        searchCriteria.orphanType && (params.orphanType = searchCriteria.orphanType)
        searchCriteria.minAge && (params.minAge = searchCriteria.minAge)
        searchCriteria.maxAge && (params.maxAge = searchCriteria.maxAge)

        const response = await childrenApi.searchChildren({ params })
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
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    const getOrphanTypes = async () => {
      try {
        const response = await childrenApi.getOrphantypes()
        setOrphanTypes(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getOrphanTypes()
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
        key: 'children_gender',
        title: 'Giới tính',
        sortable: true,
      },
      {
        key: 'address',
        title: 'Địa chỉ',
        sortable: true,
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
        key: 'orphan_type',
        title: 'Hoàn cảnh',
        sortable: true,
      },

      {
        key: 'children_id',
        title: '',
        width: 200,
        render: (_, { children_id, children_full_name }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../children/${children_id}`}>
                  <CDropdownItem>Xem hồ sơ</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to={`../children/${children_id}/edit`}>
                  <CDropdownItem>Sửa thông tin trẻ</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  to={`../relatives/create?childrenId=${children_id}&childrenName=${children_full_name}`}
                >
                  <CDropdownItem>Thêm người thân</CDropdownItem>
                </NavLink>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => handleViewRelativeBtnClick(children_id)}
                >
                  <CDropdownItem>Xem thông tin người thân</CDropdownItem>
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
      setPagination((prevPagination) => ({
        ...prevPagination,
        sortColumn: sortConfig.key,
        sortType: sortConfig.direction,
      }))
    }
  }, [sortConfig])

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

  const deleteChildren = async (params) => {
    try {
      // Call the API to delete children with the provided parameters
      await childrenApi.deleteChildren({ params })
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

  // Handle delete all when click delete all
  const handleDeleteAll = () => {
    setConfirmModalVisible(false)
    for (var key1 in checkedState) {
      if (checkedState[key1]) {
        const findedData = data.find((d) => d.children_id == key1)
        if (findedData.family_id !== null) {
          setErrorModalMessage((prevModalError) => ({
            ...prevModalError,
            modalTile: 'Lỗi',
            modalContent:
              'Trẻ vẫn ở trong gia đình, vui lòng xóa trẻ khỏi gia đình trước khi thực hiện xóa trẻ.',
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
    const params = {
      ids: ids.join(','),
    }
    deleteChildren(params)
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

  const handleViewRelativeBtnClick = (id) => {
    setRelativeChildrenId(id)
    setRelativeModalVisible(true)
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
      !searchCriteria.orphanType &&
      !searchCriteria.minAge &&
      !searchCriteria.maxAge
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
      <RelativeModal
        isVisible={relativeModalVisible}
        setVisible={setRelativeModalVisible}
        childrenId={relativeChildrenId}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Quản lý thông tin trẻ em</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="orphanType"
                        value={searchCriteria.orphanType}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        {orphanTypes.map((type, index) => (
                          <option value={type.orphan_type_id} key={index}>
                            {type.orphan_type_name}
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
                        type="number"
                        name="minAge"
                        min={0}
                        value={searchCriteria.minAge}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Độ tuổi tối thiểu
                      </CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating className="text-truncate">
                      <CFormInput
                        size="sm"
                        type="number"
                        name="maxAge"
                        min={0}
                        value={searchCriteria.maxAge}
                        onChange={handleSearchChange}
                      />
                      <CFormLabel htmlFor="inputSearch" className="label-floating-custom">
                        Độ tuổi tối đa
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

export default ChildrenManagement
