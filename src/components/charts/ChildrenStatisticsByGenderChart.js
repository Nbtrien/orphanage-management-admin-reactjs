import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CRow } from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'

import statisticsService from 'src/api/services/statisticsService'

const ChildrenStatisticsByGenderChart = () => {
  const statisticsApi = statisticsService()
  const [statistics, setStatistics] = useState([])
  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await statisticsApi.getChildrenStatisticsByGender()
        setStatistics(response.result)
      } catch (error) {
        console.log(error)
      }
    }
    getStatistics()
  }, [])

  const donutOptions = {
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        labels: {
          generateLabels: (chart) => {
            const datasets = chart.data.datasets
            return datasets[0].data.map((data, i) => ({
              text: `${chart.data.labels[i]} ${data}`,
              fillStyle: datasets[0].backgroundColor[i],
              index: i,
            }))
          },
          fontSize: 16,
          fontStyle: 'bold',
        },
        fullWidth: true,
        display: true,
        position: 'bottom',
      },
    },

    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false,
  }

  return (
    <CCard className="h-100">
      <CCardBody>
        <CRow>
          <h4 id="traffic" className="card-title mb-3">
            Thống kê trẻ theo giới tính
          </h4>
          <CChartDoughnut
            data={{
              labels: ['Nam', 'Nữ'],
              datasets: [
                {
                  data: [statistics?.male, statistics?.female],
                  backgroundColor: ['#FF6384', '#36A2EB'],
                  hoverBackgroundColor: ['#FF6385', '#36A2EB'],
                },
              ],
            }}
            options={donutOptions}
            width={350}
            height={350}
          />
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default ChildrenStatisticsByGenderChart
