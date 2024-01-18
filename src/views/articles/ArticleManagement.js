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
import volunteerService from 'src/api/services/volunteerService'
import { EventState } from 'src/constants/VolunteerCode'
import moment from 'moment'
import articleService from 'src/api/services/articleService'
import publicService from 'src/api/services/publicService'

const ArticleManagement = () => {
  const articleApi = articleService()
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
    categoryId: null,
    keyword: '',
    fromDate: '',
    toDate: '',
  })

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await publicApi.getAllArticleCategories()
        setCategories(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getCategories()
  }, [])

  useEffect(() => {
    const params = {
      limit: pagination.limit,
      page: page,
      sortType: pagination.sortType,
      sortColumn: pagination.sortColumn,
    }
    const getArticles = async () => {
      const response = await articleApi.fetchArtiles({ params })
      const result = response.result

      setData(result.records)
      setPage(result.page)
      setTotalPage(result.totalPage)
    }

    const searchArticles = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)
        searchCriteria.categoryId && (params.categoryId = searchCriteria.categoryId)
        searchCriteria.fromDate && (params.fromDate = searchCriteria.fromDate)
        searchCriteria.toDate && (params.toDate = searchCriteria.toDate)

        const response = await articleApi.fetchArtiles({ params })
        const result = response.result
        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    if (isSearching) {
      searchArticles()
    } else {
      getArticles()
    }
  }, [deleteCount, page, pagination, isSearching])

  useEffect(() => {
    const columns1 = [
      {
        key: 'article_id',
        title: '',
        render: (_, { article_id }) => (
          <CFormCheck
            checked={checkedState[article_id]}
            id="checkboxNoLabel"
            value={article_id}
            aria-label="..."
            onChange={() => handleIdCBChange(article_id)}
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
        key: 'article_id',
        title: 'ID',
        sortable: true,
        render: (_, { article_id }) => <>#{article_id}</>,
      },
      {
        key: 'article_title',
        title: 'Tiêu đề bài viết',
        sortable: true,
      },
      {
        key: 'category',
        title: 'Danh mục bài viết',
      },
      {
        key: 'summary',
        title: 'Tổng quan bài viết',
        sortable: true,
      },
      {
        key: 'publication_start_date_time',
        title: 'Thời gian đăng bài',
        sortable: true,
        render: (_, { publication_start_date_time }) => (
          <div>{moment(publication_start_date_time).format('DD/MM/YYYY hh:mm')}</div>
        ),
      },
      {
        key: 'is_active',
        title: 'Trạng thái đăng bài',
        sortable: true,
        render: (_, { article_id, is_active }) => (
          <>
            <div className="d-flex justify-content-start align-items-center gap-2">
              <CFormCheck
                checked={is_active}
                id="checkboxwaitingadoption"
                aria-label="..."
                onChange={() => handleChangeStateBtnClick(article_id, is_active)}
              />
              <span>Đang đăng bài</span>
            </div>
          </>
        ),
      },
      {
        key: 'article_id',
        title: '',
        width: 200,
        render: (_, { article_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  to={`http://localhost:3001/volunteers/events/${article_id}`}
                >
                  <CDropdownItem>Xem trên website</CDropdownItem>
                </NavLink>
                <NavLink className="text-nodecorate" to="#">
                  <CDropdownItem>Sửa bài viết</CDropdownItem>
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
      states[d.article_id] = false
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
      await articleApi.hideArticles(id)
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

  const activeArticles = async (id) => {
    setConfirmModalVisible(false)
    try {
      await articleApi.activeArticles(id)
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã đăng bài viết thành công',
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

  const deleteArticles = async (params) => {
    try {
      await articleApi.deleteArticles({ params })
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
        modalContent: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
      }))
      setErrorModalVisible(true)
    }
  }

  const handleDeleteAll = () => {
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
    deleteArticles(params)
  }

  const handleChangeStateBtnClick = (id, active) => {
    if (active) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Bạn muốn ẩn bài viết này!',
      }))
      setConfirmAction(() => () => hiddenArticles(id))
      setConfirmModalVisible(true)
    } else {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Bạn muốn đăng bài viết này!',
      }))
      setConfirmAction(() => () => activeArticles(id))
      setConfirmModalVisible(true)
    }
  }

  const handleDeleteAllClick = () => {
    let isAnySelect = false
    for (var key in checkedState) {
      if (checkedState[key]) isAnySelect = true
    }
    if (isAnySelect) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận',
        modalContent: 'Bạn muốn xóa các bài viết đã chọn!',
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
      !searchCriteria.categoryId &&
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
              <div className="header-title-custom">Quản lý bài viết</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                    <CFormFloating>
                      <CFormSelect
                        className="col-form-label custom-select-floating"
                        aria-label="Large select example"
                        name="categoryId"
                        value={searchCriteria.categoryId}
                        onChange={handleSearchChange}
                      >
                        <option></option>
                        {categories.map((cate, index) => (
                          <option value={cate.article_category_id} key={index}>
                            {cate.category_name}
                          </option>
                        ))}
                      </CFormSelect>
                      <CFormLabel htmlFor="inputStatus">Danh mục</CFormLabel>
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
                        Từ ngày đăng bài
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
                        Đến ngày đăng bài
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
                  <CCol lg={6} md={6} sm={4} xs={12}>
                    <CRow className="justify-content-start">
                      <CCol xl={4} lg={5} md={5} sm={12} xs={12} className="mb-2">
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
                    <CRow className="justify-content-end">
                      <CCol xl={5} lg={5} md={6} sm={6} xs={12} className="mb-2">
                        <NavLink to="../articles/create">
                          <CButton type="submit" color="primary" className="main-btn w-100">
                            Thêm bài viết
                          </CButton>
                        </NavLink>
                      </CCol>
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

export default ArticleManagement
