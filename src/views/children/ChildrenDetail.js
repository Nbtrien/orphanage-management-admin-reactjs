import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CFormTextarea,
  CImage,
  CLink,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
} from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import childrenService from 'src/api/services/childrenService'
import { format } from 'date-fns'
import DataCellRow from 'src/components/rows/DataCellRow'
import CIcon from '@coreui/icons-react'
import { cilDataTransferDown } from '@coreui/icons'
import MedicalRecordTable from 'src/components/tables/MedicalRecordTable'
import VaccinationRecordTable from 'src/components/tables/VaccinationRecordTable'
import { ChildrenStatus } from 'src/constants/ChildrenCode'
import ChildrenStatusHistoryTable from 'src/components/tables/ChildrenStatusHistoryTable'
import ChildrenFamilyHistoryTable from 'src/components/tables/ChildrenFamilyHistoryTable'

const ChildrenDetail = () => {
  const childrenApi = childrenService()
  const { id } = useParams()
  const [children, setChildren] = useState()
  const [changeCount, setChangeCount] = useState(0)

  useEffect(() => {
    const getChildren = async () => {
      try {
        const response = await childrenApi.getChildrenDetail(id)
        setChildren(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getChildren()
  }, [id, changeCount])

  return (
    <>
      {children && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-3">
                  <h4>Hồ sơ trẻ em #{children.children_id}</h4>
                </div>
                <CRow className="align-items-md-stretch">
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol lg={5} md={12} className="mb-3">
                        <div className="p-0 border border-2 border-light h-100">
                          <CImage fluid src={children.image_url} className="detail-image" />
                          <div className="form-header-custom m-3">
                            <h4> {children.full_name}</h4>
                          </div>
                          <div className="m-3">
                            <dd>{children.circumstance}</dd>
                          </div>
                          <div className="m-3">
                            <div className="form-header-sub-custom">
                              <h5>Các giấy tờ của trẻ</h5>
                            </div>
                            <CRow>
                              {children.documents.map((document, index) => (
                                <CCol lg={6} md={3} sm={6} key={index} className="mt-2">
                                  <CLink
                                    href={document.file_path}
                                    key={index}
                                    className="w-100 text-nodecorate"
                                    title={document.file_name}
                                  >
                                    <CButton className="download-btn w-100">
                                      <div className="download-btn-2-content">
                                        {document.file_name}
                                      </div>
                                      <CIcon icon={cilDataTransferDown} />
                                    </CButton>
                                  </CLink>
                                </CCol>
                              ))}
                            </CRow>
                          </div>
                        </div>
                      </CCol>
                      <CCol lg={7} md={12} className="mb-3">
                        <div>
                          <div className="form-header-custom mb-3">
                            <h5>Thông tin cá nhân</h5>
                          </div>
                          <CTable
                            responsive
                            bordered
                            className="form-table overflow-hidden table-border-2"
                          >
                            <CTableBody>
                              <DataCellRow label="Giới tính" value={children.gender} />
                              <DataCellRow
                                label="Ngày sinh"
                                value={format(new Date(children.date_of_birth), 'dd/MM/yyyy')}
                              />
                              <DataCellRow label="Địa chỉ" value={children.address} />
                              <DataCellRow label="Dân tộc" value={children.ethnicity} />
                              <DataCellRow label="Tôn giáo" value={children.religion} />
                              <DataCellRow
                                label="Ngày tiếp nhận"
                                value={format(new Date(children.date_of_admission), 'dd/MM/yyyy')}
                              />
                              {children.date_of_departure && (
                                <DataCellRow
                                  label="Ngày rời đi"
                                  value={format(new Date(children.date_of_departure), 'dd/MM/yyyy')}
                                />
                              )}
                              <CTableRow>
                                <CTableDataCell className="form-table-label">
                                  Trường hợp
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormTextarea value={children.orphan_type} readOnly />
                                </CTableDataCell>
                              </CTableRow>
                              <DataCellRow label="Trạng thái" value={children.children_status} />
                              <DataCellRow
                                label="Trạng thái chờ nhận nuôi"
                                value={
                                  children.children_status_id == ChildrenStatus.inCare.code
                                    ? children.is_waiting_adoption
                                      ? 'Đang chờ nhận nuôi.'
                                      : 'Không'
                                    : '###'
                                }
                              />
                            </CTableBody>
                          </CTable>
                          <CRow>
                            <CCol xl={4} lg={4} md={3} sm={5} xs={12} className="mb-2">
                              <NavLink to={'../children/' + children.children_id + '/edit'}>
                                <CButton className="form-table-btn w-100">Sửa thông tin</CButton>
                              </NavLink>
                            </CCol>
                            <CCol xl={5} lg={5} md={4} sm={7} xs={12}>
                              <NavLink
                                to={'../children/' + children.children_id + '/update-status'}
                                onClick={(e) => {
                                  !children.is_change_status && e.preventDefault()
                                }}
                              >
                                <CButton
                                  className="form-table-btn w-100"
                                  disabled={!children.is_change_status}
                                >
                                  Cập nhật trạng thái
                                </CButton>
                              </NavLink>
                            </CCol>
                          </CRow>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol md={12}>
                        <div className="h-100 p-2 pb-0 text-black bg-white border border-2 border-light">
                          <div className="form-header-custom mb-3">
                            <h5>Thông tin người thân</h5>
                          </div>
                          <CRow>
                            {children.relatives.map((relative, index) => (
                              <CCol lg={6} md={12} key={index}>
                                <CTable
                                  responsive
                                  bordered
                                  className="form-table overflow-hidden table-border-2"
                                >
                                  <CTableBody>
                                    <DataCellRow
                                      label="Quan hệ với trẻ"
                                      value={relative.relationship}
                                    />
                                    <DataCellRow label="Họ và tên" value={relative.full_name} />
                                    <DataCellRow
                                      label="Ngày sinh"
                                      value={format(new Date(relative.date_of_birth), 'dd/MM/yyyy')}
                                    />
                                    <DataCellRow
                                      label="Số điện thoại"
                                      value={relative.phone_number}
                                    />
                                    <DataCellRow
                                      label="Địa chỉ email"
                                      value={relative.mail_address || '###'}
                                    />
                                    <CTableRow>
                                      <CTableDataCell className="form-table-label">
                                        Địa chỉ
                                      </CTableDataCell>
                                      <CTableDataCell>
                                        <CFormTextarea value={relative.address} readOnly />
                                      </CTableDataCell>
                                    </CTableRow>
                                  </CTableBody>
                                </CTable>
                              </CCol>
                            ))}
                          </CRow>
                          <CRow>
                            <CCol xl={3} lg={3} md={4} sm={5} xs={12} className="mb-2">
                              <NavLink
                                to={
                                  '../relatives/create?childrenId=' +
                                  children.children_id +
                                  '&childrenName=' +
                                  children.full_name
                                }
                              >
                                <CButton className="form-table-btn mb-3">Thêm người thân</CButton>
                              </NavLink>
                            </CCol>
                          </CRow>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol md={12}>
                        <div className="h-100 p-2 pb-0 text-black bg-white border border-2 border-light">
                          <div className="form-header-custom mb-3">
                            <h5>Hồ sơ y tế</h5>
                          </div>
                          <MedicalRecordTable childrenId={children?.children_id} />
                          <CRow>
                            <CCol xl={3} lg={3} md={4} sm={5} xs={12} className="mb-2">
                              <NavLink
                                to={
                                  '../medical-records/create?childrenId=' +
                                  children.children_id +
                                  '&childrenName=' +
                                  children.full_name
                                }
                              >
                                <CButton className="form-table-btn mb-3">Thêm hồ sơ y tế</CButton>
                              </NavLink>
                            </CCol>
                          </CRow>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol md={12}>
                        <div className="h-100 p-2 pb-0 text-black bg-white border border-2 border-light">
                          <div className="form-header-custom mb-3">
                            <h5>Hồ sơ tiêm chủng</h5>
                          </div>
                          <VaccinationRecordTable childrenId={children?.children_id} />
                          <CRow>
                            <CCol xl={3} lg={3} md={5} sm={5} xs={12} className="mb-2">
                              <NavLink
                                to={
                                  '../vaccination-records/create?childrenId=' +
                                  children.children_id +
                                  '&childrenName=' +
                                  children.full_name
                                }
                              >
                                <CButton className="form-table-btn mb-3">
                                  Thêm hồ sơ tiêm chủng
                                </CButton>
                              </NavLink>
                            </CCol>
                          </CRow>
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol md={12}>
                        <div className="h-100 p-2 pb-0 text-black bg-white border border-2 border-light">
                          <div className="form-header-custom mb-3">
                            <h5>Lịch sử thay đổi trạng thái</h5>
                          </div>
                          <ChildrenStatusHistoryTable childrenId={children?.children_id} />
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                  <CCol md={12}>
                    <CRow className="h-100 p-2">
                      <CCol md={12}>
                        <div className="h-100 p-2 pb-0 text-black bg-white border border-2 border-light">
                          <div className="form-header-custom mb-3">
                            <h5>Lịch sử thay đổi gia đình</h5>
                          </div>
                          <ChildrenFamilyHistoryTable childrenId={children?.children_id} />
                        </div>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default ChildrenDetail
