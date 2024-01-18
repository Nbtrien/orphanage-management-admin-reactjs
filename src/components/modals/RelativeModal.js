import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
} from '@coreui/react'
import childrenService from 'src/api/services/childrenService'
import InfoTable from '../tables/InfoTable'
import { format } from 'date-fns'
import TableHeader from '../tables/TableHeader'
import TableRow from '../tables/TableRow'
import CustomDropdownToggle from '../buttons/CustomDropDownToggle'
import { NavLink } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import SuccessModal from './SuccessModal'

const RelativeModal = ({ childrenId, isVisible, setVisible }) => {
  const childrenApi = childrenService()
  const [childrenName, setChildrenName] = useState('')

  const [relatives, setRelatives] = useState([])
  const [columns, setColumns] = useState([])
  const [changeCount, setChangeCount] = useState(0)
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

  useEffect(() => {
    const getRelatives = async () => {
      try {
        const response = await childrenApi.getChildrenRelatives(childrenId)
        const result = response.result

        setChildrenName(result.children_full_name)
        setRelatives(result.relatives)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getRelatives()
  }, [childrenId, changeCount])

  useEffect(() => {
    const setRelativesColumns = () => {
      setColumns([
        {
          key: 'relative_id',
          title: 'ID',
          render: (_, { relative_id }) => <>#{relative_id}</>,
        },
        {
          key: 'full_name',
          title: 'Tên',
        },
        {
          key: 'date_of_birth',
          title: 'Ngày sinh',
          render: (_, { date_of_birth }) => <>{format(new Date(date_of_birth), 'dd/MM/yyyy')}</>,
        },
        {
          key: 'relationship',
          title: 'Quan hệ với trẻ',
        },
        {
          key: 'phone_number',
          title: 'Số điện thoại',
        },
        {
          key: 'mail_address',
          title: 'Địa chỉ email',
        },
        {
          key: 'address',
          title: 'Địa chỉ',
        },
        {
          key: 'relative_id',
          title: '',
          width: 200,
          render: (_, { relative_id }) => (
            <div className="d-flex justify-content-center">
              <CDropdown variant="btn-group" className="dropdown-btn-group">
                <CustomDropdownToggle />
                <CDropdownMenu>
                  <NavLink className="text-nodecorate" to={`../families/${relative_id}`}>
                    <CDropdownItem>Xem hồ sơ</CDropdownItem>
                  </NavLink>
                  <NavLink
                    className="text-nodecorate"
                    onClick={() => handleDeleteBtnClick(relative_id)}
                  >
                    <CDropdownItem>Xóa người thân</CDropdownItem>
                  </NavLink>
                </CDropdownMenu>
              </CDropdown>
            </div>
          ),
        },
      ])
    }
    if (relatives.length > 0) {
      setRelativesColumns()
    }
  }, [relatives])

  const handleDeleteBtnClick = async (relativeId) => {
    try {
      // Call the API to delete children with the provided parameters
      await childrenApi.deleteRelative(childrenId, relativeId)
      // Set success modal message and make it visible
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã xoá thành công',
      }))
      setSuccessModalVisible(true)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
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
      <CModal
        backdrop="static"
        alignment="center"
        visible={isVisible}
        size="xl"
        onClose={() => setVisible(false)}
      >
        <CModalHeader className="border-0">
          <div className="header-title-custom">Trẻ - {childrenName}</div>
        </CModalHeader>
        <CModalBody>
          <div className="header-title-sub-custom mb-1">Thông tin người thân</div>
          <CRow>
            <div>
              {relatives?.length > 0 && (
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
                    nowrapHeaderCells={true}
                    sortConfig={{ key: '', direction: '' }}
                  />
                  <CTableBody>
                    <TableRow data={relatives} columns={columns} />
                  </CTableBody>
                </CTable>
              )}
            </div>
          </CRow>
        </CModalBody>
        <CModalFooter className="border-0">
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Xong
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

RelativeModal.propTypes = {
  childrenId: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default RelativeModal
