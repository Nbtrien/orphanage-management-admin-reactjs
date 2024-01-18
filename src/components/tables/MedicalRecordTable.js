import React, { useEffect, useState } from 'react'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CFormCheck,
  CLink,
  CTable,
  CTableBody,
} from '@coreui/react'
import { NavLink } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import TableHeader from 'src/components/tables/TableHeader'
import TableRow from 'src/components/tables/TableRow'
import CustomDropdownToggle from 'src/components/buttons/CustomDropDownToggle'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'
import { PropTypes } from 'prop-types'
import ErrorModal from '../modals/ErrorModal'
import SuccessModal from '../modals/SuccessModal'

const MedicalRecordTable = ({ childrenId }) => {
  const childrenApi = childrenService()
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
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
    const getMedicalRecord = async () => {
      try {
        const response = await childrenApi.getMedicalRecords(childrenId)
        setData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getMedicalRecord()
  }, [childrenId, changeCount])

  useEffect(() => {
    const columns1 = [
      {
        key: 'medical_record_id',
        title: '',
        render: (_, { medical_record_id }) => (
          <CFormCheck
            // checked={checkedState[medical_record_id]}
            id="checkboxNoLabel"
            value={medical_record_id}
            aria-label="..."
            // onChange={() => handleIdCBChange(medical_record_id)}
          />
        ),
        renderColumn: () => (
          <CFormCheck
            // checked={checkAllState}
            id="checkboxNoLabel"
            aria-label="..."
            // onChange={handleCheckAllClick}
          />
        ),
      },
      {
        key: 'medical_record_id',
        title: 'ID',
        render: (_, { medical_record_id }) => <>#{medical_record_id}</>,
      },
      {
        key: 'diagnosis',
        title: 'Triệu chứng',
      },
      {
        key: 'prescription',
        title: 'Đơn thuốc',
      },

      {
        key: 'visit_date',
        title: 'Ngày',
        render: (_, { visit_date }) => <>{format(new Date(visit_date), 'dd/MM/yyyy')}</>,
      },
      {
        key: 'medical_notes',
        title: 'Ghi chú',
      },
      {
        key: 'document_name',
        title: 'Giấy tờ liên quan',
        render: (_, { document_name, document_url }) => (
          <>
            <CLink href={document_url} className="text-nodecorate" title={document_name}>
              <CButton className="download-btn-2 w-100">
                <div className="download-btn-2-content">{document_name}</div>
                <CIcon icon={cilDataTransferDown} />
              </CButton>
            </CLink>
          </>
        ),
      },
      {
        key: 'medical_record_id',
        title: '',
        width: 200,
        render: (_, { medical_record_id }) => (
          <div className="d-flex justify-content-center">
            <CDropdown variant="btn-group" className="dropdown-btn-group">
              <CustomDropdownToggle />
              <CDropdownMenu>
                <NavLink
                  className="text-nodecorate"
                  onClick={() => handleDeleteMedicalrecord(medical_record_id)}
                >
                  <CDropdownItem>Xóa hồ sơ</CDropdownItem>
                </NavLink>
              </CDropdownMenu>
            </CDropdown>
          </div>
        ),
      },
    ]

    if (childrenId && data.length > 0) {
      setColumns(columns1)
    }
  }, [childrenId, data])

  const handleDeleteMedicalrecord = async (id) => {
    try {
      await childrenApi.deleteMedicalRecord(id)
      setSuccessModalMessage((prevSuccessModal) => ({
        ...prevSuccessModal,
        modalTile: 'Thành công!',
        modalContent: 'Đã xoá thành công',
      }))
      setSuccessModalVisible(true)
      setChangeCount((prevChangeCount) => prevChangeCount + 1)
    } catch (error) {
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
    </>
  )
}

MedicalRecordTable.propTypes = {
  childrenId: PropTypes.any,
}

export default MedicalRecordTable
