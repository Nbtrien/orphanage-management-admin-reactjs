import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow, CTable, CTableBody } from '@coreui/react'
import { NavLink, useParams } from 'react-router-dom'
import userService from 'src/api/services/userService'
import DataCellRow from 'src/components/rows/DataCellRow'

const UserDetail = () => {
  const userApi = userService()
  const { id } = useParams()
  const [data, setData] = useState()
  const [columns, setColumns] = useState([])
  const [roles, setRoles] = useState('')

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await userApi.getUserDetail(id)
        const result = response.result
        setData(result)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserDetail()
  }, [id])

  useEffect(() => {
    if (data) {
      let rs = []
      data?.roles.map((role) => rs.push(role.role_title))
      setRoles(rs.join(', '))
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
                  <h4>Chi tiết tài khoản</h4>
                </div>
                <div className="mb-3">
                  <NavLink to="../users/management">
                    <CButton className="form-table-btn">về trang danh sách</CButton>
                  </NavLink>
                </div>
                <CTable responsive bordered className="form-table overflow-hidden table-border-2">
                  <CTableBody>
                    <DataCellRow label="ID" value={'#' + data.user_id} />
                    <DataCellRow label="Tên người dùng" value={data.user_name} />
                    <DataCellRow label="Địa chỉ email" value={data.user_mail_address} />
                    <DataCellRow label="Vai trò" value={roles} />
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

export default UserDetail
