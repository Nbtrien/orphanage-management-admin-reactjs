import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CRow } from '@coreui/react'
import { CChartRadar } from '@coreui/react-chartjs'
import statisticsService from 'src/api/services/statisticsService'

const DonationStatisticsByFamilyChart = () => {
  const statisticsApi = statisticsService()
  const [statistics, setStatistics] = useState([])
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])
  const [backgroundColors, setBackgroundColors] = useState([])
  const [usageAmount, setUsageAmount] = useState([])

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getDonationStatisticsByFamily()
        setStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  useEffect(() => {
    setLabels(statistics.map((item) => item.family))
    setData(statistics.map((item) => item.donation_amount))
    setUsageAmount(statistics.map((item) => item.usage_amount))
    const generateRandomColors = () => {
      const colors = []
      for (let i = 0; i < statistics.length; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
        colors.push(randomColor)
      }
      setBackgroundColors(colors)
    }

    statistics?.length && generateRandomColors()
  }, [statistics])

  const donutOptions = {
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        fullWidth: true,
        display: true,
        position: 'right',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <CCard className="h-100">
      <CCardBody>
        <CRow>
          <h4 id="traffic" className="card-title mb-3">
            Thống kê tài trợ theo gia đình
          </h4>
          {data?.length && (
            <CChartRadar
              data={{
                labels: labels,
                datasets: [
                  {
                    label: 'Số tiền tài trợ',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                    data: data,
                  },
                  {
                    label: 'Số tiền được phân bổ',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                    data: usageAmount,
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
          )}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default DonationStatisticsByFamilyChart
