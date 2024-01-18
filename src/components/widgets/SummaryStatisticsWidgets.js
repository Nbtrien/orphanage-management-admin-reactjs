import React, { useEffect, useState } from 'react'
import { CRow, CCol, CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMoney } from '@coreui/icons'
import statisticsService from 'src/api/services/statisticsService'
import numeral from 'numeral'
import { FaDonate, FaRegIdCard } from 'react-icons/fa'
import { FaChildren } from 'react-icons/fa6'

const SummaryStatisticsWidgets = () => {
  const statisticsApi = statisticsService()
  const [summaryStatistics, setSummaryStatistics] = useState(null)
  useEffect(() => {
    const getSummaryStatistics = async () => {
      try {
        const response = await statisticsApi.getSummaryStatistics()
        setSummaryStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getSummaryStatistics()
  }, [])
  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3 widget-custom widget-custom-1"
          icon={<FaChildren />}
          title="Tổng số trẻ em"
          value={summaryStatistics?.total_children}
          color="primary"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3 widget-custom widget-custom-1"
          icon={<FaRegIdCard />}
          title="Tổng số nhân viên"
          value={summaryStatistics?.total_employees}
          color="info"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3 widget-custom widget-custom-1"
          icon={<FaDonate />}
          title="Tổng số tài trợ"
          value={summaryStatistics?.total_donations}
          color="warning"
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3 widget-custom widget-custom-1"
          icon={<CIcon width={20} icon={cilMoney} size="lg" />}
          title="Tổng số tiền tài trợ"
          value={numeral(summaryStatistics?.total_donation_amount).format('0,0₫') + ' VND'}
          color="danger"
        />
      </CCol>
    </CRow>
  )
}

export default SummaryStatisticsWidgets
