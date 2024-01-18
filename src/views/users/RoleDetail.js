import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow, CTable, CTableBody } from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import userService from 'src/api/services/userService'
import DataCellRow from 'src/components/rows/DataCellRow'

const RoleDetail = () => {
  const userApi = userService()
  const { id } = useParams()
  const [data, setData] = useState()
  const [columns, setColumns] = useState([])
  const [permissions, setPermissions] = useState('')

  useEffect(() => {
    const fetchRoleDetail = async () => {
      try {
        const response = await userApi.getRoleDetail(id)
        const result = response.result
        setData(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRoleDetail()
  }, [id])

  useEffect(() => {
    if (data) {
      let rs = []
      data?.permissions.map((per) => rs.push(per.permission_title))
      setPermissions(rs.join(', '))
    }
  }, [data])

  return (
    <>
      {data && (
        <CRow>
          <CCol xs>
            <CCard className="mb-4">
              <CCardBody>
                <div className="form-header-custom mb-3">
                  <h4>Chi tiết vai trò</h4>
                </div>
                <div className="mb-3">
                  <NavLink to="../roles/management">
                    <CButton className="form-table-btn">về trang danh sách</CButton>
                  </NavLink>
                </div>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <DataCellRow label="ID" value={'#' + data.role_id} />
                    <DataCellRow label="Vai trò" value={data.role_title} />
                    <DataCellRow label="Mô tả" value={data.role_description} />
                    <DataCellRow label="Quyền" value={permissions} />
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}
    </>
  )
}

export default RoleDetail
