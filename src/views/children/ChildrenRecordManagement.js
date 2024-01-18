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
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormFloating,
  CLink,
  CFormCheck,
} from '@coreui/react'
import { Pagination } from 'src/constants/Pagination'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import ConfirmModal from 'src/components/modals/ConfirmModal'
import { NavLink } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import CustomAvatar from 'src/components/rows/CustomAvatar'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import { FaDownload, FaUpload } from 'react-icons/fa'
import DragDropFile from 'src/components/modals/DragDropFile'
import MedicalRecordModal from 'src/components/modals/MedicalRecordModal'

const ChildrenRecordManagement = () => {
  const childrenApi = childrenService()

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [checkedState, setCheckedState] = useState({})
  const [isReRender, setReRender] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const [documentTypes, setDocumentTypes] = useState([])

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

  const [uploadModalVisible, setUploadModalVisible] = useState(false)

  const [medicalRecordModalVisible, setMedicalRecordModalVisible] = useState(false)
  const [medicalRecordChildrenId, setMedicalRecordChildrenId] = useState('')

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' })
  const [totalPage, setTotalPage] = useState(0)
  const [page, setPage] = useState(1)

  const [uploadDocumentData, setUploadDocumentData] = useState()
  const [handleSubmitFileClick, setHandleSubmitFileClick] = useState()

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
  })

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await childrenApi.getChildrenStatus()
        console.log(response)
        setStatusArr(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatus()
  }, [])

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await childrenApi.getDocumentTypes()
        const result = response.result

        setDocumentTypes(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchDocumentTypes()
  }, [])

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
        const response = await childrenApi.getAllChildrenRecord({ params })
        const result = response.result

        setData(result.records)
        setPage(result.page)
        setTotalPage(result.totalPage)
      } catch (error) {
        console.log(error)
      }
    }

    const searchChildren = async () => {
      try {
        searchCriteria.keyword && (params.keyword = searchCriteria.keyword)

        const response = await childrenApi.getAllChildrenRecord({ params })
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
  }, [page, pagination, isChanged, isSearching])

  useEffect(() => {
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
            <div className="clearfix align-content-center align-items-center d-flex justify-content-start">
              <CustomAvatar src={image_url} size="md" />
              {children_full_name}
            </div>
          </>
        ),
      },
    ]

    if (documentTypes.length) {
      documentTypes.map((type) => {
        columns1.push({
          key: 'documents',
          title: type.document_type_name,
          render: (_, { documents, children_id }) => (
            <>
              {documents
                .filter((document) => document.document_type_id === type.document_type_id)
                .map((document, index) => (
                  <div key={index}>
                    <CLink href={document.file_path} className="text-nodecorate d-block mb-1">
                      <CButton>
                        <div className="d-flex align-items-center gap-2">
                          <FaDownload color="white" />
                          Tải xuống
                        </div>
                      </CButton>
                    </CLink>
                    <CButton
                      color="dark"
                      onClick={() =>
                        handleUpdateDocumentBtnClick(type.document_type_id, children_id)
                      }
                    >
                      <div className="d-flex align-items-center gap-2 text-nowrap">
                        <FaUpload color="white" />
                        Cập nhật giấy tờ
                      </div>
                    </CButton>
                  </div>
                ))}
              {documents.filter((document) => document.document_type_id === type.document_type_id)
                .length === 0 ? (
                <div key={type.document_type_id}>
                  <CButton
                    color="dark"
                    onClick={() => handleUploadDocumentBtnClick(type.document_type_id, children_id)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FaUpload color="white" />
                      Tải lên
                    </div>
                  </CButton>
                </div>
              ) : null}
            </>
          ),
        })
      })
    }

    columns1.push({
      key: 'children_id',
      title: '',
      width: 200,
      render: (_, { children_id, children_full_name, family_id }) => (
        <div className="d-flex justify-content-center">
          <CDropdown variant="btn-group">
            <CustomDropdownToggle />
            <CDropdownMenu>
              <NavLink className="text-nodecorate" to={`../children/${children_id}`}>
                <CDropdownItem>Xem hồ sơ</CDropdownItem>
              </NavLink>
              <NavLink
                className="text-nodecorate"
                onClick={() => handleViewMedicallRecordBtnClick(children_id)}
              >
                <CDropdownItem>Xem lịch sử y tế</CDropdownItem>
              </NavLink>
              <NavLink
                className="text-nodecorate"
                to={`../medical-records/create?childrenId=${children_id}&childrenName=${children_full_name}`}
              >
                <CDropdownItem>Thêm lịch sử y tế</CDropdownItem>
              </NavLink>
              <NavLink
                className="text-nodecorate"
                to={`../vaccination-records/create?childrenId=${children_id}&childrenName=${children_full_name}`}
              >
                <CDropdownItem>Thêm lịch sử tiêm chủng</CDropdownItem>
              </NavLink>
            </CDropdownMenu>
          </CDropdown>
        </div>
      ),
    })
    setColumns(columns1)
  }, [checkedState, isReRender, checkAllState, documentTypes])

  useEffect(() => {
    const states = {}
    data.forEach((d) => {
      states[d.children_id] = false
    })
    setCheckedState(states)
  }, [data])

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

  const handleUpdateDocumentBtnClick = (documentTypeId, childrenId) => {
    setUploadDocumentData({
      uploadType: 'update',
      documentTypeId: documentTypeId,
      childrenId: childrenId,
    })
    setUploadModalVisible(true)
  }

  const handleUploadDocumentBtnClick = (documentTypeId, childrenId) => {
    setUploadDocumentData({
      uploadType: 'upload',
      documentTypeId: documentTypeId,
      childrenId: childrenId,
    })
    setUploadModalVisible(true)
  }

  useEffect(() => {
    if (uploadDocumentData?.file) {
      if (uploadDocumentData?.uploadType == 'upload') {
        const uploadDocuments = async () => {
          const data = {
            file_name: uploadDocumentData?.file.fileName,
            file_path: uploadDocumentData?.file.filePath,
            document_type_id: uploadDocumentData?.documentTypeId,
          }
          try {
            await childrenApi.uploadDocuments(uploadDocumentData.childrenId, JSON.stringify(data))
            setSuccessModalMessage((prevSuccessModal) => ({
              ...prevSuccessModal,
              modalTile: 'Thành công!',
              modalContent: 'Đã thêm thành công',
            }))
            setUploadDocumentData({})
            setIsChanged(!isChanged)
            setSuccessModalVisible(true)
          } catch (error) {
            console.log(error)
            setErrorModalMessage((prevModalError) => ({
              ...prevModalError,
              modalTile: 'Lỗi',
              modalContent: 'Có lỗi xảy ra vui lòng thử lại sau!',
            }))
            setUploadDocumentData({})
            setErrorModalVisible(true)
          }
        }
        uploadDocuments()
      } else if (uploadDocumentData?.uploadType == 'update') {
        const updateDocuments = async () => {
          const data = {
            file_name: uploadDocumentData?.file.fileName,
            file_path: uploadDocumentData?.file.filePath,
            document_type_id: uploadDocumentData?.documentTypeId,
          }
          try {
            await childrenApi.updateDocuments(uploadDocumentData.childrenId, JSON.stringify(data))
            setSuccessModalMessage((prevSuccessModal) => ({
              ...prevSuccessModal,
              modalTile: 'Thành công!',
              modalContent: 'Đã cập nhật thành công',
            }))
            setUploadDocumentData({})
            setIsChanged(!isChanged)
            setSuccessModalVisible(true)
          } catch (error) {
            console.log(error)
            setErrorModalMessage((prevModalError) => ({
              ...prevModalError,
              modalTile: 'Lỗi',
              modalContent: 'Có lỗi xảy ra vui lòng thử lại sau!',
            }))
            setUploadDocumentData({})
            setErrorModalVisible(true)
          }
        }
        updateDocuments()
      } else {
        setErrorModalMessage((prevModalError) => ({
          ...prevModalError,
          modalTile: 'Lỗi',
          modalContent: 'Có lỗi xảy ra vui lòng thử lại sau!',
        }))
        setErrorModalVisible(true)
      }
    } else if (uploadDocumentData?.error) {
      setErrorModalMessage((prevModalError) => ({
        ...prevModalError,
        modalTile: 'Lỗi',
        modalContent: 'Có lỗi xảy ra vui lòng thử lại sau!',
      }))
      setErrorModalVisible(true)
    }
  }, [uploadDocumentData])

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

  const pageNumbers = []
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i)
  }

  const handleConfirmBtnClick = () => {
    if (confirmAction) {
      confirmAction()
    }
  }

  const handleViewMedicallRecordBtnClick = (id) => {
    setMedicalRecordChildrenId(id)
    setMedicalRecordModalVisible(true)
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage)
    }
  }
  const handleSearchBtnClick = async (event) => {
    event.preventDefault()
    if (!searchCriteria.keyword) {
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
      <DragDropFile
        isVisible={uploadModalVisible}
        setVisible={setUploadModalVisible}
        handleSubmitBtnClick={handleSubmitFileClick}
        uploadDocumentData={uploadDocumentData}
        setUploadDocumentData={setUploadDocumentData}
      />
      <MedicalRecordModal
        isVisible={medicalRecordModalVisible}
        setVisible={setMedicalRecordModalVisible}
        childrenId={medicalRecordChildrenId}
      />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4 card-custom">
            <CCardHeader>
              <div className="header-title-custom">Quản lý tình trạng trẻ em</div>
              <div className="header-search-area">
                <CRow>
                  <CCol xs={12} className="mt-1">
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
                          onClick={() => setIsChanged(!isChanged)}
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

export default ChildrenRecordManagement
