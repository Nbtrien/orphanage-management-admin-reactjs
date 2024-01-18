import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import statisticsService from 'src/api/services/statisticsService'
import numeral from 'numeral'

const DonorStatisticsTable = () => {
  const statisticsApi = statisticsService()
  const [data, setData] = useState([])

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getTopDonor()
        setData(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  return (
    <CCard className="h-100 mb-4">
      <CCardBody>
        <h4 id="traffic" className="card-title mb-3">
          Những nhà tài trợ nhiều nhất
        </h4>
        <CTable align="middle" className="mb-0 border" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Tên nhà tài trợ</CTableHeaderCell>
              <CTableHeaderCell>Địa chỉ email</CTableHeaderCell>
              <CTableHeaderCell>Số điện thoại</CTableHeaderCell>
              <CTableHeaderCell>Số lượt tài trợ</CTableHeaderCell>
              <CTableHeaderCell>Tổng số tiền tài trợ</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">#{item.donor_id}</CTableDataCell>
                <CTableDataCell>{item.donor_full_name}</CTableDataCell>
                <CTableDataCell>{item.donor_mail_address}</CTableDataCell>
                <CTableDataCell>{item.donor_phone_number}</CTableDataCell>
                <CTableDataCell>{item.donation_count}</CTableDataCell>
                <CTableDataCell>
                  {numeral(item.total_amount).format('0,0₫') + ' VND'}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default DonorStatisticsTable
