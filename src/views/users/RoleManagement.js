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
  CFormFloating,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CTable,
  CTableBody,
} from '@coreui/react'
import userService from 'src/api/services/userService'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'

const RoleManagement = () => {
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
  const [checkAllState, setCheckAllState] = useState(false)

  const userApi = userService()

  const [searchKey, setSearchKey] = useState('')
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [pagination, setPagination] = useState({
    limit: Pagination.limit,
    sortColumn: Pagination.sortColumn,
    sortType: Pagination.sortType,
    page: 1,
  })

  const [searchCriteria, setSearchCriteria] = useState({
    keyword: '',
    permissionId: '',
  })
  const [isSearching, setIsSearching] = useState(0)
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await userApi.getAllPermissions()
        setPermissions(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getPermissions()
  }, [])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    if (searchKey) {
      params.search = searchKey
    }
    // Fetch roles data
    const fetchRoles = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.permissionId && (params.permissionId = searchCriteria.permissionId)
        const response = await userApi.getRoles({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRoles()
  }, [deleteCount, page, pagination, searchKey, isSearching])

  useEffect(() => {
    // Define columns for the table
    const columns1 = [
      {
        key: 'role_id',
        title: '',
        render: (_, { role_id }) => (
          <CFormCheck
            checked={checkedState[role_id]}
            id="checkboxNoLabel"
            value={role_id}
            aria-label="..."
            onChange={() => handleIdCBChange(role_id)}
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
        key: 'role_id',
        title: 'Id',
        sortable: true,
        handleSortClick: handleSortClick,
        render: (_, { role_id }) => <>#{role_id}</>,
      },
      {
        key: 'role_title',
        title: 'Vai trò',
        sortable: true,
      },
      {
        key: 'role_description',
        title: 'Mô tả',
        sortable: true,
      },
      {
        key: 'permissions',
        title: 'Quyền',
        width: 200,
        render: (_, { permissions }) => (
          <>
            {permissions.map((permission, index) => (
              <CButton
                key={`tag-${index}`}
                color="primary"
                className="font-weight-bold mr-1 mb-1 btn-sm-custom "
                disabled
              >
                {permission.permission_title}
              </CButton>
            ))}
          </>
        ),
      },
      {
        key: 'role_id',
        title: '',
        width: 200,
        render: (_, { role_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../roles/${role_id}`}>
                  <CDropdownItem>Xem vai trò</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to={`../roles/${role_id}/edit`}>
                  <CDropdownItem>Sửa vai trò</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]
    setColumns(columns1)
  }, [checkedState, isReRender])

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

  useEffect(() => {
    const states = {}
    data.forEach((d) => {
      states[d.role_id] = false
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

  const deleteRoles = async (params) => {
    try {
      // Call the API to delete users with the provided parameters
      await userApi.deleteRoles({ params })
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

  // Handle delete rows when click delete all
  const handleDeleteRows = () => {
    // Get the selected row IDs
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
    deleteRoles(params)
  }

  // Handle delete row when click delete one
  const handleDeleteRow = (id) => {
    setConfirmModalVisible(false)
    const params = {
      ids: id,
    }
    deleteRoles(params)
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
      setConfirmAction(() => handleDeleteRows)
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    })
  }

  const handleSearchBtnClick = (event) => {
    event.preventDefault()
    setPage(1)
    setIsSearching((preIsSearching) => preIsSearching + 1)
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
              <div className="header-title-custom">Quản lý vai trò</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xs={6} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="permissionId"
                        value={searchCriteria.permissionId}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        {permissions.map((permission, index) => (
                          <option value={permission.permission_id} key={index}>
                            {permission.permission_title}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Quyền</CFormLabel>
                    </CFormFloating>
                  </CCol>
                  <CCol xs={6} className="mt-1">
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
                      <CCol xl={5} lg={6} md={6} sm={6} xs={12}>
                        <NavLink to="../roles/create">
                          <CButton type="submit" color="primary" className="main-btn w-100">
                            Thêm vai trò
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

export default RoleManagement
