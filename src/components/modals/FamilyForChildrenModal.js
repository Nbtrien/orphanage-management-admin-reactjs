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
import TableHeader from '../tables/TableHeader'
import TableRow from '../tables/TableRow'

const FamilyForChildrenModal = ({
  childrenId,
  familyId,
  childrenName,
  isVisible,
  setVisible,
  handleResult,
}) => {
  const childrenApi = childrenService()
  const familyApi = familyService()

  const [families, setFamilies] = useState([])
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const getFamilies = async () => {
      try {
        const response = await familyApi.getFamiliesForChildren(childrenId)
        setFamilies(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getFamilies()
  }, [childrenId])

  useEffect(() => {
    const setFamilyColumns = () => {
      setColumns([
        {
          key: 'family_id',
          title: 'ID',
          render: (_, { family_id }) => <>#{family_id}</>,
        },
        {
          key: 'family_name',
          title: 'Gia đình',
        },
        {
          key: 'mother',
          title: 'Bà mẹ',
          render: (_, { mother }) => <>{mother.mother_name}</>,
        },

        {
          key: 'date_of_formation',
          title: 'Ngày thành lập',
          render: (_, { date_of_formation }) => (
            <>{format(new Date(date_of_formation), 'dd/MM/yyyy')}</>
          ),
        },
        {
          key: 'condition',
          title: 'Độ tuổi quy định',
          render: (_, { condition }) => (
            <>
              {condition.age_from} ~ {condition.age_to} tuổi
            </>
          ),
        },
        {
          key: 'condition',
          title: 'Số trẻ quy định',
          render: (_, { condition }) => (
            <>
              {condition.min_number_of_children} ~ {condition.max_number_of_children} trẻ
            </>
          ),
        },
        {
          key: 'no_of_children',
          title: 'Số trẻ hiện tại',
        },
        {
          key: 'family_id',
          title: '',
          width: 200,
          render: (_, { family_id }) => (
            <div className="d-flex justify-content-center">
              <CDropdown variant="btn-group" className="dropdown-btn-group">
                <CustomDropdownToggle />
                <CDropdownMenu>
                  <NavLink className="text-nodecorate" to={`../families/${family_id}`}>
                    <CDropdownItem>Xem thông tin gia đình</CDropdownItem>
                  </NavLink>
                  {familyId && familyId != family_id ? (
                    <>
                      <NavLink
                        className="text-nodecorate"
                        onClick={() => handleAddBtnClick(family_id)}
                      >
                        <CDropdownItem>Thay đổi gia đình</CDropdownItem>
                      </NavLink>
                    </>
                  ) : (
                    !familyId && (
                      <>
                        <NavLink
                          className="text-nodecorate"
                          onClick={() => handleAddBtnClick(family_id)}
                        >
                          <CDropdownItem>Thêm trẻ vào gia đình</CDropdownItem>
                        </NavLink>
                      </>
                    )
                  )}
                </CDropdownMenu>
              </CDropdown>
            </div>
          ),
        },
      ])
    }
    if (families.length > 0) {
      setFamilyColumns()
    }
  }, [families])

  const handleAddBtnClick = async (id) => {
    try {
      const response = await childrenApi.setFamilyForChildren(childrenId, id)
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
        <div className="header-title-custom">Cập nhật gia đình trẻ - {childrenName}</div>
      </CModalHeader>
      <CModalBody>
        <div className="header-title-sub-custom mb-1">Danh sách gia đình phù hợp</div>
        <CRow>
          <div>
            {families?.length > 0 && (
              // <InfoTable nowrapHeaderCells={true} data={families} columns={columns}></InfoTable>
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
                  <TableRow data={families} columns={columns} />
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

FamilyForChildrenModal.propTypes = {
  childrenId: PropTypes.number,
  familyId: PropTypes.any,
  childrenName: PropTypes.any,
  isVisible: PropTypes.bool,
  setVisible: PropTypes.func,
  handleResult: PropTypes.func,
}

export default FamilyForChildrenModal
