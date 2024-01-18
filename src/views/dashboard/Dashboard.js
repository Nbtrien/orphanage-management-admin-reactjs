import React from 'react'
import { CCol, CRow } from '@coreui/react'

import SummaryStatisticsWidgets from 'src/components/widgets/SummaryStatisticsWidgets'
import ChildrenStatisticsByGenderChart from 'src/components/charts/ChildrenStatisticsByGenderChart'
import ChildrenStatisticsByAgeChart from 'src/components/charts/ChildrenStatisticsByAgeChart'
import ChildrenStatisticsByStatusChart from 'src/components/charts/ChildrenStatisticsByStatusChart'
import ChildrenStatisticsByFamilyChart from 'src/components/charts/ChildrenStatisticsByFamilyChart'
import DonationStatisticsByMonthChart from 'src/components/charts/DonationStatisticByMonthChart'
import DonorStatisticsTable from 'src/components/charts/DonorStatisticsTable'
import DonationStatisticsByPurposeChart from 'src/components/charts/DonationStatisticsByPurposeChart'
import DonationStatisticsByFamilyChart from 'src/components/charts/DonationStatisticsByFamilyChart'

const Dashboard = () => {
  return (
    <>
      <SummaryStatisticsWidgets />
      <CRow>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <ChildrenStatisticsByGenderChart />
        </CCol>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <ChildrenStatisticsByAgeChart />
        </CCol>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <ChildrenStatisticsByStatusChart />
        </CCol>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <ChildrenStatisticsByFamilyChart />
        </CCol>
      </CRow>

      <DonationStatisticsByMonthChart />

      <DonorStatisticsTable />

      <CRow>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <DonationStatisticsByPurposeChart />
        </CCol>
        <CCol xs={12} md={6} xl={6} className="mb-4 ">
          <DonationStatisticsByFamilyChart />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
