import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CCollapse,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CFormCheck,
  CFormFloating,
  CFormInput,
  CFormLabel,
  CImage,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import InfoTable from 'src/components/tables/InfoTable'
import FloatingInputRow from 'src/components/rows/FloatingInputRow'
import familyService from 'src/api/services/familyService'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import HeaderSubContentCard from 'src/components/cards/HeaderSubContentCard'
import SuccessModal from 'src/components/modals/SuccessModal'
import ErrorModal from 'src/components/modals/ErrorModal'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import ConfirmModal from 'src/components/modals/ConfirmModal'

const FamilyDetails = () => {
  const familyApi = familyService()
  const childrenApi = childrenService()
  const { id } = useParams()
  const [family, setFamily] = useState()
  const [childrenData, setChildrenData] = useState([])
  const [childrenColumns, setChildrenColumns] = useState([])
  const [isChanged, setIsChanged] = useState(false)
  const [addChildrenVisible, setAddChildrenVisible] = useState(false)
  const [searchCriteria, setSearchCriteria] = useState({
    id: '',
    name: '',
    minAge: '',
    maxAge: '',
  })
  const [childrenResult, setChildrenResult] = useState([])

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
  const [confirmAction, setConfirmAction] = useState(null)

  const [checkedState, setCheckedState] = useState({})
  const [checkAllState, setCheckAllState] = useState(false)
  const [isReRender, setReRender] = useState(false)

  useEffect(() => {
    const getFamily = async () => {
      try {
        const response = await familyApi.getFamilyDetail(id)
        setFamily(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getFamily()
  }, [id])

  useEffect(() => {
    setSearchCriteria({
      id: '',
      name: '',
      minAge: family?.condition.age_from,
      maxAge: family?.condition.age_to,
    })
  }, [family])

  useEffect(() => {
    const getChildren = async () => {
      try {
        const response = await childrenApi.getChildrenByFamilyId(id)
        checkAllState && setCheckAllState(false)
        setChildrenData(response.result)
      } catch (error) {
        console.log(error)
      }
    }

    family?.family_id && getChildren()
  }, [family, isChanged])

  useEffect(() => {
    setChildrenColumns([
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
        key: 'image_url',
        title: 'Ảnh',
        render: (_, { image_url }) => (
          <>
            <div className="clearfix">
              <CImage
                // align="center"
                rounded
                src={image_url}
                width={100}
                height={100}
                className="custom-img-fit"
              />
            </div>
          </>
        ),
      },
      {
        key: 'children_full_name',
        title: 'Tên',
      },
      {
        key: 'children_gender',
        title: 'Giới tính',
      },
      {
        key: 'children_date_of_birth',
        title: 'Ngày sinh',
      },

      {
        key: 'date_of_admission',
        title: 'Ngày tiếp nhận',
      },
      {
        key: 'orphan_type',
        title: 'Hoàn cảnh',
      },
      {
        key: 'children_id',
        title: '',
        render: (_, { children_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink className="text-nodecorate" to={`../children/${children_id}`}>
                  <CDropdownItem>Xem hồ sơ</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ])
  }, [checkedState, isReRender, checkAllState])

  useEffect(() => {
    const states = {}
    childrenData.forEach((d) => {
      states[d.children_id] = false
    })
    setCheckedState(states)
  }, [childrenData])

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

  const deleteChildren = async (params) => {
    try {
      // Call the API to delete children with the provided parameters
      await familyApi.deleteChildren(id, params)
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã xoá thành công',
      }))
      checkAllState && setCheckAllState(false)
      setSuccessModalVisible(true)
      setIsChanged(!isChanged)
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

  const handleDeleteParams = () => {
    setConfirmModalVisible(false)
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

  const handleDeleteBtnClick = () => {
    let isAnySelect = false
    for (var key in checkedState) {
      if (checkedState[key]) isAnySelect = true
    }
    if (isAnySelect) {
      setConfirmModalMessage((prevModalMessage) => ({
        ...prevModalMessage,
        modalTile: 'Xác nhận xóa',
        modalContent: 'Bạn muốn xóa trẻ khỏi gia đình.',
      }))
      setConfirmAction(() => handleDeleteParams)
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

  const handleChange = (event) => {
    const { name, value } = event.target
    setSearchCriteria({
      ...searchCriteria,
      [name]: value,
    })
  }

  const handleSearchBtnClick = async (event) => {
    event.preventDefault()
    if (
      !searchCriteria.id &&
      !searchCriteria.name &&
      !searchCriteria.minAge &&
      !searchCriteria.maxAge
    ) {
      return
    }
    const params = {}
    searchCriteria.id && (params.id = searchCriteria.id)
    searchCriteria.name && (params.name = searchCriteria.name)
    searchCriteria.minAge && (params.minAge = searchCriteria.minAge)
    searchCriteria.maxAge && (params.maxAge = searchCriteria.maxAge)
    searchChildren(params)
  }

  const searchChildren = async (params) => {
    try {
      const response = await childrenApi.searchChildren({ params })
      setChildrenResult(response.result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleBtnShowCollapseClick = () => {
    setAddChildrenVisible(!addChildrenVisible)
    setSearchCriteria({
      id: '',
      name: '',
      minAge: family?.condition.age_from,
      maxAge: family?.condition.age_to,
    })
    setChildrenResult([])
  }

  const handleAddToFamilyClick = async (childrenId) => {
    try {
      const response = await childrenApi.setFamilyForChildren(childrenId, id)
      if (
        !searchCriteria.id &&
        !searchCriteria.name &&
        !searchCriteria.minAge &&
        !searchCriteria.maxAge
      ) {
        return
      }
      const params = {}
      searchCriteria.id && (params.id = searchCriteria.id)
      searchCriteria.name && (params.name = searchCriteria.name)
      searchCriteria.minAge && (params.minAge = searchCriteria.minAge)
      searchCriteria.maxAge && (params.maxAge = searchCriteria.maxAge)
      searchChildren(params)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã thêm thành công',
      }))
      setSuccessModalVisible(true)
      setIsChanged(!isChanged)
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

  const handleConfirmBtnClick = () => {
    if (confirmAction) {
      confirmAction()
    }
  }

  return (
    <>
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
      <ConfirmModal
        modalMessage={confirmModalMessage}
        isVisible={confirmModalVisible}
        setVisible={setConfirmModalVisible}
        handleConfirmBtnClick={handleConfirmBtnClick}
      />
      {family && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4 card-custom">
              <CCardHeader>
                <div className="header-title-custom">Chi tiết gia đình #{family?.family_id}</div>
                <div className="header-search-area">
                  <CRow>
                    <CCol md={6} sm={6} xs={12} className="mt-1 ">
                      <HeaderSubContentCard label="Gia đình" content={family.family_name} />
                    </CCol>
                    <CCol md={6} sm={6} xs={12} className="mt-1 ">
                      <HeaderSubContentCard
                        label="Bà mẹ"
                        content={family.mother?.mother_name || '###'}
                      />
                    </CCol>
                    <CCol md={6} sm={6} xs={12} className="mt-1 ">
                      <HeaderSubContentCard
                        label="Tiêu chuẩn gia đình"
                        content={
                          'Từ ' +
                          `${family.condition.age_from} ~ ${family.condition.age_to}` +
                          ' tuổi, Số lượng ' +
                          `${family.condition.min_number_of_children} ~ ${family.condition.max_number_of_children}` +
                          ' trẻ'
                        }
                      />
                    </CCol>
                    <CCol md={6} sm={6} xs={12} className="mt-1 ">
                      <HeaderSubContentCard
                        label="Số trẻ hiện tại"
                        content={family.no_of_children + ' trẻ'}
                      />
                    </CCol>
                  </CRow>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="h-100 text-black bg-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="header-title-sub-custom">Danh sách trẻ</div>
                    <CButton
                      color="primary"
                      disabled={family.no_of_children >= family.condition.max_number_of_children}
                      onClick={handleBtnShowCollapseClick}
                    >
                      <CIcon icon={cilPlus} size="md" />
                    </CButton>
                  </div>
                  <div>
                    <CCollapse visible={addChildrenVisible}>
                      <CCard className="mt-3">
                        <CCardHeader>
                          <div className="header-title-sub-custom">Thêm trẻ vào gia đình</div>
                          <div className="header-search-area">
                            <CRow>
                              <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                                <CFormFloating>
                                  <CFormInput
                                    className="bg-light border-light border-2"
                                    size="sm"
                                    type="text"
                                    name="id"
                                    value={searchCriteria.id}
                                    onChange={handleChange}
                                  />
                                  <CFormLabel
                                    htmlFor="inputSearch"
                                    className="label-floating-custom"
                                  >
                                    Tìm kiếm theo ID
                                  </CFormLabel>
                                </CFormFloating>
                              </CCol>
                              <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                                <CFormFloating>
                                  <CFormInput
                                    className="bg-light border-light border-2"
                                    size="sm"
                                    type="text"
                                    name="name"
                                    value={searchCriteria.name}
                                    onChange={handleChange}
                                  />
                                  <CFormLabel
                                    htmlFor="inputSearch"
                                    className="label-floating-custom"
                                  >
                                    Tìm kiếm theo tên
                                  </CFormLabel>
                                </CFormFloating>
                              </CCol>
                              <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                                <CFormFloating>
                                  <CFormInput
                                    className="bg-light border-light border-2"
                                    size="sm"
                                    type="number"
                                    name="minAge"
                                    value={searchCriteria.minAge}
                                    min={family.condition.age_from}
                                    onChange={handleChange}
                                  />
                                  <CFormLabel
                                    htmlFor="inputSearch"
                                    className="label-floating-custom"
                                  >
                                    Độ tuổi tối thiểu
                                  </CFormLabel>
                                </CFormFloating>
                              </CCol>
                              <CCol xl={3} lg={3} md={3} sm={6} xs={12} className="mt-1">
                                <CFormFloating>
                                  <CFormInput
                                    className="bg-light border-light border-2"
                                    size="sm"
                                    type="number"
                                    name="maxAge"
                                    max={family.condition.age_to}
                                    value={searchCriteria.maxAge}
                                    onChange={handleChange}
                                  />
                                  <CFormLabel
                                    htmlFor="inputSearch"
                                    className="label-floating-custom"
                                  >
                                    Độ tuổi tối đa
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
                          <div className="header-title-sub-custom mb-2">Danh sách kết quả</div>
                          <CTable
                            striped
                            bordered
                            borderColor="light"
                            align="middle"
                            className="mb-3 border table-border-custom "
                            hover
                            responsive
                          >
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">
                                      <CFormCheck id="checkboxNoLabel" aria-label="..." />
                                    </div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">ID</div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">Ảnh</div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">Tên</div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">Giới tính</div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell scope="col" className={'text-nowrap'}>
                                  <CCol className="d-flex align-items-center justify-content-between">
                                    <div className="order-1">Ngày sinh</div>
                                  </CCol>
                                </CTableHeaderCell>
                                <CTableHeaderCell
                                  scope="col"
                                  className={'text-nowrap'}
                                ></CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {childrenResult.map((children) => (
                                <>
                                  <CTableRow>
                                    <CTableDataCell>
                                      <CFormCheck
                                        id="checkboxNoLabel"
                                        value={children.children_id}
                                        aria-label="..."
                                      />
                                    </CTableDataCell>
                                    <CTableDataCell>#{children.children_id}</CTableDataCell>
                                    <CTableDataCell>
                                      <div className="clearfix">
                                        <CImage
                                          rounded
                                          src={children.image_url}
                                          width={100}
                                          height={100}
                                          className="custom-img-fit"
                                        />
                                      </div>
                                    </CTableDataCell>
                                    <CTableDataCell>{children.children_full_name}</CTableDataCell>
                                    <CTableDataCell>{children.children_gender}</CTableDataCell>
                                    <CTableDataCell>
                                      {format(
                                        new Date(children.children_date_of_birth),
                                        'dd/MM/yyyy',
                                      )}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <div className="d-flex justify-content-center">
                                        <CDropdown variant="btn-group">
                                          <CustomDropdownToggle />
                                          <CDropdownMenu>
                                            <NavLink
                                              className="text-nodecorate"
                                              to={`../children/${children.children_id}`}
                                            >
                                              <CDropdownItem>Xem hồ sơ</CDropdownItem>
                                            </NavLink>
                                            <NavLink
                                              className="text-nodecorate"
                                              onClick={() =>
                                                handleAddToFamilyClick(children.children_id)
                                              }
                                            >
                                              <CDropdownItem>Thêm vào gia đình</CDropdownItem>
                                            </NavLink>
                                          </CDropdownMenu>
                                        </CDropdown>
                                      </div>
                                    </CTableDataCell>
                                  </CTableRow>
                                </>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CCardBody>
                      </CCard>
                    </CCollapse>
                  </div>
                  <div className="mt-3">
                    <div className="body-btn-group mb-2">
                      <CRow className="justify-content-between">
                        <CCol lg={6} md={6} sm={4} xs={12} className="mb-2">
                          <CRow className="justify-content-start gap-2">
                            <CCol xl={4} lg={5} md={5} sm={10} xs={12}>
                              <CButton
                                type="submit"
                                color="primary"
                                className="main-btn w-100"
                                onClick={handleDeleteBtnClick}
                              >
                                Xóa
                              </CButton>
                            </CCol>
                          </CRow>
                        </CCol>
                        <CCol lg={6} md={6} sm={8}>
                          <CRow className="justify-content-end gap-2">
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
                        columns={childrenColumns}
                        sortConfig={{ key: '', direction: '' }}
                        nowrapHeaderCells={true}
                      />
                      <CTableBody>
                        <TableRow data={childrenData} columns={childrenColumns} />
                      </CTableBody>
                    </CTable>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default FamilyDetails
