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
import familyService from 'src/api/services/familyService'
import CustomDropdownToggle from '../buttons/CustomDropDownToggle'
import { NavLink } from 'react-router-dom'
import CustomAvatar from '../rows/CustomAvatar'
import TableHeader from '../tables/TableHeader'
import TableRow from '../tables/TableRow'

const MotherForFamilyModal = ({ familyId, familyName, isVisible, setVisible, handleResult }) => {
  const familyApi = familyService()
  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  console.log(familyId)

  useEffect(() => {
    const getMothers = async () => {
      try {
        const response = await familyApi.getAllMothersAvailable()
        setData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    familyId && getMothers()
  }, [familyId])

  useEffect(() => {
    const setFamilyColumns = () => {
      setColumns([
        {
          key: 'mother_id',
          title: 'ID',
          render: (_, { mother_id }) => <>#{mother_id}</>,
        },
        {
          key: 'mother_name',
          title: 'Họ và tên',
          render: (_, { mother_name, image_url }) => (
            <>
              <div className="clearfix align-content-center align-items-center d-flex justify-content-start text-nowrap">
                <CustomAvatar src={image_url} size="md" />
                {mother_name}
              </div>
            </>
          ),
        },
        {
          key: 'employee_id',
          title: 'ID Nhân viên',
          render: (_, { employee_id }) => <>#{employee_id}</>,
        },
        {
          key: 'date_of_birth',
          title: 'Ngày sinh',
          render: (_, { date_of_birth }) => <>{format(new Date(date_of_birth), 'dd/MM/yyyy')}</>,
        },
        {
          key: 'ethnicity',
          title: 'Dân tộc',
        },
        {
          key: 'religion',
          title: 'Tôn giáo',
        },
        {
          key: 'address',
          title: 'Địa chỉ',
        },
        {
          key: 'hire_date',
          title: 'Ngày bắt đầu',
          render: (_, { hire_date }) => <>{format(new Date(hire_date), 'dd/MM/yyyy')}</>,
        },
        {
          key: 'mother_id',
          title: '',
          width: 200,
          render: (_, { mother_id }) => (
            <div className="d-flex justify-content-center">
              <CDropdown variant="btn-group" className="dropdown-btn-group">
                <CustomDropdownToggle />
                <CDropdownMenu>
                  <NavLink className="text-nodecorate" to={`../families/${mother_id}`}>
                    <CDropdownItem>Xem hồ sơ</CDropdownItem>
                  </NavLink>
                  <NavLink className="text-nodecorate" onClick={() => handleAddBtnClick(mother_id)}>
                    <CDropdownItem>Cập nhật bà mẹ</CDropdownItem>
                  </NavLink>
                </CDropdownMenu>
              </CDropdown>
            </div>
          ),
        },
      ])
    }
    if (data.length > 0) {
      setFamilyColumns()
    }
  }, [data])

  const handleAddBtnClick = async (id) => {
    try {
      const response = await familyApi.updateMotherForFamily(familyId, id)
      handleResult(true)
    } catch (error) {
      console.log(error)
      handleResult(false)
    }
  }

  return (
    <CModal
      backdrop="static"
      alignment="center"
      visible={isVisible}
      size="xl"
      onClose={() => setVisible()}
    >
      <CModalHeader className="border-0">
        <div className="header-title-custom">Cập nhật bà mẹ</div>
      </CModalHeader>
      <CModalBody>
        <div className="header-title-sub-custom mb-1">Danh sách bà mẹ phù hợp</div>
        <CRow>
          <div>
            {data?.length > 0 && (
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
                  <TableRow data={data} columns={columns} />
                </CTableBody>
              </CTable>
            )}
          </div>
        </CRow>
      </CModalBody>
      <CModalFooter className="border-0">
        <CButton color="secondary" onClick={() => setVisible()}>
          Xong
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

MotherForFamilyModal.propTypes = {
  familyId: PropTypes.any,
  familyName: PropTypes.any,
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  handleResult: PropTypes.func,
}

export default MotherForFamilyModal
