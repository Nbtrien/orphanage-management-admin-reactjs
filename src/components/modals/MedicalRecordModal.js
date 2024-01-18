import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CFormCheck,
  CLink,
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

const MedicalRecordModal = ({ childrenId, isVisible, setVisible }) => {
  const childrenApi = childrenService()
  const [childrenName, setChildrenName] = useState('')

  const [medicalRecords, setMedicalRecords] = useState([])
  const [medicalColumns, setMedicalColumns] = useState([])

  const [vaccinationRecords, setVaccinationRecords] = useState([])
  const [vaccinationColumns, setVaccinationColumns] = useState([])

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
        const response = await childrenApi.getMedicalVaccinationRecords(childrenId)
        const result = response.result

        setChildrenName(result.children_full_name)
        setMedicalRecords(result.medical_records)
        setVaccinationRecords(result.vaccination_records)
      } catch (error) {
        console.log(error)
      }
    }
    childrenId && getMedicalRecord()
  }, [childrenId, changeCount])

  useEffect(() => {
    const setMedicalRecords = () => {
      setMedicalColumns([
        {
          key: 'medical_record_id',
          title: 'sdfsdf',
          render: (_, { medical_record_id }) => (
            <CFormCheck id="checkboxNoLabel" value={medical_record_id} aria-label="..." />
          ),
          renderColumn: () => <CFormCheck id="checkboxNoLabel" aria-label="..." />,
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
          title: 'Ngày khám',
          render: (_, { visit_date }) => <>{format(new Date(visit_date), 'dd/MM/yyyy')}</>,
        },
        {
          key: 'medical_notes',
          title: 'Ghi chú',
          render: (_, { medical_notes }) => <>{medical_notes || '###'}</>,
        },
        {
          key: 'document_name',
          title: 'Giấy tờ',
          render: (_, { document_name, document_url }) => (
            <>
              <CLink href={document_url}>{document_name}</CLink>
              <br />
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
      ])
    }
    const setVaccinationRecords = () => {
      setVaccinationColumns([
        {
          key: 'vaccination_record_id',
          title: 'sdfsdf',
          render: (_, { vaccination_record_id }) => (
            <CFormCheck id="checkboxNoLabel" value={vaccination_record_id} aria-label="..." />
          ),
          renderColumn: () => <CFormCheck id="checkboxNoLabel" aria-label="..." />,
        },
        {
          key: 'vaccination_record_id',
          title: 'ID',
          render: (_, { vaccination_record_id }) => <>#{vaccination_record_id}</>,
        },
        {
          key: 'vaccine_name',
          title: 'Tên vaccine',
        },
        {
          key: 'vaccine_type',
          title: 'Loại vaccine',
        },
        {
          key: 'vaccination_date',
          title: 'Ngày tiêm',
          render: (_, { vaccination_date }) => (
            <>{format(new Date(vaccination_date), 'dd/MM/yyyy')}</>
          ),
        },
        {
          key: 'vaccination_location',
          title: 'Địa điểm',
        },
        {
          key: 'vaccination_notes',
          title: 'Ghi chú',
        },
        {
          key: 'document_name',
          title: 'Giấy tờ',
          render: (_, { document_name, document_url }) => (
            <>
              <CLink href={document_url}>{document_name}</CLink>
              <br />
            </>
          ),
        },
        {
          key: 'vaccination_record_id',
          title: '',
          width: 200,
          render: (_, { vaccination_record_id }) => (
            <div className="d-flex justify-content-center">
              <CDropdown variant="btn-group" className="dropdown-btn-group">
                <CustomDropdownToggle />
                <CDropdownMenu>
                  <NavLink
                    className="text-nodecorate"
                    onClick={() => handleDeleteVaccinationrecord(vaccination_record_id)}
                  >
                    <CDropdownItem>Xóa hồ sơ</CDropdownItem>
                  </NavLink>
                </CDropdownMenu>
              </CDropdown>
            </div>
          ),
        },
      ])
    }
    if (medicalRecords.length > 0) {
      setMedicalRecords()
    }
    if (vaccinationRecords.length > 0) {
      setVaccinationRecords()
    }
  }, [medicalRecords, vaccinationRecords])

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

  const handleDeleteVaccinationrecord = async (id) => {
    try {
      await childrenApi.deleteVaccinationRecord(id)
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
      <CModal
        backdrop="static"
        alignment="center"
        visible={isVisible}
        size="xl"
        onClose={() => setVisible(false)}
      >
        <CModalHeader>
          <div className="header-title-custom">Trẻ - {childrenName}</div>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <div className="mb-3">
              <div className="header-title-sub-custom mb-2">Hồ sơ y tế</div>
              {medicalRecords?.length > 0 && (
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
                    columns={medicalColumns}
                    nowrapHeaderCells={true}
                    sortConfig={{ key: '', direction: '' }}
                  />
                  <CTableBody>
                    <TableRow data={medicalRecords} columns={medicalColumns} />
                  </CTableBody>
                </CTable>
              )}
            </div>
            <div>
              <div className="header-title-sub-custom mb-2">Hồ sơ tiêm chủng</div>
              {vaccinationRecords?.length > 0 && (
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
                    columns={vaccinationColumns}
                    nowrapHeaderCells={true}
                    sortConfig={{ key: '', direction: '' }}
                  />
                  <CTableBody>
                    <TableRow data={vaccinationRecords} columns={vaccinationColumns} />
                  </CTableBody>
                </CTable>
              )}
            </div>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Xong
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

MedicalRecordModal.propTypes = {
  childrenId: PropTypes.number.isRequired,
  isVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
}

export default MedicalRecordModal
