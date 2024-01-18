import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import statisticsService from 'src/api/services/statisticsService'

const DonationStatisticsByMonthChart = () => {
  const statisticsApi = statisticsService()
  const [statistics, setStatistics] = useState([])
  const [data, setData] = useState([])
  const [donationCount, setDonationCount] = useState([])
  const [donorCount, setDonorCount] = useState([])
  const [usageAmount, setUsageAmount] = useState([])
  const [labels, setLabels] = useState([])
  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getDonationStatisticsBymonth()
        setStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  useEffect(() => {
    setLabels(statistics.map((item) => item.month))
    setData(statistics.map((item) => item.donation_amount))
    setDonationCount(statistics.map((item) => item.donation_count))
    setUsageAmount(statistics.map((item) => item.usage_amount))
    setDonorCount(statistics.map((item) => item.donor_count))
  }, [statistics])

  return (
    <CRow>
      <CCol xs={12} md={6} xl={6} className="mb-4 ">
        <CCard className="h-100">
          <CCardBody>
            <CRow>
              <h4 id="traffic" className="card-title mb-3">
                Thống kê số lượt tài trợ
              </h4>
              <CChartLine
                className="h-100"
                data={{
                  labels: [
                    'Jan',
                    'Feb',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Số lượt tài trợ',
                      backgroundColor: 'rgba(220, 220, 220, 0.2)',
                      borderColor: 'rgba(220, 220, 220, 1)',
                      pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                      pointBorderColor: '#fff',
                      data: donationCount,
                    },
                    {
                      label: 'Số nhà tài trợ',
                      backgroundColor: 'rgba(151, 187, 205, 0.2)',
                      borderColor: 'rgba(151, 187, 205, 1)',
                      pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                      pointBorderColor: '#fff',
                      data: donorCount,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    tooltip: {
                      enabled: false,
                    },
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} md={6} xl={6} className="mb-4 ">
        <CCard className="h-100">
          <CCardBody>
            <CRow>
              <h4 id="traffic" className="card-title mb-3">
                Thống kê số tiền tài trợ
              </h4>
              <h6 className="text-blueGray-100 text-xs mb-2">Số tiền (VND)</h6>
              <CChartBar
                data={{
                  labels: [
                    'Jan',
                    'Feb',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Số tiền tài trợ',
                      data: data,
                      backgroundColor: '#f87979',
                      borderColor: 'rgba(255,99,132,1)',
                      borderWidth: 1,
                      yAxisID: 'totalAmount',
                    },
                    {
                      label: 'Số tiền được sử dụng',
                      data: usageAmount,
                      backgroundColor: 'rgba(255,99,132,0.5)',
                      borderColor: 'rgba(255,99,132,1)',
                      borderWidth: 1,
                      yAxisID: 'totalAmount',
                    },
                  ],
                }}
                labels="Số trẻ"
                height={200}
                options={{
                  plugins: {
                    tooltip: {
                      enabled: false,
                    },
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DonationStatisticsByMonthChart
